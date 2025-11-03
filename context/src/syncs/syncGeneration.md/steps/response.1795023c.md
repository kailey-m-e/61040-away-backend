---
timestamp: 'Sun Nov 02 2025 20:38:37 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251102_203837.be7e9cf6.md]]'
content_id: 1795023c7258d26e1d6a2b99bb8a337f34fb0214ef5524564a738d1bcf31216f
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

@[posting](posting.sync.ts)
@[posting](wishlist.sync.ts)
@[posting](friending.sync.ts)

\#prompt: Compare the syncs in the attached files to the syncs below to determine why the get syncs aren't correctly returning arrays, so requesting multiple friends or making multiple posts is overwriting the old ones.

import { actions, Frames, Sync } from "@engine";
import { Requesting, Sessioning, FileUploading, Sharing, UserAuthentication } from "@concepts";

//-- Phase 1: Request Upload URL --//
export const RequestUploadURL: Sync = ({ request, session, filename, user }) => ({
when: actions(\[Requesting.request, { path: "/FileUploading/requestUploadURL", session, filename }, { request }]),
where: async (frames) => {
frames = await frames.query(Sessioning.\_getUser, { session }, { user })
return frames
},
then: actions(\[FileUploading.requestUploadURL, { owner: user, filename }]),
});

export const RequestUploadURLResponse: Sync = ({ request, file, uploadURL }) => ({
when: actions(
\[Requesting.request, { path: "/FileUploading/requestUploadURL" }, { request }],
\[FileUploading.requestUploadURL, {}, { file, uploadURL }],
),
then: actions(\[Requesting.respond, { request, file, uploadURL }]),
});

//-- Phase 2: Confirm Upload --//
export const ConfirmUploadRequest: Sync = ({ request, session, file, user, owner }) => ({
when: actions(\[Requesting.request, { path: "/FileUploading/confirmUpload", session, file }, { request }]),
where: async (frames) => {
frames = await frames.query(Sessioning.\_getUser, { session }, { user });
frames = await frames.query(FileUploading.\_getOwner, { file }, { owner });
return frames.filter(($) => $\[user] === $\[owner]);
},
then: actions(\[FileUploading.confirmUpload, { file }]),
});

export const ConfirmUploadResponseSuccess: Sync = ({ request, file }) => ({
when: actions(
\[Requesting.request, { path: "/FileUploading/confirmUpload" }, { request }],
\[FileUploading.confirmUpload, {}, { file }],
),
then: actions(\[Requesting.respond, { request, status: "confirmed" }]),
});

export const ConfirmUploadResponseError: Sync = ({ request, error }) => ({
when: actions(
\[Requesting.request, { path: "/FileUploading/confirmUpload" }, { request }],
\[FileUploading.confirmUpload, {}, { error }],
),
then: actions(\[Requesting.respond, { request, error }]),
});

//-- List User's Files --//
export const ListMyFilesRequest: Sync = ({ request, session, user, file, filename, results }) => ({
when: actions(\[Requesting.request, { path: "/my-files", session }, { request }]),
where: async (frames) => {
const originalFrame = frames\[0];
frames = await frames.query(Sessioning.\_getUser, { session }, { user });
frames = await frames.query(FileUploading.\_getFilesByOwner, { owner: user }, { file, filename });
if (frames.length === 0) {
const response = {...originalFrame, \[results]: \[]}
return new Frames(response)
}
return frames.collectAs(\[file, filename], results);
},
then: actions(\[Requesting.respond, { request, results }]),
});

export const ListSharedFilesRequest: Sync = ({ request, session, user, file, filename, owner, ownerUsername, results }) => ({
when: actions(\[Requesting.request, { path: "/my-shares", session }, { request }]),
where: async (frames) => {
const originalFrame = frames\[0];

```
// 1. Authenticate user
frames = await frames.query(Sessioning._getUser, { session }, { user });

// If the session is invalid, return an empty list immediately.
if (frames.length === 0) {
  return new Frames({...originalFrame, [results]: []});
}

// 2. Find files shared with the user
frames = await frames.query(Sharing._getFilesSharedWithUser, { user }, { file });

// If no files are shared, return an empty list.
if (frames.length === 0) {
  return new Frames({...originalFrame, [results]: []});
}

// 3. & 4. Enrich each file with its details
frames = await frames.query(FileUploading._getFilename, { file }, { filename });
frames = await frames.query(FileUploading._getOwner, { file }, { owner });
frames = await frames.query(UserAuthentication._getUsername, { user: owner }, { username: ownerUsername });

// 5. Collect into final response structure
return frames.collectAs([file, filename, ownerUsername], results);
```

},
then: actions(\[Requesting.respond, { request, results }]),
});

//-- Download a File --//
export const DownloadFileRequest: Sync = ({ request, session, file, user, owner, isShared, downloadURL }) => ({
when: actions(\[Requesting.request, { path: "/download", session, file }, { request }]),
where: async (frames) => {
frames = await frames.query(Sessioning.\_getUser, { session }, { user });
frames = await frames.query(FileUploading.\_getOwner, { file }, { owner });
frames = await frames.query(Sharing.\_isSharedWith, { file, user }, { access: isShared });
// Authorization Logic: Keep frames where the user is the owner OR the file is shared.
frames = frames.filter(($) => $\[user] === $\[owner] || $\[isShared] === true);
// If any authorized frames remain, get the download URL for them.
return await frames.query(FileUploading.\_getDownloadURL, { file }, { downloadURL });
},
then: actions(\[Requesting.respond, { request, downloadURL }]),
});
