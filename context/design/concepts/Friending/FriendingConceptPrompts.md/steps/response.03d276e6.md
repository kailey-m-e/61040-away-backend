---
timestamp: 'Fri Oct 17 2025 09:16:41 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251017_091641.15bd25eb.md]]'
content_id: 03d276e66639d568be0c8c1f5ffcce4080cb136213bb0a1ab3a45f66744f6415
---

# response:

Here is a list of concise feedback for the Friending concept test file:

1. **Test Case 5 - Step 7: Ambiguous Action and Comment:**
   * The line `const endFriendship = await friendingConcept.rejectFriend(...)` has a misleading variable name (`endFriendship`) and comment (`// 7. Other user tries to end`) that suggest the `endFriendship` action. However, `rejectFriend` is actually called.
   * While calling `rejectFriend` here correctly returns an error (as `userA` is already friends with `userB` and not in `userB`'s `outgoingRequests`), the test's intent is unclear. It should either be rephrased to explicitly test `rejectFriend` under these conditions, or be corrected to call `endFriendship` (which should *succeed* at this point) if that was the original intention.

2. **`_getIncomingRequests` - Specification Mismatch and Test Scope:**
   * The concept specification for `_getIncoming(user: User): (set of Users)` implies returning an array of `User` IDs (primitive `ID`s). However, the implementation `_getIncomingRequests` returns `UserDoc[]`.
   * The tests in Test Case 2 and Test Case 6 correctly verify the `_id` property of the `UserDoc` objects returned. While the tests are functional, this discrepancy between the spec's expected return type and the implementation's actual return type (and thus the test's verification target) should be resolved for strict adherence to concept guidelines (either update the spec to `UserDoc[]` or update the implementation to return `ID[]`).

3. **Missing Concurrency/Race Condition Tests:**
   * The current test suite does not include any scenarios designed to simulate concurrent operations. Actions like `requestFriend`, `acceptFriend`, and `endFriendship` involve multiple, non-atomic database read and write operations.
   * Tests that use `Promise.all` or similar constructs to trigger simultaneous calls to these methods would be valuable to identify and address potential race conditions and ensure data consistency in a multi-user environment.

4. **No Explicit Negative Test for `_getIncomingRequests` on Empty/Non-existent Users:**
   * While `_getIncomingRequests` is used in tests, there isn't an explicit test case for a user who has *never* received requests or a user whose `UserDoc` does not exist in the collection at all. A dedicated test confirming an empty array (`[]`) is returned in such scenarios would enhance coverage.
