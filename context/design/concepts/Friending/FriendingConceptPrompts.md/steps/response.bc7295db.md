---
timestamp: 'Fri Oct 17 2025 14:02:57 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251017_140257.81dead44.md]]'
content_id: bc7295db116e08dd81c4513a0831e69d28d70b509236f71f17b6c1b41f692ffa
---

# response:

To fix the concurrency issues, we will primarily utilize MongoDB's atomic update operators and multi-document transactions.

Here's the plan implemented in the code:

1. **Introduce a `_runInTransaction` Helper:** A private helper method will encapsulate the boilerplate for starting, committing, aborting, and ending MongoDB sessions and transactions.
2. **`requestFriend`:**
   * The initial `user === friend` check remains outside the transaction as it's a synchronous check.
   * Inside the transaction, we first use `updateOne` with `upsert: true` and `$setOnInsert` for both `user` and `friend` documents. This atomically ensures both user profiles exist, creating them if necessary, and initializing their arrays.
   * Then, we fetch the (potentially newly created or updated) `userDoc` and `friendDoc` within the same transaction.
   * All complex precondition checks (`alreadyFriend`, `userAlreadyRequested`, `friendAlreadyRequested`) are performed on these fetched documents. If any fail, the transaction is aborted.
   * Finally, if all checks pass, `user`'s `outgoingRequests` are updated with `$push`.
3. **`unrequestFriend` and `rejectFriend`:**
   * These actions primarily affect a single document (removing an entry from an array). The concurrency risk between `findOne` and `updateOne` can be eliminated by using a single `findOneAndUpdate` operation. This operation combines the check (if the request exists) and the update (removing the request) atomically for that document.
4. **`acceptFriend`:**
   * This action involves updating multiple documents. It will be wrapped in a transaction.
   * The first step uses `findOneAndUpdate` on the `friend` document to atomically check for the incoming request (`outgoingRequests: user`) and `$pull` it. If `findOneAndUpdate` returns no match, the request didn't exist, and the transaction is aborted.
   * Then, two separate `updateOne` operations (for `user` and `friend`) are performed within the same transaction to `$push` each other to their respective `friends` arrays. The `$ne` operator is added to prevent duplicate entries if, for some reason, they were already friends (though prior logic should ideally prevent this state).
5. **`endFriendship`:**
   * This action also involves updating multiple documents and will be wrapped in a transaction.
   * Similar to `acceptFriend`, it uses `findOneAndUpdate` on the `user` document to atomically verify the friendship (`friends: friend`) and `$pull` the `friend` from it. If no match, the transaction is aborted.
   * Finally, an `updateOne` operation within the same transaction removes `user` from `friend`'s `friends` array.

Here's the updated `FriendingConcept.ts` file:

