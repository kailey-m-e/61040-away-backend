---
timestamp: 'Sat Oct 18 2025 14:58:13 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251018_145813.5e98645f.md]]'
content_id: cc7bba7e35e4e0d84cb468abef9386a91386d4df4379393a7a7c0b8390fce15a
---

# response:

You're absolutely right to point that out! My apologies, that's another common TypeScript type inference issue with the MongoDB driver, where it can sometimes lose the `FindAndModifyResult` wrapper type and assume it's just the document itself.

The `findOneAndUpdate` method always returns a `FindAndModifyResult<TSchema>` object, which contains the `value` property (the document before modification, or `null` if no match was found) and other properties like `ok`.

To fix this, you need to explicitly declare the type of the variable receiving the result of `findOneAndUpdate` as `FindAndModifyResult<UsersDoc>`.

Here's the corrected `FriendingConcept.ts` file

\#prompt: I'm now getting the error: Module '"file:///C:/Users/Kailey/AppData/Local/deno/npm/registry.npmjs.org/mongodb/6.10.0/mongodb.d.ts"' has no exported member 'FindAndModifyResult'.. How can I fix this?
