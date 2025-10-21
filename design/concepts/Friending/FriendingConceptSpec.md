# Friending Concept Spec

**concept** Friending [User]

**purpose** to allow users to share special permissions with other users

**principle** after a user requests to be another user's friend, that user can accept or reject the request; if a friendship is created, it can be validated for mutual, special permissions between the friends; if one of the friends ends the friendship, all special permissions are lost between the users

**state**

&nbsp; a users set of Users with \
&nbsp;&nbsp;&nbsp; a friends set of Users \
&nbsp;&nbsp;&nbsp; an outgoingRequests set of Users

**actions**

&nbsp; requestFriend(user: User, friend: User) \
&nbsp;&nbsp;&nbsp; **requires**  friend is not already in user's set of outgoingRequests or friends; user is not already in friend's set of outgoingRequests (if user and/or friend exist in  users); friend does not equal user  \
&nbsp;&nbsp;&nbsp; **effects** adds user and friend to users if not in users already; adds friend to user's set of outgoingRequests

&nbsp; unrequestFriend(user: User, friend: User) \
&nbsp;&nbsp;&nbsp; **requires**  friend exists  in user's set of outgoingRequests  \
&nbsp;&nbsp;&nbsp; **effects** removes friend from user's set of outgoingRequests

&nbsp; acceptFriend(user: User, friend: User) \
&nbsp;&nbsp;&nbsp; **requires** user exists in friend's set of outgoingRequests \
&nbsp;&nbsp;&nbsp; **effects** removes user from friend's set of outgoingRequests; adds friend to user's set of friends and adds user to friend's set of friends

&nbsp; rejectFriend(user: User, friend: User) \
&nbsp;&nbsp;&nbsp; **requires** user exists in friend's set of outgoingRequests \
&nbsp;&nbsp;&nbsp; **effects** removes user from friend's set of outgoingRequests

&nbsp; validateFriendship(user: User, friend: User) \
&nbsp;&nbsp;&nbsp; **requires** friend exists in user's set of friends

&nbsp; endFriendship(user: User, friend: User) \
&nbsp;&nbsp;&nbsp; **requires** friend exists in user's set of friends \
&nbsp;&nbsp;&nbsp; **effects** removes friend from user's associated set and removes user from friend's associated set

**queries**

&nbsp; _getIncomingRequests(user: User): (users set of Users) \
&nbsp;&nbsp;&nbsp; **effects** returns all users with given user in their outgoingRequests

&nbsp; _getOutgoingRequests(user: User): (users set of Users) \
&nbsp;&nbsp;&nbsp; **effects** returns all friends in given user's outgoingRequests

&nbsp; _getFriends(user: User): (users set of Users) \
&nbsp;&nbsp;&nbsp; **effects** returns all friends in given user's friends
