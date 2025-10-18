# Posting Concept Spec

**concept** Posting [User]

**purpose** to make a record of a user's trip

**principle** after a user creates a post about a trip that they took, it becomes part of their personal content, and can then be edited to update details, or later deleted to remove it from their personal content

**state**

&nbsp; a set of Posts with \
&nbsp;&nbsp;&nbsp; a creator User \
&nbsp;&nbsp;&nbsp; a title string \
&nbsp;&nbsp;&nbsp; a city string \
&nbsp;&nbsp;&nbsp; a region string \
&nbsp;&nbsp;&nbsp; a country string \
&nbsp;&nbsp;&nbsp; a start Date \
&nbsp;&nbsp;&nbsp; an end Date \
&nbsp;&nbsp;&nbsp; a description string

**actions**

&nbsp; create(creator: User, title: string, city: string, region: string, country: string, start: Date, end: Date, description: string): (post: Post) \
&nbsp;&nbsp;&nbsp; **requires** end date is in the past and not before start date \
&nbsp;&nbsp;&nbsp; **effects** creates and returns a post associated with the given user, title, city, region, country, start date, end date, and description

&nbsp; editTitle(user: User, post: Post, title: string): (post: Post) \
&nbsp;&nbsp;&nbsp; **requires** post exists and user is its creator \
&nbsp;&nbsp;&nbsp; **effects** updates post's title and returns post

&nbsp; editPlace(user: User, post: Post, city: string, region: string, country: string): (post: Post) \
&nbsp;&nbsp;&nbsp; **requires** post exists and user is its creator \
&nbsp;&nbsp;&nbsp; **effects** updates post's city, region, and country, and returns post

&nbsp; editDates(user: User, post: Post, start: Date, end: Date): (post: Post) \
&nbsp;&nbsp;&nbsp; **requires** post exists and user is its creator; end date is in the past and not before start date  \
&nbsp;&nbsp;&nbsp; **effects** updates post's start and end dates and returns post

&nbsp; editDescription(user: User, post: Post, description: string): (post: Post) \
&nbsp;&nbsp;&nbsp; **requires** post exists and user is its creator \
&nbsp;&nbsp;&nbsp; **effects** updates post's description and returns post

&nbsp; delete(user: User, post: Post) \
&nbsp;&nbsp;&nbsp; **requires** post exists in set of posts and user is its creator \
&nbsp;&nbsp;&nbsp; **effects** removes post from set of posts

**queries**

&nbsp; getPosts(user: User): (set of Posts) \
&nbsp;&nbsp;&nbsp; **effects** returns all posts with user as creator in order of start date, with the most recent post first
