# Design Reflection

<!-- a design file that explains changes that you made to the design of the application as a whole, and that includes 5-10 pointers to interesting moments (explained below) in your development, each with a couple of sentences explaining it -->

## Application Changes

I didn't make any significant changes to my application as a whole. While I: strengethened the security of my UserAuthentication concept, refactored my Wishlist concept, and slightly simplified my Posting and Friending concepts, I neither added or removed any concepts, and the purpose of my app remained the same.

## Interesting Moments

 <!-- As you work on your implementation, some moments will be worth recording. For example, you might discover that your concept specification was wrong in some way; a test run might expose a subtle bug in a concept implementation; the LLM might generate some code that is unexpectedly good or bad in some way; you might discover a way to simplify your design; and so on. When any such moment arises, you should save a link to the relevant file and place it in your design document. Make sure to save a link to a snapshot in the context area, not a link to a file in the design or source code areas (since those are mutable). If this moment did not arise from running the LLM, you should save the relevant files by creating a little design document to record your observations, and then run the tool with the save option to snapshot the files first. -->

### 1) Current Date

[@response.867847f6.md](..\context\design\concepts\Posting\PostingConceptPrompts.md\steps\response.867847f6.md)

As briefly mentioned in my Posting concept design reflection, one interesting moment was that the LLM kept flagging issues with my test cases regarding the dates of my posts in comparison to the current date. However, even after double checking that these dates did lie in the past, the LLM wasn't satisfied. I finally realized that the LLM wasn't accessing the internet as I'd been inherently assuming, so I would have to feed the current date as context (as was brought up in lecture). Afterwards, the LLM was quick to retract its past statements (as can be seen in the response linked above), and the interaction made a lot more sense!

### 2) Hashing Tests

[@response.e4a53e87.md](..\context\design\concepts\UserAuthentication\UserAuthenticationConceptPrompts.md\steps\response.e4a53e87.md)

Another interesting moment was the LLM's respones after I prompted it to rework my test cases after having updated the UserAuthentication implementation to use hashing. I was expecting in a general sense that the LLM would have to make changes to every test case; however, as can be seen in the response linked above, it told me that because the public parameters and return types of the actions hadn't changed (only the state had been updated to include a hashedPassword and salt for each user; register and authenticate still received usernames and passwords), the tests didn't have to be reworked and all still passed. This suprised me and reinforced the idea of how seamless it is to change the implementation of a concept as long as the endpoints remain the same!

### 3) Friending Concurrency

[@response.65dd0b53](..\context\design\concepts\Friending\FriendingConceptPrompts.md\steps\response.65dd0b53.md)

Another interesting moment arose when I asked the LLM to critique my current spec and implementation of the Friending concept. It brought up the potential for race conditions in some of my actions (acceptFriend, requestFriend, and endFriendship), which I'd thought about briefly after reading a Piazza post but had then forgotten about. This was interesting because it was a major concern that I wouldn't have otherwise protected against, and the LLM did very well at generating the somewhat complex code needed to ensure that concurrent operation wouldn't lead to any issues.

### 4) Type Debugging

[@response.96bb3bb1.md](..\context\design\concepts\Friending\FriendingConceptPrompts.md\steps\response.96bb3bb1.md)

[@response.40553615.md](..\context\design\concepts\Friending\FriendingConceptPrompts.md\steps\response.40553615.md)

A fourth interesting moment arose when I was debugging my new concurrency-safe implementation of the Friending concept. There was an issue with accessing the result.value field of a returned document as the LLM wanted me to, so my initial instinct was to check `if (!result)` instead of `if (!result.value)`. However, I decided to see what the LLM recommended (the first link above), which led me in a circle of making multiple updates to the entire file, including adding a type and then making a type alias, before the LLM finally suggested I simply checked `if(!result)` (the second link above). Thus, this proved that sometimes it is best to just listen to your instincts and try to test a fix out!

### 5)

[@response.12b5d229.md](..\context\design\concepts\Friending\FriendingConceptPrompts.md\steps\response.12b5d229.md)

Finally, a fifth interesting moment came about when I was running the test case that the LLM had generated to handle concurrency within the Friending concept. The scenario in which two users simultaneously ended a friendship was failing the assertion that only of the calls had succeeded, and when I asked the LLM for help debugging, it came to the conclusion that MongoDB would allow these concurrent, non-conflicting updates to two different documents to both succeed (as described in the link above). This was an intriguing instance that made me reflect back on my concurrency lessons from 6.102, and after this update, the test case did indeed pass!
