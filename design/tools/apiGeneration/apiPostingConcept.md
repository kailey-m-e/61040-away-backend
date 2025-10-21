# API Posting Concept

[@api-extraction-from-code.md](../../tools/api-extraction-from-code.md)

[@PostingConcept.ts](../../../src/concepts/Posting/PostingConcept.ts)

# prompt: Using the concept implementation of the Posting concept in PostingConcept.ts, follow the prompt in api-extraction-from-code.

# response:

# response:

# API Specification: Posting Concept

**Purpose:** To make a record of a user's trip.

---

## API Endpoints

### POST /api/Posting/create

**Description:** Creates a new post.

**Requirements:**
- end date is in the past and not before start date

**Effects:**
- creates and returns a post associated with the given user, title, city, region, country, start date, end date, and description

**Request Body:**
```json
{
  "creator": "ID",
  "title": "string",
  "city": "string",
  "region": "string",
  "country": "string",
  "start": "Date (ISO 8601 string)",
  "end": "Date (ISO 8601 string)",
  "description": "string"
}
```

**Success Response Body (Action):**
```json
{
  "post": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Posting/editTitle

**Description:** Edits a post's title.

**Requirements:**
- post exists and user is its creator

**Effects:**
- updates post's title and returns post

**Request Body:**
```json
{
  "user": "ID",
  "post": "ID",
  "title": "string"
}
```

**Success Response Body (Action):**
```json
{
  "post": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Posting/editPlace

**Description:** Edits a post's place.

**Requirements:**
- post exists and user is its creator

**Effects:**
- updates post's city, region, and country, and returns post

**Request Body:**
```json
{
  "user": "ID",
  "post": "ID",
  "city": "string",
  "region": "string",
  "country": "string"
}
```

**Success Response Body (Action):**
```json
{
  "post": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Posting/editDates

**Description:** Edits a post's start and end dates.

**Requirements:**
- post exists and user is its creator
- end date is in the past and not before start date

**Effects:**
- updates post's start and end dates and returns post

**Request Body:**
```json
{
  "user": "ID",
  "post": "ID",
  "start": "Date (ISO 8601 string)",
  "end": "Date (ISO 8601 string)"
}
```

**Success Response Body (Action):**
```json
{
  "post": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Posting/editDescription

**Description:** Edits a post's description.

**Requirements:**
- post exists and user is its creator

**Effects:**
- updates post's description and returns post

**Request Body:**
```json
{
  "user": "ID",
  "post": "ID",
  "description": "string"
}
```

**Success Response Body (Action):**
```json
{
  "post": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/Posting/delete

**Description:** Removes a user's post.

**Requirements:**
- post exists and user is its creator

**Effects:**
- removes the specified post

**Request Body:**
```json
{
  "user": "ID",
  "post": "ID"
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

### POST /api/Posting/_getPosts

**Description:** Retrieves all posts for a given creator in order of start date.

**Requirements:**
- true

**Effects:**
- returns all posts with user as creator in order of start date, with the most recent post first

**Request Body:**
```json
{
  "user": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "creator": "ID",
    "title": "string",
    "city": "string",
    "region": "string",
    "country": "string",
    "start": "Date (ISO 8601 string)",
    "end": "Date (ISO 8601 string)",
    "description": "string"
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