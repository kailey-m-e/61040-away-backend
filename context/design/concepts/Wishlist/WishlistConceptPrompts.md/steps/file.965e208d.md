---
timestamp: 'Thu Oct 16 2025 22:35:48 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251016_223548.191439ec.md]]'
content_id: 965e208d99a32ca3d68619a6e06b4b83e6d8ea5ef4e646c6e2103488d252f3dd
---

# file: src/concepts/Wishlist/WishlistConcept.test.ts

```typescript
import {
  assert,
  assertEquals,
  assertExists,
  assertNotEquals,
} from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { Empty, ID } from "@utils/types.ts";
import WishlistConcept from "./WishlistConcept.ts";
import { freshID } from "@utils/database.ts";

const creatorA = "creator:Alice" as ID;
const creatorB = "creator:Bob" as ID;
const nonPlace = "place:nonPlace" as ID;

/**
 * Test Case 1
 * Demonstrates operational principle: user adds and removes places.
 */
Deno.test("Test Case 1 - operational principle", async () => {
  const [db, client] = await testDb();
  const wishlistConcept = new WishlistConcept(db);

  try {
    // 1. user adds places
    const makeAthens = await wishlistConcept.addPlace({
      user: creatorA,
      city: "Athens",
      region: "Attica",
      country: "Greece",
    });
    assertNotEquals(
      "error" in makeAthens,
      true,
      "Place addition should not fail.",
    );
    const { place: athens } = makeAthens as { place: ID };
    assertExists(athens);

    const makeTokyo = await wishlistConcept.addPlace({
      user: creatorA,
      city: "Tokyo",
      region: "Kanto",
      country: "Japan",
    });
    assertNotEquals(
      "error" in makeTokyo,
      true,
      "Place addition should not fail.",
    );
    const { place: tokyo } = makeTokyo as { place: ID };
    assertExists(tokyo);

    const makeNyc = await wishlistConcept.addPlace({
      user: creatorA,
      city: "New York City",
      region: "New York",
      country: "United States",
    });
    assertNotEquals(
      "error" in makeNyc,
      true,
      "Place addition should not fail.",
    );

    const { place: nyc } = makeNyc as { place: ID };
    assertExists(nyc);

    const places = await wishlistConcept._getPlaces({ user: creatorA });
    assertEquals(places.length, 3, "Wishlist should have 3 places.");

    // 2. user removes places
    const removeAthens = await wishlistConcept.removePlace({
      user: creatorA,
      place: athens,
    });
    assertNotEquals(
      "error" in removeAthens,
      true,
      "Place deletion should not fail.",
    );
    const removeNyc = wishlistConcept.removePlace({
      user: creatorA,
      place: nyc,
    });
    assertNotEquals(
      "error" in removeNyc,
      true,
      "Place deletion should not fail.",
    );

    const newPlaces = await wishlistConcept._getPlaces({ user: creatorA });
    assertEquals(newPlaces.length, 1, "Wishlist should have 1 place.");
  } finally {
    await client.close();
  }
});

/**
 * Test Case 2
 * Demonstrates user tries to remove place that was never added;
 * user tries to remove another user's place.
 */
Deno.test("Test Case 2 - user removes unadded place, another user's place", async () => {
  const [db, client] = await testDb();
  const wishlistConcept = new WishlistConcept(db);

  try {
    // 1. user A tries to remove place that was never added
    const removePlace1 = await wishlistConcept.removePlace({
      user: creatorA,
      place: nonPlace,
    });
    assertEquals(
      "error" in removePlace1,
      true,
      "Removing nonexistant place should fail.",
    );

    // 2. user A adds place
    const makeTokyo = await wishlistConcept.addPlace({
      user: creatorA,
      city: "Tokyo",
      region: "Kanto",
      country: "Japan",
    });

    const { place: tokyo } = makeTokyo as { place: ID };

    // 3. user B tries to remove place
    const removePlace2 = await wishlistConcept.removePlace({
      user: creatorB,
      place: tokyo,
    });
    assertEquals(
      "error" in removePlace2,
      true,
      "Removing another user's place should fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 3
 * Demonstrates user adds duplicate place, another user adds same place.
 */
Deno.test("Test Case 2 - duplicate places for same and different user", async () => {
  const [db, client] = await testDb();
  const wishlistConcept = new WishlistConcept(db);

  try {
    // 1. user A adds place
    await wishlistConcept.addPlace({
      user: creatorA,
      city: "Tokyo",
      region: "Kanto",
      country: "Japan",
    });

    // 2. user A adds same place
    const makeTokyo2 = await wishlistConcept.addPlace({
      user: creatorA,
      city: "Tokyo",
      region: "Kanto",
      country: "Japan",
    });

    assertEquals(
      "error" in makeTokyo2,
      true,
      "Adding duplicate place for same user should fail.",
    );

    // 3. user B adds same place
    const makeTokyo3 = await wishlistConcept.addPlace({
      user: creatorB,
      city: "Tokyo",
      region: "Kanto",
      country: "Japan",
    });

    assertNotEquals(
      "error" in makeTokyo3,
      true,
      "Adding duplicate place for different user shouldn't fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 4
 * Demonstrates multiple users add and remove places.
 */
Deno.test("Test Case 4 - multiple users", async () => {
  const [db, client] = await testDb();
  const wishlistConcept = new WishlistConcept(db);

  try {
    const places0 = await wishlistConcept._getPlaces({ user: creatorA });
    assertEquals(places0, [], "User A's wishlist should have 0 places.");

    // 1. user A adds place
    await wishlistConcept.addPlace({
      user: creatorA,
      city: "Tokyo",
      region: "Kanto",
      country: "Japan",
    });

    // 2. user B adds place
    const makeChicago = await wishlistConcept.addPlace({
      user: creatorB,
      city: "Chicago",
      region: "Illinois",
      country: "United States",
    });

    const { place: chicago } = makeChicago as { place: ID };

    // 3. user A adds place
    const makeMiami = await wishlistConcept.addPlace({
      user: creatorA,
      city: "Miami",
      region: "Florida",
      country: "United States",
    });

    const { place: miami } = makeMiami as { place: ID };

    let placesA = await wishlistConcept._getPlaces({ user: creatorA });
    assertEquals(placesA.length, 2, "User A's wishlist should have 2 places.");

    // 4. user A removes place
    await wishlistConcept.removePlace({
      user: creatorA,
      place: miami,
    });

    placesA = await wishlistConcept._getPlaces({ user: creatorA });
    assertEquals(placesA.length, 1, "User A's wishlist should have 1 place.");

    // 5. user A adds place
    const makeGreensboro = await wishlistConcept.addPlace({
      user: creatorA,
      city: "Greensboro",
      region: "North Carolina",
      country: "United States",
    });

    const { place: greensboro } = makeGreensboro as { place: ID };

    placesA = await wishlistConcept._getPlaces({ user: creatorA });
    assertEquals(placesA.length, 2, "User A's wishlist should have 2 places.");

    // 6. user B removes place
    await wishlistConcept.removePlace({
      user: creatorB,
      place: chicago,
    });

    placesA = await wishlistConcept._getPlaces({ user: creatorB });
    assertEquals(placesA.length, 0, "User B's wishlist should have 0 places.");
  } finally {
    await client.close();
  }
});

```

\#prompt: Evaluate the effectiveness of the tests in WishlistConcept.test.ts based on the provided testing-concepts.md info and provide a list of concise feedback.
