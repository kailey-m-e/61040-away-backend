import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import UserAuthenticationConcept from "./UserAuthenticationConcept.ts";

/**
 * Test Case 1
 * Demonstrates operational principle: user registers and then authenticates.
 */
Deno.test("Test Case 1 - operational principle", async () => {
  const [db, client] = await testDb();
  const userAuthenticationConcept = new UserAuthenticationConcept(db);

  try {
    const username = "Alice";
    const password = "1234";

    // 1. User registers
    const registerUser = await userAuthenticationConcept.register({
      username,
      password,
    });
    assertNotEquals(
      "error" in registerUser,
      true,
      "User registration should not fail.",
    );
    const { user } = registerUser as { user: ID };
    assertExists(user);

    // 2. User authenticates
    const authenticateUser = await userAuthenticationConcept.authenticate({
      username,
      password,
    });
    assertNotEquals(
      "error" in authenticateUser,
      true,
      "User authentication should not fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 2
 * Demonstrates user tries to authenticate with incorrect password.
 */
Deno.test("Test Case 2 - incorrect password", async () => {
  const [db, client] = await testDb();
  const userAuthenticationConcept = new UserAuthenticationConcept(db);

  try {
    // 1. User registers
    await userAuthenticationConcept.register({
      username: "Alice",
      password: "1234",
    });

    // 2. User tries to authenticate with incorrect password
    const authenticateUser = await userAuthenticationConcept.authenticate({
      username: "Alice",
      password: "5678",
    });
    assertEquals(
      "error" in authenticateUser,
      true,
      "User authentication should fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 3
 * Demonstrates user registers with duplicate username/password.
 */
Deno.test("Test Case 3 - duplicate username/password", async () => {
  const [db, client] = await testDb();
  const userAuthenticationConcept = new UserAuthenticationConcept(db);

  try {
    // 1. First user registers
    await userAuthenticationConcept.register({
      username: "Alice",
      password: "1234",
    });

    // 2. Second user registers with same password
    const registerUser2 = await userAuthenticationConcept.register({
      username: "Bob",
      password: "1234",
    });
    assertNotEquals(
      "error" in registerUser2,
      true,
      "User registration with duplicate password should not fail.",
    );
    const { user: user1 } = registerUser2 as { user: ID };
    assertExists(user1);

    // 3. Third user registers with same username
    const registerUser3 = await userAuthenticationConcept.register({
      username: "Alice",
      password: "5678",
    });
    assertEquals(
      "error" in registerUser3,
      true,
      "User registration with duplicate username should fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 4
 * Demonstrates user tries to authenticate without registering.
 */
Deno.test("Test Case 4 - authenticate without registering", async () => {
  const [db, client] = await testDb();
  const userAuthenticationConcept = new UserAuthenticationConcept(db);

  try {
    const authenticateUser = await userAuthenticationConcept.authenticate({
      username: "Alice",
      password: "1234",
    });
    assertEquals(
      "error" in authenticateUser,
      true,
      "User authentication without registration should fail.",
    );
  } finally {
    await client.close();
  }
});

/**
 * Test Case 5
 * Demonstrates multiple users register and then authenticate.
 */
Deno.test("Test Case 5 - multiple users", async () => {
  const [db, client] = await testDb();
  const userAuthenticationConcept = new UserAuthenticationConcept(db);

  try {
    // 1. First user registers
    await userAuthenticationConcept.register({
      username: "Alice",
      password: "1234",
    });

    // 2. First user authenticates
    const authenticateUser1 = await userAuthenticationConcept.authenticate({
      username: "Alice",
      password: "1234",
    });
    assertNotEquals(
      "error" in authenticateUser1,
      true,
      "User authentication should not fail.",
    );

    // 3. Second user registers
    await userAuthenticationConcept.register({
      username: "Bob",
      password: "5678",
    });

    // 4. Second user authenticates
    const authenticateUser2 = await userAuthenticationConcept.authenticate({
      username: "Bob",
      password: "5678",
    });
    assertNotEquals(
      "error" in authenticateUser2,
      true,
      "User authentication should not fail.",
    );
  } finally {
    await client.close();
  }
});
