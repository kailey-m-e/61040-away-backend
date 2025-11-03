---
timestamp: 'Sat Nov 01 2025 22:35:38 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251101_223538.e2bb80f4.md]]'
content_id: 19aa7a29c55dd64350a5037c2f94285d5b0bf123b49982b0914ff5147634bb13
---

# response:

To implement the synchronizations for the `Posting` actions, we'll follow the structure and patterns established in `implementing-synchronizations.md` and `sample.sync.ts`. This involves defining a `Posting` interface, a cache `updater`, a base `get` sync, and then specific syncs for each create, edit, and delete action.

We'll assume the following:

* `@raycast/sync` provides `createSync`, `createOptimistic`, `createUpdater`, and `Sync`.
* `uuid` library (e.g., `uuidv4`) is available for generating unique IDs for optimistic updates.
* Server responses typically return the full `Posting` object for create/edit, and a success status with the `id` for delete.

```typescript
// sample.sync.ts (conceptual file for output)

import { createSync, createUpdater, Sync } from "@raycast/sync";
import { v4 as uuidv4 } from "uuid"; // Assuming uuid is installed for generating temporary IDs

// -----------------------------------------------------------------------------
// 1. Define the core data type for 'Posting'
// -----------------------------------------------------------------------------
interface Posting {
  id: string;
  title: string;
  place: string;
  dates: string; // Using string for simplicity, could be Date or a date range object
  description: string;
  _optimisticId?: string; // Optional: Used for internal tracking of optimistic items
}

// -----------------------------------------------------------------------------
// 2. Define the cache updater for 'Posting' resources
//    This allows us to interact with the local cache for 'Posting' objects.
//    'Postings' is the cache key/namespace.
// -----------------------------------------------------------------------------
const PostingUpdater = createUpdater<Posting>("Postings");

// -----------------------------------------------------------------------------
// 3. Define the read sync for 'Posting'
//    This sync retrieves a list of all posts and will be used as a target
//    for revalidation by all write operations to ensure data freshness.
// -----------------------------------------------------------------------------
export const PostingGetPostsSync = createSync<Posting[]>(
  "/api/Posting/_getPosts", // The API route for fetching all posts
  {
    response: {
      // Parser to transform the raw server response into an array of Posting objects
      parser: (data) => data as Posting[],
    },
    // Read syncs typically don't have optimistic updates or direct success/error handlers
    // as their primary role is data retrieval, with cache invalidation managing freshness.
  }
);

// Helper array to easily reference the 'get posts' sync for revalidation
const revalidateGetPostsSync = [PostingGetPostsSync];

// -----------------------------------------------------------------------------
// 4. Define Syncs for 'Posting' write actions
// -----------------------------------------------------------------------------

/**
 * Sync for creating a new Posting.
 *
 * This sync optimistically adds a new posting to the cache, replaces it with the
 * server's response on success, and removes the optimistic item on error.
 */
export const PostingCreateSync = createSync<
  Omit<Posting, "id">, // Request payload: new posting data without an ID
  Posting,             // Server response: the full created posting with its new ID
  Posting              // Optimistic data: full posting with a temporary optimistic ID
>(
  "/api/Posting/create", // The API route for creating a posting
  {
    response: {
      // Parse the server response into a full Posting object
      parser: (data) => data as Posting,
    },
    optimistic: {
      // When an item is created optimistically, assign a temporary ID and an _optimisticId
      parser: (input) => ({ ...input, id: uuidv4(), _optimisticId: uuidv4() }),
      // Handler to add the optimistic posting to the local cache immediately
      handler: (optimisticPost) => {
        PostingUpdater.create(optimisticPost.id, optimisticPost);
      },
    },
    onSuccess: {
      // On successful creation, replace the optimistic item (identified by its temp ID)
      // with the actual server-created item (identified by its real ID).
      handler: (input, responseData, optimisticPost) => {
        if (optimisticPost?.id) {
          // Replace the temporary ID with the real ID from the server and update the item
          PostingUpdater.replaceId(optimisticPost.id, responseData.id, responseData);
        } else {
          // Fallback: if no optimisticPost (e.g., sync was configured without optimistic phase), create directly
          PostingUpdater.create(responseData.id, responseData);
        }
      },
    },
    onError: {
      // On error, remove the optimistically added item from the cache
      handler: (input, error, optimisticPost) => {
        if (optimisticPost?.id) {
          PostingUpdater.delete(optimisticPost.id);
        }
      },
    },
    // Always revalidate the list of posts to ensure data consistency with the server
    revalidate: revalidateGetPostsSync,
  }
);

/**
 * Generic helper function to create Syncs for editing a specific field of a Posting.
 *
 * This function generates syncs that optimistically update the specified field,
 * replace it with the server's full response on success, and revalidate on error
 * to ensure data consistency.
 */
type EditInput<K extends keyof Posting> = { id: string } & Pick<Posting, K>;

function createPostingEditSync<K extends keyof Posting>(
  routePath: string,
  field: K
): Sync<EditInput<K>, Posting, EditInput<K>> {
  return createSync<EditInput<K>, Posting, EditInput<K>>(
    routePath,
    {
      response: {
        // Server is expected to return the full updated Posting object
        parser: (data) => data as Posting,
      },
      optimistic: {
        // The optimistic update payload includes the ID of the item to update
        // and the new value for the specific field.
        parser: (input) => ({ id: input.id, [field]: input[field] } as EditInput<K>),
        handler: (optimisticUpdate) => {
          // Apply the partial update to the existing posting in the local cache
          PostingUpdater.update(optimisticUpdate.id, { [field]: optimisticUpdate[field] } as Partial<Posting>);
        },
      },
      onSuccess: {
        handler: (input, responseData) => {
          // Replace the optimistically updated item with the full, confirmed data from the server
          PostingUpdater.update(responseData.id, responseData);
        },
      },
      onError: {
        // On error, we primarily trigger a revalidation of the list.
        // This ensures a fresh fetch from the server, overriding any incorrect
        // optimistic state without needing to meticulously revert each specific field.
        handler: (input, error, optimisticUpdate) => {
          // No explicit local revert needed; revalidation handles fetching fresh data.
        },
      },
      // Revalidate the list of posts to ensure eventual consistency with the server
      revalidate: revalidateGetPostsSync,
    }
  );
}

// Syncs for editing specific fields of a Posting
export const PostingEditTitleSync = createPostingEditSync("/api/Posting/editTitle", "title");
export const PostingEditPlaceSync = createPostingEditSync("/api/Posting/editPlace", "place");
export const PostingEditDatesSync = createPostingEditSync("/api/Posting/editDates", "dates");
export const PostingEditDescriptionSync = createPostingEditSync("/api/Posting/editDescription", "description");

/**
 * Sync for deleting an existing Posting.
 *
 * This sync optimistically removes the posting from the cache, confirms deletion
 * on success, and re-adds it to the cache on error.
 */
export const PostingDeleteSync = createSync<
  Posting,       // Request payload: the full Posting object to be deleted (useful for re-adding on error)
  { id: string },  // Server response: typically just the ID of the deleted item
  Posting        // Optimistic data: the full Posting object that was optimistically removed
>(
  "/api/Posting/delete", // The API route for deleting a posting
  {
    response: {
      // Parse the server response to extract the ID of the deleted item
      parser: (data) => data as { id: string },
    },
    optimistic: {
      // The input itself is the full Posting object, which is stored as optimistic data.
      // This allows easy re-addition of the item to the cache if the deletion fails.
      parser: (input) => input,
      // Handler to remove the posting from the local cache optimistically
      handler: (optimisticPost) => {
        PostingUpdater.delete(optimisticPost.id);
      },
    },
    onSuccess: {
      // On successful deletion, ensure the item is removed from the cache using the confirmed ID.
      handler: (input, responseData, optimisticPost) => {
        PostingUpdater.delete(responseData.id);
      },
    },
    onError: {
      // On error, re-add the optimistically removed item back to the cache
      handler: (input, error, optimisticPost) => {
        if (optimisticPost) {
          PostingUpdater.create(optimisticPost.id, optimisticPost);
        }
      },
    },
    // Always revalidate the list of posts to ensure data consistency with the server
    revalidate: revalidateGetPostsSync,
  }
);
```
