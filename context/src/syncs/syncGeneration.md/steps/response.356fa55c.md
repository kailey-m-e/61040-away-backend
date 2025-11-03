---
timestamp: 'Sun Nov 02 2025 12:13:47 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251102_121347.cf826a55.md]]'
content_id: 356fa55ce1115eae08b59a0bdb321709126b5bc0950c3487a180c486d0918e56
---

# response:

To implement the `EditPostTitle` syncs as three separate synchronizations, we will strictly follow the exact format provided by your `CreatePostRequest`, `CreatePostResponse`, and `CreatePostResponseError` examples. This declarative structure implies a granular, event-driven orchestration where different syncs react to specific stages (request initiation, successful response, error response) of the overall operation.

This approach requires specific interpretations for the action creators used in the `when` and `then` clauses:

1. **`Requesting.request`**: When used in a `when` clause, it implies the sync is listening for the *completion* of an API request identified by the `request` token. When used in a `then` clause (as in the provided `CreatePostRequest` example), it acts as an action to *initiate* the API call. The data for the request (like `id` and `title`) is merged directly into the options object, as shown in the example.
2. **`PostingActions.updateInitiated`**: This is an action that signifies an optimistic update has been applied. It's used in the `then` block of the `Request` sync.
3. **`PostingActions.updateSucceeded` / `PostingActions.updateFailed`**: These are conceptual actions that are expected to be dispatched internally by the framework (or a preceding `then` block) to signal the *outcome* of an update operation. The `Response` and `ResponseError` syncs listen for these in their `when` clauses, along with the `Requesting.request` completion.
4. **`RequestingActions.respond` / `RequestingActions.error`**: These are the ultimate handlers in the `then` block for processing the server's data or error and reconciling the cache.

```typescript
// posting.sync.ts

import { createUpdater, Sync, actions } from "@raycast/sync";
import { v4 as uuidv4 } from "uuid";

import { Posting } from "../concepts/posting/PostingConcept";
import { Requesting, RequestingActions, RequestType } from "../concepts/requesting/RequestingConcept";

const PostingUpdater = createUpdater<Posting>("Postings");

// Action creators for 'Posting' optimistic updates, mirroring the example's `Posting.create` usage
const PostingActions = {
  // This action signifies the initiation of an optimistic update.
  // It's structured to match the example format `[Action, { data }, {}]` for `then` blocks.
  updateInitiated: (input: { id: string; title: string }) => ({
    type: "POSTING_UPDATE_INITIATED",
    payload: input,
  }),
  // These actions represent the outcome of a posting update, used in `when` clauses.
  // They mimic the `[Posting.create, {}, { post }]` or `[Posting.create, {}, { error }]` format.
  // The framework is assumed to internally dispatch these based on the HTTP request outcome.
  updateSucceeded: (post: Posting) => ({
    type: "POSTING_UPDATE_SUCCEEDED",
    payload: { post },
  }),
  updateFailed: (error: any) => ({
    type: "POSTING_UPDATE_FAILED",
    payload: { error },
  }),
};

// -----------------------------------------------------------------------------
// Syncs for editing the title of an existing Posting (three separate syncs)
// -----------------------------------------------------------------------------

export const EditPostTitleRequest: Sync<{ id: string; title: string; request: RequestType }> = ({ id, title, request }) => ({
  when: actions(
    // As per the example, path and body fields are merged into the second parameter.
    // The 'request' token (the RequestType object returned by Requesting.request) is passed in the third parameter.
    [Requesting.request, { path: "/api/Posting/editTitle", id, title }, { request }],
  ),
  then: actions(
    // The optimistic update action, structured to match the example's `then` format.
    [PostingActions.updateInitiated, { id, title }, {}],
  ),
});

export const EditPostTitleResponse: Sync<{ request: RequestType; post: Posting }> = ({ request, post }) => ({
  when: actions(
    // Listen for the Requesting.request action for this path, linked by the 'request' token.
    // The framework will filter this to specifically match successful completions.
    [Requesting.request, { path: "/api/Posting/editTitle" }, { request }],
    // Listen for the corresponding successful optimistic update action, indicating success.
    [PostingActions.updateSucceeded, {}, { post }],
  ),
  then: actions(
    // Handle the successful response: RequestingActions.respond will reconcile the cache
    // using the actual server 'post' data and trigger revalidations.
    [RequestingActions.respond, { request, resource: post }],
  ),
});

export const EditPostTitleResponseError: Sync<{ request: RequestType; error: any }> = ({ request, error }) => ({
  when: actions(
    // Listen for the Requesting.request action for this path, linked by the 'request' token.
    // The framework will filter this to specifically match error completions.
    [Requesting.request, { path: "/api/Posting/editTitle" }, { request }],
    // Listen for the corresponding failed optimistic update action, indicating error.
    [PostingActions.updateFailed, {}, { error }],
  ),
  then: actions(
    // Handle the error response: RequestingActions.error will manage rollback
    // of optimistic changes and global error handling.
    [RequestingActions.error, { request, error }],
  ),
});
```
