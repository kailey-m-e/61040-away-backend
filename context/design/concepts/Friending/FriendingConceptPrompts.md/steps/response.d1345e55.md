---
timestamp: 'Sat Oct 18 2025 16:10:06 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251018_161006.9be191d2.md]]'
content_id: d1345e5503f8dde85c817f34d402d992e97cb6d27d7a48ed97f3c1299bf54ca4
---

# response:

You've hit a tricky but important concurrency scenario! The `AssertionError: Values are not equal: Exactly one of two mutual end friendship requests should succeed atomically.` indicates that when `userA` and `userB` tried to `endFriendship` with each other simultaneously, both operations likely succeeded (or perhaps both failed, though that's less likely given the setup).

The test's expectation (`assertEquals(endAB_succeeded !== endBA_succeeded, true)`) is that only one of the two concurrent `endFriendship` calls should ultimately succeed, and the other should fail because the friendship would no longer exist.

**The Root Cause:**

Your current `endFriendship` implementation performs two updates within a transaction:

1. `findOneAndUpdate` on the `user` to pull the `friend`.
2. `updateOne` on the `friend` to pull the `user`.

When two `endFriendship` calls run concurrently (e.g., `A->B` and `B->A`):

* `A->B`'s transaction will `findOneAndUpdate` `userA` (pull `userB`) and `updateOne` `userB` (pull `userA`).
* `B->A`'s transaction will `findOneAndUpdate` `userB` (pull `userA`) and `updateOne` `userA` (pull `userB`).

Because MongoDB's transaction write conflict detection primarily targets modifications to the *same document fields* by concurrent transactions, and here each transaction modifies both documents, but often in different fields/array elements (though they are both `friends` arrays), and because the second `updateOne` is less conditional, it's possible for both transactions to successfully commit if their operations don't directly conflict in a way that forces an abort. Each might see the initial state as valid for its `findOneAndUpdate` then successfully complete its two updates.

**The Fix: Ensure Mutual Precondition Check within the Transaction**

To ensure only one succeeds in this mutual termination race, the `endFriendship` transaction needs to explicitly verify the *mutual* existence of the friendship from both perspectives before making any modifications. If it doesn't find the friendship on both sides (or finds it's already gone from one), it should abort.

Here's how to update the `endFriendship` method to be more robust against this specific race condition:

```typescript
import {
  ClientSession,
  Collection,
  Db,
  MongoClient,
} from "npm:mongodb";
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
  private readonly client: MongoClient; // store the MongoClient instance

  constructor(private readonly db: Db, client: MongoClient) {
    this.client = client;
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
    const session = this.client.startSession();
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
      // check if both user and friend documents exist,
      // and automatically create otherwise
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

      // fetch documents within transaction to perform complex
      // precondition checks; reads isolated within transaction
      const userDoc = await this.users.findOne({ _id: user }, { session });
      const friendDoc = await this.users.findOne({ _id: friend }, { session });

      // should  always exist after upsert
      if (!userDoc || !friendDoc) {
        throw new Error(
          "User or friend document not found after upsert operation. This indicates a critical issue.",
        );
      }

      // check friend logic
      if (userDoc.friends.includes(friend)) {
        throw new Error(
          `User with ID ${user} is already friends with ${friend}.`,
        );
      }
      if (userDoc.outgoingRequests.includes(friend)) {
        throw new Error(
          `User with ID ${user} has already sent a friend request to ${friend}.`,
        );
      }
      if (friendDoc.outgoingRequests.includes(user)) {
        throw new Error(
          `User with ID ${friend} has already sent a friend request to ${user}.`,
        );
      }

      // request friend; atomic update within transaction
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
    // check and remove request atomically
    const result = await this.users.findOneAndUpdate(
      { _id: user, outgoingRequests: friend },
      { $pull: { outgoingRequests: friend } },
      { returnDocument: "before" },
    );

    // check if document matching query was found
    if (!result) { // Direct check of 'result'
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
      // find user, ensure user has outgoing request from friend,
      // and atomically remove request
      const friendRequestPulled = await this.users.findOneAndUpdate(
        { _id: friend, outgoingRequests: user },
        { $pull: { outgoingRequests: user } },
        { returnDocument: "before", session },
      );

      // check if match was found
      if (!friendRequestPulled) { // Direct check of 'friendRequestPulled'
        throw new Error(
          `Friend with ID ${friend} hasn't requested user with ID ${user}.`,
        );
      }

      // atomically add friend for user
      await this.users.updateOne(
        { _id: user, friends: { $ne: friend } },
        { $push: { friends: friend } },
        { session },
      );

      // atomically add user for friend
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
    // find user, ensure user has outgoing request from friend,
    // and atomically remove request
    const result = await this.users.findOneAndUpdate(
      { _id: friend, outgoingRequests: user },
      { $pull: { outgoingRequests: user } },
      { returnDocument: "before" },
    );

    // check if match was found
    if (!result) { // Direct check of 'result'
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
    // check if friend is user's friend
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
      // 1. Fetch both documents within the transaction.
      // These reads are isolated and consistent within the transaction's snapshot.
      const userDoc = await this.users.findOne({ _id: user }, { session });
      const friendDoc = await this.users.findOne({ _id: friend }, { session });

      // 2. Perform precondition checks: Ensure both users exist and are mutually friends.
      // If either user doesn't exist, or the friendship is not mutual (or already broken), abort.
      if (
        !userDoc || !friendDoc ||
        !userDoc.friends.includes(friend) ||
        !friendDoc.friends.includes(user)
      ) {
        throw new Error(
          `No mutual friendship exists between user with ID ${user} and friend with ID ${friend}.`,
        );
      }

      // 3. Atomically remove friend from user's friends list.
      await this.users.updateOne(
        { _id: user },
        { $pull: { friends: friend } },
        { session },
      );

      // 4. Atomically remove user from friend's friends list.
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
    return await this.users.find({ outgoingRequests: user }).toArray();
  }
}
```
