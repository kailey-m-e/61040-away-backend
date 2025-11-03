/**
 * The Requesting concept exposes passthrough routes by default,
 * which allow POSTs to the route:
 *
 * /{REQUESTING_BASE_URL}/{Concept name}/{action or query}
 *
 * to passthrough directly to the concept action or query.
 * This is a convenient and natural way to expose concepts to
 * the world, but should only be done intentionally for public
 * actions and queries.
 *
 * This file allows you to explicitly set inclusions and exclusions
 * for passthrough routes:
 * - inclusions: those that you can justify their inclusion
 * - exclusions: those to exclude, using Requesting routes instead
 */

/**
 * INCLUSIONS
 *
 * Each inclusion must include a justification for why you think
 * the passthrough is appropriate (e.g. public query).
 *
 * inclusions = {"route": "justification"}
 */

export const inclusions: Record<string, string> = {
  // UserAuthentication - public authentication actions
  "/api/UserAuthentication/register": "public registration",
  "/api/UserAuthentication/hashPassword": "public registration",
  "/api/UserAuthentication/_getUserByUsername":
    "can publicly lookup users by username",
  "/api/Posting/_getPostById": "can publicly lookup posts by ID",
  "/api/Wishlist/_getPlaceById": "can publicly lookup places by ID",
  // "/api/UserAuthentication/authenticate": "public login",
  // "/api/UserAuthentication/logout": "public logout",
  // "/api/UserAuthentication/_getSessionUser": "check current session",
};

/**
 * EXCLUSIONS
 *
 * Excluded routes fall back to the Requesting concept, and will
 * instead trigger the normal Requesting.request action. As this
 * is the intended behavior, no justification is necessary.
 *
 * exclusions = ["route"]
 */

export const exclusions: Array<string> = [
  // user authentication
  "/api/UserAuthentication/authenticate",
  "/api/UserAuthentication/logout",
  "/api/UserAuthentication/_getSessionUser",

  // sessioning
  "/api/Sessioning/create",
  "/api/Sessioning/delete",
  "/api/Sessioning/_getUser",

  // posting
  "/api/Posting/create",
  "/api/Posting/editTitle",
  "/api/Posting/editPlace",
  "/api/Posting/editDates",
  "/api/Posting/editDescription",
  "/api/Posting/delete",
  "/api/Posting/_getPosts",

  // wishlist
  "/api/Wishlist/addPlace",
  "/api/Wishlist/removePlace",
  "/api/Wishlist/_getPlaces",

  // friending
  "/api/Friending/_runInTransaction",
  "/api/Friending/requestFriend",
  "/api/Friending/unrequestFriend",
  "/api/Friending/acceptFriend",
  "/api/Friending/rejectFriend",
  "/api/Friending/validateFriendship",
  "/api/Friending/endFriendship",
  "/api/Friending/_getIncomingRequests",
  "/api/Friending/_getOutgoingRequests",
  "/api/Friending/_getFriends",
];
