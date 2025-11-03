import { actions, Frames, Sync } from "@engine";
import {
  Friending,
  Requesting,
  Sessioning,
  UserAuthentication,
} from "@concepts";

export const FriendingRequestFriendRequest: Sync = (
  { session, userId, friendUsername, friendUserId, request },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Friending/requestFriend",
      session,
      friend: friendUsername,
    }, { request }],
  ),
  where: async (frames) => {
    // First query: session -> userId
    frames = await frames.query(Sessioning._getUser, { session }, {
      user: userId,
    });

    // Second query: friendUsername -> friendUserId
    frames = await frames.query(UserAuthentication._getUserByUsername, {
      username: friendUsername,
    }, { user: friendUserId });

    return frames;
  },
  then: actions(
    [Friending.requestFriend, { user: userId, friend: friendUserId }, {}],
  ),
});

export const FriendingRequestFriendResponse: Sync = (
  { request },
) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/requestFriend" }, { request }],
    [Friending.requestFriend, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const FriendingRequestFriendResponseError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/requestFriend" }, { request }],
    [Friending.requestFriend, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const FriendingUnrequestFriendRequest: Sync = (
  { session, user, friendUsername, friendId, request },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Friending/unrequestFriend",
      session,
      friend: friendUsername,
    }, { request }],
  ),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });

    frames = await frames.query(UserAuthentication._getUserByUsername, {
      username: friendUsername,
    }, { user: friendId });

    return frames;
  },
  then: actions(
    [Friending.unrequestFriend, { user, friend: friendId }, {}],
  ),
});

export const UnrequestFriendResponse: Sync = (
  { request },
) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/unrequestFriend" }, { request }],
    [Friending.unrequestFriend, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const UnrequestFriendResponseError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/unrequestFriend" }, { request }],
    [Friending.unrequestFriend, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const AcceptFriendRequest: Sync = (
  { session, user, friendUsername, friendId, request },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Friending/acceptFriend",
      session,
      friend: friendUsername,
    }, { request }],
  ),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });

    frames = await frames.query(UserAuthentication._getUserByUsername, {
      username: friendUsername,
    }, { user: friendId });

    return frames;
  },
  then: actions(
    [Friending.acceptFriend, { user, friend: friendId }, {}],
  ),
});

export const AcceptFriendResponse: Sync = (
  { request },
) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/acceptFriend" }, { request }],
    [Friending.acceptFriend, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const AcceptFriendResponseError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/acceptFriend" }, { request }],
    [Friending.acceptFriend, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const RejectFriendRequest: Sync = (
  { session, user, friendUsername, friendId, request },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Friending/rejectFriend",
      session,
      friend: friendUsername,
    }, { request }],
  ),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });

    frames = await frames.query(UserAuthentication._getUserByUsername, {
      username: friendUsername,
    }, { user: friendId });

    return frames;
  },
  then: actions(
    [Friending.rejectFriend, { user, friend: friendId }, {}],
  ),
});

export const RejectFriendResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/rejectFriend" }, { request }],
    [Friending.rejectFriend, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const FriendingRejectFriendResponseError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/rejectFriend" }, { request }],
    [Friending.rejectFriend, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

// export const FriendingValidateFriendshipRequest: Sync = (
//   { session, user, friendUsername, friendId, request },
// ) => ({
//   when: actions(
//     [Requesting.request, {
//       path: "/Friending/validateFriendship",
//       session,
//       friend: friendUsername,
//     }, { request }],
//   ),
//   where: async (frames) => {
//     frames = await frames.query(Sessioning._getUser, { session }, { user });

//     frames = await frames.query(UserAuthentication._getUserByUsername, {
//       username: friendUsername,
//     }, { user: friendId });

//     return frames;
//   },
//   then: actions(
//     [Friending.validateFriendship, { user, friend: friendId }, {}],
//   ),
// });

// export const ValidateFriendshipResponse: Sync = (
//   { request },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Friending/validateFriendship" }, {
//       request,
//     }],
//     [Friending.validateFriendship, {}, {}],
//   ),
//   then: actions(
//     [Requesting.respond, { request }],
//   ),
// });

// export const ValidateFriendshipResponseError: Sync = (
//   { request, error },
// ) => ({
//   when: actions(
//     [Requesting.request, { path: "/Friending/validateFriendship" }, {
//       request,
//     }],
//     [Friending.validateFriendship, {}, { error }],
//   ),
//   then: actions(
//     [Requesting.respond, { request, error }],
//   ),
// });

export const EndFriendshipRequest: Sync = (
  { session, user, friendUsername, friendId, request },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Friending/endFriendship",
      session,
      friend: friendUsername,
    }, { request }],
  ),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });

    frames = await frames.query(UserAuthentication._getUserByUsername, {
      username: friendUsername,
    }, { user: friendId });

    return frames;
  },
  then: actions(
    [Friending.endFriendship, { user, friend: friendId }, {}],
  ),
});

export const EndFriendshipResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/endFriendship" }, { request }],
    [Friending.endFriendship, {}, {}],
  ),
  then: actions(
    [Requesting.respond, { request }],
  ),
});

export const EndFriendshipResponseError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Friending/endFriendship" }, { request }],
    [Friending.endFriendship, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const GetFriendsRequest: Sync = (
  { request, session, user, friendId, username, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Friending/_getFriends", session },
    { request },
  ]),
  where: async (frames) => {
    const originalFrame = frames[0];

    frames = await frames.query(Sessioning._getUser, { session }, { user });

    if (frames.length === 0) {
      return new Frames({ ...originalFrame, [results]: [] });
    }

    frames = await frames.query(Friending._getFriends, { user }, {
      friendId,
    });

    if (frames.length === 0) {
      return new Frames({ ...originalFrame, [results]: [] });
    }

    frames = await frames.query(
      UserAuthentication._getUsername,
      { user: friendId },
      {
        username,
      },
    );

    return frames.collectAs([friendId, username], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const GetOutgoingFriendsRequest: Sync = (
  { request, session, user, friendId, username, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Friending/_getOutgoingRequests", session },
    { request },
  ]),
  where: async (frames) => {
    const originalFrame = frames[0];

    frames = await frames.query(Sessioning._getUser, { session }, { user });

    if (frames.length === 0) {
      return new Frames({ ...originalFrame, [results]: [] });
    }

    frames = await frames.query(Friending._getOutgoingRequests, { user }, {
      friendId,
    });

    if (frames.length === 0) {
      return new Frames({ ...originalFrame, [results]: [] });
    }

    frames = await frames.query(
      UserAuthentication._getUsername,
      { user: friendId },
      {
        username,
      },
    );

    return frames.collectAs([friendId, username], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const GetIncomingFriendsRequest: Sync = (
  { request, session, user, friendId, username, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Friending/_getIncomingRequests", session },
    { request },
  ]),

  where: async (frames) => {
    const originalFrame = frames[0];

    frames = await frames.query(Sessioning._getUser, { session }, {
      user,
    });

    if (frames.length === 0) {
      return new Frames({ ...originalFrame, [results]: [] });
    }

    frames = await frames.query(Friending._getIncomingRequests, { user }, {
      friendId,
    });

    if (frames.length === 0) {
      return new Frames({ ...originalFrame, [results]: [] });
    }

    frames = await frames.query(
      UserAuthentication._getUsername,
      { user: friendId },
      {
        username,
      },
    );

    return frames.collectAs([friendId, username], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

// Need to add syncs to allow read access to friend's posts and wishlists
