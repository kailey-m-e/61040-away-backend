---
timestamp: 'Sat Oct 18 2025 15:59:36 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251018_155936.e188014f.md]]'
content_id: ec5ea87e36d2fd7764258122179bef34432754881e36662b351b14107a223328
---

# response:

You've pinpointed a crucial detail in Scenario 2 of "Test Case 7 - Concurrency Scenarios."

You are absolutely correct. Given the initial setup where "UserA has an outgoing request to UserB," the concurrent call to `friendingConcept.requestFriend({ user: userA, friend: userB })` would indeed fail because UserA has **already sent a friend request to UserB**. The concept's `requestFriend` action explicitly checks for this in its `requires` clause and its implementation.

The current assertion in the test case:

```typescript
assertEquals(reRequestRes.error, `User with ID ${userA} is already friends with ${userB}.`, "Re-request should fail because they are already friends.");
```

expects the error message indicating they are "already friends." However, the `requestFriend` implementation's precondition checks (see below) prioritize checking `friends` first, then `outgoingRequests`:

```typescript
      // check friend logic
      if (userDoc.friends.includes(friend)) { // Check 1: Already friends
        throw new Error(
          `User with ID ${user} is already friends with ${friend}.`,
        );
      }
      if (userDoc.outgoingRequests.includes(friend)) { // Check 2: Already requested
        throw new Error(
          `User with ID ${user} has already sent a friend request to ${friend}.`,
        );
      }
```

Because of this order, the error message received by `reRequestRes` depends on the exact timing of the two concurrent transactions:

* **If `acceptFriend`'s transaction commits and becomes visible *before* `requestFriend`'s transaction performs its `findOne` operations for preconditions:** `requestFriend` will find that `userA.friends` now includes `userB`, triggering "Check 1" and returning the "already friends" error. This matches the current assertion.
* **If `requestFriend`'s transaction performs its `findOne` operations *before* `acceptFriend`'s transaction commits:** `requestFriend` will find that `userA.friends` does *not* include `userB`, but `userA.outgoingRequests` *does* include `userB` (from the initial setup). This would trigger "Check 2" and return the error "User has already sent a friend request."

While transactions aim for atomicity, the visibility of one transaction's committed changes to another concurrent transaction can still lead to different valid failure paths depending on timing.

**To make the test more robust and accurate given these possibilities:**

1. **Refine the expected error message:** The assertion should allow for either of the two valid error messages, or be more general about just expecting an error.
2. **Adjust initial state (optional):** If you strictly want the "already friends" error, you could remove the initial A->B request, and instead have A->C and C->B, then in scenario 2 A tries to request B *after* B has accepted A (which is not what's happening here). But sticking with the current scenario, acknowledging both error possibilities is best.

**Proposed fix for the test case's Scenario 2 assertion:**

```typescript
// ... (previous test code)

    // --- Scenario 2: Concurrent Accept and Re-request (UserB accepts A, while UserA tries to request B again) ---
    // Pre-condition: UserA has an outgoing request to UserB.
    // Expect: `acceptFriend` succeeds, making them friends. `requestFriend` fails because they are now either
    // already friends OR UserA already has an outstanding request to UserB.
    const [acceptRes, reRequestRes] = await Promise.all([
      friendingConcept.acceptFriend({ user: userB, friend: userA }),
      friendingConcept.requestFriend({ user: userA, friend: userB }), // This should fail as they become friends or request already exists
    ]);

    assertNotEquals("error" in acceptRes, true, "Accepting friend should not fail.");
    assertEquals("error" in reRequestRes, true, "Re-requesting an existing friend or pending request should fail.");

    const expectedErrors = [
      `User with ID ${userA} is already friends with ${userB}.`,
      `User with ID ${userA} has already sent a friend request to ${userB}.`,
    ];
    assert(
      expectedErrors.includes(reRequestRes.error as string),
      `Re-request should fail with an expected error (either 'already friends' or 'already sent'). Actual error: ${reRequestRes.error}`,
    );

    // ... (rest of Scenario 2 and subsequent scenarios)
```

This updated assertion acknowledges that both failure conditions are plausible outcomes depending on the race, making the test more resilient.
