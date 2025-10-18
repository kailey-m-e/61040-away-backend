---
timestamp: 'Fri Oct 17 2025 09:22:32 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251017_092232.f494ce32.md]]'
content_id: 77f3ebb9ae19da16ce5f59cf20098a74226f854d3145308928db9c50fc09c0a7
---

# response:

Here is a list of concise feedback for the Friending concept test file, based on the most up-to-date specification and implementation:

1. **`validateFriendship` - Misclassified Method:** The concept specification lists `validateFriendship` as an "action", but it functions purely as a query (reads state and returns success/error without modifying state). According to the concept guidelines, query methods should be prefixed with an underscore (`_`) and listed under the "queries" section in the concept specification and implementation (e.g., `_validateFriendship`).
2. **`_getIncomingRequests` - Specification Mismatch:** The concept specification for `_getIncoming(user: User): (users set of Users)` implies returning an array of primitive `User` IDs (`ID[]`). However, the implementation `_getIncomingRequests` returns `UserDoc[]`. While the tests correctly verify the `_id` property of the `UserDoc` objects, this discrepancy between the spec's expected return type and the implementation's actual return type should be resolved for strict adherence to concept guidelines (either update the spec to reflect `UserDoc[]` or modify the implementation to return `ID[]`).
3. **Missing Concurrency/Race Condition Tests:** The current test suite lacks scenarios that simulate concurrent operations. Actions like `requestFriend`, `acceptFriend`, and `endFriendship` involve multiple, non-atomic database read and write operations (`findOne`, `insertOne`, `updateOne`). Adding tests (e.g., using `Promise.all` with simultaneous calls) would be beneficial to expose potential race conditions and ensure data consistency in a multi-user environment.
4. **Collection Naming Inconsistency:** In the implementation's constructor, the MongoDB collection is named `PREFIX + "friends"`. However, this collection stores `UserDoc` documents (which represent a user's friending-related data like `friends` and `outgoingRequests`), not individual "friendship" records. The concept's `state` explicitly describes "a users set of Users". To better align with the `UserDoc` structure and the concept's state, the MongoDB collection name should ideally be `PREFIX + "users"`.
