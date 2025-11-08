# Final Design Document

[Assignment 2](../../61040-portfolio/assignments/assignment2.md)

## Backend

### Concepts

In comparison to Assignment 2, my concepts mostly developed through the addition of queries, and some minor refactoring of the concept states as seen below:

**UserAuthentication**
- My final [UserAuthentication](/design/concepts/UserAuthentication/UserAuthenticationConceptSpec.md) concept implements hashing of passwords instead of storing simple strings, and I added the queries `_getUserByUsername`, `_getUsernameByUser`, and `_getUsernames` when these functions were needed for my syncs.

**Posting**
- My final [Posting](/design/concepts/Posting/PostingConceptSpec.md) concept removed the gallery of images for simplicity (so I didn't have to concern myself with files and uploading) and added the query `_getPosts` for my syncs.

**Wishlist**
- My final [Wishlist](/design/concepts/Wishlist/WishlistConceptSpec.md) concept simply stores places instead of mapping users to wishlists and wishlists to places, and I added the query `_getPlaces` for my syncs.

**Friending**
- My final [Friending](/design/concepts/Friending/FriendingConceptSpec.md) concept added the ability to unrequest a friend through `unrequestFriend` and stores only an `outgoingFriendRequests` set, instead of both `outgoingFriendRequests` and `incomingFriendRequests`. Finally, I added multiple queries when creating my syncs -- `_getOutgoingRequests`, `_getIncomingRequests`, and `_getFriends` -- and changed the `validateFriendship action` into a `_isFriendsWith` query to ensure that the friendship validation in my syncs worked.

### Syncs

- First, I excluded the majority of my concept actions in order to ensure that only authorized users could interact with the app. Thus, the only routes that were included were those that handled registering, logging in, and queries that converted between two things, such as an ID and post or user and username.
- The majority of my syncs were essentially wrappers for actions (such as `CreatePost` or `EndAction`), so they followed the simple three-part format with a request, a response with success, and a response with error. Next, my queries turned into a single sync each. Finally, the `GetFriendPostsRequest` and `GetFriendWishlistRequest` syncs were more complicated because these were called on the `FriendProfile` page of the app, when the UI was supposed to display a friend's posts and wishlist to the user. Thus, the syncs had to take the extra step of verifying that a friendship existed between the user and the friend, essentially giving read access to the user.

## Frontend

In terms of the frontend, while my visual design still conveys the same general aesthetics from Assignment 4b with the same color palette, I made updates across the app to create a more modern feel and replicate the look of sites that I enjoy. On top of adding more icons and colors and creating a logo, here are a few of my bigger changes:

- I replaced the page titles with a centered navigation bar:

  ![Old UI](/assets/oldUI.png)
  ![New UI](/assets/newUI.png)

- I changed both the login and sign up screens from a centered form to a split layout, featuring a large away logo:

  ![Old Login Page](/assets/oldLogin.png)
  ![New Login Page](/assets/newLogin.png)

- I updated the Friends page with a sleeker column layout for requests and changed friend profile boxes into more minimalist avatar circles. Additionally, the search bar to request a friend now autocompletes and can be selected as a chip:

  ![Old Friends Page](/assets/oldFriends.png)
  ![New Friends Page](/assets/newFriends.png)
