---
timestamp: 'Fri Oct 17 2025 09:22:11 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251017_092211.fca23d93.md]]'
content_id: 92b4319ad9fda977b5965b74a084864d598a807744626544b3116d7566dbef6d
---

# response:

Here is a list of concise feedback for the Friending concept test file, based on the most up-to-date file content:

1. **Test Case 5 - Step 7 Logic Error:** The test calls `friendingConcept.endFriendship({ user: userB, friend: userA })` at a point where `userA` and `userB` are already friends (established in step 3). Ending an *existing* friendship should succeed, but the test currently asserts `assertEquals("error" in endFriendship, true)`, expecting it to fail. This assertion is incorrect and should be `assertNotEquals("error" in endFriendship, true)`. The accompanying comment "Ending friendship that doesn't exist should fail" is also inaccurate for this specific scenario and should be updated.

2. **`_getIncomingRequests` - Specification Mismatch:** The concept specification defines `_getIncoming(user: User): (set of Users)`, implying a return type of an array of `ID`s. However, the implementation `_getIncomingRequests` returns `UserDoc[]`. While the tests correctly verify the `_id` property of the `UserDoc` objects, this mismatch between the spec's expected return and the implementation's actual return (and thus the test's verification target) should be resolved for strict adherence to the concept guidelines (either update the spec or modify the implementation to return `ID[]`).

3. **Missing Concurrency/Race Condition Tests:** The test suite does not include scenarios that simulate concurrent operations. Actions like `requestFriend`, `acceptFriend`, and `endFriendship` involve multiple `findOne`, `insertOne`, and `updateOne` operations which are not intrinsically atomic in MongoDB. Adding tests (e.g., using `Promise.all` with simultaneous calls) would be beneficial to expose potential race conditions and ensure data consistency in a multi-user environment.

4. **No Explicit Negative Test for `_getIncomingRequests` for Non-existent Users:** While `_getIncomingRequests` is used, there isn't a dedicated test case to confirm its behavior for a `user` ID that has never been involved in any friending action (i.e., whose `UserDoc` might not exist in the collection). An explicit test asserting that `_getIncomingRequests` returns an empty array `[]` in such a scenario would improve coverage.

\#prompt: Can you relook at the most up-to-date spec?
