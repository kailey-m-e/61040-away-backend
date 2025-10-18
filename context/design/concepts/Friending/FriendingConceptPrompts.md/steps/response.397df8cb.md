---
timestamp: 'Fri Oct 17 2025 09:09:08 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251017_090908.5c428944.md]]'
content_id: 397df8cbc33053d10e57f82b9a761d7d23a7c403c12b6b14c12176dd4783cfa7
---

# response:

Here is a list of concise feedback for the Friending concept test file:

1. **Test Case 5 - Step 7 Logic Error/Typo:**
   * The line `const endFriendship = await friendingConcept.rejectFriend({ user: userB, friend: userA });` contains a typo: `rejectFriend` is called, but the variable name `endFriendship` and its associated comment suggest the `endFriendship` action.
   * Given that `userA` and `userB` are already friends from step 3, calling `rejectFriend` correctly results in an error (as `userA` is no longer in `userB`'s `outgoingRequests`).
   * However, if the intent was to test `endFriendship` on an *existing* friendship, it should call `friendingConcept.endFriendship(...)` and the assertion `assertEquals("error" in endFriendship, true)` would be incorrect; it should assert that no error occurs. This step needs clarification and correction to match the intended behavior.

2. **`_getIncomingRequests` Insufficient Content Verification:**
   * In Test Case 2 and Test Case 6, `_getIncomingRequests` is called, and only the `length` of the returned array is verified.
   * To fully confirm the `effects` of `requestFriend` and `rejectFriend`/`acceptFriend` on incoming requests, the tests should also verify the `_id` of the `UserDoc` objects returned in the `incoming` array (e.g., `assertEquals(incoming[0]._id, userA, "Expected userA to be in incoming requests.")`).
   * Furthermore, the concept specification for `_getIncoming(user: User): (set of Users)` implies returning an array of `User` IDs, whereas the implementation returns `UserDoc[]`. The tests currently accept `UserDoc[]` but should ensure they verify the correct fields, and ideally the implementation should align with the spec's simpler return type.

3. **Missing Race Condition Tests:**
   * The current test suite does not include scenarios that simulate concurrent operations. Actions like `requestFriend` and `acceptFriend` involve multiple `findOne`, `insertOne`, and `updateOne` operations, which are not intrinsically atomic in MongoDB.
   * Adding tests (e.g., using `Promise.all` with multiple simultaneous calls) would be beneficial to expose potential race conditions and ensure data consistency, particularly if a transaction mechanism is not used.

4. **`validateFriendship` Behavior for Non-existent Users:**
   * Test Case 4, when validating friendship for `userA` and `userB`, correctly returns an error because no friendship exists. However, it doesn't explicitly test the scenario where `userA` or `userB` (or both) have never been involved in any friending action (i.e., their `UserDoc` might not even exist in the collection). The current implementation would likely handle this by `findOne` returning `null`, leading to the same error message, but it's a distinct edge case worth explicitly testing.