```typescript
import { ClientSession, Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Friending" + ".";

// Generic types for the concept's external dependencies
type User = ID;

/**
 * State: A set of Users with a set of friends,
 * outgoingRequests friend requests, and incoming friend requests.
 */
export interface UsersDoc {
  _id: User;
  friends: User[];
  outgoingRequests: User[];
}

/**
 * @concept Friending
 * @purpose To allow users to share special permissions with other users.
 */
export default class FriendingConcept {
  users: Collection<UsersDoc>;

  constructor(private readonly db: Db) {
    this.users = this.db.collection(PREFIX + "users");
  }

  /**
   * Private helper for running operations in a multi-document transaction.
   * Ensures atomicity across multiple operations or documents.
   * @param callback The async function containing the transaction logic.
   * @returns The result of the callback or an error object.
   */
  private async _runInTransaction<T>(
    callback: (session: ClientSession) => Promise<T>,
  ): Promise<T | { error: string }> {
    const session = this.db.startSession();
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      // console.error("Transaction aborted:", error); // Uncomment for debugging
      return {
        error: error instanceof Error
          ? error.message
          : "An unknown error occurred during the transaction.",
      };
    } finally {
      await session.endSession();
    }
  }

  /**
   * Action: Requests a new friend.
   * @requires friend is not already in user's set of outgoingRequests
   * or friends; user is not already in friend's set of outgoingRequests
   * (if user and/or friend exist in  users); friend does not equal user
   * @effects adds user and friend to users if not in users already;
   * adds friend to user's set of outgoingRequests
   */
  async requestFriend(
    { user, friend }: { user: User; friend: User },
  ): Promise<Empty | { error: string }> {
    if (user === friend) {
      return { error: `User cannot send friend request to theirself.` };
    }

    return await this._runInTransaction(async (session) => {
      // 1. Ensure both user and friend documents exist. Atomically create if they don't.
      // upsert: true creates the document if it doesn't exist, $setOnInsert initializes fields.
      await this.users.updateOne(
        { _id: user },
        { $setOnInsert: { _id: user, friends: [], outgoingRequests: [] } },
        { upsert: true, session },
      );
      await this.users.updateOne(
        { _id: friend },
        { $setOnInsert: { _id: friend, friends: [], outgoingRequests: [] } },
        { upsert: true, session },
      );

      // 2. Fetch the documents within the transaction to perform complex precondition checks.
      // These reads are isolated within the transaction.
      const userDoc = await this.users.findOne({ _id: user }, { session });
      const friendDoc = await this.users.findOne({ _id: friend }, { session });

      // These should always exist after upsert, but guarding for unexpected behavior.
      if (!userDoc || !friendDoc) {
        throw new Error(
          "User or friend document not found after upsert operation. This indicates a critical issue.",
        );
      }

      // 3. Perform all precondition checks. If any fail, throw an error to abort the transaction.
      if (userDoc.friends.includes(friend)) {
        throw new Error(`User with ID ${user} is already friends with ${friend}.`);
      }
      if (userDoc.outgoingRequests.includes(friend)) {
        throw new Error(`User with ID ${user} has already sent a friend request to ${friend}.`);
      }
      if (friendDoc.outgoingRequests.includes(user)) {
        throw new Error(`User with ID ${friend} has already sent a friend request to ${user}.`);
      }

      // 4. Add the outgoing request. This update is atomic within the transaction.
      await this.users.updateOne(
        { _id: user },
        { $push: { outgoingRequests: friend } },
        { session },
      );

      return {};
    });
  }

  /**
   * Action: Cancels an outgoing friend request.
   * @requires friend exists  in user's set of outgoingRequests
   * @effects removes friend from user's set of outgoingRequests
   */
  async unrequestFriend(
    { user, friend }: { user: User; friend: User },
  ): Promise<Empty | { error: string }> {
    // Check and remove request atomically using findOneAndUpdate for a single document.
    const result = await this.users.findOneAndUpdate(
      { _id: user, outgoingRequests: friend }, // Query to find user with specific outgoing request
      { $pull: { outgoingRequests: friend } }, // Atomically pull the friend from outgoingRequests
      { returnDocument: 'before' }, // Return document before update to check if it existed
    );

    if (!result.value) { // If no document was found matching the query, the request didn't exist
      return {
        error:
          `User with ID ${user} hasn't requested friend with ID ${friend}.`,
      };
    }

    return {};
  }

  /**
   * Action: Accepts an incoming friend request.
   * @requires user exists in friend's set of outgoingRequests
   * @effects removes user from friend's set of outgoingRequests;
   * adds friend to user's set of friends and adds user to friend's set of friends
   */
  async acceptFriend(
    { user, friend }: { user: User; friend: User },
  ): Promise<Empty | { error: string }> {
    return await this._runInTransaction(async (session) => {
      // 1. Find the friend document, ensure it has an outgoing request from 'user',
      // and atomically pull 'user' from its outgoingRequests.
      const friendRequestPulled = await this.users.findOneAndUpdate(
        { _id: friend, outgoingRequests: user }, // Query to find friend doc with pending request from user
        { $pull: { outgoingRequests: user } }, // Remove user from friend's outgoingRequests
        { returnDocument: 'before', session }, // Return doc before update to check if it existed
      );

      if (!friendRequestPulled.value) { // If no doc matched, the incoming request did not exist
        throw new Error(`Friend with ID ${friend} hasn't requested user with ID ${user}.`);
      }

      // 2. Atomically add 'friend' to 'user''s friends list.
      // $ne condition prevents adding if already present (defensive).
      // No upsert, assuming 'user' document exists from a prior requestFriend or user creation.
      await this.users.updateOne(
        { _id: user, friends: { $ne: friend } },
        { $push: { friends: friend } },
        { session },
      );

      // 3. Atomically add 'user' to 'friend''s friends list.
      // $ne condition prevents adding if already present (defensive).
      // No upsert, assuming 'friend' document exists from a prior requestFriend or user creation.
      await this.users.updateOne(
        { _id: friend, friends: { $ne: user } },
        { $push: { friends: user } },
        { session },
      );

      return {};
    });
  }

  /**
   * Action: Rejects an incoming friend request.
   * @requires user exists in friend's set of outgoingRequests
   * @effects removes user from friend's set of outgoingRequests
   */
  async rejectFriend(
    { user, friend }: { user: User; friend: User },
  ): Promise<Empty | { error: string }> {
    // Check and remove request atomically using findOneAndUpdate for a single document.
    const result = await this.users.findOneAndUpdate(
      { _id: friend, outgoingRequests: user }, // Query for friend with specific outgoing request from user
      { $pull: { outgoingRequests: user } }, // Atomically pull the user from friend's requests
      { returnDocument: 'before' }, // Return document before update to check if it existed
    );

    if (!result.value) { // If no document was found matching the query, the request didn't exist
      return {
        error:
          `Friend with ID ${friend} hasn't requested user with ID ${user}.`,
      };
    }

    return {};
  }

  /**
   * Action: Confirms that a given friendship exists.
   * @requires friend exists in user's set of friends
   */
  async validateFriendship(
    { user, friend }: { user: User; friend: User },
  ): Promise<Empty | { error: string }> {
    // This is a query, and findOne is atomic for a single document read.
    const currFriend = await this.users.findOne({
      _id: user,
      friends: friend,
    });
    if (!currFriend) {
      return {
        error:
          `No friendship exists between user with ID ${user} and friend with ID ${friend}.`,
      };
    }

    return {};
  }

  /**
   * Action: Ends the friendship between two users.
   * @requires friend exists in user's set of friends
   * @effects removes friend from user's associated set
   * and removes user from friend's associated set
   */
  async endFriendship(
    { user, friend }: { user: User; friend: User },
  ): Promise<Empty | { error: string }> {
    return await this._runInTransaction(async (session) => {
      // 1. Find 'user' document, ensure 'friend' exists in its friends list,
      // and atomically pull 'friend' from 'user''s friends.
      const userFriendshipPulled = await this.users.findOneAndUpdate(
        { _id: user, friends: friend },
        { $pull: { friends: friend } },
        { returnDocument: 'before', session },
      );

      if (!userFriendshipPulled.value) { // If no doc matched, the friendship did not exist from user's side
        throw new Error(`No friendship exists between user with ID ${user} and friend with ID ${friend}.`);
      }

      // 2. Atomically pull 'user' from 'friend''s friends list.
      // This is done unconditionally on the 'friend' document, as the first step confirmed
      // the existence of the friendship from 'user''s perspective.
      await this.users.updateOne(
        { _id: friend },
        { $pull: { friends: user } },
        { session },
      );

      return {};
    });
  }

  /**
   * Query: Retrieves all users who have friend requested a given user.
   * @effects returns all users with given user in their outgoingRequests
   */
  async _getIncomingRequests(
    { user }: { user: User },
  ): Promise<UsersDoc[]> {
    // This is a query, and find is atomic for a single read operation.
    return await this.users.find({ outgoingRequests: user }).toArray();
  }
}
```
