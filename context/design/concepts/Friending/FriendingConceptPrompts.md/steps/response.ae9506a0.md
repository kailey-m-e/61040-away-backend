---
timestamp: 'Fri Oct 17 2025 09:00:41 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251017_090041.aa7f375a.md]]'
content_id: ae9506a0869305e810a970888cd38175a7d32e210e78c7685fbeb67a7ca3e7e3
---

# response:

Here is a list of concise feedback for the Friending concept implementation and specification:

1. **`validateFriendship` Misclassification:** The `validateFriendship` method is specified as an "action" but functions as a query (it reads state without modification). According to the guidelines, query methods should be prefixed with an underscore (`_`) and listed under "queries" in the concept specification.
2. **Atomicity/Race Conditions:** Several actions (`requestFriend`, `acceptFriend`, `endFriendship`) involve multiple non-atomic database operations (e.g., `findOne` followed by `updateOne`/`insertOne`). This can lead to race conditions and potential data inconsistencies if concurrent operations occur. These operations should ideally be consolidated into a single atomic update or transaction where possible.
3. **`_getIncomingRequests` Return Type Mismatch:** The specification's query `_getIncoming(user: User): (set of Users)` implies returning an array of `User` IDs (primitive `ID`s). The implementation, `_getIncomingRequests`, returns `FriendDoc[]` which is an array of custom objects, violating the guideline that action/query outputs should ideally use primitive values or simple collections of them, and providing more data than specified.
4. **Collection Naming Ambiguity:** The `this.friends` collection stores `FriendDoc` documents, which represent individual users and their friendship-related data. Naming it `users` or `userFriendData` might more clearly reflect its content than `friends`, which could be confused with a collection of *friendship relations* rather than *user profiles containing friendship data*.
