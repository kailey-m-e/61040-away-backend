# Final Reflection

### What was hard or easy?

- I found the initial designing part of the project a bit difficult because I hadn't yet crasped the idea of concepts as a whole, and then the hardest part was figuring out how to create the syncs and have the frontend integrate properly with the new backend structure. In particular, it was difficult to get the frontend to understand the Sessioning and Requesting concepts. Finally, it was tricky to figure out how to ensure that a user could view their friends' posts and wishlist through the sync functionality.

- However, vibe-coding the frontend was straightforward using the LLMs -- and a lot of fun.

### What went well?

- I believe that I framed the purpose and principle of my app well from the beginning, so I didn't have to make many large structural changes to the app as a whole during my backend development. Additionally, my UI creation went well and resulted in a frontend that I'm proud of, and I enjoyed finding media for the design study.

### What mistakes did you make, and how would you avoid making them in the future?

- During development, I had mistakes in the return types of my queries and the names of the variable bindings, so I had many problems with handling query returns between the syncs and the frontend. In the future, I would be more careful when creating the queries and have the LLM check my work to spare myself major debugging time later on. In addition, prompting the LLM with the likely source of error could help the model catch the bugs sooner.

- I also forgot to switch my Gemini version from Flash to Pro for Context, so I struggled with getting Context to understand, and create, syncs. Additionally, I wasn't linking other files correctly at times. In the future, I would ensure that I carefully reflect my models and check what my settings are when an LLM's responses don't seem to be up to par.

### What skills did you acquire and which do you feel you still need to develop further?

- I developed a solid foundation in the skills of designing concepts, creating syncs, and querying non-relational databases. Writing the backend almost entirely by hand at the start helped me nail down these aspects and fully understand my code.

- However, I still need to further develop my skills in frontend development, such as being able to independently implement layout changes and more complex UI logic. Additionally, I want to gain confidence in my comprehension of the app's entire flow, from client to server to database, and how all of the pieces fit together.

### How did you use the Context tool? How did you use an agentic coding tool? What conclusions would you draw about the appropriate role of LLMs in software development?

- As mentioned above, I hand-coded almost the entirety of the initial backend, including concepts and tests. Then, I used the context tool to review my initial concept implementations, to develop syncs, and to help debug. However, most of my debugging was done with the agentic coding tools, passing files as context from the backend to the frontend. I also used the agentic coding tool to vibe-code the frontend and connect the frontend to the backend. Specific design prompting also allowed me to apply incremental changes to the UI, fine-tuning my app to look and behave exactly as I wanted it.

- I believe that the appropriate role of LLMs in software development is nuanced. LLMs certainly cut down on the often-tedious work of writing code and are especially efficient at debugging. However, these models create an abstraction, or almost black-box, layer between the developer and the project that obscures what's happening behind the scenes, leading to less of an understanding of the codebase and less acquisition of the engineering skills that building an app is supposed to develop. Additionally, as I found in my own workflow, using LLM's can result in an overreliance on AI and a lack of confidence in one's own abilities: some problems can be sufficiently solved by the developer on their own, so the habit of turning to an LLM can unnecessarily slow down progress. Ultimately, I believe that while LLMs are very advanced and valuable coding tools, developers must always balance the use of LLMs and the use of their own brain, to ensure that the human and the AI are partners that work together to create a better product, rather than the AI leading the human into the unknown.
