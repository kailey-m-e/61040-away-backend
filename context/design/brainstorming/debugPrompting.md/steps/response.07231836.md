---
timestamp: 'Thu Oct 16 2025 13:54:02 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251016_135402.3b21ba59.md]]'
content_id: 07231836e9d521dca5daf1d515adcf10101fd204039e8c794001e3eaed14d295
---

# response:

Okay, that's excellent! The `deno.json` content you provided confirms that you have correctly set up the `imports` map for your custom aliases:

```json
{
  "imports": {
    "@concepts/": "./src/concepts/",
    "@utils/": "./src/utils/"
  }
}
```

This configuration tells Deno (and the Deno language server that powers your IDE's IntelliSense) exactly where to find modules imported with `@concepts/` and `@utils/`.

Given this, the red underlines for `@utils/types.ts` and `@utils/database.ts` should theoretically be resolved, and `npm:mongodb` should also be better understood by your IDE.

If they are *still* underlined, here are the most common reasons and troubleshooting steps:

### 1. For `@utils/types.ts` and `@utils/database.ts`:

* **Confirm File Paths:** The `deno.json` maps `@utils/` to `./src/utils/`. This means your `types.ts` and `database.ts` files **must** be located at `/src/utils/types.ts` and `/src/utils/database.ts` respectively, relative to your project root (where `deno.json` is).
  * **Is this path correct?** If your utility files are, for example, directly in `utils/` (i.e., `./utils/`), then your `deno.json` should be `"@utils/": "./utils/"`.
  * **Are there any typos** in `types.ts`, `database.ts`, or the import statements?
* **IDE Restart & Deno Extension:**
  * **Crucial Step:** Fully **restart your IDE** (e.g., close and re-open VS Code). The Deno language server needs to re-initialize and read the new `deno.json` file.
  * Ensure the **Deno VS Code extension** is installed and enabled for your workspace. Look
