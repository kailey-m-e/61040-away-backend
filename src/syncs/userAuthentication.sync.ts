import { actions, Sync } from "@engine";
import { Requesting, Sessioning, UserAuthentication } from "@concepts";

//-- User Registration --//
export const RegisterRequest: Sync = ({ request, username, password }) => ({
  when: actions([Requesting.request, {
    path: "/UserAuthentication/register",
    username,
    password,
  }, { request }]),
  then: actions([UserAuthentication.register, { username, password }]),
});

export const RegisterResponseSuccess: Sync = ({ request, user }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/register" }, {
      request,
    }],
    [UserAuthentication.register, {}, { user }],
  ),
  then: actions([Requesting.respond, { request, user }]),
});

export const RegisterResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/register" }, {
      request,
    }],
    [UserAuthentication.register, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

//-- User Login & Session Creation --//
export const LoginRequest: Sync = ({ request, username, password }) => ({
  when: actions([Requesting.request, {
    path: "/UserAuthentication/authenticate",
    username,
    password,
  }, {
    request,
  }]),
  then: actions([UserAuthentication.authenticate, { username, password }]),
});

export const LoginSuccessCreatesSession: Sync = ({ username, user }) => ({
  when: actions([UserAuthentication.authenticate, { username }, {}]),
  where: async (frames) => {
    return await frames.query(UserAuthentication._getUserByUsername, {
      username,
    }, { user });
  },
  then: actions([Sessioning.create, { user }]),
});

export const LoginResponseSuccess: Sync = (
  { request, user, session },
) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/authenticate" }, {
      request,
    }],
    [UserAuthentication.authenticate, {}, {}],
    [Sessioning.create, { user }, { session }],
  ),
  then: actions([Requesting.respond, { request, session, user }]),
});

export const LoginResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/authenticate" }, {
      request,
    }],
    [UserAuthentication.authenticate, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

//-- User Logout --//
export const LogoutRequest: Sync = ({ request, session, user }) => ({
  when: actions([Requesting.request, { path: "/logout", session }, {
    request,
  }]),
  where: (frames) => frames.query(Sessioning._getUser, { session }, { user }),
  then: actions([Sessioning.delete, { session }]),
});

export const LogoutResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/logout" }, { request }],
    [Sessioning.delete, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "logged_out" }]),
});
