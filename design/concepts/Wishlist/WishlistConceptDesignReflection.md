# Wishlist Concept Design Reflection

I made some significant changes to the Wishlist concept compared to assignment 2. First, I decided to remove the AI-augmented recommendation action for now in order to focus on creating a working backend first. (While this does simplify the Wishlist concept, the ability to flesh it out by adding Gemini support still remains.)

Additionally, after coding an implementation of my original spec, I realized that the state structure wasn't very functional: I initially had a set of Wishlists, each with a set of userPlaces, and then a separate set of Places. However, when thinking through the user journey, I ran into a series of design decisions that I hadn't originally thought of: when was a place created? What happened when a user removed a place? Could duplicate places exist? I wasn't satisfied with the potential answers, so I realized that I could simply focus on defining places themselves instead of wishlists. Thus, I restructured the state accordingly by storing a set of places, which led to a far more straightforward implementation.

Other than that, I didn't run into any significant problems with the Wishlist concept.
