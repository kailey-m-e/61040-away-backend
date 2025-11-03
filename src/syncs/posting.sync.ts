import { actions, Frames, Sync } from "@engine";
import {
  Friending,
  Posting,
  Requesting,
  Sessioning,
  UserAuthentication,
} from "@concepts";

export const CreatePostRequest: Sync = (
  {
    request,
    session,
    user,
    title,
    city,
    region,
    country,
    start,
    end,
    description,
  },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Posting/create",
      session,
      title,
      city,
      region,
      country,
      start,
      end,
      description,
    },
    { request },
  ]),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });
    return frames;
  },
  then: actions([Posting.create, {
    creator: user,
    title,
    city,
    region,
    country,
    start,
    end,
    description,
  }]),
});

export const CreatePostResponse: Sync = ({ request, post }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/create" }, { request }],
    [Posting.create, {}, { post }],
  ),
  then: actions([Requesting.respond, { request, post }]),
});

export const CreatePostResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/create" }, { request }],
    [Posting.create, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const EditPostTitleRequest: Sync = (
  { request, session, user, post, title },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Posting/editTitle",
      session,
      post,
      title,
    }, {
      request,
    }],
  ),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });
    return frames;
  },
  then: actions(
    [Posting.editTitle, { user, post, title }, {}],
  ),
});

export const EditPostTitleResponse: Sync = ({ request, post }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/editTitle" }, { request }],
    [Posting.editTitle, {}, { post }],
  ),
  then: actions(
    [Requesting.respond, { request, post }],
  ),
});

export const EditPostTitleResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/editTitle" }, { request }],
    [Posting.editTitle, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const EditPostPlaceRequest: Sync = (
  { request, session, user, post, city, region, country },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Posting/editPlace",
      session,
      post,
      city,
      region,
      country,
    }, {
      request,
    }],
  ),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });
    return frames;
  },
  then: actions(
    [Posting.editPlace, { user, post, city, region, country }, {}],
  ),
});

export const EditPostPlaceResponse: Sync = ({ request, post }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/editPlace" }, { request }],
    [Posting.editPlace, {}, { post }],
  ),
  then: actions(
    [Requesting.respond, { request, post }],
  ),
});

export const EditPostPlaceResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/editPlace" }, { request }],
    [Posting.editPlace, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const EditPostEditDates: Sync = (
  { request, session, user, post, start, end },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Posting/editDates",
      session,
      post,
      start,
      end,
    }, {
      request,
    }],
  ),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });
    return frames;
  },
  then: actions(
    [Posting.editDates, { user, post, start, end }, {}],
  ),
});

export const EditPostDatesResponse: Sync = ({ request, post }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/editDates" }, { request }],
    [Posting.editDates, {}, { post }],
  ),
  then: actions(
    [Requesting.respond, { request, post }],
  ),
});

export const EditPostDatesResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/editDates" }, { request }],
    [Posting.editDates, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const EditPostDescriptionRequest: Sync = (
  { request, session, user, post, description },
) => ({
  when: actions(
    [Requesting.request, {
      path: "/Posting/editDescription",
      session,
      post,
      description,
    }, {
      request,
    }],
  ),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });
    return frames;
  },
  then: actions(
    [Posting.editDescription, { user, post, description }, {}],
  ),
});

export const EditPostDescriptionResponse: Sync = ({ request, post }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/editDescription" }, { request }],
    [Posting.editDescription, {}, { post }],
  ),
  then: actions(
    [Requesting.respond, { request, post }],
  ),
});

export const EditPostDescriptionResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/editDescription" }, { request }],
    [Posting.editDescription, {}, { error }],
  ),
  then: actions(
    [Requesting.respond, { request, error }],
  ),
});

export const DeletePostRequest: Sync = (
  {
    request,
    session,
    user,
    post,
  },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Posting/delete",
      session,
      post,
    },
    { request },
  ]),
  where: async (frames) => {
    frames = await frames.query(Sessioning._getUser, { session }, { user });
    return frames;
  },
  then: actions([Posting.delete, {
    user,
    post,
  }]),
});

export const DeletePostResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/delete" }, { request }],
    [Posting.delete, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const DeletePostResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Posting/delete" }, { request }],
    [Posting.delete, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const GetPostsRequest: Sync = (
  { request, session, user, post, postData, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Posting/_getPosts", session },
    { request },
  ]),
  where: async (frames) => {
    const originalFrame = frames[0];

    // Get user from session
    frames = await frames.query(Sessioning._getUser, { session }, { user });

    // Get all post IDs for this user
    frames = await frames.query(Posting._getPosts, { user }, { post });

    // If no posts, return empty results
    if (frames.length === 0) {
      return new Frames({ ...originalFrame, [results]: [] });
    }

    // Get full post data for each post ID
    frames = await frames.query(Posting._getPostById, { _id: post }, {
      postData,
    });

    // Collect all postData into results array
    return frames.collectAs([post, postData], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const GetFriendPostsRequest: Sync = (
  {
    request,
    session,
    user,
    friendUsername,
    friendUserId,
    friendshipBoolean,
    post,
    postData,
    results,
  },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Posting/_getPosts", session, friendUsername: friendUsername! },
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

    frames = await frames.query(Posting._getPosts, { user: friendUserId }, {
      post,
    });

    if (frames.length === 0) {
      return new Frames({ ...originalFrame, [results]: [] });
    }

    frames = await frames.query(Posting._getPostById, { _id: post }, {
      postData,
    });

    return frames.collectAs([post, postData], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});
