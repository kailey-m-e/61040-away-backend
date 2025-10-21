# API Wishlist Concept

[@api-extraction-from-code.md](../../tools/api-extraction-from-code.md)

[@WishlistConcept.ts](../../../src/concepts/Wishlist/WishlistConcept.ts)

# prompt: Using the concept implementation of the Wishlist concept in WishlistConcept.ts, follow the prompt in api-extraction-from-code.

# response:

# API Specification: Wishlist Concept

**Purpose:** To keep track of a user's future dream destinations.

---

## API Endpoints

### POST /api/Wishlist/addPlace

**Description:** Adds a new place for a user.

**Requirements:**
- A place doesn't already exist in the set of places with the given user, city, region, and country.

**Effects:**
- Adds and returns a place with the given user, city, region, and country.

**Request Body:**
```json
{
  "user": "string",
  "city": "string",
  "region": "string",
  "country": "string"
}
```

**Success Response Body (Action):**
```json
{
  "place": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Wishlist/removePlace

**Description:** Removes a place from an existing wishlist.

**Requirements:**
- Place exists in set of places and user is its creator.

**Effects:**
- Removes the place from the set of places.

**Request Body:**
```json
{
  "user": "string",
  "place": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Wishlist/_getPlaces

**Description:** Retrieves a user's places.

**Requirements:**
- None.

**Effects:**
- Returns all places for a given user.

**Request Body:**
```json
{
  "user": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "user": "string",
    "city": "string",
    "region": "string",
    "country": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---
