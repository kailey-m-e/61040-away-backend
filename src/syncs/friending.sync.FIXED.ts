import { actions, Frames, Sync } from "@engine";
import {
  Friending,
  Requesting,
  Sessioning,
  UserAuthentication,
} from "@concepts";

// ... (keep all the existing syncs above GetFriendsRequest)

export const GetFriendsRequest: Sync = (
  { request, session, user, friend, username, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Friending/_getFriends", session },
    { request },
  ]),
  where: async (frames) => {
    const originalFrame = frames[0];

    frames = await frames.query(Sessioning._getUser, { session }, { user });
    frames = await frames.query(Friending._getFriends, { user }, { friend });

    if (frames.length === 0) {
      const response = { ...originalFrame, [results]: [] };
      return new Frames(response);
    }

    // Convert friend IDs to usernames
    frames = await frames.query(UserAuthentication._getUsername, { user: friend }, { username });

    return frames.collectAs([username], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const GetOutgoingFriendsRequest: Sync = (
  { request, session, user, friend, username, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Friending/_getOutgoingRequests", session },
    { request },
  ]),
  where: async (frames) => {
    const originalFrame = frames[0];

    frames = await frames.query(Sessioning._getUser, { session }, { user });
    frames = await frames.query(Friending._getOutgoingRequests, { user }, { friend });

    if (frames.length === 0) {
      const response = { ...originalFrame, [results]: [] };
      return new Frames(response);
    }

    // Convert friend IDs to usernames
    frames = await frames.query(UserAuthentication._getUsername, { user: friend }, { username });

    return frames.collectAs([username], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const GetIncomingFriendsRequest: Sync = (
  { request, session, user, friend, username, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Friending/_getIncomingRequests", session },
    { request },
  ]),

  where: async (frames) => {
    const originalFrame = frames[0];

    frames = await frames.query(Sessioning._getUser, { session }, { user });
    frames = await frames.query(Friending._getIncomingRequests, { user }, { friend });

    if (frames.length === 0) {
      const response = { ...originalFrame, [results]: [] };
      return new Frames(response);
    }

    // Convert friend IDs to usernames
    frames = await frames.query(UserAuthentication._getUsername, { user: friend }, { username });

    return frames.collectAs([username], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

// Need to add syncs to allow read access to friend's posts and wishlists
