# User Authentication Concept Spec

**concept** UserAuthentication

**purpose** to provide secure user registration and authentication in order to limit access to registered users

**principle** after a user registers with a username and a password, they can authenticate with the same username and password to be handled as the same user each time

**state**

&nbsp; a set of Users with \
&nbsp;&nbsp;&nbsp; a username string \
&nbsp;&nbsp;&nbsp; a hashedPassword string \
&nbsp;&nbsp;&nbsp; a salt string

**actions**

&nbsp; register(username: string, password: string): (user: User) \
&nbsp;&nbsp;&nbsp; **requires** username doesn't exist among set of users \
&nbsp;&nbsp;&nbsp; **effects** creates and returns a new user with the given username, a hashedPassword derived from the given password, and the unique salt used to derive the hashedPassword

&nbsp; authenticate(username: String, password: String) \
&nbsp;&nbsp;&nbsp; **requires** username matches a user whose password matches the given password after re-hashing with the stored salt

**queries**

&nbsp; _getUserByUsername(username: String) : (userFromUsername: User) \
&nbsp;&nbsp;&nbsp; **requires** user with given uesername existsafter re-hashing with the stored salt
&nbsp;&nbsp;&nbsp; **effects** returns the user with a given username
