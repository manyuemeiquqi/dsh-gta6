/* Generated from src/ by scripts/build.mjs. Do not edit directly. */
(() => {
  // src/client/core/config-store.js
  function createConfigStore(form, defaults) {
    const listeners = /* @__PURE__ */ new Set();
    const pending = /* @__PURE__ */ new Map();
    let snapshot = form.getSnapshot();
    function reconcile() {
      for (const [key, operation] of pending) {
        if (!operation.failed && snapshot.value?.[key] === operation.value) pending.delete(key);
      }
    }
    function emit() {
      for (const listener of listeners) listener();
    }
    const unsubscribeForm = form.subscribe(() => {
      snapshot = form.getSnapshot();
      reconcile();
      emit();
    });
    function getState() {
      const values = { ...defaults, ...snapshot.value || {} };
      for (const [key, operation] of pending) values[key] = operation.value;
      return {
        snapshot,
        values,
        failed: [...pending.values()].some((operation) => operation.failed)
      };
    }
    async function update(key, value) {
      if (snapshot.status !== "ready" || snapshot.writable !== true) return false;
      pending.set(key, { value, failed: false });
      emit();
      try {
        const ok = await form.set(key, value);
        snapshot = form.getSnapshot();
        const operation = pending.get(key);
        if (operation?.value !== value) return ok;
        if (ok && snapshot.value?.[key] === value) pending.delete(key);
        else operation.failed = true;
        emit();
        return ok;
      } catch {
        const operation = pending.get(key);
        if (operation?.value === value) operation.failed = true;
        emit();
        return false;
      }
    }
    return {
      getState,
      update,
      subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      dispose() {
        unsubscribeForm();
        listeners.clear();
        pending.clear();
      }
    };
  }

  // src/client/core/run-signal.js
  var STOP_LABELS = /* @__PURE__ */ new Set(["停止生成", "Stop generating"]);
  var SETTLE_MS = 260;
  function createRunSignal({ body }) {
    const listeners = /* @__PURE__ */ new Set();
    let observer;
    let timer;
    let scheduled = false;
    let running = false;
    let started = false;
    function read() {
      return [...document.querySelectorAll("button")].some((button) => STOP_LABELS.has(button.getAttribute("aria-label") || ""));
    }
    function publish() {
      scheduled = false;
      const next = read();
      if (next === running) return;
      running = next;
      for (const listener of listeners) listener(running);
    }
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      window.clearTimeout(timer);
      timer = window.setTimeout(publish, SETTLE_MS);
    }
    return {
      start() {
        if (started) return;
        started = true;
        running = read();
        observer = new MutationObserver(schedule);
        observer.observe(body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["aria-label", "disabled"]
        });
      },
      /** Current state, for a subscriber that mounts mid-run. */
      get() {
        return running;
      },
      subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      dispose() {
        window.clearTimeout(timer);
        timer = void 0;
        scheduled = false;
        observer?.disconnect();
        observer = void 0;
        listeners.clear();
        running = false;
        started = false;
      }
    };
  }

  // src/client/core/styles.js
  function installStyles(pluginId, chunks) {
    const sheet = document.createElement("style");
    sheet.dataset.plugin = pluginId;
    sheet.textContent = chunks.filter(Boolean).join("\n");
    document.head.appendChild(sheet);
    return () => sheet.remove();
  }

  // src/client/features/brand/index.js
  function registerBrandMark() {
    return () => {
    };
  }

  // src/client/features/brand/styles.css
  var styles_default = "/* Brand marks: official VI artwork standing in for the built-in glyphs. */\n\n.vice-brand-mark {\n  display: block;\n  height: clamp(30px, 2.8vw, 44px);\n  width: auto;\n  max-width: 160px;\n  object-fit: contain;\n  object-position: left center;\n  filter: drop-shadow(0 3px 14px rgba(255, 95, 146, 0.32));\n}\n\n/* ---------- sidebar brand ----------\n   These two seats are already taken by the official brand plugin (a single\n   slot keeps its first registrant), so the swap is done visually: the built-in\n   glyph is hidden and the VI artwork is painted in its place. */\n\nbody[data-vice-enabled='1'] [data-slot='sidebar.brand.mark'] {\n  display: inline-flex;\n  align-items: center;\n}\n\nbody[data-vice-enabled='1'] [data-slot='sidebar.brand.mark'] > * {\n  display: none !important;\n}\n\nbody[data-vice-enabled='1'] [data-slot='sidebar.brand.mark']::after {\n  content: '';\n  display: block;\n  width: 26px;\n  height: 22px;\n  background: var(--vice-logo) left center / contain no-repeat;\n}\n\nbody[data-vice-enabled='1'] [data-slot='sidebar.brand.name'] {\n  display: inline-flex;\n  align-items: center;\n}\n\nbody[data-vice-enabled='1'] [data-slot='sidebar.brand.name'] > * {\n  display: none !important;\n}\n\nbody[data-vice-enabled='1'] [data-slot='sidebar.brand.name']::after {\n  content: 'GRAND THEFT AUTO VI';\n  color: var(--dsw-alias-label-primary);\n  font: 700 11px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.16em;\n  white-space: nowrap;\n}\n\n/* The collapsed rail needs no handling: the harness removes the whole name slot\n   from the DOM at 56px, so the nowrap wordmark never overflows. */\n\nbody[data-vice-enabled='1'] [data-slot='sidebar.brand.mark']::after {\n  flex: 0 0 auto;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .vice-brand-mark {\n    animation: none !important;\n  }\n}\n";

  // src/client/features/conversation/styles.css
  var styles_default2 = "/* Conversation surfaces: markdown body, code blocks, and inline code.\n   Highlights are driven by the shiki CSS variables the renderer already emits. */\n\nbody[data-vice-enabled='1'] {\n  /* Shiki token colors, tuned to the sunset palette. */\n  --shiki-token-keyword: #ff6b9d;\n  --shiki-token-function: #ffc46b;\n  --shiki-token-constant: #6fe3ec;\n  --shiki-token-string: #a6e88f;\n  --shiki-token-string-expression: #a6e88f;\n  --shiki-token-comment: #8b7f9e;\n  --shiki-token-parameter: #ffd9a8;\n  --shiki-token-variable: #f3e6ff;\n  --shiki-token-variable-other: #f3e6ff;\n  --shiki-token-punctuation: #c9bcd8;\n  --shiki-token-operator: #ff9fbf;\n  --shiki-token-builtin: #6fe3ec;\n  --shiki-token-class: #ffc46b;\n  --shiki-token-type: #6fe3ec;\n  --shiki-token-property: #ffd9a8;\n  --shiki-token-number: #ffa07a;\n}\n\n/* ---------- user message ---------- */\n\n/* Only user turns get a bubble, so this is the player's own line: a briefing\n   card with a passing-signal tick on the trailing edge. */\nbody[data-vice-enabled='1'] [data-message-bubble] {\n  position: relative;\n  border: 1px solid rgba(255, 95, 146, 0.16);\n  background:\n    linear-gradient(184deg, rgba(255, 95, 146, 0.07), rgba(95, 224, 234, 0.015) 64%),\n    var(--dsw-alias-bg-layer-1);\n  box-shadow: 0 8px 22px rgba(20, 8, 34, 0.06);\n  transition: border-color 180ms var(--vice-ease), box-shadow 180ms var(--vice-ease);\n}\n\nbody[data-vice-enabled='1'] [data-message-bubble]::after {\n  content: '';\n  position: absolute;\n  inset-block: 9px;\n  inset-inline-end: 0;\n  width: 2px;\n  border-radius: 2px 0 0 2px;\n  background: linear-gradient(180deg, var(--vice-hot), rgba(255, 95, 146, 0));\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n@media (hover: hover) {\n  body[data-vice-enabled='1'] [data-message-bubble]:hover {\n    border-color: rgba(255, 95, 146, 0.3);\n    box-shadow: 0 10px 26px rgba(20, 8, 34, 0.09);\n  }\n\n  body[data-vice-enabled='1'] [data-message-bubble]:hover::after {\n    opacity: 0.9;\n  }\n}\n\n/* ---------- markdown body ---------- */\n\nbody[data-vice-enabled='1'] [data-text-interaction-source] {\n  line-height: 1.68;\n}\n\nbody[data-vice-enabled='1'] [data-text-interaction-source] a {\n  color: var(--dsw-alias-link);\n  text-underline-offset: 3px;\n}\n\nbody[data-vice-enabled='1'] [data-text-interaction-source] blockquote {\n  border-left: 2px solid var(--dsw-alias-border-selected);\n  border-radius: 0 4px 4px 0;\n  background: linear-gradient(90deg, rgba(255, 95, 146, 0.06), transparent 70%);\n  padding-inline-start: 14px;\n}\n\nbody[data-vice-enabled='1'] [data-text-interaction-source] hr {\n  border: 0;\n  height: 1px;\n  background: linear-gradient(90deg,\n    transparent,\n    rgba(255, 95, 146, 0.36),\n    rgba(255, 179, 92, 0.28),\n    transparent);\n}\n\n/* ---------- code blocks ---------- */\n\nbody[data-vice-enabled='1'] pre.shiki {\n  position: relative;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 10px;\n  box-shadow: 0 8px 26px rgba(10, 4, 20, 0.16);\n}\n\n/* A neon hairline along the top edge of every fence. */\nbody[data-vice-enabled='1'] pre.shiki::before {\n  content: '';\n  position: absolute;\n  inset: 0 0 auto;\n  height: 1px;\n  border-radius: 10px 10px 0 0;\n  background: linear-gradient(90deg, transparent, rgba(255, 95, 146, 0.42), transparent);\n  pointer-events: none;\n}\n\nbody[data-vice-enabled='1'] pre.shiki code {\n  font-variant-ligatures: none;\n  tab-size: 2;\n}\n\n/* Line numbers stay quiet so the code itself carries the color. */\nbody[data-vice-enabled='1'] pre.shiki .line-number {\n  color: var(--dsw-alias-label-tertiary);\n  opacity: 0.55;\n}\n\n/* ---------- inline code ---------- */\n\nbody[data-vice-enabled='1'] [data-text-interaction-source] :not(pre) > code {\n  border: 1px solid rgba(255, 95, 146, 0.10);\n  border-radius: 4px;\n  padding: 1px 5px;\n  background: var(--dsw-alias-markdown-inline-code);\n  /* Rose-on-pink read as a smudge; the tint carries the theme and the ink keeps\n     the readable label colour. */\n  color: var(--dsw-alias-label-primary);\n  font-size: 0.94em;\n}\n\n/* ---------- tables ---------- */\n\nbody[data-vice-enabled='1'] [data-text-interaction-source] table {\n  border-collapse: collapse;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 8px;\n  overflow: hidden;\n}\n\nbody[data-vice-enabled='1'] [data-text-interaction-source] th {\n  background: var(--dsw-alias-bg-layer-2);\n  color: var(--dsw-alias-label-primary);\n  font-weight: 600;\n}\n\nbody[data-vice-enabled='1'] [data-text-interaction-source] th,\nbody[data-vice-enabled='1'] [data-text-interaction-source] td {\n  border-color: var(--dsw-alias-border-l1);\n  padding: 7px 12px;\n}\n\nbody[data-vice-enabled='1'] [data-text-interaction-source] tbody tr:nth-child(even) {\n  background: rgba(127, 96, 128, 0.05);\n}\n\n/* ---------- reduced motion ---------- */\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-vice-enabled='1'] pre.shiki,\n  body[data-vice-enabled='1'] [data-text-interaction-source] * {\n    transition: none !important;\n  }\n}\n";

  // src/client/core/art.js
  var GRAIN_URI = (() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
<feColorMatrix type="saturate" values="0"/></filter>
<rect width="160" height="160" filter="url(#g)" opacity="0.5"/></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  })();
  function radarSvg(color) {
    return `<svg viewBox="0 0 120 120" aria-hidden="true">
<circle cx="60" cy="60" r="56" fill="rgba(6,4,12,.55)" stroke="rgba(255,255,255,.22)" stroke-width="1.5"/>
<circle cx="60" cy="60" r="38" fill="none" stroke="rgba(255,255,255,.12)"/>
<circle cx="60" cy="60" r="20" fill="none" stroke="rgba(255,255,255,.09)"/>
<path d="M60 4 V116 M4 60 H116" stroke="rgba(255,255,255,.10)"/>
<path d="M60 60 L104 22 A56 56 0 0 1 112 46 Z" fill="${color}" opacity=".26"/>
<path d="M16 96 L44 74 L62 82 L88 52 L106 60" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" opacity=".85"/>
<path d="M28 18 L48 40 L40 62" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.8" stroke-linejoin="round"/>
<circle cx="60" cy="60" r="3" fill="${color}"/>
</svg>`;
  }

  // src/client/features/intro/index.js
  var SHARD_COUNT = 5;
  var LIFE_MS = 3e3;
  function createIntro({ assets }) {
    let shown = false;
    let element;
    let timer;
    function play() {
      if (shown || document.querySelector(".vice-intro")) return;
      shown = true;
      const shards = Array.from({ length: SHARD_COUNT }, (_, index) => `
      <span class="vice-intro-shard"
        style="--vice-shard-left:${index * 20}%;
               --vice-shard-position:${index * 25}%;
               --vice-shard-delay:${240 + index * 70}ms"></span>`).join("");
      element = document.createElement("div");
      element.className = "vice-intro";
      element.setAttribute("aria-hidden", "true");
      element.style.setProperty("--vice-poster", `url("${assets.poster}")`);
      element.style.setProperty("--vice-grain", `url("${GRAIN_URI}")`);
      element.innerHTML = `
      <div class="vice-intro-stage">
        <div class="vice-intro-shards">${shards}</div>
        <img class="vice-intro-logo" src="${assets.logo}" alt="">
        <div class="vice-intro-flare"></div>
        <div class="vice-intro-grain"></div>
      </div>
      <div class="vice-intro-line"></div>
    `;
      document.body.appendChild(element);
      timer = window.setTimeout(() => {
        element?.remove();
        element = void 0;
        timer = void 0;
      }, LIFE_MS);
    }
    return {
      sync(active) {
        if (active) play();
      },
      dispose() {
        if (timer !== void 0) window.clearTimeout(timer);
        timer = void 0;
        element?.remove();
        element = void 0;
      }
    };
  }

  // src/client/features/intro/styles.css
  var styles_default3 = "/* Launch animation: the poster assembles from five vertical shards, the mark\n   scales in over it, a neon rule draws across, then the whole frame wipes up. */\n\n.vice-intro {\n  position: fixed;\n  z-index: 2147483646;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  overflow: hidden;\n  background: #07050d;\n  pointer-events: none;\n  animation: vice-intro-exit 700ms cubic-bezier(.76, 0, .24, 1) 2300ms both;\n}\n\n.vice-intro-stage {\n  position: relative;\n  width: min(86vw, 920px);\n  aspect-ratio: 16 / 9;\n  overflow: hidden;\n  animation: vice-intro-zoom 3400ms cubic-bezier(.2, .7, .3, 1) both;\n}\n\n/* ---------- shards ---------- */\n\n.vice-intro-shards {\n  position: absolute;\n  inset: 0;\n}\n\n.vice-intro-shard {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: var(--vice-shard-left);\n  width: calc(20% + 1px);\n  background-image: var(--vice-poster);\n  background-position: var(--vice-shard-position) center;\n  background-size: 500% 100%;\n  opacity: 0;\n  animation: vice-shard-in 1150ms cubic-bezier(.16, 1, .3, 1) both;\n  animation-delay: var(--vice-shard-delay);\n  will-change: transform, opacity;\n}\n\n.vice-intro-shard:nth-child(odd) { --vice-shard-y: -52px; }\n.vice-intro-shard:nth-child(even) { --vice-shard-y: 52px; }\n\n/* ---------- mark ---------- */\n\n.vice-intro-logo {\n  position: absolute;\n  z-index: 2;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  filter: drop-shadow(0 18px 44px rgba(240, 102, 179, 0.28));\n  animation: vice-logo-in 1450ms cubic-bezier(.16, 1, .3, 1) 620ms both;\n}\n\n.vice-intro-flare {\n  position: absolute;\n  z-index: 1;\n  inset: -20%;\n  background: radial-gradient(circle at 50% 54%, rgba(255, 122, 160, 0.26), transparent 58%);\n  animation: vice-flare 1900ms ease-in-out both;\n  pointer-events: none;\n}\n\n.vice-intro-grain {\n  position: absolute;\n  z-index: 3;\n  inset: 0;\n  background-image: var(--vice-grain);\n  opacity: 0.18;\n  mix-blend-mode: overlay;\n  pointer-events: none;\n}\n\n/* ---------- rule ---------- */\n\n.vice-intro-line {\n  position: absolute;\n  right: 0;\n  bottom: 9vh;\n  left: 0;\n  height: 2px;\n  background: linear-gradient(90deg, transparent, #ff5f92 42%, #5fe0ea 58%, transparent);\n  transform-origin: left;\n  animation: vice-line-in 1300ms cubic-bezier(.16, 1, .3, 1) 200ms both;\n}\n\n/* ---------- keyframes ---------- */\n\n@keyframes vice-shard-in {\n  from { opacity: 0; transform: translate3d(0, var(--vice-shard-y), 0) scale(1.06); }\n  to { opacity: 1; transform: none; }\n}\n\n@keyframes vice-logo-in {\n  from { opacity: 0; transform: scale(.66); }\n  55% { opacity: 1; }\n  to { opacity: 1; transform: scale(1); }\n}\n\n@keyframes vice-flare {\n  0% { opacity: 0; transform: scale(.6); }\n  45% { opacity: 1; }\n  100% { opacity: .55; transform: scale(1.2); }\n}\n\n@keyframes vice-line-in {\n  from { opacity: 0; transform: scaleX(0); }\n  to { opacity: .85; transform: scaleX(1); }\n}\n\n@keyframes vice-intro-zoom {\n  from { transform: scale(1.03); }\n  to { transform: scale(1); }\n}\n\n@keyframes vice-intro-exit {\n  0% { opacity: 1; clip-path: inset(0); }\n  100% { opacity: 0; clip-path: inset(0 0 100% 0); visibility: hidden; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .vice-intro { display: none; }\n}\n";

  // src/client/features/motion/index.js
  var REVEAL_SELECTOR = [
    "[data-message-id]",
    "[data-turn-id]",
    '[class*="_messageRow"]',
    '[class*="_turnContainer"]',
    '[class*="_conversationTurn"]',
    '[class*="_messageItem"]'
  ].join(",");
  var SCROLL_ROOT_SELECTOR = [
    '[class*="_scrollBody"]',
    '[class*="_scrollArea"]',
    '[class*="_scrollRegion"]'
  ].join(",");
  var SKIP_SELECTOR = '.vice-intro, .vice-panel, nav, [role="navigation"]';
  function createMotion(body) {
    let active = false;
    let cleanup;
    let generation = 0;
    function stop() {
      generation += 1;
      cleanup?.();
      cleanup = void 0;
      active = false;
    }
    function start() {
      if (active) return;
      active = true;
      const current = ++generation;
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("vice-visible");
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
      function mark(element) {
        if (!(element instanceof HTMLElement) || element.classList.contains("vice-reveal") || element.closest(SKIP_SELECTOR)) return;
        requestAnimationFrame(() => {
          if (generation !== current || !element.isConnected || element.offsetHeight < 32 || element.offsetWidth < 180) return;
          element.classList.add("vice-reveal");
          observer.observe(element);
        });
      }
      document.querySelectorAll(REVEAL_SELECTOR).forEach(mark);
      document.querySelectorAll(
        '[class*="_mainPanel"] [class*="_scrollBody"] > *, [class*="_mainPanel"] [class*="_scrollArea"] > *, [class*="_mainPanel"] [class*="_scrollRegion"] > *'
      ).forEach(mark);
      const mutations = new MutationObserver((records) => {
        for (const record of records) {
          for (const added of record.addedNodes) {
            if (!(added instanceof HTMLElement)) continue;
            if (added.matches(REVEAL_SELECTOR)) mark(added);
            added.querySelectorAll(REVEAL_SELECTOR).forEach(mark);
            const scrollRoot = added.closest(SCROLL_ROOT_SELECTOR);
            if (!scrollRoot || !scrollRoot.closest('[class*="_mainPanel"]')) continue;
            let block = added;
            while (block.parentElement && block.parentElement !== scrollRoot) block = block.parentElement;
            mark(block);
          }
        }
      });
      mutations.observe(body, { childList: true, subtree: true });
      cleanup = () => {
        mutations.disconnect();
        observer.disconnect();
        document.querySelectorAll(".vice-reveal").forEach((element) => {
          element.classList.remove("vice-reveal", "vice-visible");
        });
      };
    }
    return {
      sync(next) {
        if (next === active) return;
        if (next) start();
        else stop();
      },
      dispose: stop
    };
  }

  // src/client/features/motion/styles.css
  var styles_default4 = ".vice-reveal {\n  opacity: 0;\n  transform: translateY(8px);\n}\n\n.vice-reveal.vice-visible {\n  opacity: 1;\n  transform: none;\n  transition:\n    opacity 420ms cubic-bezier(.22, .7, .28, 1),\n    transform 420ms cubic-bezier(.22, .7, .28, 1);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .vice-reveal,\n  .vice-reveal.vice-visible {\n    opacity: 1;\n    transform: none;\n    transition: none;\n  }\n}\n";

  // src/client/features/panel/index.js
  function registerVicePanel({ ctx, React, store, assets }) {
    let unregister = () => {
    };
    ctx.inject(["sidebarRightTabs", "sidebarRight"], (child) => {
      const tabs = child.sidebarRightTabs;
      const sidebar = child.sidebarRight;
      const h = React.createElement;
      unregister = tabs.register({
        id: "vice-coast",
        kind: "vice-coast",
        priority: "extension",
        title: () => "Vice City",
        guide: [{
          id: "neon-coast",
          order: 10,
          title: () => "Vice City",
          description: () => "Leonida, neon nights, and your next move.",
          icon: () => h("img", { src: assets.logo, alt: "", className: "vice-guide-icon" })
        }]
      });
      function Panel() {
        const [, refresh] = React.useReducer((value) => value + 1, 0);
        React.useEffect(() => store.subscribe(refresh), [store]);
        if (store.getState().values.enabled !== "1") return null;
        return h(
          "div",
          { className: "vice-panel" },
          h(
            "div",
            { className: "vice-panel-top" },
            h("span", null, "GRAND THEFT AUTO VI"),
            h("button", {
              type: "button",
              className: "vice-panel-back",
              onClick: () => sidebar.openTab("guide", { replaceTab: true })
            }, "工具 / LEONIDA")
          ),
          h(
            "div",
            { className: "vice-panel-heading" },
            h(
              "div",
              null,
              h("p", null, "WELCOME TO"),
              h("h1", null, "Vice City")
            ),
            h(
              "div",
              { className: "vice-wanted-panel", "aria-label": "Wanted level decoration" },
              h("span", null, "WANTED"),
              h("b", null, "★★★★★★")
            )
          ),
          h(
            "div",
            { className: "vice-panel-card" },
            h("img", { src: assets.postcard, alt: "Vice City postcard artwork" }),
            h("div", { className: "vice-panel-card-shade" }),
            h("span", null, "VISIT LEONIDA")
          ),
          h(
            "div",
            { className: "vice-panel-meter" },
            h("div", { className: "vice-panel-radar", dangerouslySetInnerHTML: { __html: radarSvg("#ff5f92") } }),
            h(
              "div",
              { className: "vice-panel-radio" },
              h("span", null, "RADIO"),
              h("strong", null, "98.6 FM · NON STOP POP")
            ),
            h(
              "div",
              { className: "vice-panel-speed", "aria-hidden": true },
              h("span", { className: "vice-panel-speed-needle" }),
              h("b", null, "186"),
              h("i", null, "MPH")
            )
          ),
          h("div", { className: "vice-checker", "aria-hidden": true }),
          h(
            "div",
            { className: "vice-panel-strip" },
            h(
              "figure",
              null,
              h("img", { src: assets.cheetah, alt: "Grotti Cheetah in Vice City" }),
              h("figcaption", null, "GROTTI CHEETAH")
            ),
            h(
              "figure",
              null,
              h("img", { src: assets.beachNight, alt: "Vice Beach at night" }),
              h("figcaption", null, "VICE BEACH · 917")
            )
          ),
          h(
            "div",
            { className: "vice-panel-crime" },
            h("span", { className: "vice-panel-siren" }),
            h(
              "div",
              null,
              h("b", null, "VCPD"),
              h("i", null, "HEAT · LEVEL 6")
            )
          ),
          h(
            "div",
            { className: "vice-panel-footer" },
            h("img", { src: assets.logo, alt: "Grand Theft Auto VI", className: "vice-panel-logo" }),
            h("span", null, "AWAIT YOUR NEXT MOVE")
          )
        );
      }
      child.slots.inject("sidebar.right.pane.tab", function* () {
        yield child.slots.register({
          name: "sidebar.right.pane.tab",
          key: "vice-coast",
          order: 10
        }, Panel);
      });
    });
    return () => unregister();
  }

  // src/client/features/panel/styles.css
  var styles_default5 = "/* Right-sidebar panel: official artwork, radar, radio strip, wanted stars. */\n\n.vice-panel {\n  container-type: inline-size;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  min-height: 100%;\n  padding: 18px;\n  overflow: auto;\n  color: var(--dsw-alias-label-primary);\n  background:\n    linear-gradient(180deg, rgba(255, 95, 146, 0.06), transparent 38%),\n    var(--dsw-alias-bg-base);\n}\n\n.vice-panel-top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  color: var(--dsw-alias-label-tertiary);\n  font: 600 8px/1.4 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.16em;\n}\n\n.vice-panel-back {\n  padding: 6px 9px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 4px;\n  color: var(--dsw-alias-label-secondary);\n  background: transparent;\n  font: inherit;\n  letter-spacing: 0.14em;\n  cursor: pointer;\n  transition: color 160ms ease, border-color 160ms ease;\n}\n\n.vice-panel-back:hover,\n.vice-panel-back:focus-visible {\n  color: var(--vice-rose);\n  border-color: var(--dsw-alias-border-selected);\n  outline: none;\n}\n\n.vice-panel-heading {\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 14px;\n  margin: 6px 0 2px;\n}\n\n.vice-panel-heading p {\n  margin: 0 0 6px;\n  color: var(--vice-rose);\n  font: 600 9px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.3em;\n}\n\n.vice-panel-heading h1 {\n  margin: 0;\n  color: var(--dsw-alias-label-primary);\n  font: 700 40px/0.95 Georgia, 'Times New Roman', serif;\n  letter-spacing: -0.055em;\n}\n\n.vice-wanted-panel {\n  display: grid;\n  justify-items: end;\n  gap: 7px;\n  color: var(--vice-gold);\n}\n\n.vice-wanted-panel span {\n  font: 600 8px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.16em;\n  opacity: 0.8;\n}\n\n.vice-wanted-panel b {\n  font: 14px/1 Georgia, serif;\n  letter-spacing: 3px;\n  filter: drop-shadow(0 0 8px rgba(255, 179, 92, 0.5));\n}\n\n/* ---------- hero card ---------- */\n\n.vice-panel-card {\n  position: relative;\n  overflow: hidden;\n  aspect-ratio: 1.7;\n  border: 1px solid rgba(255, 95, 146, 0.24);\n  border-radius: 10px;\n  background: #160e26;\n  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.3);\n}\n\n.vice-panel-card img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: center 40%;\n}\n\n.vice-panel-card-shade {\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(180deg, transparent 40%, rgba(10, 5, 20, 0.88) 100%);\n}\n\n.vice-panel-card > span {\n  position: absolute;\n  right: 16px;\n  bottom: 13px;\n  color: #ffe4bf;\n  font: 700 13px/1 Georgia, serif;\n  letter-spacing: 0.16em;\n  text-shadow: 0 2px 12px #301629;\n}\n\n/* ---------- radar + radio ---------- */\n\n.vice-panel-meter {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 10px 12px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.vice-panel-radar {\n  flex: 0 0 auto;\n  width: 56px;\n  aspect-ratio: 1;\n}\n\n.vice-panel-radar svg { display: block; width: 100%; height: 100%; }\n\n.vice-panel-radio {\n  display: grid;\n  gap: 5px;\n  min-width: 0;\n}\n\n.vice-panel-radio span {\n  color: var(--dsw-alias-label-tertiary);\n  font: 600 8px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.22em;\n}\n\n.vice-panel-radio strong {\n  overflow: hidden;\n  color: var(--vice-rose);\n  font: 600 10px/1.3 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.08em;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* ---------- speedometer ---------- */\n\n.vice-panel-speed {\n  position: relative;\n  flex: 0 0 auto;\n  display: grid;\n  justify-items: center;\n  align-content: center;\n  width: 58px;\n  aspect-ratio: 1;\n  border: 1px solid rgba(255, 179, 92, 0.28);\n  border-radius: 50%;\n  background:\n    radial-gradient(circle at 50% 62%, rgba(255, 179, 92, 0.12), transparent 62%),\n    rgba(10, 5, 20, 0.4);\n}\n\n.vice-panel-speed b {\n  color: var(--vice-gold);\n  font: 700 15px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.02em;\n}\n\n.vice-panel-speed i {\n  margin-top: 2px;\n  color: var(--dsw-alias-label-tertiary);\n  font: 600 6px/1 ui-sans-serif, system-ui, sans-serif;\n  font-style: normal;\n  letter-spacing: 0.16em;\n}\n\n/* The needle swings when the agent is working, like a revving engine. */\n.vice-panel-speed-needle {\n  position: absolute;\n  bottom: 50%;\n  left: 50%;\n  width: 1px;\n  height: 21px;\n  background: linear-gradient(0deg, var(--vice-hot), transparent);\n  transform-origin: bottom center;\n  transform: rotate(-118deg);\n  transition: transform 420ms cubic-bezier(.22, .7, .28, 1);\n}\n\nbody[data-vice-wanted] .vice-panel-speed-needle {\n  animation: vice-speed-rev 900ms ease-in-out infinite alternate;\n}\n\n@keyframes vice-speed-rev {\n  from { transform: rotate(-118deg); }\n  to { transform: rotate(96deg); }\n}\n\n/* ---------- checkered divider ---------- */\n\n.vice-checker {\n  height: 8px;\n  border-radius: 2px;\n  background-image:\n    repeating-conic-gradient(\n      rgba(255, 255, 255, 0.26) 0% 25%,\n      transparent 0% 50%\n    );\n  background-size: 16px 16px;\n  opacity: 0.5;\n}\n\n/* ---------- crime / VCPD ---------- */\n\n.vice-panel-crime {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 9px 12px;\n  border: 1px solid rgba(255, 95, 146, 0.18);\n  border-radius: 10px;\n  background: linear-gradient(90deg, rgba(255, 95, 146, 0.08), transparent 70%);\n}\n\n.vice-panel-siren {\n  position: relative;\n  flex: 0 0 auto;\n  width: 30px;\n  height: 12px;\n  border-radius: 3px;\n  background: linear-gradient(90deg, #d63447 0 50%, #2f6fd6 50% 100%);\n  opacity: 0.45;\n  transition: opacity 220ms ease;\n}\n\nbody[data-vice-wanted] .vice-panel-siren {\n  opacity: 1;\n  animation: vice-siren 700ms steps(1, end) infinite;\n}\n\n@keyframes vice-siren {\n  0%, 49% { filter: brightness(1.35) drop-shadow(0 0 10px #d63447); }\n  50%, 100% { filter: brightness(1.35) drop-shadow(0 0 10px #2f6fd6); }\n}\n\n.vice-panel-crime div {\n  display: grid;\n  gap: 4px;\n  min-width: 0;\n}\n\n.vice-panel-crime b {\n  color: var(--dsw-alias-label-primary);\n  font: 700 10px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.2em;\n}\n\n.vice-panel-crime i {\n  color: var(--dsw-alias-label-tertiary);\n  font: 600 8px/1 ui-sans-serif, system-ui, sans-serif;\n  font-style: normal;\n  letter-spacing: 0.14em;\n}\n\nbody[data-vice-wanted] .vice-panel-crime i {\n  color: #ff8a8a;\n}\n\n/* ---------- image strip ---------- */\n\n.vice-panel-strip {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n\n.vice-panel-strip figure {\n  position: relative;\n  margin: 0;\n  overflow: hidden;\n  aspect-ratio: 1.5;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 9px;\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.vice-panel-strip img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  opacity: 0.9;\n}\n\n.vice-panel-strip figcaption {\n  position: absolute;\n  inset: auto 0 0;\n  padding: 16px 9px 8px;\n  color: #ffe2c0;\n  background: linear-gradient(transparent, rgba(10, 5, 20, 0.88));\n  font: 600 8px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.14em;\n}\n\n/* ---------- footer ---------- */\n\n.vice-panel-footer {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 6px 0 12px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.vice-panel-logo {\n  width: 46px;\n  height: 46px;\n  object-fit: contain;\n}\n\n.vice-panel-footer span {\n  font: 600 8px/1.5 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.16em;\n  text-align: center;\n}\n\n.vice-guide-icon {\n  display: inline-flex;\n  width: 24px;\n  height: 24px;\n  object-fit: contain;\n}\n\n@container (max-width: 340px) {\n  .vice-panel-heading { align-items: flex-start; flex-direction: column; gap: 12px; }\n  .vice-wanted-panel { justify-items: start; }\n  .vice-panel-heading h1 { font-size: 34px; }\n  .vice-panel-strip { grid-template-columns: 1fr; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .vice-panel * { animation: none !important; }\n}\n";

  // src/client/features/pet/index.js
  var STORAGE_KEY = "dsh-theme-vice:pet";
  var SLEEP_AFTER_MS = 45e3;
  var DONE_MS = 1300;
  var BUBBLE_MS = 3600;
  var DRAG_THRESHOLD = 5;
  var SNAP_MARGIN = 30;
  var EDGE = 26;
  var POSE_TURN_MS = 26e3;
  var LINES = [
    { who: "JASON", line: "车没熄火，走。" },
    { who: "JASON", line: "我数到三，一起动手。" },
    { who: "JASON", line: "别急，先看清楚。" },
    { who: "LUCIA", line: "这次换我开车。" },
    { who: "LUCIA", line: "天快亮了，动作快点。" },
    { who: "LUCIA", line: "Ocean Beach，老地方见。" }
  ];
  function createPet({ body, assets, signal }) {
    let host;
    let stage;
    let layers = [];
    let bubble;
    let unsubscribe = () => {
    };
    let bubbleTimer;
    let sleepTimer;
    let doneTimer;
    let poseTimer;
    let running = false;
    let state = "idle";
    let pose = 0;
    let position = readPosition();
    let drag = null;
    let lastLine = -1;
    function readPosition() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!Number.isFinite(parsed?.x) || !Number.isFinite(parsed?.y)) return null;
        return { x: parsed.x, y: parsed.y };
      } catch {
        return null;
      }
    }
    function savePosition(next) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
      }
    }
    function clampPosition(x, y) {
      const width = host.offsetWidth || 160;
      const height = host.offsetHeight || 170;
      return {
        x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - width)),
        y: Math.min(Math.max(0, y), Math.max(0, window.innerHeight - height))
      };
    }
    function snapPosition(next) {
      const width = host.offsetWidth || 160;
      const height = host.offsetHeight || 170;
      const rightEdge = window.innerWidth - width - EDGE;
      const bottomEdge = window.innerHeight - height - EDGE;
      const snapped = { ...next };
      if (Math.abs(next.x - EDGE) < SNAP_MARGIN) snapped.x = EDGE;
      else if (Math.abs(next.x - rightEdge) < SNAP_MARGIN) snapped.x = rightEdge;
      if (Math.abs(next.y - EDGE) < SNAP_MARGIN) snapped.y = EDGE;
      else if (Math.abs(next.y - bottomEdge) < SNAP_MARGIN) snapped.y = bottomEdge;
      return snapped;
    }
    function applyPosition() {
      if (!position) return;
      position = clampPosition(position.x, position.y);
      host.style.left = `${position.x}px`;
      host.style.top = `${position.y}px`;
      host.style.right = "auto";
      host.style.bottom = "auto";
    }
    function showPose(index) {
      if (index === pose || layers.length < 2) return;
      pose = index;
      layers.forEach((layer, i) => layer.classList.toggle("is-active", i === index));
    }
    function setState(next) {
      if (next === state || !host) return;
      state = next;
      host.dataset.state = next;
      window.clearTimeout(doneTimer);
      if (next === "done") doneTimer = window.setTimeout(() => setState(running ? "working" : "idle"), DONE_MS);
      if (next === "working") showPose(1);
      else if (next === "done") showPose(0);
    }
    function armSleep() {
      window.clearTimeout(sleepTimer);
      sleepTimer = window.setTimeout(() => {
        if (!running) setState("sleep");
      }, SLEEP_AFTER_MS);
    }
    function armPoseTurn() {
      window.clearTimeout(poseTimer);
      poseTimer = window.setTimeout(() => {
        if (state === "idle") showPose(pose === 0 ? 1 : 0);
        armPoseTurn();
      }, POSE_TURN_MS);
    }
    function applyRunning(next) {
      if (next === running) return;
      running = next;
      if (running) {
        window.clearTimeout(sleepTimer);
        setState("working");
      } else {
        setState("done");
        armSleep();
      }
    }
    function say() {
      if (!bubble) return;
      let index = Math.floor(Math.random() * LINES.length);
      if (LINES.length > 1 && index === lastLine) index = (index + 1) % LINES.length;
      lastLine = index;
      const { who, line } = LINES[index];
      const name = document.createElement("b");
      name.className = "vice-pet-who";
      name.textContent = who;
      const text = document.createElement("span");
      text.textContent = line;
      bubble.replaceChildren(name, text);
      bubble.dataset.who = who.toLowerCase();
      bubble.hidden = false;
      window.clearTimeout(bubbleTimer);
      bubbleTimer = window.setTimeout(() => {
        if (bubble) bubble.hidden = true;
      }, BUBBLE_MS);
    }
    function onPointerDown(event) {
      if (event.button !== 0) return;
      const rect = host.getBoundingClientRect();
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: rect.left,
        originY: rect.top,
        moved: false
      };
      host.setPointerCapture?.(event.pointerId);
      host.classList.add("is-dragging");
      window.clearTimeout(sleepTimer);
      if (state === "sleep") setState("idle");
      event.preventDefault();
    }
    function onPointerMove(event) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) drag.moved = true;
      if (!drag.moved) return;
      position = clampPosition(drag.originX + dx, drag.originY + dy);
      applyPosition();
    }
    function onPointerUp(event) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      host.releasePointerCapture?.(event.pointerId);
      host.classList.remove("is-dragging");
      const moved = drag.moved;
      drag = null;
      if (moved) {
        if (position) {
          position = snapPosition(position);
          applyPosition();
          savePosition(position);
        }
        armSleep();
      } else {
        say();
      }
    }
    function onResize() {
      if (!position) return;
      const clamped = clampPosition(position.x, position.y);
      if (clamped.x === position.x && clamped.y === position.y) return;
      position = clamped;
      applyPosition();
      savePosition(position);
    }
    function onClick(event) {
      if (drag) return;
      event.preventDefault();
    }
    function mount() {
      if (host) return;
      host = document.createElement("div");
      host.className = "vice-pet";
      host.setAttribute("role", "img");
      host.setAttribute("aria-label", "Jason 与 Lucia");
      bubble = document.createElement("div");
      bubble.className = "vice-pet-bubble";
      bubble.hidden = true;
      stage = document.createElement("div");
      stage.className = "vice-pet-stage";
      layers = [assets.pet, assets.petAlt].filter(Boolean).map((src, index) => {
        const layer = document.createElement("img");
        layer.className = "vice-pet-layer";
        layer.src = src;
        layer.alt = "";
        layer.draggable = false;
        if (index === 0) layer.classList.add("is-active");
        stage.appendChild(layer);
        return layer;
      });
      host.append(bubble, stage);
      body.appendChild(host);
      applyPosition();
      host.addEventListener("pointerdown", onPointerDown);
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerup", onPointerUp);
      host.addEventListener("pointercancel", onPointerUp);
      host.addEventListener("click", onClick);
      window.addEventListener("resize", onResize);
      running = signal.get();
      unsubscribe = signal.subscribe(applyRunning);
      state = running ? "working" : "idle";
      pose = 0;
      host.dataset.state = state;
      if (running) showPose(1);
      else armSleep();
      armPoseTurn();
    }
    function unmount() {
      unsubscribe();
      unsubscribe = () => {
      };
      window.clearTimeout(bubbleTimer);
      window.clearTimeout(sleepTimer);
      window.clearTimeout(doneTimer);
      window.clearTimeout(poseTimer);
      if (!host) return;
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      host.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      host.remove();
      host = void 0;
      stage = void 0;
      layers = [];
      bubble = void 0;
      drag = null;
      running = false;
      state = "idle";
      pose = 0;
    }
    return {
      sync(values) {
        const visible = values.enabled === "1" && values.pet === "1";
        if (visible) mount();
        else unmount();
      },
      dispose() {
        unmount();
      }
    };
  }

  // src/client/features/pet/styles.css
  var styles_default6 = "/* Desktop pet: Jason and Lucia in a fixed layer over the conversation.\n   The art is two cut-out stills, so the animation is transform-only: it stays\n   crisp at any size and costs nothing beyond the two PNGs.\n\n   The box is a fixed size and each pose is anchored to its bottom-right corner,\n   because the two poses have very different aspect ratios — a landscape lean\n   and a portrait car shot — and letting them size the box would make the\n   corner jump every time the pose turns over. */\n\n.vice-pet {\n  position: fixed;\n  z-index: 60;\n  right: 26px;\n  bottom: 124px;\n  width: 220px;\n  height: clamp(124px, 9.6vw, 164px);\n  cursor: grab;\n  touch-action: none;\n  user-select: none;\n  -webkit-user-select: none;\n  transition: opacity 260ms var(--vice-ease);\n}\n\n/* A soft pad under the pair: their feet are cropped out of the source, so\n   without it they read as pasted on the glass rather than standing there. */\n.vice-pet::after {\n  content: '';\n  position: absolute;\n  left: 12%;\n  right: 12%;\n  bottom: -7px;\n  height: 13px;\n  border-radius: 50%;\n  background: radial-gradient(ellipse at center, rgba(8, 3, 16, 0.46), transparent 72%);\n  filter: blur(3px);\n  pointer-events: none;\n}\n\n.vice-pet-stage {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n\n.vice-pet-layer {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  max-width: 100%;\n  max-height: 100%;\n  width: auto;\n  height: auto;\n  pointer-events: none;\n  opacity: 0;\n  transform-origin: 50% 100%;\n  /* The first shadow is a rose halo tracing the silhouette, so the cut-out\n     picks up the theme's neon instead of sitting on the shell as a pasted\n     photo. The second is the ordinary ambient drop. */\n  filter:\n    drop-shadow(0 0 7px rgba(255, 95, 146, 0.34))\n    drop-shadow(0 10px 24px rgba(10, 4, 20, 0.42));\n  transition: opacity 420ms var(--vice-ease);\n}\n\n.vice-pet-layer.is-active {\n  opacity: 1;\n  animation: vice-pet-idle 5.2s ease-in-out infinite;\n}\n\n.vice-pet.is-dragging {\n  cursor: grabbing;\n}\n\n.vice-pet.is-dragging .vice-pet-layer.is-active {\n  animation: none;\n  transform: rotate(-1.5deg) scale(0.98);\n  filter:\n    drop-shadow(0 0 9px rgba(255, 95, 146, 0.4))\n    drop-shadow(0 16px 32px rgba(10, 4, 20, 0.55));\n}\n\n/* ---------- states ---------- */\n\n.vice-pet[data-state='working'] .vice-pet-layer.is-active {\n  animation: vice-pet-work 720ms ease-in-out infinite;\n}\n\n.vice-pet[data-state='done'] .vice-pet-layer.is-active {\n  animation: vice-pet-hop 720ms cubic-bezier(.3, .7, .35, 1) 2;\n}\n\n.vice-pet[data-state='sleep'] {\n  opacity: 0.62;\n}\n\n.vice-pet[data-state='sleep'] .vice-pet-layer.is-active {\n  animation: vice-pet-sleep 7s ease-in-out infinite;\n}\n\n/* Hover: they look up at you. The idle animation is paused first, or it would\n   keep overwriting the transform. */\n@media (hover: hover) {\n  .vice-pet:hover .vice-pet-layer.is-active {\n    animation: none;\n    transform: translateY(-4px) scale(1.04);\n    filter:\n      drop-shadow(0 0 10px rgba(255, 95, 146, 0.44))\n      drop-shadow(0 14px 28px rgba(10, 4, 20, 0.5));\n  }\n}\n\n@keyframes vice-pet-idle {\n  0%, 100% { transform: translateY(0) rotate(-0.8deg); }\n  50% { transform: translateY(-3px) rotate(0.8deg); }\n}\n\n@keyframes vice-pet-work {\n  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }\n  50% { transform: translateY(-7px) rotate(-1.6deg) scale(1.02); }\n}\n\n@keyframes vice-pet-hop {\n  0% { transform: translateY(0) scale(1); }\n  32% { transform: translateY(-14px) scale(1.03); }\n  62% { transform: translateY(0) scale(0.98); }\n  80% { transform: translateY(-4px) scale(1.01); }\n  100% { transform: translateY(0) scale(1); }\n}\n\n@keyframes vice-pet-sleep {\n  0%, 100% { transform: translateY(0) rotate(2.4deg); }\n  50% { transform: translateY(2px) rotate(3.2deg); }\n}\n\n/* ---------- speech ---------- */\n\n.vice-pet-bubble {\n  position: absolute;\n  right: 0;\n  bottom: calc(100% + 10px);\n  display: grid;\n  gap: 3px;\n  max-width: 210px;\n  padding: 8px 12px 9px;\n  border: 1px solid rgba(255, 95, 146, 0.3);\n  border-radius: 10px 10px 3px 10px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-layer-1);\n  box-shadow: 0 10px 24px rgba(10, 4, 20, 0.28);\n  font: 500 11px/1.45 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.01em;\n  white-space: nowrap;\n  pointer-events: none;\n  animation: vice-pet-bubble-in 180ms var(--vice-ease);\n}\n\n/* The tail points down at the pair, so it is clear who is talking. */\n.vice-pet-bubble::after {\n  content: '';\n  position: absolute;\n  right: 16px;\n  bottom: -5px;\n  width: 9px;\n  height: 9px;\n  background: var(--dsw-alias-bg-layer-1);\n  border-right: 1px solid rgba(255, 95, 146, 0.3);\n  border-bottom: 1px solid rgba(255, 95, 146, 0.3);\n  transform: rotate(45deg);\n}\n\n.vice-pet-who {\n  color: var(--vice-hot);\n  font: 700 8px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.2em;\n}\n\n.vice-pet-bubble[data-who='lucia'] .vice-pet-who {\n  color: var(--vice-gold);\n}\n\n.vice-pet-bubble[hidden] {\n  display: none;\n}\n\n@keyframes vice-pet-bubble-in {\n  from { opacity: 0; transform: translateY(4px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n/* The cut-out is a dark, high-contrast render. On the light shell it sat like a\n   smudge, so it gets a lift and a warmer pad to hold its own. */\n@media (prefers-color-scheme: light) {\n  .vice-pet-layer {\n    filter:\n      drop-shadow(0 0 6px rgba(255, 95, 146, 0.22))\n      drop-shadow(0 10px 22px rgba(44, 14, 44, 0.32))\n      brightness(1.06) saturate(1.04);\n  }\n\n  .vice-pet::after {\n    background: radial-gradient(ellipse at center, rgba(54, 18, 54, 0.26), transparent 72%);\n  }\n}\n\n/* ---------- motion preference ---------- */\n\n@media (prefers-reduced-motion: reduce) {\n  .vice-pet-layer.is-active,\n  .vice-pet[data-state='working'] .vice-pet-layer.is-active,\n  .vice-pet[data-state='done'] .vice-pet-layer.is-active,\n  .vice-pet[data-state='sleep'] .vice-pet-layer.is-active,\n  .vice-pet:hover .vice-pet-layer.is-active {\n    animation: none;\n    transform: none;\n  }\n\n  .vice-pet-bubble {\n    animation: none;\n  }\n}\n\n@media (max-width: 720px) {\n  .vice-pet {\n    width: 160px;\n    height: 96px;\n    right: 14px;\n    bottom: 112px;\n  }\n}\n";

  // src/client/features/scene/art.js
  function sceneArtHtml(assets) {
    return `
    <img class="vice-shot" src="${assets.rooftop}" alt="">
    <div class="vice-shade"></div>
    <div class="vice-wanted">
      <span>WANTED</span>
      <b>★★★★★★</b>
    </div>
    <div class="vice-radar">${radarSvg("#ff5f92")}</div>
    <div class="vice-caption">
      <strong>Vice City</strong>
      <span>LEONIDA · 1986<i>★ ★ ★ ★ ★</i></span>
    </div>
  `;
  }

  // src/client/features/scene/index.js
  var HERO_SELECTOR = '[class*="_composerHero"]';
  function createScene({ body, assets }) {
    let scene;
    let observer;
    let scheduled = 0;
    let enabled = false;
    function remove() {
      scene?.remove();
      scene = void 0;
    }
    function mount(hero) {
      if (scene && scene.parentElement === hero) return;
      remove();
      scene = document.createElement("div");
      scene.className = "vice-scene";
      scene.setAttribute("aria-hidden", "true");
      scene.innerHTML = `
      <div class="vice-eyebrow"><i></i> GRAND THEFT AUTO VI <span>LEONIDA · 2026</span></div>
      <div class="vice-frame">${sceneArtHtml(assets)}</div>
      <div class="vice-scene-footer"><span>WELCOME TO</span><strong>VICE CITY</strong><i></i></div>
    `;
      hero.appendChild(scene);
    }
    function sync() {
      if (!enabled) {
        remove();
        return;
      }
      const hero = document.querySelector(HERO_SELECTOR);
      if (!hero) {
        remove();
        return;
      }
      mount(hero);
    }
    function schedule() {
      if (scheduled) return;
      scheduled = requestAnimationFrame(() => {
        scheduled = 0;
        sync();
      });
    }
    return {
      sync(values) {
        enabled = values.enabled === "1" && values.background === "1";
        body.classList.toggle("vice-art-enabled", enabled);
        schedule();
      },
      start() {
        observer = new MutationObserver(schedule);
        observer.observe(body, { childList: true, subtree: true });
        window.addEventListener("resize", schedule);
      },
      dispose() {
        observer?.disconnect();
        observer = void 0;
        cancelAnimationFrame(scheduled);
        scheduled = 0;
        window.removeEventListener("resize", schedule);
        body.classList.remove("vice-art-enabled");
        remove();
      }
    };
  }

  // src/client/features/scene/styles.css
  var styles_default7 = "/* Empty-state postcard built from official artwork plus GTA-style UI motifs. */\n\nbody.vice-art-enabled [class*='_composerHero'] {\n  display: grid;\n  grid-template-columns: minmax(300px, 1.1fr) minmax(300px, 0.9fr);\n  align-content: center;\n  column-gap: clamp(28px, 4.5vw, 76px);\n  width: min(1180px, calc(100% - 88px));\n  max-width: none;\n  min-height: 100%;\n  padding: 68px 0 50px;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] > [class*='_root']:has([class*='_headline']) {\n  grid-column: 1;\n  grid-row: 1;\n  margin-bottom: 32px;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] [class*='_headline'] {\n  position: relative;\n  justify-content: flex-start;\n  gap: 14px;\n  color: var(--dsw-alias-label-primary);\n  font-size: clamp(28px, 2.4vw, 40px);\n  font-weight: 550;\n  letter-spacing: -0.045em;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] [class*='_headline']::before {\n  content: 'SUNSET VIBES · OPEN LATE';\n  position: absolute;\n  bottom: calc(100% + 20px);\n  left: 1px;\n  color: var(--vice-rose);\n  font: 600 10px/1.2 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.32em;\n}\n\n/* ---------- headline banner ----------\n   The hero headline is a locale string, not a slot, so it is replaced visually.\n   What takes its place is not recreated type: it is the official key art itself,\n   cropped to a wide band so the real wordmark and the cast read at size.\n   Disabling the theme removes this sheet and the original copy returns. */\n\nbody[data-vice-enabled='1'] [class*='_headline'] {\n  display: block;\n  width: 100%;\n}\n\nbody[data-vice-enabled='1'] [class*='_headline'] [class*='_fishHitbox'] {\n  display: none;\n}\n\nbody[data-vice-enabled='1'] [class*='_titleGroup'] {\n  display: block;\n  position: relative;\n  width: min(100%, 640px);\n}\n\nbody[data-vice-enabled='1'] [class*='_titleGroup'] > span:first-child {\n  display: block;\n  font-size: 0;\n  letter-spacing: 0;\n}\n\n/* The band: official key art, cropped so the wordmark reads whole. */\nbody[data-vice-enabled='1'] [class*='_titleGroup'] > span:first-child::after {\n  content: '';\n  display: block;\n  aspect-ratio: 2 / 1;\n  border: 1px solid rgba(255, 95, 146, 0.22);\n  border-radius: 10px;\n  background: var(--vice-poster) center center / cover no-repeat;\n  box-shadow:\n    0 18px 48px rgba(0, 0, 0, 0.3),\n    0 0 0 1px rgba(255, 179, 92, 0.05) inset;\n}\n\n/* The badge has no place over the artwork; its copy is suppressed entirely. */\nbody[data-vice-enabled='1'] [class*='_previewBadge'] {\n  display: none;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] [class*='_heroWorkspaceRow'] {\n  grid-column: 1;\n  grid-row: 2;\n  min-width: 0;\n  margin-bottom: 14px;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] > [data-slot='conversation.composer.bar'] {\n  grid-column: 1;\n  grid-row: 3;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] [data-composer-card='true'] {\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 16px;\n  background: var(--dsw-alias-bg-layer-1);\n  box-shadow: 0 18px 52px rgba(10, 4, 20, 0.24);\n}\n\nbody.vice-art-enabled [class*='_composerHero'] [data-composer-input='true'],\nbody.vice-art-enabled [class*='_composerHero'] [data-composer-placeholder='true'] {\n  color: var(--dsw-alias-label-primary-dimmed);\n}\n\n/* ---------- the postcard ---------- */\n\n.vice-scene {\n  grid-column: 2;\n  grid-row: 1 / 4;\n  display: flex;\n  flex-direction: column;\n  align-self: center;\n  min-width: 0;\n  pointer-events: none;\n  animation: vice-scene-in 900ms var(--vice-ease) both;\n}\n\n.vice-eyebrow {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 14px;\n  color: var(--vice-rose);\n  font: 600 9px/1.2 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.24em;\n}\n\n.vice-eyebrow i {\n  width: 5px;\n  height: 5px;\n  background: var(--vice-hot);\n  box-shadow: 0 0 10px var(--vice-hot);\n  transform: rotate(45deg);\n}\n\n.vice-eyebrow span {\n  margin-left: auto;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 8px;\n  letter-spacing: 0.1em;\n}\n\n.vice-frame {\n  position: relative;\n  overflow: hidden;\n  aspect-ratio: 3 / 4;\n  max-height: clamp(310px, 52vh, 570px);\n  border: 1px solid rgba(255, 95, 146, 0.26);\n  border-radius: 8px;\n  background: #160e26;\n  box-shadow:\n    0 26px 70px rgba(0, 0, 0, 0.34),\n    0 0 0 1px rgba(255, 179, 92, 0.06) inset;\n  isolation: isolate;\n}\n\n.vice-shot {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: 28% 40%;\n  filter: brightness(calc(0.62 + var(--vice-opacity, 0.72) * 0.38)) saturate(0.92);\n}\n\n.vice-shade {\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(180deg, rgba(10, 5, 20, 0.45) 0%, transparent 34%, rgba(10, 5, 20, 0.88) 100%),\n    linear-gradient(90deg, rgba(10, 5, 20, 0.5), transparent 42%);\n  backdrop-filter: blur(var(--vice-blur, 0px));\n  pointer-events: none;\n}\n\n/* ---------- wanted level ---------- */\n\n.vice-wanted {\n  position: absolute;\n  z-index: 2;\n  top: 14px;\n  right: 16px;\n  display: grid;\n  justify-items: end;\n  gap: 6px;\n  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);\n}\n\n.vice-wanted span {\n  color: rgba(255, 224, 224, 0.82);\n  font: 700 8px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.2em;\n}\n\n.vice-wanted b {\n  color: var(--vice-gold);\n  font: 15px/1 Georgia, serif;\n  letter-spacing: 3px;\n  filter: drop-shadow(0 0 8px rgba(255, 179, 92, 0.55));\n}\n\n/* ---------- radar ---------- */\n\n.vice-radar {\n  position: absolute;\n  z-index: 2;\n  top: 14px;\n  left: 14px;\n  width: clamp(58px, 7vw, 84px);\n  aspect-ratio: 1;\n  opacity: 0.92;\n  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.5));\n}\n\n.vice-radar svg { display: block; width: 100%; height: 100%; }\n\n/* ---------- caption ---------- */\n\n.vice-caption {\n  position: absolute;\n  z-index: 2;\n  inset: auto 20px 20px;\n}\n\n.vice-caption strong {\n  display: block;\n  color: #fff2e7;\n  font: 500 clamp(20px, 1.8vw, 28px)/1.15 Georgia, 'Times New Roman', serif;\n  letter-spacing: 0.02em;\n  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.65);\n}\n\n.vice-caption span {\n  display: flex;\n  justify-content: space-between;\n  gap: 8px;\n  margin-top: 9px;\n  color: rgba(255, 205, 205, 0.78);\n  font: 600 8px/1.2 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.16em;\n}\n\n.vice-caption i {\n  color: var(--vice-gold);\n  font-style: normal;\n  letter-spacing: 2px;\n  opacity: 0.75;\n}\n\n.vice-scene-footer {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  margin-top: 15px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.vice-scene-footer span {\n  font: 600 8px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.18em;\n}\n\n.vice-scene-footer strong {\n  color: var(--vice-rose);\n  font: 500 12px/1 Georgia, 'Times New Roman', serif;\n  letter-spacing: 0.09em;\n}\n\n.vice-scene-footer i {\n  flex: 1;\n  height: 1px;\n  background: linear-gradient(90deg, rgba(255, 95, 146, 0.5), transparent);\n}\n\nbody:not(.vice-art-enabled) .vice-scene {\n  display: none;\n}\n\n@keyframes vice-scene-in {\n  from { opacity: 0; transform: translateY(14px); }\n  to { opacity: 1; transform: none; }\n}\n\n@media (max-width: 1000px) {\n  body.vice-art-enabled [class*='_composerHero'] {\n    grid-template-columns: minmax(280px, 1fr) minmax(200px, 0.7fr);\n    column-gap: 28px;\n    width: min(860px, calc(100% - 56px));\n  }\n  .vice-frame { max-height: min(46vh, 460px); }\n}\n\n@media (max-width: 760px) {\n  body.vice-art-enabled [class*='_composerHero'] {\n    display: block;\n    width: min(620px, calc(100% - 40px));\n    padding: 90px 0 40px;\n  }\n  .vice-scene { display: none; }\n}\n";

  // src/shared/constants.js
  var PLUGIN_ID = "dsh-theme-vice";
  var CONFIG_FORM_ID = "theme-vice";
  var ASSETS = Object.freeze({
    poster: "plugins/dsh-theme-vice/assets/poster_full-25ce00b5d601.jpg",
    logo: "plugins/dsh-theme-vice/assets/poster_logo-8eb6649ac961.png",
    rooftop: "plugins/dsh-theme-vice/assets/jason-lucia-rooftop.webp",
    postcard: "plugins/dsh-theme-vice/assets/vice-city.webp",
    cheetah: "plugins/dsh-theme-vice/assets/cheetah.webp",
    beachNight: "plugins/dsh-theme-vice/assets/vice-beach-night.webp",
    street: "plugins/dsh-theme-vice/assets/leonida-street.webp",
    nightlife: "plugins/dsh-theme-vice/assets/nightlife.webp",
    pet: "plugins/dsh-theme-vice/assets/pet-keyart-56a1afa1c5df.png",
    petAlt: "plugins/dsh-theme-vice/assets/pet-roof-b179a351be25.png"
  });
  var DEFAULTS = Object.freeze({
    enabled: "1",
    background: "1",
    opacity: "72",
    blur: "0",
    glow: "1",
    motion: "1",
    intro: "1",
    pet: "1"
  });
  var BODY_DATA_KEYS = Object.freeze(["enabled", "background", "glow", "motion", "pet"]);
  var BODY_STYLE_KEYS = Object.freeze(["opacity", "blur"]);

  // src/client/features/theme/palette.js
  var t = (light, dark) => ({ light, dark });
  var palette = Object.freeze({
    "--dsw-alias-bg-base": t("#fdf6f2", "#0b0814"),
    "--dsw-alias-bg-layer-1": t("#fffbf8", "#120e1e"),
    "--dsw-alias-bg-layer-2": t("#f9ece7", "#1a1428"),
    "--dsw-alias-bg-layer-3": t("#f3e0db", "#241b36"),
    "--dsw-alias-bg-overlay": t("#fffbf8", "#1a1426"),
    "--dsw-alias-bg-module-platform": t("#fbf0ec", "#151022"),
    "--dsw-alias-bg-document-preview": t("#fdf6f2", "#0b0814"),
    "--dsw-alias-card-fill": t("#fffbf8", "#151022"),
    "--dsw-alias-card-fill-hover": t("#f8ebe6", "#20182f"),
    "--dsw-alias-border-l1": t("#e9d8d3", "#2a2140"),
    "--dsw-alias-border-l2-darkmode-thin": t("#dfcbc5", "#332850"),
    "--dsw-alias-border-l2": t("#d8bfb9", "#3a2d56"),
    "--dsw-alias-border-l3": t("#c5a49e", "#503d70"),
    "--dsw-alias-border-l4": t("#a97f7a", "#6d5391"),
    "--dsw-alias-border-selected": t("#cc2f6b", "#ff5f92"),
    "--dsw-alias-label-primary": t("#2a1c2c", "#f8eaf4"),
    "--dsw-alias-label-primary-dimmed": t("#5c4459", "#dcc3da"),
    "--dsw-alias-label-primary-foreground": t("#4a2338", "#fff2f8"),
    "--dsw-alias-label-primary-bluish": t("#2c5f6b", "#8fe3ea"),
    "--dsw-alias-label-secondary": t("#6d5468", "#b89fc0"),
    "--dsw-alias-label-tertiary": t("#8a7089", "#8e7897"),
    "--dsw-alias-label-caption": t("#9a829a", "#7c6886"),
    "--dsw-alias-label-on-color": t("#ffffff", "#2a1c2c"),
    "--dsw-alias-brand-primary": t("#cc2f6b", "#ff5f92"),
    "--dsw-alias-brand-primary-invert": t("#fff4f8", "#2a1c2c"),
    "--dsw-alias-brand-primary-new-colorprimary-new-color": t("#cc2f6b", "#ff5f92"),
    "--dsw-alias-brand-text": t("#a8225a", "#ffa7c3"),
    "--dsw-alias-button-primary-fill": t("#cc2f6b", "#ff5f92"),
    "--dsw-alias-button-primary-hover": t("#b02359", "#ff7ea8"),
    "--dsw-alias-button-primary-dimmed": t("#f3d9e2", "#4d2440"),
    "--dsw-alias-button-elevated-fill": t("#fff4f8", "#221a31"),
    "--dsw-alias-button-floating-fill": t("#fff4f8", "#1e172c"),
    "--dsw-alias-button-floating-hover": t("#f8e4ec", "#2b2140"),
    "--dsw-alias-button-ghost-active-border": t("#d68aa8", "#8d6bb0"),
    "--dsw-alias-button-ghost-active-fill": t("#f6e2ea", "#2b2142"),
    "--dsw-alias-button-ghost-active-hover": t("#f0d5e1", "#372a52"),
    "--dsw-alias-button-info-fill": t("#1f7f8f", "#5fe0ea"),
    "--dsw-alias-button-info-hover": t("#176a78", "#8aeef4"),
    "--dsw-alias-button-contrast-fill": t("#3a1f33", "#fff0f6"),
    "--dsw-alias-button-tool-bar-fill-invisible": t("rgba(204, 47, 107, 0.10)", "rgba(255, 95, 146, 0.12)"),
    "--dsw-alias-button-tool-bar-fill": t("rgba(204, 47, 107, 0.18)", "rgba(255, 95, 146, 0.22)"),
    "--dsw-alias-button-tool-bar-hover": t("rgba(204, 47, 107, 0.30)", "rgba(255, 95, 146, 0.34)"),
    "--dsw-alias-interactive-bg-hover": t("#f7e7ee", "#211931"),
    "--dsw-alias-interactive-bg-active": t("#f0dae5", "#2d2142"),
    "--dsw-alias-interactive-bg-hover-accent": t("#f5dbe4", "#3a284f"),
    "--dsw-alias-interactive-bg-hover-solid": t("#f7e7ee", "#211931"),
    "--dsw-alias-specific-bubble": t("#fff6f9", "#171129"),
    "--dsw-specific-bubble": t("#fff6f9", "#171129"),
    "--dsw-specific-bubble-highlight": t("#f8e2ea", "#2b2040"),
    "--dsw-alias-bubble-highlight": t("#f8e2ea", "#2b2040"),
    "--dsw-specific-input-major": t("#fffbf8", "#120e1e"),
    "--dsw-specific-sidebar-fill": t("rgba(252, 244, 240, 0.94)", "rgba(9, 7, 16, 0.96)"),
    "--dsw-specific-sidebar-tint": t("transparent", "transparent"),
    "--dsw-specific-sidebar-wash-top": t("transparent", "transparent"),
    "--dsw-specific-sidebar-wash-top-clear": t("transparent", "transparent"),
    "--dsw-specific-sidebar-wash-bottom": t("transparent", "transparent"),
    "--dsw-specific-sidebar-wash-bottom-clear": t("transparent", "transparent"),
    "--dsw-specific-sidebar-glass-fill": t("rgba(255, 250, 247, 0.96)", "rgba(18, 14, 30, 0.96)"),
    "--dsw-specific-sidebar-glass-hover": t("rgba(246, 230, 236, 0.96)", "rgba(38, 28, 56, 0.96)"),
    "--dsw-specific-sidebar-nav-item-active": t("#f5e3ea", "#2a1f3f"),
    "--dsw-specific-sidebar-nav-item-active-accent": t("#cc2f6b", "#ff5f92"),
    "--dsw-menu-surface-fill": t("#fffbf8", "#1a1428"),
    "--dsw-specific-menu": t("#fffbf8", "#1a1428"),
    "--dsw-alias-menu-group-header-fill": t("#fffbf8", "#1a1428"),
    "--dsw-specific-selector": t("#f8eae5", "#251b38"),
    "--dsw-alias-hovercard-bg": t("#fffbf8", "#1a1428"),
    "--dsw-alias-markdown-code-block": t("#f6eae6", "#100c1c"),
    "--dsw-alias-markdown-code-block-banner": t("#efdcd7", "#1c1530"),
    "--dsw-alias-markdown-inline-code": t("#f6e2e9", "#2b2040"),
    "--dsw-alias-markdown-code-segment-selected": t("#eec3d5", "#4a2f52"),
    "--dsw-alias-markdown-code-segment-unselected": t("#f6eae6", "#100c1c"),
    "--dsw-alias-markdown-placeholder": t("#f3e2e8", "#241c3a"),
    "--dsw-alias-markdown-tag": t("#f3e2e8", "#241c3a"),
    "--dsw-alias-link": t("#1f7f8f", "#6fdce6"),
    "--dsw-alias-state-error-primary": t("#b02a4d", "#ff8fa3"),
    "--dsw-alias-state-error-secondary": t("#9c2444", "#ffb0bc"),
    "--dsw-alias-state-success-primary": t("#2f8f79", "#7fe0c0"),
    "--dsw-alias-state-success-secondary": t("#256b5a", "#aef0da"),
    "--dsw-alias-state-warn-label": t("#8f5f1c", "#f0b45c"),
    "--dsw-alias-state-warn-primary": t("#a06a1f", "#f0b45c"),
    "--dsw-alias-state-warn-secondary": t("#8a5a16", "#f8d29a"),
    "--dsw-alias-tooltip-bg": t("#fffbf8", "#251b38"),
    "--dsw-alias-tooltip-label": t("#3a2333", "#f8eaf4"),
    "--dsw-alias-toast-bg": t("#fffbf8", "#251b38"),
    "--dsw-alias-toast-label": t("#3a2333", "#f8eaf4"),
    "--dsw-alias-toast-action": t("#b02359", "#ffa7c3"),
    "--dsw-alias-scrollbar-bg-l1": t("#dcc8c2", "#463764"),
    "--dsw-alias-scrollbar-bg-l2": t("#c3a8a2", "#5e4a80"),
    "--dsw-alias-scrollbar-hover-l1": t("#b58b8a", "#6d5596"),
    "--dsw-alias-scrollbar-hover-l2": t("#a2767a", "#8a6cb4"),
    "--dsw-alias-label-deep-diving": t("#1f7f8f", "#6fdce6"),
    "--dsw-alias-label-deep-diving-shimmer": t("#cc2f6b", "#ffa7c3"),
    "--dsw-alias-turn-trigger-bg": t("#f7e7ee", "#211931"),
    "--dsw-alias-turn-trigger-bg-hover": t("#f0dae5", "#2d2142"),
    "--dsw-alias-switch-thumb": t("#8a7089", "#8e7897")
  });
  var art = Object.freeze({
    sunTop: "#fff3c4",
    sunMid: "#ffcf6b",
    sunLow: "#ff8a4c",
    sunHot: "#ff4d7e",
    sunDeep: "#c8348f",
    horizon: "#ff5f92",
    grid: "rgba(255, 138, 180, 0.30)",
    ink: "#0a0713",
    cyan: "#5fe0ea"
  });

  // src/client/features/theme/index.js
  function datasetName(key) {
    return `vice${key[0].toUpperCase()}${key.slice(1)}`;
  }
  function createThemeController({ ctx, body }) {
    let restore;
    function install() {
      if (!restore) restore = ctx.theme.overrideTokens(PLUGIN_ID, palette);
    }
    function uninstall() {
      restore?.();
      restore = void 0;
    }
    return {
      sync(values) {
        if (values.enabled === "1") install();
        else uninstall();
        for (const key of BODY_DATA_KEYS) {
          if (values.enabled === "1") body.dataset[datasetName(key)] = values[key];
          else delete body.dataset[datasetName(key)];
        }
        if (values.enabled === "1") {
          body.style.setProperty("--vice-opacity", String(Number(values.opacity) / 100));
          body.style.setProperty("--vice-blur", `${Number(values.blur)}px`);
          body.style.setProperty("--vice-logo", `url("${ASSETS.logo}")`);
          body.style.setProperty("--vice-poster", `url("${ASSETS.poster}")`);
        } else {
          for (const key of BODY_STYLE_KEYS) body.style.removeProperty(`--vice-${key}`);
        }
      },
      dispose() {
        uninstall();
        for (const key of BODY_DATA_KEYS) delete body.dataset[datasetName(key)];
        for (const key of BODY_STYLE_KEYS) body.style.removeProperty(`--vice-${key}`);
      }
    };
  }

  // src/client/features/theme/styles.css
  var styles_default8 = "/* Shell surfaces and typography. Colors come from the installed token palette;\n   this sheet only adds structure and the neon trim. */\n\nbody[data-vice-enabled='1'] {\n  --vice-ink: #0a0713;\n  --vice-hot: #ff5f92;\n  --vice-gold: #ffb35c;\n  --vice-cyan: #5fe0ea;\n  --vice-rose: #ffa7c3;\n  --vice-ease: cubic-bezier(.22, .7, .28, 1);\n  --vice-hairline: var(--dsw-hairline-width, 1px);\n  --vice-headline-size: clamp(28px, 2.4vw, 40px);\n  background-color: var(--dsw-alias-bg-base);\n}\n\n/* ---------- shell columns ---------- */\n\nbody[data-vice-enabled='1'] [class*='_sidebarCol'] {\n  position: relative;\n  isolation: isolate;\n  background:\n    linear-gradient(168deg, rgba(255, 95, 146, 0.06), transparent 46%),\n    var(--dsw-alias-bg-base) !important;\n  border-right: 1px solid var(--dsw-alias-border-l1);\n}\n\nbody[data-vice-enabled='1'] [class*='_mainPanel'] {\n  position: relative;\n  background:\n    radial-gradient(circle at 92% -6%, rgba(255, 95, 146, 0.07), transparent 38%),\n    radial-gradient(circle at 6% 104%, rgba(95, 224, 234, 0.05), transparent 42%),\n    var(--dsw-alias-bg-base);\n}\n\n/* Neon hairline along the top of the conversation column. */\nbody[data-vice-enabled='1'] [class*='_mainPanel']::before {\n  content: '';\n  position: absolute;\n  z-index: 5;\n  inset: 0 0 auto;\n  height: var(--vice-hairline);\n  background: linear-gradient(90deg,\n    transparent,\n    rgba(255, 95, 146, 0.42),\n    rgba(255, 179, 92, 0.34),\n    rgba(95, 224, 234, 0.28),\n    transparent);\n  pointer-events: none;\n}\n\nbody[data-vice-enabled='1'] [class*='_rightbarCol'] {\n  position: relative;\n  border-left: 1px solid var(--dsw-alias-border-l1);\n  background:\n    radial-gradient(circle at 100% 0%, rgba(255, 95, 146, 0.07), transparent 40%),\n    var(--dsw-alias-bg-base);\n}\n\n/* ---------- typography ---------- */\n\nbody[data-vice-enabled='1'] [class*='_headline'] {\n  letter-spacing: -0.02em;\n}\n\nbody[data-vice-enabled='1'] [class*='_titleGroup'] {\n  letter-spacing: -0.025em;\n}\n\nbody[data-vice-glow='1'] [class*='_headline'] {\n  text-shadow: 0 0 22px rgba(255, 95, 146, 0.20);\n}\n\n/* ---------- composer ---------- */\n\nbody[data-vice-enabled='1'] [class*='_composerStack'] [class*='_root']:has(textarea) {\n  border-color: var(--dsw-alias-border-l2);\n  transition: border-color 180ms var(--vice-ease), box-shadow 180ms var(--vice-ease);\n}\n\nbody[data-vice-enabled='1'] [class*='_composerStack'] [class*='_root']:has(textarea):focus-within {\n  border-color: var(--dsw-alias-border-selected);\n  box-shadow: 0 0 0 3px rgba(255, 95, 146, 0.10);\n}\n\nbody[data-vice-glow='1'][data-vice-enabled='1'] [data-composer-card='true']:focus-within {\n  box-shadow:\n    0 0 0 1px rgba(255, 95, 146, 0.28),\n    0 0 34px rgba(255, 95, 146, 0.14),\n    0 18px 52px rgba(0, 0, 0, 0.22);\n}\n\n/* ---------- small accents ---------- */\n\nbody[data-vice-enabled='1'] [class*='_scrollbar'] {\n  background-image: linear-gradient(180deg, rgba(255, 95, 146, 0.25), rgba(95, 224, 234, 0.18));\n}\n\nbody[data-vice-glow='1'][data-vice-enabled='1'] button[class*='_primary'] {\n  box-shadow: 0 6px 22px rgba(255, 95, 146, 0.26);\n}\n\n/* Respect the reduced-motion preference everywhere in this theme. */\n@media (prefers-reduced-motion: reduce) {\n  body[data-vice-enabled='1'] * {\n    animation-duration: 1ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 1ms !important;\n  }\n}\n";

  // src/client/features/tools/styles.css
  var styles_default9 = "/* Tool-call rows.\n   The harness tags every process step with `data-process-activity`, so the\n   colour and the running animation are keyed off semantics rather than the\n   hashed class names, which change between releases.\n\n   The title button ships with `padding: 0`, so the accent rail is drawn in\n   added padding that a matching negative margin cancels out: content does not\n   move, only the band around it grows. */\n\nbody[data-vice-enabled='1'] {\n  --vice-act-thinking: #a78bfa;\n  --vice-act-read: #6fe3ec;\n  --vice-act-search: #7fb8ff;\n  --vice-act-edit: #a6e88f;\n  --vice-act-command: #ffb35c;\n  --vice-act-plan: #ff5f92;\n  --vice-act-context: #b9a8d8;\n  /* Default accent for any activity the harness adds later; the per-activity\n     rules below win because they sit on a descendant, not because of weight. */\n  --vice-act: var(--vice-act-context);\n}\n\n/* ---------- per-activity accent ---------- */\n\nbody[data-vice-enabled='1'] [data-process-activity='thinking'] { --vice-act: var(--vice-act-thinking); }\nbody[data-vice-enabled='1'] [data-process-activity='read'],\nbody[data-vice-enabled='1'] [data-process-activity='readImage'] { --vice-act: var(--vice-act-read); }\nbody[data-vice-enabled='1'] [data-process-activity='search'],\nbody[data-vice-enabled='1'] [data-process-activity='webSearch'],\nbody[data-vice-enabled='1'] [data-process-activity='webFetch'] { --vice-act: var(--vice-act-search); }\nbody[data-vice-enabled='1'] [data-process-activity='edit'],\nbody[data-vice-enabled='1'] [data-process-activity='write'],\nbody[data-vice-enabled='1'] [data-process-activity='code'] { --vice-act: var(--vice-act-edit); }\nbody[data-vice-enabled='1'] [data-process-activity='commands'],\nbody[data-vice-enabled='1'] [data-process-activity='tools'] { --vice-act: var(--vice-act-command); }\nbody[data-vice-enabled='1'] [data-process-activity='subagents'],\nbody[data-vice-enabled='1'] [data-process-activity='plan'],\nbody[data-vice-enabled='1'] [data-process-activity='questions'] { --vice-act: var(--vice-act-plan); }\nbody[data-vice-enabled='1'] [data-process-activity='context'] { --vice-act: var(--vice-act-context); }\n\n/* ---------- the step row ---------- */\n\nbody[data-vice-enabled='1'] [data-process-activity] {\n  padding-inline: 10px;\n  margin-inline: -10px;\n  border-radius: 6px;\n  background: linear-gradient(90deg, color-mix(in srgb, var(--vice-act) 12%, transparent), transparent 62%);\n  box-shadow: inset 2px 0 0 color-mix(in srgb, var(--vice-act) 62%, transparent);\n  transition: background 180ms var(--vice-ease), box-shadow 180ms var(--vice-ease);\n}\n\nbody[data-vice-enabled='1'] [data-process-activity]:hover {\n  background: linear-gradient(90deg, color-mix(in srgb, var(--vice-act) 20%, transparent), transparent 72%);\n  box-shadow: inset 2px 0 0 var(--vice-act);\n}\n\nbody[data-vice-enabled='1'] [data-process-activity]:focus-visible {\n  outline: none;\n  box-shadow: inset 2px 0 0 var(--vice-act), 0 0 0 1px color-mix(in srgb, var(--vice-act) 45%, transparent);\n}\n\n/* The glyph carries the accent; the label stays on the readable token. */\nbody[data-vice-enabled='1'] [data-step-process-icon] {\n  color: var(--vice-act, var(--vice-act-context));\n  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--vice-act, var(--vice-act-context)) 45%, transparent));\n}\n\nbody[data-vice-enabled='1'] [data-process-activity] [class*='_label'] {\n  letter-spacing: -0.005em;\n}\n\n/* Running: the rail sweeps like a patrol light. */\nbody[data-vice-enabled='1'][data-vice-wanted] [data-process-activity] {\n  background: linear-gradient(90deg,\n    color-mix(in srgb, var(--vice-act) 26%, transparent),\n    transparent 70%);\n  background-size: 220% 100%;\n  animation: vice-activity-sweep 1.6s linear infinite;\n}\n\n@keyframes vice-activity-sweep {\n  from { background-position: 130% 0; }\n  to { background-position: -30% 0; }\n}\n\n/* ---------- expanded body ---------- */\n\nbody[data-vice-enabled='1'] [data-step-process-body] {\n  margin-inline-start: 2px;\n  border-inline-start: 1px solid color-mix(in srgb, var(--vice-act, var(--vice-act-context)) 26%, transparent);\n}\n\nbody[data-vice-enabled='1'] [data-step-process-body] [data-step-process-content] {\n  padding-inline-start: 12px;\n}\n\n/* ---------- turn summary ---------- */\n\nbody[data-vice-enabled='1'] [data-turn-process] {\n  padding-inline: 10px;\n  margin-inline: -10px;\n  border-radius: 6px;\n  color: var(--dsw-alias-label-secondary);\n  background: linear-gradient(90deg, rgba(255, 179, 92, 0.09), transparent 58%);\n  box-shadow: inset 2px 0 0 rgba(255, 179, 92, 0.45);\n  transition: background 180ms var(--vice-ease), box-shadow 180ms var(--vice-ease);\n}\n\nbody[data-vice-enabled='1'] [data-turn-process]:hover {\n  background: linear-gradient(90deg, rgba(255, 179, 92, 0.15), transparent 66%);\n  box-shadow: inset 2px 0 0 var(--vice-gold);\n}\n\nbody[data-vice-enabled='1'] [data-turn-process]:focus-visible {\n  outline: none;\n  box-shadow: inset 2px 0 0 var(--vice-gold), 0 0 0 1px rgba(255, 179, 92, 0.4);\n}\n\nbody[data-vice-enabled='1'] [data-turn-process] [class*='_label'] {\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.01em;\n}\n\nbody[data-vice-enabled='1'] [data-turn-process] [class*='_durationNumber'] {\n  color: var(--vice-gold);\n}\n\n/* ---------- generic disclosure rows (tool payloads, subagent work) ---------- */\n\nbody[data-vice-enabled='1'] [data-disclosure-row][data-expandable] {\n  border-radius: 6px;\n  transition: background 160ms var(--vice-ease);\n}\n\nbody[data-vice-enabled='1'] [data-disclosure-row][data-expandable]:hover {\n  background: rgba(255, 95, 146, 0.07);\n}\n\nbody[data-vice-enabled='1'] [data-disclosure-row][data-expandable]:focus-visible {\n  outline: none;\n  background: rgba(255, 95, 146, 0.1);\n  box-shadow: 0 0 0 1px rgba(255, 95, 146, 0.35);\n}\n\n/* ---------- reduced motion ---------- */\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-vice-enabled='1'][data-vice-wanted] [data-process-activity] {\n    animation: none;\n  }\n}\n";

  // src/client/features/wanted/index.js
  var MAX_LEVEL = 6;
  function createWantedMeter({ body, signal }) {
    let level = 0;
    let unsubscribe = () => {
    };
    function apply(running) {
      const next = running ? MAX_LEVEL : 0;
      if (next === level) return;
      level = next;
      if (next > 0) {
        body.dataset.viceWanted = String(next);
        body.setAttribute("data-vice-wanted", String(next));
      } else {
        delete body.dataset.viceWanted;
        body.removeAttribute("data-vice-wanted");
      }
    }
    return {
      start() {
        apply(signal.get());
        unsubscribe = signal.subscribe(apply);
      },
      dispose() {
        unsubscribe();
        unsubscribe = () => {
        };
        apply(false);
      }
    };
  }

  // src/client/features/wanted/styles.css
  var styles_default10 = "/* Wanted level read by the artwork. `body[data-vice-wanted]` carries 0 or 6. */\n\n.vice-wanted,\n.vice-wanted-panel {\n  --vice-wanted-on: 0;\n}\n\nbody[data-vice-wanted] .vice-wanted,\nbody[data-vice-wanted] .vice-wanted-panel {\n  --vice-wanted-on: 1;\n}\n\n/* Six stars, lit one after another while the agent works. */\n.vice-wanted b,\n.vice-wanted-panel b {\n  position: relative;\n  display: inline-block;\n  letter-spacing: 3px;\n  color: rgba(255, 179, 92, 0.26);\n  transition: color 220ms ease, filter 220ms ease, transform 220ms ease;\n}\n\nbody[data-vice-wanted] .vice-wanted b,\nbody[data-vice-wanted] .vice-wanted-panel b {\n  color: transparent;\n  background: linear-gradient(90deg,\n    #ffd36b 0%, #ffb35c 18%, #ff8a4c 34%, #ff5f92 52%, #ff8a4c 68%, #ffb35c 84%, #ffd36b 100%);\n  background-size: 260% 100%;\n  -webkit-background-clip: text;\n  background-clip: text;\n  filter: drop-shadow(0 0 9px rgba(255, 140, 90, 0.75));\n  animation: vice-wanted-sweep 2.4s linear infinite;\n}\n\n/* Unlit stars stay as a faint outline so the meter always reads as six. */\nbody[data-vice-wanted] .vice-wanted b::before,\nbody[data-vice-wanted] .vice-wanted-panel b::before {\n  content: '★★★★★★';\n  position: absolute;\n  inset: 0;\n  color: rgba(255, 179, 92, 0.24);\n  -webkit-text-fill-color: rgba(255, 179, 92, 0.24);\n  z-index: -1;\n}\n\n@keyframes vice-wanted-sweep {\n  from { background-position: 160% 0; }\n  to { background-position: -60% 0; }\n}\n\n/* The label above the stars flickers on while wanted. */\n.vice-wanted span,\n.vice-wanted-panel span {\n  transition: color 220ms ease, opacity 220ms ease;\n}\n\nbody[data-vice-wanted] .vice-wanted span,\nbody[data-vice-wanted] .vice-wanted-panel span {\n  color: #ff8a8a;\n  opacity: 1;\n  animation: vice-wanted-pulse 1.6s ease-in-out infinite;\n}\n\n@keyframes vice-wanted-pulse {\n  0%, 100% { opacity: 0.72; }\n  50% { opacity: 1; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-vice-wanted] .vice-wanted b,\n  body[data-vice-wanted] .vice-wanted-panel b,\n  body[data-vice-wanted] .vice-wanted span,\n  body[data-vice-wanted] .vice-wanted-panel span {\n    animation: none;\n    background: none;\n    -webkit-text-fill-color: var(--vice-gold);\n    color: var(--vice-gold);\n  }\n}\n";

  // src/client/index.js
  window.__ModuleLoader__.load({
    id: PLUGIN_ID,
    factory(require2) {
      const React = require2("react");
      function apply(ctx) {
        const body = document.body;
        const form = ctx.configForms.get(CONFIG_FORM_ID);
        const store = createConfigStore(form, DEFAULTS);
        const removeStyles = installStyles(PLUGIN_ID, [
          styles_default8,
          styles_default2,
          styles_default9,
          styles_default,
          styles_default7,
          styles_default5,
          styles_default6,
          styles_default10,
          styles_default3,
          styles_default4
        ]);
        const theme = createThemeController({ ctx, body });
        const scene = createScene({ body, assets: ASSETS });
        const unregisterPanel = registerVicePanel({ ctx, React, store, assets: ASSETS });
        const unregisterBrand = registerBrandMark();
        const runSignal = createRunSignal({ body });
        const wanted = createWantedMeter({ body, signal: runSignal });
        const intro = createIntro({ assets: ASSETS });
        const motion = createMotion(body);
        const pet = createPet({ body, assets: ASSETS, signal: runSignal });
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        runSignal.start();
        scene.start();
        wanted.start();
        function sync() {
          const { values } = store.getState();
          const animations = values.enabled === "1" && values.motion === "1" && !reducedMotion.matches;
          theme.sync(values);
          scene.sync(values);
          motion.sync(animations);
          intro.sync(animations && values.intro === "1");
          pet.sync(values);
        }
        const unsubscribeStore = store.subscribe(sync);
        reducedMotion.addEventListener?.("change", sync);
        sync();
        ctx.effect(() => () => {
          unsubscribeStore();
          reducedMotion.removeEventListener?.("change", sync);
          motion.dispose();
          intro.dispose();
          pet.dispose();
          wanted.dispose();
          runSignal.dispose();
          scene.dispose();
          theme.dispose();
          unregisterBrand();
          unregisterPanel();
          store.dispose();
          removeStyles();
        }, "vice: feature lifecycle");
      }
      return {
        name: PLUGIN_ID,
        inject: ["slots", "configForms", "theme"],
        apply
      };
    }
  });
})();
