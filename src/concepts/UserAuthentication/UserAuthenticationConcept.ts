import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
import { Buffer } from "node:buffer";
import * as crypto from "node:crypto";

// Collection prefix to ensure namespace separation
const PREFIX = "UserAuthentication" + ".";

// Internal entity types, represented as IDs
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
const DIGEST_ALGORITHM = "sha512";
// --- End Hashing Constants ---

/**
 * State: A set of Users with a username, hashed password, and salt.
 */
export interface UsersDoc {
  _id: User;
  username: string;
  hashedPassword: string; // stores the securely hashed password
  salt: string; // stores the unique salt used for hashing this password
}

/**
 * @concept UserAuthentication
 * @purpose To provide secure user registration and authentication
 *          in order to limit access to registered users.
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
          // store the derived key as a hex string
          resolve(derivedKey.toString("hex"));
        },
      );
    });
  }

  /**
   * Action: Register a user with the given username and password.
   * (Passwords are automatically hashed and salted before storage.)
   *
   * @requires username doesn't exist among users
   * @effects creates and returns a new user with the given username,
   * a hashedPassword derived from the given password,
   * and the unique salt used to derive the hashedPassword
   */
  async register(
    { username, password }: { username: string; password: string },
  ): Promise<{ user: User } | { error: string }> {
    // check if the username already exists
    const usernameExists = await this.users.findOne({ username });
    if (usernameExists) {
      return { error: `Username already exists.` };
    }

    // generate a unique cryptographic salt for this user,
    // converted to a hex string for storage
    const salt = crypto.randomBytes(SALT_LENGTH_BYTES).toString("hex");

    // hash the provided password using the generated salt and PBKDF2
    const hashedPassword = await this.hashPassword(password, salt);

    // add the user
    const newUserId = freshID() as User;

    await this.users.insertOne({
      _id: newUserId,
      username,
      hashedPassword,
      salt,
    });

    return { user: newUserId };
  }

  /**
   * Action: Authenticate a user with the given username and password.
   * (This method securely verifies the provided password against the
   * stored hashed password.)
   *
   * @requires username matches a user whose password matches the given
   * password after re-hashing with the stored salt
   */
  async authenticate(
    { username, password }: { username: string; password: string },
  ): Promise<Empty | { error: string }> {
    // check username exists
    const userDoc = await this.users.findOne({ username });
    if (!userDoc) {
      return { error: `Username or password incorrect.` };
    }

    // retrieve the stored salt and hashed password for this user.
    const { salt: storedSalt, hashedPassword: storedHashedPassword } = userDoc;

    // hash the provided password using the *stored* salt.
    const providedPasswordHash = await this.hashPassword(password, storedSalt);

    // compare the newly generated hash with the stored hash using a timing-safe comparison
    // (this prevents timing attacks that could reveal information about the password)
    const hashesMatch = crypto.timingSafeEqual(
      Buffer.from(providedPasswordHash, "hex"),
      Buffer.from(storedHashedPassword, "hex"),
    );

    // check if password is correct
    if (!hashesMatch) {
      return { error: `Username or password incorrect.` };
    }

    return {};
  }

  /**
   * Query: Retrieves the user with a given username.
   * @requires user with given uesername exists
   * @effects returns the user with a given username
   */
  async _getUserByUsername(
    { username }: { username: string },
  ): Promise<{ user: User }[]> {
    const user = await this.users.findOne({ username });
    if (user) {
      return [{ user: user._id }];
    }
    return [];
  }

  /**
   * Query: Retrieves the username for a given user
   * @requires user exists in set of users
   * @effects returns the username of the given user
   */
  async _getUsername(
    { user }: { user: User },
  ): Promise<{ username: string }[]> {
    const userFound = await this.users.findOne({ _id: user });
    return [{ username: userFound!.username }];
  }
}
