import { actions, Frames, Sync } from "@engine";
import {
  Friending,
  Requesting,
  Sessioning,
  UserAuthentication,
  Wishlist,
} from "@concepts";

export const AddWishlistPlaceRequest: Sync = (
  {
    request,
    session,
    user,
    title,
    city,
    region,
    country,
  },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Wishlist/addPlace",
      session,
      city,
      region,
      country,
    },
    { request },
  ]),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });
    return frames;
  },
  then: actions([Wishlist.addPlace, {
    user,
    city,
    region,
    country,
  }]),
});

export const AddWishlistPlaceResponse: Sync = ({ request, place }) => ({
  when: actions(
    [Requesting.request, { path: "/Wishlist/addPlace" }, { request }],
    [Wishlist.addPlace, {}, { place }],
  ),
  then: actions([Requesting.respond, { request, place }]),
});

export const RemoveWishlistPlaceRequest: Sync = (
  {
    request,
    session,
    user,
    place,
  },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Wishlist/removePlace",
      session,
      place,
    },
    { request },
  ]),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });
    return frames;
  },
  then: actions([Wishlist.removePlace, {
    user,
    place,
  }]),
});

export const RemoveWishlistPlaceResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Wishlist/removePlace" }, { request }],
    [Wishlist.removePlace, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const RemoveWishlistPlaceResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Wishlist/removePlace" }, { request }],
    [Wishlist.removePlace, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const GetPlacesRequest: Sync = (
  { request, session, user, place, placeData, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Wishlist/_getPlaces", session },
    { request },
  ]),
  where: async (frames) => {
    const originalFrame = frames[0];

    frames = await frames.query(Sessioning._getUser, { session }, { user });
    frames = await frames.query(Wishlist._getPlaces, { user }, { place });

    if (frames.length === 0) {
      const response = { ...originalFrame, [results]: [] };
      return new Frames(response);
    }

    // Get full post data for each post ID
    frames = await frames.query(Wishlist._getPlaceById, { _id: place }, {
      placeData,
    });

    return frames.collectAs([place, placeData], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const GetFriendWishlistRequest: Sync = (
  {
    request,
    session,
    user,
    friendUsername,
    friendUserId,
    friendshipBoolean,
    place,
    placeData,
    results,
  },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Wishlist/_getPlaces",
      session,
      friendUsername: friendUsername!,
    },
    { request },
  ]),
  where: async (frames) => {
    const originalFrame = frames[0];

    frames = await frames.query(Sessioning._getUser, { session }, { user });
    frames = await frames.query(UserAuthentication._getUserByUsername, {
      username: friendUsername,
    }, { user: friendUserId });
    frames = await frames.query(
      Friending._isFriendsWith,
      { user, username: friendUserId },
      {
        friendshipExists: friendshipBoolean,
      },
    );

    if (frames.length === 0) {
      return new Frames({ ...originalFrame, [results]: [] });
    }

    frames = await frames.query(Wishlist._getPlaces, { user: friendUserId }, {
      place,
    });

    if (frames.length === 0) {
      return new Frames({ ...originalFrame, [results]: [] });
    }

    frames = await frames.query(Wishlist._getPlaceById, { _id: place }, {
      placeData,
    });

    return frames.collectAs([place, placeData], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});
