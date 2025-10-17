# Wishlist Concept Spec

**concept** Wishlist [User]

**purpose** to keep track of a user's future dream destinations

**principle** a user can add places that they want to travel to to their wishlist, and then remove places that they've already been or no longer want to go

**state**

&nbsp; a set of Places with \
&nbsp;&nbsp;&nbsp; a creator User \
&nbsp;&nbsp;&nbsp; a city string \
&nbsp;&nbsp;&nbsp; a region string \
&nbsp;&nbsp;&nbsp; a country string

**actions**

&nbsp; addPlace(creator: User, city: string, region: string, country: string): (place: Place) \
&nbsp;&nbsp;&nbsp; **requires** a place doesn't already exist in the set of places with the given creator, city, region, and country
&nbsp;&nbsp;&nbsp; **effects** adds and returns a place with the creator, given city, region, and country

&nbsp; removePlace(creator: User, place: Place) \
&nbsp;&nbsp;&nbsp; **requires** place exists in set of places and user is its creator \
&nbsp;&nbsp;&nbsp; **effects** removes the place from the set of places

**queries**

&nbsp; getPlaces(user: User) \
&nbsp;&nbsp;&nbsp; **effects** returns all places that have a creator of user
