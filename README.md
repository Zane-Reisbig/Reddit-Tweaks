# Reddit Tweaks

Small Tampermonkey-oriented tweaks for old Reddit, bundled from TypeScript with `esbuild`.

The project currently targets two flows:

- comment pages: adds a `download video` action to the main post
- timeline and listing pages: adds a `filter subreddit` action to each newly discovered post

## How it works

`[reddit.ts](./src/reddit.ts)` is the entry point. It runs on an interval, checks the current URL, and routes to either the comment-page tweaks or the timeline tweaks.

Both feature paths operate on the same `RedditThing` abstraction from `[reddit-things.ts](./src/reddit-things.ts)`. Instead of scattering raw DOM queries across every tweak, the code wraps each Reddit post container in a small class that exposes useful post data such as:

- author
- subreddit
- permalink
- media URL
- button bar access

That wrapper is the main foundation for future work. New tweaks can be added by extending behavior around `RedditThing` instances rather than re-solving Reddit's DOM structure each time. In practice, that gives you a single place to:

- detect whether an element is a real Reddit post
- read post metadata from `data-*` attributes
- attach new button-bar actions
- mark processed posts so the same tweak is not applied twice

As more tweaks are added, this keeps the code organized around post-level behavior instead of one-off selectors.

## Project structure

```text
src/
  comments-tweaks.ts
  helpers.ts
  reddit-things.ts
  reddit.ts
  timeline-tweaks.ts
compile.ps1
```

## Build

The bundle is produced with `esbuild` through the provided PowerShell script.

### Requirements

- Node.js
- `npx` available in your shell

### Build command

```powershell
./compile.ps1
```

That script bundles `src/reddit.ts` into `dist/reddit.js` with sourcemaps.

If you want to install `esbuild` locally first:

```powershell
npm install --save-dev esbuild
./compile.ps1
```

## Using the script

1. Build the bundle.
2. Open your userscript manager.
3. Create or update a script using the generated `dist/reddit.js` bundle.
4. Visit old Reddit comment or listing pages and confirm the extra actions appear in the post button bar.

## Current tweak behavior

### Comment pages

On Reddit comment pages, the script finds the main post and adds a `download video` action that builds a RapidSave download URL from the post permalink and media URL.

### Timeline pages

On listing pages, the script finds unprocessed posts and adds a `filter subreddit` action to each one. That action issues Reddit's filter request using the page's existing `window.r.config` values.

## Extending it

The intended way to grow this project is:

1. find one or more `RedditThing` instances
2. read the metadata you need from the wrapper
3. attach a new action through `thing.buttonBar.addListItem(...)`
4. mark the post as processed with `thing.addCSSClass("touched")`

That pattern already exists in both tweak modules, so future additions can follow the same shape with minimal DOM-specific code.
