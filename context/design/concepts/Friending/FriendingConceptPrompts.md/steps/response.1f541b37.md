---
timestamp: 'Sat Oct 18 2025 15:28:59 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251018_152859.7e650fb3.md]]'
content_id: 1f541b376d1177f0d33b447825d6377c22d60868842c840bd3d2b579f248598f
---

# response:

```typescript
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import FriendingConcept from "./FriendingConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;
const userC = "user:Charlie" as ID; // Retained for consistency with other tests, though not strictly used here.

/**
 * Test Case 7: Concurrency Scenarios
 * Tests requestFriend, acceptFriend, and endFriendship under concurrent conditions
 * to ensure atomicity, correct state changes, and proper error handling.
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
    assertEquals(reqAB_succeeded !== reqBA_succeeded, true, "Exactly one of two mutual requests should succeed atomically.");

    // Verify the state after concurrent requests: one request should be pending, no friendship yet.
    const docA_afterReq = await friendingConcept.users.findOne({ _id: userA });
    const docB_afterReq = await friendingConcept.users.findOne({ _id: userB });

    if (reqAB_succeeded) { // If A->B succeeded, then B->A should have failed.
      assertEquals(docA_afterReq?.outgoingRequests.includes(userB), true, "UserA should have outgoing request to UserB.");
      assertEquals(docB_afterReq?.outgoingRequests.includes(userA), false, "UserB should NOT have outgoing request to UserA.");
      assertEquals(reqBA.error, `User with ID ${userA} has already sent a friend request to ${userB}.`, "B->A request should fail because A->B already sent.");
    } else { // If B->A succeeded, then A->B should have failed.
      assertEquals(docB_afterReq?.outgoingRequests.includes(userA), true, "UserB should have outgoing request to UserA.");
      assertEquals(docA_afterReq?.outgoingRequests.includes(userB), false, "UserA should NOT have outgoing request to UserB.");
      assertEquals(reqAB.error, `User with ID ${userB} has already sent a friend request to ${userA}.`, "A->B request should fail because B->A already sent.");
    }
    assertEquals(docA_afterReq?.friends.includes(userB), false, "UserA and UserB should not be friends yet.");
    assertEquals(docB_afterReq?.friends.includes(userA), false, "UserB and UserA should not be friends yet.");


    // --- Setup for Scenario 2: Ensure A->B is the pending request for deterministic next step ---
    // If B->A won in the previous step, we undo it and explicitly establish A->B.
    if (reqBA_succeeded) {
        await friendingConcept.unrequestFriend({ user: userB, friend: userA }); // Undo B->A
        await friendingConcept.requestFriend({ user: userA, friend: userB }); // Explicitly create A->B
    }


    // --- Scenario 2: Concurrent Accept and Re-request (UserB accepts A, while UserA tries to request B again) ---
    // Pre-condition: UserA has an outgoing request to UserB.
    // Expect: `acceptFriend` succeeds, making them friends. `requestFriend` fails because they are now friends.
    const [acceptRes, reRequestRes] = await Promise.all([
      friendingConcept.acceptFriend({ user: userB, friend: userA }),
      friendingConcept.requestFriend({ user: userA, friend: userB }), // This should fail as they become friends
    ]);

    assertNotEquals("error" in acceptRes, true, "Accepting friend should not fail.");
    assertEquals("error" in reRequestRes, true, "Re-requesting an existing friend should fail.");
    assertEquals(reRequestRes.error, `User with ID ${userA} is already friends with ${userB}.`, "Re-request should fail because they are already friends.");

    // Verify friendship established and requests cleared
    const docA_afterAccept = await friendingConcept.users.findOne({ _id: userA });
    const docB_afterAccept = await friendingConcept.users.findOne({ _id: userB });

    assertEquals(docA_afterAccept?.friends.includes(userB), true, "UserA should be friends with UserB.");
    assertEquals(docB_afterAccept?.friends.includes(userA), true, "UserB should be friends with UserA.");
    assertEquals(docA_afterAccept?.outgoingRequests.includes(userB), false, "UserA should not have outgoing request to UserB.");
    assertEquals(docB_afterAccept?.outgoingRequests.includes(userA), false, "UserB should not have any incoming request from UserA.");


    // --- Scenario 3: Concurrent Mutual Friendship Termination (UserA ends B, UserB ends A) ---
    // Pre-condition: UserA and UserB are friends.
    // Expect: Exactly one `endFriendship` succeeds. The other should fail because the friendship
    // is already terminated by the concurrent call, violating the 'requires' clause.
    const [endAB, endBA] = await Promise.all([
      friendingConcept.endFriendship({ user: userA, friend: userB }),
      friendingConcept.endFriendship({ user: userB, friend: userA }),
    ]);

    let endAB_succeeded = !("error" in endAB);
    let endBA_succeeded = !("error" in endBA);

    // Assert that one and only one of the end friendship calls succeeded.
    assertEquals(endAB_succeeded !== endBA_succeeded, true, "Exactly one of two mutual end friendship requests should succeed atomically.");

    // Verify the specific error message for the failed termination.
    if (endAB_succeeded) {
        assertEquals(endBA.error, `No friendship exists between user with ID ${userB} and friend with ID ${userA}.`, "B->A end should fail because A->B already ended.");
    } else {
        assertEquals(endAB.error, `No friendship exists between user with ID ${userA} and friend with ID ${userB}.`, "A->B end should fail because B->A already ended.");
    }

    // Verify friendship is terminated on both sides.
    const docA_afterEnd = await friendingConcept.users.findOne({ _id: userA });
    const docB_afterEnd = await friendingConcept.users.findOne({ _id: userB });

    assertEquals(docA_afterEnd?.friends.includes(userB), false, "UserA should no longer be friends with UserB.");
    assertEquals(docB_afterEnd?.friends.includes(userA), false, "UserB should no longer be friends with UserA.");

  } finally {
    await client.close();
  }
});
```
