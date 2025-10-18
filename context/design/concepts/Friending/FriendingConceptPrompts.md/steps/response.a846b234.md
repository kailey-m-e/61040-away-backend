---
timestamp: 'Sat Oct 18 2025 14:45:15 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251018_144515.bf58bb47.md]]'
content_id: a846b234ff5bf35ec7a3bb4ddd31609cbcde87794ff0893919de3bfb16dbb1cb
---

# response:

You are absolutely correct! That's a common point of confusion when working with the MongoDB Node.js/TypeScript driver.

The `startSession()` method is typically available on the **`MongoClient`** instance, not directly on the `Db` instance.

Your `FriendingConcept` class currently only receives the `Db` object in its constructor:

```typescript
constructor(private readonly db: Db) {
  this.users = this.db.collection(PREFIX + "users");
}
```

To fix this, you need to pass the `MongoClient` instance to your `FriendingConcept` class so it can start sessions for transactions.

Here's the plan to fix it:

1. **Modify the `FriendingConcept` constructor** to accept both the `Db` and `MongoClient` instances.
2. **Update the `_runInTransaction` method** to use the `MongoClient` instance to call `startSession()`.

### Updated `FriendingConcept.ts`

```typescript
import { ClientSession, Collection, Db, MongoClient } from "npm:mongodb"; // Import MongoClient
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
  private readonly client: MongoClient; // Store the MongoClient instance

  // Modify constructor to accept MongoClient
  constructor(private readonly db: Db, client: MongoClient) {
    this.client = client; // Assign the MongoClient
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
    // Use this.client to start the session
    const session = this.client.startSession(); // FIX IS HERE
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
    if (!result.value) { // Ensure to check result.value as findOneAndUpdate returns an object with a value property
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
      if (!friendRequestPulled.value) { // Ensure to check result.value
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
    if (!result.value) { // Ensure to check result.value
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
    // check friend logic
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
        // find user, ensure user is friends with friend,
        // and atomically remove friend
        const userFriendshipPulled = await this.users.findOneAndUpdate(
            { _id: user, friends: friend },
            { $pull: { friends: friend } },
            { returnDocument: "before", session },
        );

        // check if match was found
        if (!userFriendshipPulled.value) { // If no doc matched, the friendship did not exist from user's side
            throw new Error(
                `No friendship exists between user with ID ${user} and friend with ID ${friend}.`,
            );
        }

        // atomically remove user from friend's friend
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

### Important Notes:

1. **`MongoClient` Import:** I've added `MongoClient` to the import statement from `npm:mongodb`.
2. **Constructor Update:** The constructor now takes `client: MongoClient` as an additional argument and stores it.
3. **`_runInTransaction` Fix:** The `session` is now correctly started using `this.client.startSession()`.
4. **`findOneAndUpdate` Return Value:** I've also updated the checks for `result` and `friendRequestPulled` in `unrequestFriend`, `acceptFriend`, `rejectFriend`, and `endFriendship` to correctly access `.value`, as `findOneAndUpdate` returns an object with a `value` property (the document before the update, or `null` if not found).
5. **Instantiation:** Wherever you create an instance of `FriendingConcept`, you'll now need to pass both the `db` and `client` objects. For example, in your test file:

   ```typescript
   import { testDb } from "@utils/database.ts";
   import FriendingConcept from "./FriendingConcept.ts";

   Deno.test("...", async () => {
     const [db, client] = await testDb(); // testDb should return [Db, MongoClient]

     const friendingConcept = new FriendingConcept(db, client); // Pass both db and client

     try {
       // ... tests
     } finally {
       await client.close();
     }
   });
   ```
