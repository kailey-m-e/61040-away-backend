# Wishlist Concept Spec

**concept** Wishlist [User]

**purpose** to keep track of a user's future dream destinations

**principle** a user can add places to which they want to travel to their wishlist, and can then remove places that they've already been to or no longer want to go

**state**

&nbsp; a set of Places with \
&nbsp;&nbsp;&nbsp; a User \
&nbsp;&nbsp;&nbsp; a city string \
&nbsp;&nbsp;&nbsp; a region string \
&nbsp;&nbsp;&nbsp; a country string

**actions**

&nbsp; addPlace(user: User, city: string, region: string, country: string): (place: Place) \
&nbsp;&nbsp;&nbsp; **requires** a place doesn't already exist in the set of places with the given user, city, region, and country
&nbsp;&nbsp;&nbsp; **effects** adds and returns a place with the given user, city, region, and country

&nbsp; removePlace(user: User, place: Place) \
&nbsp;&nbsp;&nbsp; **requires** place exists in set of places and is associated with the given user \
&nbsp;&nbsp;&nbsp; **effects** removes the place from the set of places

**queries**

&nbsp; _getPlaces(user: User): (set of Places) \
&nbsp;&nbsp;&nbsp; **effects** returns all places with the given user
