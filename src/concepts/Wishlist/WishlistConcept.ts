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
 * State: A set of Places with a creator, city, region, and country.
 */
export interface PlaceDoc {
  _id: Place;
  creator: User;
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
  // wishlists: Collection<WishlistDoc>;

  constructor(private readonly db: Db) {
    this.places = this.db.collection(PREFIX + "places");
    // this.wishlists = this.db.collection(PREFIX + "wishlist");
  }

  /**
   * Action: Adds a new place for a user.
   * @requires
   * @effects
   */
  async addPlace(
    { user, city, region, country }: {
      user: User;
      city: string;
      region: string;
      country: string;
    },
  ): Promise<{ place: Place } | { error: string }> {
    // checks
    const existingPlace = await this.places.findOne({
      creator: user,
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

    const newPlaceId = freshID() as Place;

    await this.places.insertOne({
      _id: newPlaceId,
      creator: user,
      city,
      region,
      country,
    });

    return { place: newPlaceId };
  }

  /**
   * Action: Removes a place from an existing wishlist.
   * @requires
   * @effects
   */
  async removePlace(
    { user, place }: {
      user: User;
      place: Place;
    },
  ): Promise<Empty | { error: string }> {
    // checks
    const currPlace = await this.places.findOne({ _id: place });
    if (!currPlace) {
      return { error: `Place not in wishlist for user with ID ${user}.` };
    }

    if (currPlace.creator !== user) {
      return { error: "Cannot remove place from another user's wishlist." };
    }

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
    return await this.places.find({ creator: user }).toArray();
  }
}
