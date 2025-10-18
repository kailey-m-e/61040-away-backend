---
timestamp: 'Thu Oct 16 2025 23:39:35 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251016_233935.936adb3d.md]]'
content_id: 22576eeccdec64c241e5d44f33e24721447bae9f11db1551163b52f23c0e0751
---

# file: src/concepts/Posting/PostingConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Posting" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type Post = ID;

/**
 * State: A set of Posts with a creator; title; city, region, and country; start and end date; and description.
 */
export interface PostDoc {
  _id: Post;
  creator: User;
  title: string;
  city: string;
  region: string;
  country: string;
  start: Date;
  end: Date;
  description: string;
}

/**
 * @concept Posting
 * @purpose To make a record of a user's trip.
 */
export default class PostingConcept {
  posts: Collection<PostDoc>;

  constructor(private readonly db: Db) {
    this.posts = this.db.collection(PREFIX + "posts");
  }

  /**
   * Action: Creates a new post.
   * @requires end date is in the past and not before start date
   * @effects creates and returns a post associated with the given user,
   * title, city, region, country, start date, end date, and description
   */
  async create(
    {
      creator,
      title,
      city,
      region,
      country,
      start,
      end,
      description,
    }: {
      creator: User;
      title: string;
      city: string;
      region: string;
      country: string;
      start: Date;
      end: Date;
      description: string;
    },
  ): Promise<{ post: Post } | { error: string }> {
    // check date logic
    if (
      end < start || end > new Date()
    ) {
      return {
        error:
          `Impossible dates detected: cannot have start date ${start} and end date ${end}.`,
      };
    }

    // create new post
    const newPostId = freshID() as Post;
    await this.posts.insertOne({
      _id: newPostId,
      creator,
      title,
      city,
      region,
      country,
      start,
      end,
      description,
    });

    return { post: newPostId };
  }

  /**
   * Action: Edits a post's title.
   * @requires post exists and user is its creator
   * @effects updates post's title and returns post
   */
  async editTitle(
    { user, post, title }: { user: User; post: Post; title: string },
  ): Promise<{ post: Post } | { error: string }> {
    // check post exists
    const currPost = await this.posts.findOne({ _id: post });
    if (!currPost) {
      return { error: `Post with ID ${post} not found.` };
    }

    // check user is creator
    if (currPost!.creator !== user) {
      return { error: "Cannot edit another user's post." };
    }

    // update post
    await this.posts.updateOne({ _id: post }, { $set: { title: title } });

    return { post: post };
  }

  /**
   * Action: Edits a post's place.
   * @requires post exists and user is its creator
   * @effects updates post's city, region, and country, and returns post
   */
  async editPlace(
    { user, post, city, country, region }: {
      user: User;
      post: Post;
      city: string;
      region: string;
      country: string;
    },
  ): Promise<{ post: Post } | { error: string }> {
    // check post exists
    const currPost = await this.posts.findOne({ _id: post });
    if (!currPost) {
      return { error: `Post with ID ${post} not found.` };
    }

    // check user is creator
    if (currPost!.creator !== user) {
      return { error: "Cannot edit another user's post." };
    }

    // update post
    await this.posts.updateOne({ _id: post }, {
      $set: { city: city, country: country, region: region },
    });

    return { post: post };
  }

  /**
   * Action: Edits a post's start and end dates.
   * @requires post exists and user is its creator; end date is in the past and not before start date
   * @effects updates post's start and end dates and returns post
   */
  async editDates(
    { user, post, start, end }: {
      user: User;
      post: Post;
      start: Date;
      end: Date;
    },
  ): Promise<{ post: Post } | { error: string }> {
    // check post exists
    const currPost = await this.posts.findOne({ _id: post });
    if (!currPost) {
      return { error: `Post with ID ${post} not found.` };
    }

    // check user is creator
    if (currPost!.creator !== user) {
      return { error: "Cannot edit another user's post." };
    }

    // check date logic
    if (end < start || end > new Date()) {
      return {
        error:
          `Impossible dates detected: cannot have start date ${start} and end date ${end}.`,
      };
    }

    // updates post
    await this.posts.updateOne({ _id: post }, {
      $set: { start: start, end: end },
    });

    return { post: post };
  }

  /**
   * Action: Edits a post's description.
   * @requires post exists and user is its creator
   * @effects updates post's description and returns post
   */
  async editDescription(
    { user, post, description }: {
      user: User;
      post: Post;
      description: string;
    },
  ): Promise<{ post: Post } | { error: string }> {
    // check post exists
    const currPost = await this.posts.findOne({ _id: post });
    if (!currPost) {
      return { error: `Post with ID ${post} not found.` };
    }

    // check user is creator
    if (currPost!.creator !== user) {
      return { error: "Cannot edit another user's post." };
    }

    // update post
    await this.posts.updateOne({ _id: post }, {
      $set: { description: description },
    });

    return { post: post };
  }

  /**
   * Action: Removes a user's post.
   * @requires
   * @effects
   */
  async delete(
    { user, post }: { user: User; post: Post },
  ): Promise<Empty | { error: string }> {
    // check post exists
    const currPost = await this.posts.findOne({ _id: post });
    if (!currPost) {
      return { error: `Post with ID ${post} not found.` };
    }

    // check user is creator
    if (currPost!.creator !== user) {
      return { error: "Cannot edit another user's post." };
    }

    // delete post
    await this.posts.deleteOne({ _id: post });
    return {};
  }

  /**
   * Query: Retrieves all posts for a given creator in order of start date.
   * @effects returns all posts with user as creator in order of start date,
   * with the most recent post first
   */
  async _getPosts(
    { user }: { user: User },
  ): Promise<PostDoc[]> {
    return await this.posts.find({ creator: user }).sort({ start: -1 })
      .toArray();
  }
}

```
