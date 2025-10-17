---
timestamp: 'Thu Oct 16 2025 13:59:01 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251016_135901.8fbcb2f1.md]]'
content_id: 82541fe9f77c002db6ff45f7be063d71ae83d7494d1553ea8812059a55275d04
---

# response:

Thank you for sharing your `settings.json`! This is very helpful and directly points to the most likely cause of your persistent red underlines.

You are correct: your `settings.json` **does not mention Deno at all**. This is the core issue.

### The Problem: Deno Language Server Not Fully Activated

Even if you have the Deno extension installed, it needs to be explicitly enabled for the workspace (or globally, but workspace is usually preferred) for its language server to properly kick in and provide features like:

1. **Module resolution for Deno's `imports` maps** (like your `@utils/` aliases).
2. **Type-checking and IntelliSense for `npm:` specifiers.**
3. **General Deno-specific syntax and tooling.**

Without `deno.enable: true` in your `settings.json` (or implicitly enabled elsewhere, which isn't happening here), your IDE (VS Code) is likely falling back to its default TypeScript language server, which knows nothing about Deno's `deno.json` or `npm:` module resolution. Hence, the "cannot find module" errors.

### The Solution: Enable the Deno Extension

You need to add the `deno.enable` setting to your `settings.json`.

**Here's how to do it:**

1. **Open your `settings.json` file** again (Command Palette: `F1` or `Ctrl+Shift+P` -> "Open Workspace Settings (JSON)").

2. **Add the `deno.enable` line.** I recommend adding `deno.lint` as well, as it's generally useful. `deno.unstable` is only needed if you're using Deno's unstable APIs.

   ```json
   {
     "files.insertFinalNewline": true,
     "files.trimFinalNewlines": true,
     "files.trimTrailingWhitespace": true,
     "python.terminal.executeInFileDir": true,
     "python.defaultInterpreterPath": "C:\\Users\\Kailey\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
     "cmake.pinnedCommands": [
       "workbench.action.tasks.configureTaskRunner",
       "workbench.action.tasks.runTask"
     ],
     "cmake.showOptionsMovedNotification": false,
     "praxis.location.personalLink": "https://praxistutor.mit.edu/6102-sp25/startTutor/646dea61-05d1-45f1-960a-41589c55ea6b",
     "sshfs.configs": [
       {
         "name": "athena",
         "host": "athena.dialup.mit.edu",
         "username": "kaileyme",
         "root": "~/6191-sp25"
       }
     ],
     "remote.SSH.remotePlatform": {
       "decode205gti": "linux"
     },
     "workbench.colorCustomizations": {},
     "workbench.colorTheme": "Visual Studio 2017 Dark - C++",
     "files.autoSave": "afterDelay",
     "terminal.integrated.commandsToSkipShell": [
       "language-julia.interrupt"
     ],
     "julia.symbolCacheDownload": true,
     "dart.flutterSdkPath": "C:\\Users\\Kailey\\Documents\\flutter",
     "github.copilot.enable": {
       "*": false,
       "plaintext": false,
       "markdown": false,
       "scminput": false
     },
     // === ADD THESE LINES FOR DENO ===
     "deno.enable": true,
     "deno.lint": true
     // "deno.unstable": true // Add this only if you're using unstable Deno features
   }
   ```

3. **Save the `settings.json` file.**

4. **Crucially: Fully restart VS Code.** Close all instances and reopen.

### What should happen next:

* The Deno extension should now be properly activated for your workspace.
* It will read your `deno.json` file.
* It should then correctly resolve the `@utils/types.ts` and `@utils/database.ts` imports based on your `imports` map.
* It should also provide correct type information and remove red underlines for `npm:mongodb`.
* You should see a "Deno" status in the bottom status bar of VS Code, indicating it's active.

If, after these steps, the red underlines still persist, please let me know the **exact error messages** that appear when you hover over them. This will give us the next clue. But I am highly confident this `deno.enable: true` setting is what's missing!
