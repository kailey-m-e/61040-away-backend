---
timestamp: 'Sun Oct 19 2025 07:57:40 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251019_075740.b7a85426.md]]'
content_id: c2ff24db0309b85855147ff73b4dfd55f3bfcea1775f285be27b2bc5b4304327
---

# API Specification: Friending Concept

**Purpose:** To allow users to share special permissions with other users.

***

## API Endpoints

### POST /api/Friending/requestFriend

**Description:** Requests a new friend.

**Requirements:**

* friend is not already in user's set of outgoingRequests or friends
* user is not already in friend's set of outgoingRequests (if user and/or friend exist in users)
* friend does not equal user

**Effects:**

* adds user and friend to users if not in users already
* adds friend to user's set of outgoingRequests

**Request Body:**

```json
{
  "user": "string",
  "friend": "string"
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

### POST /api/Friending/unrequestFriend

**Description:** Cancels an outgoing friend request.

**Requirements:**

* friend exists in user's set of outgoingRequests

**Effects:**

* removes friend from user's set of outgoingRequests

**Request Body:**

```json
{
  "user": "string",
  "friend": "string"
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

### POST /api/Friending/acceptFriend

**Description:** Accepts an incoming friend request.

**Requirements:**

* user exists in friend's set of outgoingRequests

**Effects:**

* removes user from friend's set of outgoingRequests
* adds friend to user's set of friends
* adds user to friend's set of friends

**Request Body:**

```json
{
  "user": "string",
  "friend": "string"
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

### POST /api/Friending/rejectFriend

**Description:** Rejects an incoming friend request.

**Requirements:**

* user exists in friend's set of outgoingRequests

**Effects:**

* removes user from friend's set of outgoingRequests

**Request Body:**

```json
{
  "user": "string",
  "friend": "string"
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

### POST /api/Friending/validateFriendship

**Description:** Confirms that a given friendship exists.

**Requirements:**

* friend exists in user's set of friends

**Effects:**

* (Implicit: the friendship is validated if no error is returned)

**Request Body:**

```json
{
  "user": "string",
  "friend": "string"
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

### POST /api/Friending/endFriendship

**Description:** Ends the friendship between two users.

**Requirements:**

* friend exists in user's set of friends

**Effects:**

* removes friend from user's associated set
* removes user from friend's associated set

**Request Body:**

```json
{
  "user": "string",
  "friend": "string"
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

### POST /api/Friending/\_getIncomingRequests

**Description:** Retrieves all users who have friend requested a given user.

**Requirements:**

* true

**Effects:**

* returns all users with given user in their outgoingRequests

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
    "friends": [
      "string"
    ],
    "outgoingRequests": [
      "string"
    ]
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
