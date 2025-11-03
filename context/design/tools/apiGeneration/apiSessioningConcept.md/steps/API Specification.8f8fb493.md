---
timestamp: 'Sun Nov 02 2025 08:55:23 GMT-0500 (Eastern Standard Time)'
parent: '[[..\20251102_085523.fc98112a.md]]'
content_id: 8f8fb4930ba6da230551da90c9a0bd1ca7fcab796cca734a9c0c6b8bd61410b9
---

# API Specification: Sessioning Concept

**Purpose:** To maintain a user's logged-in state across multiple requests without re-sending credentials.

***

## API Endpoints

### POST /api/Sessioning/create

**Description:** Creates a new session for the given user.

**Requirements:**

* true.

**Effects:**

* creates a new Session `s`; associates it with the given `user`; returns `s` as `session`.

**Request Body:**

```json
{
  "user": "{ID}"
}
```

**Success Response Body (Action):**

```json
{
  "session": "{ID}"
}
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***

### POST /api/Sessioning/delete

**Description:** Removes the specified session.

**Requirements:**

* the given `session` exists.

**Effects:**

* removes the session `s`.

**Request Body:**

```json
{
  "session": "{ID}"
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

***

### POST /api/Sessioning/\_getUser

**Description:** Retrieves the user associated with the given session.

**Requirements:**

* the given `session` exists.

**Effects:**

* returns the user associated with the session.

**Request Body:**

```json
{
  "session": "{ID}"
}
```

**Success Response Body (Query):**

```json
[
  {
    "user": "{ID}"
  }
]
```

**Error Response Body:**

```json
{
  "error": "string"
}
```

***
