---
timestamp: 'Sat Nov 01 2025 22:42:01 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251101_224201.7021ab10.md]]'
content_id: 1ae4419f0c4814f70e622296ab2a2000061890ad020210cde3a70c7c238b32cf
---

# response:

```typescript
// sample.sync.ts (conceptual file for output, to be placed in a syncs directory)

import { createSync, createUpdater, Sync } from "@raycast/sync";
import { v4 as uuidv4 } from "uuid"; // Assuming uuid is installed for generating temporary IDs

// -----------------------------------------------------------------------------
// 1. Import the core data type for 'Posting' from its concept definition
// -----------------------------------------------------------------------------
import { Posting } from "../concepts/posting/postingConcept";

// -----------------------------------------------------------------------------
// 2. Define the cache updater for 'Posting' resources
//    This allows us to interact with the local cache for 'Posting' objects.
//    'Postings' is the cache key/namespace for this resource type.
// -----------------------------------------------------------------------------
const PostingUpdater = createUpdater<Posting>("Postings");

// -----------------------------------------------------------------------------
// 3. Define the read sync for 'GetPosts'
//    This sync retrieves a list of all posts and will be used as a target
//    for revalidation by all write operations to ensure data freshness.
// -----------------------------------------------------------------------------
export const GetPostsSync = createSync<Posting[]>(
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
const revalidateGetPostsSync = [GetPostsSync];

// -----------------------------------------------------------------------------
// 4. Define Syncs for 'Posting' write actions (individually)
// -----------------------------------------------------------------------------

/**
 * Sync for creating a new Posting.
 *
 * This sync optimistically adds a new posting to the cache, replaces it with the
 * server's response on success, and removes the optimistic item on error.
 */
export const CreatePostSync = createSync<
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
 * Sync for editing the title of an existing Posting.
 *
 * This sync optimistically updates the title in the cache, replaces it with the
 * server's full response on success, and revalidates on error.
 */
export const EditPostTitleSync = createSync<
  { id: string; title: string }, // Request payload: Posting ID and new title
  Posting,                       // Server response: the full updated Posting object
  { id: string; title: string }  // Optimistic data: Posting ID and new title
>(
  "/api/Posting/editTitle", // The API route for editing a posting's title
  {
    response: {
      // Server is expected to return the full updated Posting object
      parser: (data) => data as Posting,
    },
    optimistic: {
      // The optimistic update payload includes the ID of the item to update
      // and the new value for the 'title' field.
      parser: (input) => ({ id: input.id, title: input.title }),
      handler: (optimisticUpdate) => {
        // Apply the partial update to the existing posting's title in the local cache
        PostingUpdater.update(optimisticUpdate.id, { title: optimisticUpdate.title });
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

/**
 * Sync for editing the place of an existing Posting.
 *
 * This sync optimistically updates the place in the cache, replaces it with the
 * server's full response on success, and revalidates on error.
 */
export const EditPostPlaceSync = createSync<
  { id: string; place: string }, // Request payload: Posting ID and new place
  Posting,                       // Server response: the full updated Posting object
  { id: string; place: string }  // Optimistic data: Posting ID and new place
>(
  "/api/Posting/editPlace", // The API route for editing a posting's place
  {
    response: {
      parser: (data) => data as Posting,
    },
    optimistic: {
      parser: (input) => ({ id: input.id, place: input.place }),
      handler: (optimisticUpdate) => {
        PostingUpdater.update(optimisticUpdate.id, { place: optimisticUpdate.place });
      },
    },
    onSuccess: {
      handler: (input, responseData) => {
        PostingUpdater.update(responseData.id, responseData);
      },
    },
    onError: {
      handler: (input, error, optimisticUpdate) => {
        // Revalidation will handle fetching fresh data.
      },
    },
    revalidate: revalidateGetPostsSync,
  }
);

/**
 * Sync for editing the dates of an existing Posting.
 *
 * This sync optimistically updates the dates in the cache, replaces it with the
 * server's full response on success, and revalidates on error.
 */
export const EditPostDatesSync = createSync<
  { id: string; dates: string }, // Request payload: Posting ID and new dates
  Posting,                       // Server response: the full updated Posting object
  { id: string; dates: string }  // Optimistic data: Posting ID and new dates
>(
  "/api/Posting/editDates", // The API route for editing a posting's dates
  {
    response: {
      parser: (data) => data as Posting,
    },
    optimistic: {
      parser: (input) => ({ id: input.id, dates: input.dates }),
      handler: (optimisticUpdate) => {
        PostingUpdater.update(optimisticUpdate.id, { dates: optimisticUpdate.dates });
      },
    },
    onSuccess: {
      handler: (input, responseData) => {
        PostingUpdater.update(responseData.id, responseData);
      },
    },
    onError: {
      handler: (input, error, optimisticUpdate) => {
        // Revalidation will handle fetching fresh data.
      },
    },
    revalidate: revalidateGetPostsSync,
  }
);

/**
 * Sync for editing the description of an existing Posting.
 *
 * This sync optimistically updates the description in the cache, replaces it with the
 * server's full response on success, and revalidates on error.
 */
export const EditPostDescriptionSync = createSync<
  { id: string; description: string }, // Request payload: Posting ID and new description
  Posting,                             // Server response: the full updated Posting object
  { id: string; description: string }  // Optimistic data: Posting ID and new description
>(
  "/api/Posting/editDescription", // The API route for editing a posting's description
  {
    response: {
      parser: (data) => data as Posting,
    },
    optimistic: {
      parser: (input) => ({ id: input.id, description: input.description }),
      handler: (optimisticUpdate) => {
        PostingUpdater.update(optimisticUpdate.id, { description: optimisticUpdate.description });
      },
    },
    onSuccess: {
      handler: (input, responseData) => {
        PostingUpdater.update(responseData.id, responseData);
      },
    },
    onError: {
      handler: (input, error, optimisticUpdate) => {
        // Revalidation will handle fetching fresh data.
      },
    },
    revalidate: revalidateGetPostsSync,
  }
);

/**
 * Sync for deleting an existing Posting.
 *
 * This sync optimistically removes the posting from the cache, confirms deletion
 * on success, and re-adds it to the cache on error.
 */
export const DeletePostSync = createSync<
  { id: string },  // Request payload: the ID of the Posting to be deleted
  { id: string },  // Server response: typically just the ID of the deleted item
  Posting        // Optimistic data: the full Posting object that was optimistically removed (for re-adding on error)
>(
  "/api/Posting/delete", // The API route for deleting a posting
  {
    response: {
      // Parse the server response to extract the ID of the deleted item
      parser: (data) => data as { id: string },
    },
    optimistic: {
      // For deletion, we need the full item to potentially re-add it on error.
      // So, we'd typically fetch the item from the cache using its ID before calling the sync.
      // Assuming 'input' here already includes enough info or a full Posting object
      // which allows the optimistic handler to remove it and onError to re-add.
      // If only ID is passed as input, you might fetch the full object in your UI layer
      // before calling `sync.run()` and pass it as the optimistic data argument.
      // For simplicity here, we assume the input has the ID and we fetch the object
      // or that the input *is* the Posting object needed for optimistic.
      parser: (input) => PostingUpdater.get(input.id)!, // Retrieve the full object from cache for optimistic rollback
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
