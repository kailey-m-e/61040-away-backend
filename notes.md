TODO:
- at end: copy all requires and effects to the actual functions
- check that all names align between specs and implementations
- look below at rubric comments from past assignemnt
- don't need more queries than I have; not directly querying parts of states? (do I need getters? - look at rubric comments below)
- what should test output to console look like?
- ask llm to review work and give suggestions on what can be improved overall
- should queries be in spec
- potential for race conditions for friending

questions:
- don't need getters; just queries?
- should queries be in the spec?
- (−1) Reads missing: Posting lacks “get posts for user/friend” actions; Wishlist lacks a getter. Your sync references “Posting’s state” but no read API.
    - so would these reads be actions not queries?

    ## Concept queries

Queries are reads of the concept state. Explicit query specifications are often not required since the concept state is assumed to be visible, so that straightforward queries of the state do not need to be defined in advance. It can be useful, though, to define queries for particularly significant and non-trivial observations of the state. For example, for a *UserProfile* concept with this state

	a set of Users with
	  a bio String
	  a thumbnail Image

one would not define a query to extract the bio of a user. But for a *Friend* concept with this state

	a set of Users with
	  a friends set of Users

one might define a query that tells you, given two users, how many mutual friends they have:

  \_countMutualFriends (u1: User, u2: User): (count: Number)
  **effects** return number of mutual friends of users u1 and u2


concepts:
- wishlist
- postcard - figure out how to use places - Create explicit Posting.listByUser(viewer, owner) / Wishlist.get(owner) actions with access checks.
- userauthnetication (figure out hashing - piazza)
- friending



WISHLIST

- places not separate concept - because just data structure?
- fine to have number of places to recommend as magic number?
- first commit for spec and implementation: no queries yet
- should everything be async?
- flesh out queries in spec - correct to list under queries title?
- don't know how to deal with users so can't test
- where am i uspposed to be using empty type? return for queries?

moments:
- passing wish lists instead of users
- no database of places because too hard to check and not always wanted; like google calendar feature

<!-- a design file explaining changes you made to the concept as specified in Assignment 2 and any other issues that came up (in markdown). -->

<!-- - decided that I need place to have a database on its own and export it to the othre (doesn't matter if exports to postcard or postcard exports to it) because otherwise no way to get past places; can eventually add where creating a place uses an llm call to decide if the places actually exists or looks in some other database idk

- would it be good to have a clear option for wishlist?
- decided that i want to pass in the user in order to ensure that only the user can update the wishlist

- decided to refactor the states because a wishlist was a weird concept that didn't provide functionality -- now just looking at palces; multiple users can have same place
- decided to do no ai

- wishlist concept very simplified without AI - but will add back in later; still separate from posting becasue separate feed, simpler, etc. -->




POSTING
- should I make edit checks more dry??
- how am I supposed to be overloading the edit func?
- figure out how to sort posts in order??

- decided not to include gallery because would get pretty complicated and don't want to worry about working with images yet
- combined dates into single edit (because easier that way) and added description edit
- do I need to store the date that a post was created?



how did I use llm?
- used google ai for debugging errors


FRIENDING
- how am I supposed to do validation? should it return true/false?
- do I update return value in spec?



deno test --allow-all  src/concepts/Posting/PostingConcept.test.ts

PS C:\Users\Kailey\Documents\PC School\MIT\Courses\2025 Fall\6.1040\61040-away> .\ctx save src\concepts\Wishlist\WishlistConcept.ts



<!-- (−2) Editing signatures: Posting.edit(user, start: Date) and Posting.edit(user, end: Date) omit the post parameter but refer to “post exists”—this is a correctness bug.
(−1) IDs & references: Many actions key off strings (usernames, place triples). Prefer stable IDs (userId, postId, placeId) to avoid ambiguity.
(−1) Auth/security: password String implies plaintext; specify hashed/opaque credential.
(−1) Visibility model: You commented out public/private; Friending implies permissioned access, but there’s no field or rule on Posts/Wishlist. Add a visibility flag or enforce “friends-only” in read paths.
(−1) Reads missing: Posting lacks “get posts for user/friend” actions; Wishlist lacks a getter. Your sync references “Posting’s state” but no read API.
(−1) Location validity: Several actions require a location “exists” but there’s no Place registry concept. Either add a PlaceDirectory or drop that precondition.
Essential Synchronizations — 5 / 8
(−1) viewFriendContent mixes UI response with model sync and relies on undeclared read APIs. Create explicit Posting.listByUser(viewer, owner) / Wishlist.get(owner) actions with access checks.
(−1) Accept path: You sync requestFriend but not accept; add a sync for acceptFriend.
(−1) Typos/params: desription typo; ensure param names match concept actions exactly. -->
