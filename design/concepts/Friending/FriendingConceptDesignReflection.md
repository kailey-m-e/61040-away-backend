# Friending Concept Design Reflection

Compared to assignment 2, I updated the spec to remove the state's set of incomingFriendRequests. This was in respones to a Piazza post from another student about their Friending concept, in which the LLM critique mentioned that only tracking incoming requests provided all of the needed functionality. Because this was simpler and required less state manipulaton for each action, I took this suggestion. The LLM also talked about a "cancel request" action, which I hadn't originally considered for my concept, so I added this in as unrequest.

Additionally, I went back and forth on how to think about adding users to the docs: should a user and friend need to be instantiated with an action before they can befriend one another? Can it happen automatically? I decided that the instantiation would happen during the request action if the two users were not already in the doc, in order to simplify the concept's flow and prevent an abundance of action calls.

Finally, in terms of implementation, I had to add in protection against concurrency bugs, and then also concurrency tests.
