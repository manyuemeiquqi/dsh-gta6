# Contributing

[中文](CONTRIBUTING.md)

## Requirements

- Node.js `>= 24.9.0`
- DeepSeek Harness `>= 0.2.0 < 0.3.0` (to run the plugin)

```bash
npm install
npm run build   # produces index.js and client.js
npm run check   # build + syntax check
```

`index.js` and `client.js` are build artefacts committed to the repo. **Do not edit them by hand** — change `src/` and rebuild.

Reload the plugin after building. Refreshing the page alone will not evict the cached module.

## Layout

```text
src/
  host/index.cjs            # host entry and config schema
  shared/constants.js       # plugin id, asset paths, defaults
  client/
    index.js                # client entry: assembly and lifecycle only
    core/
      run-signal.js         # run state: one observer, many subscribers
      session-state.js      # session data: title / tokens / model
      art.js                # original SVG: palms, skyline, radar, stars
    features/
      theme/                # design token overrides and palette
      conversation/         # message bubbles and body typography
      tools/                # tool-call rows coloured by action
      wanted/               # wanted-level meter, subscribes to run-signal
      panel/                # sidebar dashboard, subscribes to session-state
      pet/                  # desktop pets
      brand/                # tagline replacement
      scene/                # key-art banner and empty state
      intro/                # intro animation
      motion/               # entrance animation and sweep
market/index.json           # in-app market index (format 1)
docs/shots/                 # README screenshots
```

## Conventions

- Every CSS rule is namespaced with `vice-` or scoped to `body[data-vice-*]`; nothing leaks into global elements.
- Selectors use `data-*` semantic markers, never hashed class names. The host uses CSS Modules, so class names carry hashes — binding to them means breaking on every host release.
- To add padding without moving layout, use `padding` with an equal negative `margin`.
- Every feature's teardown must release its listeners, observers and injected styles.
- State is read from the host's services; page text is never scraped.

## Performance

A streaming reply can mutate the page hundreds of times a second. So:

- Exactly one MutationObserver on the whole document, debounced inside `core/run-signal.js`. Every feature that needs run state subscribes to it rather than listening on its own.
- Session data goes through `session-state.js`, also subscribed once.

## Before opening a PR

1. `npm run check` passes.
2. Install it in a real DSH and confirm every toggle can be switched off, and that the interface returns to normal when it is.
3. If you changed a selector, say which `data-*` marker it hangs off.

Before adding a dependency, consider this: the plugin has zero runtime dependencies today, and only esbuild at build time.
