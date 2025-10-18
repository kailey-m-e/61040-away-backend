---
timestamp: 'Fri Oct 17 2025 14:02:07 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251017_140207.51573a4d.md]]'
content_id: fed0ec29878025ee745c9fb9bc5a334fc8de4cfa638bef09d533b1706fc3d76b
---

# response:

Here's a plan to address the concurrency issues in the `FriendingConcept` actions, primarily by leveraging MongoDB's atomic operations and multi-document transactions where necessary.

**General Approach:**

* **Atomic Operators:** MongoDB's update operators (`$push`, `$pull`, `$ne`) are atomic on a single document. We'll use these within a single `updateOne` or `findOneAndUpdate` call to combine checks and updates on one document.
* **Multi-Document Transactions:** For operations that require atomicity across *multiple documents* (like `acceptFriend` and `endFriendship` affecting two user documents, or `requestFriend` needing to check conditions on both user and friend documents), we will use MongoDB's multi-document transactions. This ensures all changes within the transaction succeed or fail together, preventing inconsistent states.
* **Error Handling:** Transactions will require explicit `try...catch` blocks to `abortTransaction()` on failure and `commitTransaction()` on success, followed by `endSession()`.

***

### 1. `requestFriend`

**Current Issue:** Multiple `findOne` calls followed by `insertOne` and `updateOne` create a race window. The cross-document check (user not already in friend's `outgoingRequests`) is also not atomic with the `user`'s update.

**Plan:** Use a multi-document transaction to ensure all checks and updates are atomic.

1. **Start Transaction:** Begin a MongoDB session and a transaction.
2. **Precondition Checks (Atomic within Transaction):**
   * Fetch `userDoc` and `friendDoc` within the transaction. If either doesn't exist, insert a basic document for them (see point 3).
   * Perform the checks:
     * `user === friend`
     * `userDoc?.friends.includes(friend)` (already friends)
     * `userDoc?.outgoingRequests.includes(friend)` (user already requested friend)
     * `friendDoc?.outgoingRequests.includes(user)` (friend already requested user)
   * If any condition fails, abort the transaction and return an error.
3. **Ensure User Documents Exist (Atomic Upsert within Transaction):**
   * Use `updateOne` with `$setOnInsert` and `upsert: true` to ensure both `user` and `friend` documents exist. This creates them atomically if they don't, within the transaction.
     ```typescript
     await this.users.updateOne(session, { _id: user }, { $setOnInsert: { friends: [], outgoingRequests: [] } }, { upsert: true });
     await this.users.updateOne(session, { _id: friend }, { $setOnInsert: { friends: [], outgoingRequests: [] } }, { upsert: true });
     ```
     *(Note: `session` would be passed to `updateOne` when inside a transaction)*
4. **Add Outgoing Request (Atomic Update within Transaction):**
   * Update the `user` document to `$push` the `friend` to `outgoingRequests`. This operation will now only occur if the prior checks passed, and it's part of the atomic transaction.
     ```typescript
     await this.users.updateOne(session, { _id: user }, { $push: { outgoingRequests: friend } });
     ```
5. **Commit/Abort Transaction:**
   * If all operations succeed, `commitTransaction()`.
   * If any error occurs, `abortTransaction()` and re-throw or return an error.
   * Always `endSession()` regardless of success or failure.

***

### 2. `acceptFriend`

**Current Issue:** Three separate `updateOne` calls, leading to potential inconsistency if an error occurs in the middle.

**Plan:** Use a multi-document transaction to make all three updates atomic.

1. **Start Transaction:** Begin a MongoDB session and a transaction.
2. **Verify Incoming Request and Pull (Atomic within Transaction):**
   * Find the `friend` document and atomically pull the `user` from its `outgoingRequests`. This also implicitly checks if the request exists.
     ```typescript
     const pullResult = await this.users.findOneAndUpdate(
       session,
       { _id: friend, outgoingRequests: user }, // Query to find friend document with pending request from user
       { $pull: { outgoingRequests: user } }, // Remove user from friend's outgoingRequests
       { returnDocument: 'before' } // Return document before update
     );
     if (!pullResult.value) { // If no document was matched and updated
       await session.abortTransaction();
       return { error: `Friend with ID ${friend} hasn't requested user with ID ${user}.` };
     }
     ```
3. **Add Friendships (Atomic within Transaction):**
   * Atomically push `friend` to `user`'s `friends` array, but only if `friend` is not already present (using `$ne`).
   * Atomically push `user` to `friend`'s `friends` array, but only if `user` is not already present.
     ```typescript
     await this.users.updateOne(session, { _id: user, friends: { $ne: friend } }, { $push: { friends: friend } });
     await this.users.updateOne(session, { _id: friend, friends: { $ne: user } }, { $push: { friends: user } });
     ```
4. **Commit/Abort Transaction:** As above.

***

### 3. `endFriendship`

**Current Issue:** Two separate `updateOne` calls, leading to potential inconsistency.

**Plan:** Use a multi-document transaction to make both updates atomic.

1. **Start Transaction:** Begin a MongoDB session and a transaction.
2. **Verify Friendship and Pull (Atomic within Transaction):**
   * Find the `user` document and atomically pull the `friend` from its `friends` list. This also implicitly checks if the friendship exists from the `user`'s side.
     ```typescript
     const pullResult = await this.users.findOneAndUpdate(
       session,
       { _id: user, friends: friend }, // Query to find user document with friend
       { $pull: { friends: friend } }, // Remove friend from user's friends
       { returnDocument: 'before' }
     );
     if (!pullResult.value) { // If no document was matched and updated
       await session.abortTransaction();
       return { error: `No friendship exists between user with ID ${user} and friend with ID ${friend}.` };
     }
     ```
3. **Remove Friendship from Friend (Atomic within Transaction):**
   * Atomically pull `user` from `friend`'s `friends` array. This is done unconditionally on the `friend` document now, as the prior step confirmed the existence of the mutual friendship.
     ```typescript
     await this.users.updateOne(session, { _id: friend }, { $pull: { friends: user } });
     ```
4. **Commit/Abort Transaction:** As above.

***

**Implementation Notes:**

* **Session Management:** The `Db` instance can create a session: `const session = this.db.startSession();`.
* **Transaction Execution:** The pattern generally involves:
  ```typescript
  const session = this.db.startSession();
  session.startTransaction();
  try {
      // All your read/write operations with `session` option
      // e.g., this.users.updateOne({ _id: user }, { ... }, { session });
      await session.commitTransaction();
      return {};
  } catch (error) {
      await session.abortTransaction();
      return { error: error.message }; // Or a more specific error
  } finally {
      await session.endSession();
  }
  ```
* **`_id` vs. Document Existence:** Ensure `_id` fields are properly handled (e.g., using `ID` type). The `upsert: true` will handle creation for `requestFriend`.
* **Performance Trade-offs:** Multi-document transactions introduce overhead. This is generally acceptable for maintaining data integrity in critical operations like friending.

\#prompt: Update the implementation with these changes.
