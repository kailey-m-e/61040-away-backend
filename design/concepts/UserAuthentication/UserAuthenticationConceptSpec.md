# User Authentication Concept Spec

**concept** UserAuthentication

**purpose** limits access to registered users

**principle** after a user registers with a username and a password, they can authenticate with that same username and password to be handled as the same user each time

**state**

&nbsp; a set of Users with \
&nbsp;&nbsp;&nbsp; a username String \
&nbsp;&nbsp;&nbsp; a password String

**actions**

&nbsp; register(username: String, password: String): (user: User) \
&nbsp;&nbsp;&nbsp; **requires** username doesn't exist among set of users \
&nbsp;&nbsp;&nbsp; **effects** creates and returns a new user with given username and password

&nbsp; authenticate(username: String, password: String): (user: User) \
&nbsp;&nbsp;&nbsp; **requires** username matches a user with the given password

<!-- **queries** -->
