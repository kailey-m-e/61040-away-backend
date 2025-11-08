# Away Backend

## Assignment Links

  - [Final Design Document](/design/FinalDesignDocument.md)
  - [Final Reflection](/design/FinalReflection.md)
  - [User Journey Video](https://drive.google.com/file/d/1jZOUQ7a6U8WzOf4qoxwgeMi8Xp89Pr-S/view?usp=drive_link)
  - [User Journey Video - trace](/design/VideoTrace.md)

## Overview

Backend for **Away**: a web application for users to document and share their past trips and future travel aspirations.

### Concepts

1. UserAuthentication
2. Posting
3. Wishlist
4. Friending
5. Sessioning
6. Requesting

## File Structure

- **src/concepts**: contains a folder for each concept with:
    - an implementation file: [ConceptName]Concept.ts
    - a test script file: [ConceptName]Concept.test.ts
    - a test script console output file: [ConceptName]TestOutput.md
- **design**:
  - **/concepts**: contains a folder for each concept with:
    - a spec file: [ConceptName]ConceptSpec.md
    - a design reflection file (4a): [ConceptName]DesignReflection.md
    - an LLM prompting file: [ConceptName]ConceptPrompts.md
