# Posting Concept Design Reflection

In comparison to my assignment 2 spec, I decided not to include the gallery feature of a post as of now because I didn't want to worry about working with images yet. Additionally, I combined the functionality of editing dates into a single action to make the implementation more concise, added a description edit that I'd previously forgotten, and decided not to overload the edit actions.

On top of changes, another issue that I ran into during an LLM-review of my code was that the LLM had a lot of trouble understanding the date aspect of posts. It continually flagged my date validation logic even when it was correct; and then, after pointing out this error, the LLM admitted its mistake and that my code was error-free. Moreover, I'd initially assumed that the LLM knew the current date, so after remembering to provide this information as context, the LLM gave a much more sensical report on my concept, spec, and tests.
