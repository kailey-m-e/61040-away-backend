# Use the official Deno image. Build steps need root to populate Deno's cache
# and npm registry directories; we'll switch to the non-root 'deno' user after
# the build is complete.
FROM denoland/deno:2.5.5

# Set the working directory inside the container
WORKDIR /app

# Expose the port the application will listen on.
# The Requesting concept defaults to PORT 10000.
EXPOSE 10000

# Copy all application files into the working directory.
# CRITICAL FIX: Use --chown to ensure the 'deno' user owns the files.
# This grants the necessary write permissions for the build step.
COPY --chown=deno:deno . .

# Run the custom build step defined in deno.json as root so Deno can write to
# its cache (/deno-dir) and populate the npm registry cache. This avoids
# permission issues that can leave incomplete cache entries (which cause
# errors like "package.json did not exist").
RUN deno task build

# Cache the main module and all dependencies.
RUN deno cache src/main.ts

# Ensure the Deno cache and application files are owned by the non-root 'deno'
# user before switching to it. This lets the runtime run without root.
RUN chown -R deno:deno /deno-dir /app || true

# Now drop privileges for the runtime.
USER deno

# Start the app using the task defined in deno.json
CMD ["deno", "task", "start"]
