---
timestamp: 'Sun Oct 12 2025 20:38:45 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251012_203845.69b8cd82.md]]'
content_id: 0142094111722111cae2c8331f7cc675536c4248689cc91200ad60061ab313be
---

# response:

To upgrade the user authentication concept to use proper hashing and salting with `node:crypto`, we'll modify the `UsersDoc` interface, add constants for hashing parameters, and implement the hashing and verification logic in the `register` and `authenticate` methods.

Here's the updated code:

```typescript
// file: src/concepts/UserAuthentication/UserAuthenticationConcept.ts

import {Collection, Db} from "npm:mongodb";
import {Empty, ID} from "@utils/types.ts";
import {freshID} from "@utils/database.ts";
import * as crypto from "node:crypto"; // Import the node:crypto module

// Collection prefix to ensure namespace separation
const PREFIX = "UserAuthentication" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// --- Hashing Constants ---
// Length of the salt in bytes. A common recommendation is 16 bytes.
const SALT_LENGTH_BYTES = 16;
// Length of the derived key (hashed password) in bytes.
// Should be at least as long as the output of the digest algorithm (e.g., 64 for sha512).
const KEY_LENGTH_BYTES = 64;
// Number of iterations for PBKDF2. OWASP recommends at least 100,000 for PBKDF2.
const PBKDF2_ITERATIONS = 100000;
// Hashing algorithm to use. SHA-512 is a strong choice.
const DIGEST_ALGORITHM = 'sha512';
// --- End Hashing Constants ---


/**
 * State: A set of Users with a username, hashed password, and salt.
 * The `password` field is replaced by `hashedPassword` and `salt`.
 */
export interface UsersDoc{
    _id: User;
    username: string;
    hashedPassword: string; // Stores the securely hashed password
    salt: string;           // Stores the unique salt used for hashing this password
}

/**
 * @concept UserAuthentication
 * @purpose To provide secure user registration and authentication using password hashing and salting
 *          following industry best practices.
 */
export default class UserAuthenticationConcept {
    users: Collection<UsersDoc>;

    constructor(private readonly db: Db) {
        this.users = this.db.collection(PREFIX + "users");
    }

    /**
     * Helper function to hash a password using PBKDF2 with a given salt.
     * This method is asynchronous due to crypto.pbkdf2's callback interface.
     * @param password The plaintext password to hash.
     * @param salt The salt (hex string) to use for hashing.
     * @returns A promise that resolves to the hex-encoded hashed password.
     */
    private async hashPassword(password: string, salt: string): Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(
                password,
                salt,
                PBKDF2_ITERATIONS,
                KEY_LENGTH_BYTES,
                DIGEST_ALGORITHM,
                (err, derivedKey) => {
                    if (err) reject(err);
                    // Store the derived key as a hex string
                    resolve(derivedKey.toString('hex'));
                }
            );
        });
    }

    /**
     * Action: Register a user with the given username and password.
     * Passwords are automatically hashed and salted before storage.
     *
     * @requires The `username` must not already exist in the database.
     * @effects A new user record is created in the database containing the username,
     *          a securely hashed password, and the unique salt used for hashing.
     */
    async register({username, password}: {username: string, password: string}
    ): Promise<{user: User} | {error: string}> {
        // 1. Check if the username already exists to prevent duplicates.
        const usernameExists = await this.users.findOne({username});
        if (usernameExists) {
            return {error: `Username already exists.`};
        }

        // 2. Generate a unique cryptographic salt for this user.
        // The salt is converted to a hex string for storage.
        const salt = crypto.randomBytes(SALT_LENGTH_BYTES).toString('hex');

        // 3. Hash the provided password using the generated salt and PBKDF2.
        const hashedPassword = await this.hashPassword(password, salt);

        // 4. Generate a new unique ID for the user.
        const newUserId = freshID() as User;

        // 5. Insert the new user into the database with the hashed password and salt.
        await this.users.insertOne({
            _id: newUserId,
            username,
            hashedPassword,
            salt
        });

        return {user: newUserId};
    }

    /**
     * Action: Authenticate a user with the given username and password.
     * This method securely verifies the provided password against the stored hashed password.
     *
     * @requires The `username` must exist and the provided `password` must match
     *           the stored hashed password after re-hashing with the stored salt.
     * @effects None (this is a read-only operation).
     */
    async authenticate({username, password}: {username: string, password: string}
    ): Promise<Empty | {error: string}> {
        // 1. Find the user by username.
        const userDoc = await this.users.findOne({username});

        // Best practice: Use a generic error message to avoid revealing whether a username exists.
        if (!userDoc) {
            return {error: `Username or password incorrect.`};
        }

        // 2. Retrieve the stored salt and hashed password for this user.
        const {salt: storedSalt, hashedPassword: storedHashedPassword} = userDoc;

        // 3. Hash the provided password using the *stored* salt.
        const providedPasswordHash = await this.hashPassword(password, storedSalt);

        // 4. Compare the newly generated hash with the stored hash using a timing-safe comparison.
        // This prevents timing attacks that could reveal information about the password.
        const hashesMatch = crypto.timingSafeEqual(
            Buffer.from(providedPasswordHash, 'hex'),
            Buffer.from(storedHashedPassword, 'hex')
        );

        if (!hashesMatch) {
            return {error: `Username or password incorrect.`};
        }

        // Authentication successful
        return {};
    }
}
```
