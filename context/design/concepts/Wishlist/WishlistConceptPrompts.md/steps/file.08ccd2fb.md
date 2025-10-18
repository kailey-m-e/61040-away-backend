---
timestamp: 'Thu Oct 16 2025 21:48:55 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251016_214855.d4bde4c6.md]]'
content_id: 08ccd2fb3d1bb7c4eddd1919b1fb25c433514316b0647f0f51553f6654ec7673
---

# file: src/concepts/Wishlist/WishlistConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Wishlist" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type Place = ID;

/**
 * State: A set of Places with a user, city, region, and country.
 */
export interface PlaceDoc {
  _id: Place;
  user: User;
  city: string;
  region: string;
  country: string;
}

/**
 * @concept Wishlist
 * @purpose To keep track of a user's future dream destinations.
 */
export default class WishlistConcept {
  places: Collection<PlaceDoc>;

  constructor(private readonly db: Db) {
    this.places = this.db.collection(PREFIX + "places");
  }

  /**
   * Action: Adds a new place for a user.
   * @requires a place doesn't already exist in the set of places
   * with the given user, city, region, and country
   * @effects adds and returns a place with the given user, city, region, and country
   */
  async addPlace(
    { user, city, region, country }: {
      user: User;
      city: string;
      region: string;
      country: string;
    },
  ): Promise<{ place: Place } | { error: string }> {
    // checks place doesn't already exist for user
    const existingPlace = await this.places.findOne({
      user,
      city,
      region,
      country,
    });

    if (existingPlace) {
      return {
        error:
          `Place "${city}, ${region}, ${country}" already exists for user with ID ${user}.`,
      };
    }

    // adds place
    const newPlaceId = freshID() as Place;

    await this.places.insertOne({
      _id: newPlaceId,
      user,
      city,
      region,
      country,
    });

    return { place: newPlaceId };
  }

  /**
   * Action: Removes a place from an existing wishlist.
   * @requires place exists in set of places and user is its creator
   * @effects removes the place from the set of places
   */
  async removePlace(
    { user, place }: {
      user: User;
      place: Place;
    },
  ): Promise<Empty | { error: string }> {
    // checks place already exists for user
    const currPlace = await this.places.findOne({ _id: place });
    if (!currPlace) {
      return { error: `Place not in wishlist for user with ID ${user}.` };
    }

    if (currPlace.user !== user) {
      return { error: "Cannot remove place from another user's wishlist." };
    }

    // remove place
    await this.places.deleteOne({ _id: place });
    return {};
  }

  /**
   * Query: Retrieves all places for a given user.
   * @requires
   * @effects
   */
  async _getPlaces(
    { user }: { user: User },
  ): Promise<PlaceDoc[]> {
    return await this.places.find({ user: user }).toArray();
  }
}

```

\#prompt: Using the implementing-concepts.md and concept-specifications.md as a guide, please do the following tasks:

1. Fill in the requires and effects clauses in WishlistConcept.ts using the matching clauses listed in the actions and queries section in WishlistConceptSpec.md.

2. Evaluate the wishlist concept implementation in WishlistConcept.ts, the wishlist spec in WishlistConceptSpec.md, and how well the implementation matches the spec. Provide a list of feedback/action items but do not take any actions.
