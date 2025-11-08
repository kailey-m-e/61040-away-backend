---
timestamp: 'Fri Nov 07 2025 08:23:19 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251107_082319.a5dd4a5b.md]]'
content_id: b7556423019272e9663e70df44f59eb36f5239ef319d11d9379e3d427b7b7bde
---

# response:

Of course. To update the `requestFriend` sync as requested, we need to modify `FriendingRequestFriendRequest` to include a `where` clause. This clause will perform a pre-flight check by querying for the user via `UserAuthentication._getUserByUsername`. If the query returns no results (i.e., `frames.length === 0`), it will throw an error, halting the sync's execution before the `then` clause (the optimistic update) is ever reached.

This ensures that a friend request is only attempted if the target user actually exists, providing immediate client-side validation.

Here is the updated `friending.sync.ts` file. Only the `FriendingRequestFriendRequest` sync has been modified; the corresponding `Response` and `Error` syncs remain the same as they react to the outcome of the API call itself.

```typescript
// friending.sync.ts

import { actions, Frames, Sync } from "@engine";
import { Requesting, Sessioning, Friending, UserAuthentication } from "@concepts";

export const FriendingRunInTransactionRequest: Sync = ({ request, session, transactionDetails }) => ({
  when: actions([Requesting.request, { path: "/Friending/_runInTransaction", session, transactionDetails }, { request }]),
  then: actions([Friending._runInTransaction, { session, transactionDetails }]),
});

export const FriendingRunInTransactionResponse: Sync = ({ request, response }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_runInTransaction" }, { request }],
    [Friending._runInTransaction, {}, { response }],
  ),
  then: actions([Requesting.respond, { request, response }]),
});

export const FriendingRunInTransactionResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_runInTransaction" }, { request }],
    [Friending._runInTransaction, {}, { error }],
  ),
  then: actions([Requesting.error, { request, error }]),
});

export const FriendingRequestFriendRequest: Sync = ({ request, session, toUsername, toUserId }) => ({
  when: actions([Requesting.request, { path: "/Friending/requestFriend", session, toUsername }, { request }]),
  where: async (frames) => {
    frames = await frames.query(UserAuthentication._getUserByUsername, { username: toUsername }, { user: toUserId });
    if (frames.length === 0) {
      throw new Error(`User "${toUsername}" not found. Cannot send friend request.`);
    }
    return frames;
  },
  then: actions([Friending._requestFriend, { toUserId }]),
});

export const FriendingRequestFriendResponse: Sync = ({ request, friendRequest }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/requestFriend" }, { request }],
    [Friending._requestFriend, {}, { friendRequest }],
  ),
  then: actions([Requesting.respond, { request, friendRequest }]),
});

export const FriendingRequestFriendResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/requestFriend" }, { request }],
    [Friending._requestFriend, {}, { error }],
  ),
  then: actions([Requesting.error, { request, error }]),
});

export const FriendingUnrequestFriendRequest: Sync = ({ request, session, requestId }) => ({
  when: actions([Requesting.request, { path: "/Friending/unrequestFriend", session, requestId }, { request }]),
  then: actions([Friending._unrequestFriend, { requestId }]),
});

export const FriendingUnrequestFriendResponse: Sync = ({ request, success }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/unrequestFriend" }, { request }],
    [Friending._unrequestFriend, {}, { success }],
  ),
  then: actions([Requesting.respond, { request, success }]),
});

export const FriendingUnrequestFriendResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/unrequestFriend" }, { request }],
    [Friending._unrequestFriend, {}, { error }],
  ),
  then: actions([Requesting.error, { request, error }]),
});

export const FriendingAcceptFriendRequest: Sync = ({ request, session, requestId }) => ({
  when: actions([Requesting.request, { path: "/Friending/acceptFriend", session, requestId }, { request }]),
  then: actions([Friending._acceptFriend, { requestId }]),
});

export const FriendingAcceptFriendResponse: Sync = ({ request, friendship }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/acceptFriend" }, { request }],
    [Friending._acceptFriend, {}, { friendship }],
  ),
  then: actions([Requesting.respond, { request, friendship }]),
});

export const FriendingAcceptFriendResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/acceptFriend" }, { request }],
    [Friending._acceptFriend, {}, { error }],
  ),
  then: actions([Requesting.error, { request, error }]),
});

export const FriendingRejectFriendRequest: Sync = ({ request, session, requestId }) => ({
  when: actions([Requesting.request, { path: "/Friending/rejectFriend", session, requestId }, { request }]),
  then: actions([Friending._rejectFriend, { requestId }]),
});

export const FriendingRejectFriendResponse: Sync = ({ request, success }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/rejectFriend" }, { request }],
    [Friending._rejectFriend, {}, { success }],
  ),
  then: actions([Requesting.respond, { request, success }]),
});

export const FriendingRejectFriendResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/rejectFriend" }, { request }],
    [Friending._rejectFriend, {}, { error }],
  ),
  then: actions([Requesting.error, { request, error }]),
});

export const FriendingValidateFriendshipRequest: Sync = ({ request, session, otherUserId }) => ({
  when: actions([Requesting.request, { path: "/Friending/validateFriendship", session, otherUserId }, { request }]),
  then: actions([Friending._validateFriendship, { otherUserId }]),
});

export const FriendingValidateFriendshipResponse: Sync = ({ request, isValid, friendshipId }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/validateFriendship" }, { request }],
    [Friending._validateFriendship, {}, { isValid, friendshipId }],
  ),
  then: actions([Requesting.respond, { request, isValid, friendshipId }]),
});

export const FriendingValidateFriendshipResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/validateFriendship" }, { request }],
    [Friending._validateFriendship, {}, { error }],
  ),
  then: actions([Requesting.error, { request, error }]),
});

export const FriendingEndFriendshipRequest: Sync = ({ request, session, friendshipId }) => ({
  when: actions([Requesting.request, { path: "/Friending/endFriendship", session, friendshipId }, { request }]),
  then: actions([Friending._endFriendship, { friendshipId }]),
});

export const FriendingEndFriendshipResponse: Sync = ({ request, success, friendshipId }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/endFriendship" }, { request }],
    [Friending._endFriendship, {}, { success, friendshipId }],
  ),
  then: actions([Requesting.respond, { request, success, friendshipId }]),
});

export const FriendingEndFriendshipResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/endFriendship" }, { request }],
    [Friending._endFriendship, {}, { error }],
  ),
  then: actions([Requesting.error, { request, error }]),
});

export const GetIncomingRequestsRequest: Sync = ({ request, session, id, fromUserId, toUserId, status, createdAt, results }) => ({
  when: actions([Requesting.request, { path: "/Friending/_getIncomingRequests", session }, { request }]),
  where: async (frames) => {
    const originalFrame = frames[0];
    frames = await frames.query(Friending._getIncomingRequests, { session }, { id, fromUserId, toUserId, status, createdAt });
    if (frames.length === 0) {
      const response = { ...originalFrame, [results]: [] };
      return new Frames(response);
    }
    return frames.collectAs([id, fromUserId, toUserId, status, createdAt], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const GetOutgoingRequestsRequest: Sync = ({ request, session, id, fromUserId, toUserId, status, createdAt, results }) => ({
  when: actions([Requesting.request, { path: "/Friending/_getOutgoingRequests", session }, { request }]),
  where: async (frames) => {
    const originalFrame = frames[0];
    frames = await frames.query(Friending._getOutgoingRequests, { session }, { id, fromUserId, toUserId, status, createdAt });
    if (frames.length === 0) {
      const response = { ...originalFrame, [results]: [] };
      return new Frames(response);
    }
    return frames.collectAs([id, fromUserId, toUserId, status, createdAt], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const GetFriendsRequest: Sync = ({ request, session, id, userId1, userId2, establishedAt, results }) => ({
  when: actions([Requesting.request, { path: "/Friending/_getFriends", session }, { request }]),
  where: async (frames) => {
    const originalFrame = frames[0];
    frames = await frames.query(Friending._getFriends, { session }, { id, userId1, userId2, establishedAt });
    if (frames.length === 0) {
      const response = { ...originalFrame, [results]: [] };
      return new Frames(response);
    }
    return frames.collectAs([id, userId1, userId2, establishedAt], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});
```

\#prompt: The issue is that an error cannot be thrown in the request sync; the
