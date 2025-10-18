---
timestamp: 'Sat Oct 18 2025 16:17:42 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251018_161742.e360de0a.md]]'
content_id: a1c0f1e90ba3a81de1a89664cd15c32cf6fe2e83123d051d0b2a762a932a6b39
---

# file: src/concepts/Friending/FriendingConcept.test.ts

```typescript
import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import FriendingConcept from "./FriendingConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;
const userC = "user:Charlie" as ID;

/**
 * Test Case 1
 * Demonstrates operational principle: one user requests another, the other user accepts,
 * and the friendship is validated; then, the friendship is ended and can no longer be validated
 */
Deno.test("Test Case 1 - operational principle", async () => {
  const [db, client] = await testDb();
  const friendingConcept = new FriendingConcept(db, client);

  try {
    const incoming1 = await friendingConcept._getIncomingRequests({
      user: userB,
    });
    assertEquals(incoming1.length, 0, "UserB should have 0 incoming requests.");

    // 1. User requests another
    const requestFriend = await friendingConcept.requestFriend({
      user: userA,
      friend: userB,
    });
    assertNotEquals(
      "error" in requestFriend,
      true,
      "Friend request should not fail.",
    );

    const incoming2 = await friendingConcept._getIncomingRequests({
      user: userB,
    });
    assertEquals(incoming2.length, 1, "UserB should have 1 incoming request.");
    assertEquals(
      incoming2[0]._id,
      userA,
      "UserB should have incoming request from userA.",
    );

    // 2. Other user accepts
    const acceptFriend = await friendingConcept.acceptFriend({
      user: userB,
      friend: userA,
    });
    assertNotEquals(
      "error" in acceptFriend,
      true,
      "Accepting friend should not fail.",
    );

    // 3. Friendship is validated
    const validateFriendship1 = await friendingConcept.validateFriendship({
      user: userA,
      friend: userB,
    });
    assertNotEquals(
      "error" in validateFriendship1,
      true,
      "Friendship validation should not fail.",
    );
    const validateFriendship2 = await friendingConcept.validateFriendship({
      user: userB,
      friend: userA,
    });
    assertNotEquals(
      "error" in validateFriendship2,
      true,
      "Friendship validation should not fail.",
    );

    // 4. User ends friendship
    const endFriendship = await friendingConcept.endFriendship({
      user: userA,
      friend: userB,
    });
    assertNotEquals(
      "error" in endFriendship,
      true,
      "Ending friendship should not fail.",
    );

    // 5. Friendship can no longer be validated
    const validateFriendship3 = await friendingConcept.validateFriendship({
      user: userA,
      friend: userB,
    });
    assertEquals(
      "error" in validateFriendship3,
      true,
      "Friendship validation should fail.",
    );
    const validateFriendship4 = await friendingConcept.validateFriendship({
      user: userB,
      friend: userA,
    });
    assertEquals(
      "error" in validateFriendship4,
      true,
      "Friendship validation should fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 2
 * Demonstrates user requests another user, who rejects the request;
 * friendship is not validated.
 */
Deno.test("Test Case 2 - request rejected", async () => {
  const [db, client] = await testDb();
  const friendingConcept = new FriendingConcept(db, client);

  try {
    // 1. User requests another
    const requestFriend = await friendingConcept.requestFriend({
      user: userA,
      friend: userB,
    });
    assertNotEquals(
      "error" in requestFriend,
      true,
      "Friend request should not fail.",
    );

    const incoming = await friendingConcept._getIncomingRequests({
      user: userB,
    });
    assertEquals(incoming.length, 1, "User should have 1 incoming request.");
    assertEquals(incoming[0]._id, userA, "Incorrect incoming request.");

    // 2. Other user rejects
    const rejectFriend = await friendingConcept.rejectFriend({
      user: userB,
      friend: userA,
    });
    assertNotEquals(
      "error" in rejectFriend,
      true,
      "Rejecting friend should not fail.",
    );

    // 3. Friendship is not validated
    const validateFriendship = await friendingConcept.validateFriendship({
      user: userA,
      friend: userB,
    });
    assertEquals(
      "error" in validateFriendship,
      true,
      "Friendship validation should fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 3
 * Demonstrates user requests, unrequests, and then re-requests another user.
 */
Deno.test("Test Case 3 - un and re-requesting", async () => {
  const [db, client] = await testDb();
  const friendingConcept = new FriendingConcept(db, client);

  try {
    // 1. User requests another
    const requestFriend = await friendingConcept.requestFriend({
      user: userA,
      friend: userB,
    });
    assertNotEquals(
      "error" in requestFriend,
      true,
      "Friend request should not fail.",
    );

    // 2. User unrequests other
    const unrequestFriend = await friendingConcept.unrequestFriend({
      user: userA,
      friend: userB,
    });
    assertNotEquals(
      "error" in unrequestFriend,
      true,
      "Unrequesting friend should not fail.",
    );

    // 3. User re-requests other
    const rerequestFriend = await friendingConcept.requestFriend({
      user: userA,
      friend: userB,
    });
    assertNotEquals(
      "error" in rerequestFriend,
      true,
      "Friend request should not fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 4
 * Demonstrates user tries to unrequest friend that was never requested;
 * user tries to accept and reject friend who didn't request user;
 * user tries to validate and end friendship that was never created.
 */
Deno.test("Test Case 4 - actions with nonexistent friendship", async () => {
  const [db, client] = await testDb();
  const friendingConcept = new FriendingConcept(db, client);

  try {
    // 1. User unrequests non-requested friend
    const unrequestFriend = await friendingConcept.unrequestFriend({
      user: userA,
      friend: userB,
    });
    assertEquals(
      "error" in unrequestFriend,
      true,
      "Friend request should fail.",
    );

    // 2. User accepts friend that didn't request user
    const acceptFriend = await friendingConcept.acceptFriend({
      user: userA,
      friend: userB,
    });
    assertEquals(
      "error" in acceptFriend,
      true,
      "Accepting friend should fail.",
    );

    // 3. User rejects friend that didn't request user
    const rejectFriend = await friendingConcept.rejectFriend({
      user: userA,
      friend: userB,
    });
    assertEquals(
      "error" in rejectFriend,
      true,
      "Rejecting friend should fail.",
    );

    // 4. User validates friendship that doesn't exist
    const validateFriendship = await friendingConcept.validateFriendship({
      user: userA,
      friend: userB,
    });
    assertEquals(
      "error" in validateFriendship,
      true,
      "Validating friendship should fail.",
    );

    // 5. User ends friendship that doesn't exist
    const endFriendship = await friendingConcept.endFriendship({
      user: userA,
      friend: userB,
    });
    assertEquals(
      "error" in endFriendship,
      true,
      "Ending friendship should fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 5
 * Demonstrates user tries to request, accept, or reject, friendship that already exists;
 * user tries to request back; user tries to request itself.
 */
Deno.test("Test Case 5 - actions with already existing friendship", async () => {
  const [db, client] = await testDb();
  const friendingConcept = new FriendingConcept(db, client);

  try {
    // 1. User requests another
    await friendingConcept.requestFriend({ user: userA, friend: userB });

    // 2. Other user tries to request back
    const requestFriendBack = await friendingConcept.requestFriend({
      user: userB,
      friend: userA,
    });
    assertEquals(
      "error" in requestFriendBack,
      true,
      "Requesting friend back should fail.",
    );

    // 3. Other user accepts
    await friendingConcept.acceptFriend({ user: userB, friend: userA });

    // 4. Other user tries to request again
    const requestFriendAgain = await friendingConcept.requestFriend({
      user: userB,
      friend: userA,
    });
    assertEquals(
      "error" in requestFriendAgain,
      true,
      "Requesting friend again should fail.",
    );

    // 5. Other user tries to accept
    const acceptFriend = await friendingConcept.acceptFriend({
      user: userB,
      friend: userA,
    });
    assertEquals(
      "error" in acceptFriend,
      true,
      "Accepting friendship that exists should fail.",
    );

    // 6. Other user tries to reject
    const rejectFriend = await friendingConcept.rejectFriend({
      user: userB,
      friend: userA,
    });
    assertEquals(
      "error" in rejectFriend,
      true,
      "Rejecting friendship that exists should fail.",
    );

    // 7. User tries to request itself
    const requestOneself = await friendingConcept.requestFriend({
      user: userA,
      friend: userA,
    });
    assertEquals(
      "error" in requestOneself,
      true,
      "User requesting itself should fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 6
 * Mutliple friendships are created.
 */
Deno.test("Test Case 6 - multiple friendships", async () => {
  const [db, client] = await testDb();
  const friendingConcept = new FriendingConcept(db, client);

  try {
    // 1. UserA requests UserB
    await friendingConcept.requestFriend({ user: userA, friend: userB });

    // 2. UserC requests UserB
    await friendingConcept.requestFriend({ user: userC, friend: userB });

    const incoming1 = await friendingConcept._getIncomingRequests({
      user: userB,
    });
    assertEquals(incoming1.length, 2, "UserB should have 2 incoming requests.");
    assertEquals(
      incoming1[0]._id,
      userA,
      "UserB should have incoming request from userA.",
    );
    assertEquals(
      incoming1[1]._id,
      userC,
      "UserB should have incoming request from userC.",
    );

    // 3. UserB accepts UserA
    await friendingConcept.acceptFriend({ user: userB, friend: userA });

    // 4. UserB accepts UserC
    await friendingConcept.acceptFriend({ user: userB, friend: userC });

    const incoming2 = await friendingConcept._getIncomingRequests({
      user: userB,
    });
    assertEquals(incoming2.length, 0, "UserB should have 0 incoming requests.");

    // 5. UserA validates friendship with userB
    const validateAB = await friendingConcept.validateFriendship({
      user: userA,
      friend: userB,
    });
    assertNotEquals(
      "error" in validateAB,
      true,
      "Validating friendship between userA and userB should not fail.",
    );

    // 6. UserA validates friendship with userC
    const validateAC = await friendingConcept.validateFriendship({
      user: userC,
      friend: userB,
    });
    assertNotEquals(
      "error" in validateAC,
      true,
      "Validating friendship between userB and userC should not fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 6
 * Concurrency.
 */
Deno.test("Test Case 7 - Concurrency Scenarios", async () => {
  const [db, client] = await testDb();
  const friendingConcept = new FriendingConcept(db, client);

  try {
    // --- Scenario 1: Concurrent Mutual Friend Requests (UserA requests UserB, UserB requests UserA) ---
    // Expect: Exactly one request succeeds. The other should fail because the reciprocal request
    // is detected by the 'friendDoc.outgoingRequests.includes(user)' precondition within the transaction.
    const [reqAB, reqBA] = await Promise.all([
      friendingConcept.requestFriend({ user: userA, friend: userB }),
      friendingConcept.requestFriend({ user: userB, friend: userA }),
    ]);

    let reqAB_succeeded = !("error" in reqAB);
    let reqBA_succeeded = !("error" in reqBA);

    // Assert that one and only one of the requests succeeded.
    assertEquals(
      reqAB_succeeded !== reqBA_succeeded,
      true,
      "Exactly one of two mutual requests should succeed atomically.",
    );

    // Verify the state after concurrent requests: one request should be pending, no friendship yet.
    const docA_afterReq = await friendingConcept.users.findOne({ _id: userA });
    const docB_afterReq = await friendingConcept.users.findOne({ _id: userB });

    if (reqAB_succeeded) { // If A->B succeeded, then B->A should have failed.
      assertEquals(
        docA_afterReq?.outgoingRequests.includes(userB),
        true,
        "UserA should have outgoing request to UserB.",
      );
      assertEquals(
        docB_afterReq?.outgoingRequests.includes(userA),
        false,
        "UserB should NOT have outgoing request to UserA.",
      );
      assertEquals(
        reqBA.error,
        `User with ID ${userA} has already sent a friend request to ${userB}.`,
        "B->A request should fail because A->B already sent.",
      );
    } else { // If B->A succeeded, then A->B should have failed.
      assertEquals(
        docB_afterReq?.outgoingRequests.includes(userA),
        true,
        "UserB should have outgoing request to UserA.",
      );
      assertEquals(
        docA_afterReq?.outgoingRequests.includes(userB),
        false,
        "UserA should NOT have outgoing request to UserB.",
      );
      assertEquals(
        reqAB.error,
        `User with ID ${userB} has already sent a friend request to ${userA}.`,
        "A->B request should fail because B->A already sent.",
      );
    }
    assertEquals(
      docA_afterReq?.friends.includes(userB),
      false,
      "UserA and UserB should not be friends yet.",
    );
    assertEquals(
      docB_afterReq?.friends.includes(userA),
      false,
      "UserB and UserA should not be friends yet.",
    );

    // --- Setup for Scenario 2: Ensure A->B is the pending request for deterministic next step ---
    // If B->A won in the previous step, we undo it and explicitly establish A->B.
    if (reqBA_succeeded) {
      await friendingConcept.unrequestFriend({ user: userB, friend: userA }); // Undo B->A
      await friendingConcept.requestFriend({ user: userA, friend: userB }); // Explicitly create A->B
    }

    // --- Scenario 2: Concurrent Accept and Re-request (UserB accepts A, while UserA tries to request B again) ---
    // Pre-condition: UserA has an outgoing request to UserB.
    // Expect: `acceptFriend` succeeds, making them friends. `requestFriend` fails because they are now either
    // already friends OR UserA already has an outstanding request to UserB.
    const [acceptRes, reRequestRes] = await Promise.all([
      friendingConcept.acceptFriend({ user: userB, friend: userA }),
      friendingConcept.requestFriend({ user: userA, friend: userB }), // This should fail
    ]);

    assertNotEquals(
      "error" in acceptRes,
      true,
      "Accepting friend should not fail.",
    );
    assertEquals(
      "error" in reRequestRes,
      true,
      "Re-requesting an existing friend or pending request should fail.",
    );

    // Updated assertion to handle both possible valid error messages due to concurrency timing
    const expectedReRequestErrors = [
      `User with ID ${userA} is already friends with ${userB}.`,
      `User with ID ${userA} has already sent a friend request to ${userB}.`,
    ];
    assert(
      expectedReRequestErrors.includes(reRequestRes.error as string),
      `Re-request should fail with an expected error (either 'already friends' or 'already sent'). Actual error: ${reRequestRes.error}`,
    );

    // Verify friendship established and requests cleared
    const docA_afterAccept = await friendingConcept.users.findOne({
      _id: userA,
    });
    const docB_afterAccept = await friendingConcept.users.findOne({
      _id: userB,
    });

    assertEquals(
      docA_afterAccept?.friends.includes(userB),
      true,
      "UserA should be friends with UserB.",
    );
    assertEquals(
      docB_afterAccept?.friends.includes(userA),
      true,
      "UserB should be friends with UserA.",
    );
    assertEquals(
      docA_afterAccept?.outgoingRequests.includes(userB),
      false,
      "UserA should not have outgoing request to UserB.",
    );
    assertEquals(
      docB_afterAccept?.outgoingRequests.includes(userA),
      false,
      "UserB should not have any incoming request from UserA.",
    );
    // --- Scenario 3: Concurrent Mutual Friendship Termination (UserA ends B, UserB ends A) ---
    // Pre-condition: UserA and UserB are friends.
    // Expect: Both `endFriendship` operations to succeed, leading to a fully terminated friendship.
    const [endAB, endBA] = await Promise.all([
      friendingConcept.endFriendship({ user: userA, friend: userB }),
      friendingConcept.endFriendship({ user: userB, friend: userA }),
    ]);

    let endAB_succeeded = !("error" in endAB);
    let endBA_succeeded = !("error" in endBA);

    // Assert that both end friendship calls succeeded.
    // MongoDB's transaction logic for concurrent $pull operations might allow both to commit
    // if the changes are considered non-conflicting (i.e., removing distinct elements from arrays).
    assertEquals(
      endAB_succeeded,
      true,
      "Ending friendship A->B should succeed.",
    );
    assertEquals(
      endBA_succeeded,
      true,
      "Ending friendship B->A should succeed.",
    );

    // Verify friendship is terminated on both sides.
    const docA_afterEnd = await friendingConcept.users.findOne({ _id: userA });
    const docB_afterEnd = await friendingConcept.users.findOne({ _id: userB });

    assertEquals(
      docA_afterEnd?.friends.includes(userB),
      false,
      "UserA should no longer be friends with UserB.",
    );
    assertEquals(
      docB_afterEnd?.friends.includes(userA),
      false,
      "UserB should no longer be friends with UserA.",
    );
  } finally {
    await client.close();
  }
});

```

\#prompt: Can you make sure that you're viewing the most up-to-date just saved files?
