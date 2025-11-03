---
timestamp: 'Sun Nov 02 2025 13:17:23 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251102_131723.a14fe1b0.md]]'
content_id: c74f7bd3f49683a6bc4fc273bdfda63ca5b222f83ca20c74725fe2cf4f930cdf
---

# response:

```typescript
// friending.sync.ts

import { createUpdater, Sync, actions } from "@raycast/sync";
import { v4 as uuidv4 } from "uuid";

import { FriendRequest, Friendship } from "../concepts/friending/friendingConcept";
import { Requesting, RequestingActions, RequestType } from "../concepts/requesting/RequestingConcept";

const FriendRequestUpdater = createUpdater<FriendRequest>("FriendRequests");
const FriendshipUpdater = createUpdater<Friendship>("Friendships");

const Friending = {
  runInTransaction: (input: { session: string, transactionDetails: any }) => ({ type: "FRIENDING_RUN_IN_TRANSACTION", payload: input }),
  requestFriend: (input: { session: string, toUserId: string }) => ({ type: "FRIENDING_REQUEST_FRIEND", payload: input }),
  unrequestFriend: (input: { session: string, requestId: string }) => ({ type: "FRIENDING_UNREQUEST_FRIEND", payload: input }),
  acceptFriend: (input: { session: string, requestId: string }) => ({ type: "FRIENDING_ACCEPT_FRIEND", payload: input }),
  rejectFriend: (input: { session: string, requestId: string }) => ({ type: "FRIENDING_REJECT_FRIEND", payload: input }),
  validateFriendship: (input: { session: string, otherUserId: string }) => ({ type: "FRIENDING_VALIDATE_FRIENDSHIP", payload: input }),
  endFriendship: (input: { session: string, friendshipId: string }) => ({ type: "FRIENDING_END_FRIENDSHIP", payload: input }),
  getIncomingRequests: (input: { session: string }) => ({ type: "FRIENDING_GET_INCOMING_REQUESTS", payload: input }),
  getOutgoingRequests: (input: { session: string }) => ({ type: "FRIENDING_GET_OUTGOING_REQUESTS", payload: input }),
  getFriends: (input: { session: string }) => ({ type: "FRIENDING_GET_FRIENDS", payload: input }),
};

export const FriendingRunInTransactionRequest: Sync<{ session: string, transactionDetails: any, request: RequestType }> = ({ session, transactionDetails, request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_runInTransaction", session, transactionDetails }, { request }],
  ),
  then: actions(
    [Friending.runInTransaction, { session, transactionDetails }, {}],
  ),
});

export const FriendingRunInTransactionResponse: Sync<{ request: RequestType, response: { success: boolean } }> = ({ request, response }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_runInTransaction" }, { request }],
    [Friending.runInTransaction, {}, { response }],
  ),
  then: actions(
    [RequestingActions.respond, { request, resource: response }],
  ),
});

export const FriendingRunInTransactionResponseError: Sync<{ request: RequestType, error: any }> = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_runInTransaction" }, { request }],
    [Friending.runInTransaction, {}, { error }],
  ),
  then: actions(
    [RequestingActions.error, { request, error }],
  ),
});

export const FriendingRequestFriendRequest: Sync<{ session: string, toUserId: string, request: RequestType }> = ({ session, toUserId, request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/requestFriend", session, toUserId }, { request }],
  ),
  then: actions(
    [Friending.requestFriend, { session, toUserId }, {}],
  ),
});

export const FriendingRequestFriendResponse: Sync<{ request: RequestType, friendRequest: FriendRequest }> = ({ request, friendRequest }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/requestFriend" }, { request }],
    [Friending.requestFriend, {}, { friendRequest }],
  ),
  then: actions(
    [RequestingActions.respond, { request, resource: friendRequest }],
  ),
});

export const FriendingRequestFriendResponseError: Sync<{ request: RequestType, error: any }> = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/requestFriend" }, { request }],
    [Friending.requestFriend, {}, { error }],
  ),
  then: actions(
    [RequestingActions.error, { request, error }],
  ),
});

export const FriendingUnrequestFriendRequest: Sync<{ session: string, requestId: string, request: RequestType }> = ({ session, requestId, request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/unrequestFriend", session, requestId }, { request }],
  ),
  then: actions(
    [Friending.unrequestFriend, { session, requestId }, {}],
  ),
});

export const FriendingUnrequestFriendResponse: Sync<{ request: RequestType, response: { success: boolean, requestId: string } }> = ({ request, response }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/unrequestFriend" }, { request }],
    [Friending.unrequestFriend, {}, { response }],
  ),
  then: actions(
    [RequestingActions.respond, { request, resource: response }],
  ),
});

export const FriendingUnrequestFriendResponseError: Sync<{ request: RequestType, error: any }> = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/unrequestFriend" }, { request }],
    [Friending.unrequestFriend, {}, { error }],
  ),
  then: actions(
    [RequestingActions.error, { request, error }],
  ),
});

export const FriendingAcceptFriendRequest: Sync<{ session: string, requestId: string, request: RequestType }> = ({ session, requestId, request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/acceptFriend", session, requestId }, { request }],
  ),
  then: actions(
    [Friending.acceptFriend, { session, requestId }, {}],
  ),
});

export const FriendingAcceptFriendResponse: Sync<{ request: RequestType, friendship: Friendship }> = ({ request, friendship }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/acceptFriend" }, { request }],
    [Friending.acceptFriend, {}, { friendship }],
  ),
  then: actions(
    [RequestingActions.respond, { request, resource: friendship }],
  ),
});

export const FriendingAcceptFriendResponseError: Sync<{ request: RequestType, error: any }> = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/acceptFriend" }, { request }],
    [Friending.acceptFriend, {}, { error }],
  ),
  then: actions(
    [RequestingActions.error, { request, error }],
  ),
});

export const FriendingRejectFriendRequest: Sync<{ session: string, requestId: string, request: RequestType }> = ({ session, requestId, request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/rejectFriend", session, requestId }, { request }],
  ),
  then: actions(
    [Friending.rejectFriend, { session, requestId }, {}],
  ),
});

export const FriendingRejectFriendResponse: Sync<{ request: RequestType, response: { success: boolean, requestId: string } }> = ({ request, response }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/rejectFriend" }, { request }],
    [Friending.rejectFriend, {}, { response }],
  ),
  then: actions(
    [RequestingActions.respond, { request, resource: response }],
  ),
});

export const FriendingRejectFriendResponseError: Sync<{ request: RequestType, error: any }> = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/rejectFriend" }, { request }],
    [Friending.rejectFriend, {}, { error }],
  ),
  then: actions(
    [RequestingActions.error, { request, error }],
  ),
});

export const FriendingValidateFriendshipRequest: Sync<{ session: string, otherUserId: string, request: RequestType }> = ({ session, otherUserId, request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/validateFriendship", session, otherUserId }, { request }],
  ),
  then: actions(
    [Friending.validateFriendship, { session, otherUserId }, {}],
  ),
});

export const FriendingValidateFriendshipResponse: Sync<{ request: RequestType, response: { isValid: boolean, friendshipId?: string } }> = ({ request, response }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/validateFriendship" }, { request }],
    [Friending.validateFriendship, {}, { response }],
  ),
  then: actions(
    [RequestingActions.respond, { request, resource: response }],
  ),
});

export const FriendingValidateFriendshipResponseError: Sync<{ request: RequestType, error: any }> = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/validateFriendship" }, { request }],
    [Friending.validateFriendship, {}, { error }],
  ),
  then: actions(
    [RequestingActions.error, { request, error }],
  ),
});

export const FriendingEndFriendshipRequest: Sync<{ session: string, friendshipId: string, request: RequestType }> = ({ session, friendshipId, request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/endFriendship", session, friendshipId }, { request }],
  ),
  then: actions(
    [Friending.endFriendship, { session, friendshipId }, {}],
  ),
});

export const FriendingEndFriendshipResponse: Sync<{ request: RequestType, response: { success: boolean, friendshipId: string } }> = ({ request, response }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/endFriendship" }, { request }],
    [Friending.endFriendship, {}, { response }],
  ),
  then: actions(
    [RequestingActions.respond, { request, resource: response }],
  ),
});

export const FriendingEndFriendshipResponseError: Sync<{ request: RequestType, error: any }> = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/endFriendship" }, { request }],
    [Friending.endFriendship, {}, { error }],
  ),
  then: actions(
    [RequestingActions.error, { request, error }],
  ),
});

export const FriendingGetIncomingRequestsRequest: Sync<{ session: string, request: RequestType }> = ({ session, request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_getIncomingRequests", session }, { request }],
  ),
  then: actions(
    [Friending.getIncomingRequests, { session }, {}],
  ),
});

export const FriendingGetIncomingRequestsResponse: Sync<{ request: RequestType, requests: FriendRequest[] }> = ({ request, requests }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_getIncomingRequests" }, { request }],
    [Friending.getIncomingRequests, {}, { requests }],
  ),
  then: actions(
    [RequestingActions.respond, { request, resource: requests }],
  ),
});

export const FriendingGetIncomingRequestsResponseError: Sync<{ request: RequestType, error: any }> = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_getIncomingRequests" }, { request }],
    [Friending.getIncomingRequests, {}, { error }],
  ),
  then: actions(
    [RequestingActions.error, { request, error }],
  ),
});

export const FriendingGetOutgoingRequestsRequest: Sync<{ session: string, request: RequestType }> = ({ session, request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_getOutgoingRequests", session }, { request }],
  ),
  then: actions(
    [Friending.getOutgoingRequests, { session }, {}],
  ),
});

export const FriendingGetOutgoingRequestsResponse: Sync<{ request: RequestType, requests: FriendRequest[] }> = ({ request, requests }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_getOutgoingRequests" }, { request }],
    [Friending.getOutgoingRequests, {}, { requests }],
  ),
  then: actions(
    [RequestingActions.respond, { request, resource: requests }],
  ),
});

export const FriendingGetOutgoingRequestsResponseError: Sync<{ request: RequestType, error: any }> = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_getOutgoingRequests" }, { request }],
    [Friending.getOutgoingRequests, {}, { error }],
  ),
  then: actions(
    [RequestingActions.error, { request, error }],
  ),
});

export const FriendingGetFriendsRequest: Sync<{ session: string, request: RequestType }> = ({ session, request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_getFriends", session }, { request }],
  ),
  then: actions(
    [Friending.getFriends, { session }, {}],
  ),
});

export const FriendingGetFriendsResponse: Sync<{ request: RequestType, friends: Friendship[] }> = ({ request, friends }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_getFriends" }, { request }],
    [Friending.getFriends, {}, { friends }],
  ),
  then: actions(
    [RequestingActions.respond, { request, resource: friends }],
  ),
});

export const FriendingGetFriendsResponseError: Sync<{ request: RequestType, error: any }> = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/_getFriends" }, { request }],
    [Friending.getFriends, {}, { error }],
  ),
  then: actions(
    [RequestingActions.error, { request, error }],
  ),
});
```
