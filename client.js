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

  // src/client/core/styles.js
  function installStyles(pluginId, chunks) {
    const sheet = document.createElement("style");
    sheet.dataset.plugin = pluginId;
    sheet.textContent = chunks.filter(Boolean).join("\n");
    document.head.appendChild(sheet);
    return () => sheet.remove();
  }

  // src/client/features/intro/index.js
  function createIntro() {
    let shown = false;
    let element;
    let timer;
    function play() {
      if (shown || document.querySelector(".vice-intro")) return;
      shown = true;
      element = document.createElement("div");
      element.className = "vice-intro";
      element.setAttribute("aria-hidden", "true");
      element.innerHTML = `
      <div class="vice-intro-sky"></div>
      <div class="vice-intro-sun"></div>
      <div class="vice-intro-horizon"></div>
      <div class="vice-intro-grid"></div>
      <div class="vice-intro-copy">
        <span class="vice-intro-kicker">SUNSET STRIP · 1986</span>
        <span class="vice-intro-title">NEON COAST</span>
      </div>
    `;
      document.body.appendChild(element);
      timer = window.setTimeout(() => {
        element?.remove();
        element = void 0;
        timer = void 0;
      }, 2800);
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
  var styles_default = "/* Original launch animation: the sun rises over a horizon and the title tracks in. */\n\n.vice-intro {\n  position: fixed;\n  z-index: 2147483000;\n  inset: 0;\n  overflow: hidden;\n  background: #0a0713;\n  animation: vice-intro-out 520ms 2200ms ease forwards;\n  pointer-events: none;\n}\n\n.vice-intro-sky {\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(180deg, #150a26 0%, #3a1650 40%, #7c1f5c 68%, #d2405f 86%, #ff8a4c 100%);\n}\n\n.vice-intro-sun {\n  position: absolute;\n  left: 50%;\n  bottom: 26%;\n  width: min(46vw, 380px);\n  aspect-ratio: 1;\n  translate: -50% 0;\n  border-radius: 50%;\n  background: linear-gradient(180deg, #fff3c4, #ffcf6b 30%, #ff8a4c 58%, #ff4d7e 82%, #c8348f);\n  -webkit-mask-image: repeating-linear-gradient(180deg, #000 0 8px, transparent 8px 11px);\n  mask-image: repeating-linear-gradient(180deg, #000 0 8px, transparent 8px 11px);\n  filter: drop-shadow(0 0 60px rgba(255, 120, 90, 0.5));\n  animation: vice-sun-rise 1400ms cubic-bezier(.18, .8, .24, 1) both;\n}\n\n.vice-intro-horizon {\n  position: absolute;\n  inset: auto 0 26%;\n  height: 1px;\n  background: linear-gradient(90deg, transparent, #ff8a4c 30%, #ffcf6b 50%, #ff8a4c 70%, transparent);\n  box-shadow: 0 0 26px rgba(255, 140, 90, 0.7);\n}\n\n.vice-intro-grid {\n  position: absolute;\n  inset: auto 0 0;\n  height: 26%;\n  background:\n    repeating-linear-gradient(90deg, rgba(255, 138, 180, 0.34) 0 1px, transparent 1px 52px),\n    repeating-linear-gradient(0deg, rgba(255, 138, 180, 0.28) 0 1px, transparent 1px 34px);\n  transform: perspective(320px) rotateX(66deg);\n  transform-origin: bottom center;\n  -webkit-mask-image: linear-gradient(0deg, #000 30%, transparent 96%);\n  mask-image: linear-gradient(0deg, #000 30%, transparent 96%);\n  animation: vice-grid-in 900ms 500ms ease both;\n}\n\n.vice-intro-copy {\n  position: absolute;\n  z-index: 2;\n  inset: auto 0 10%;\n  display: grid;\n  justify-items: center;\n  gap: 14px;\n  text-align: center;\n}\n\n/* Scrim so the copy stays legible wherever the sun sits behind it. */\n.vice-intro-copy::before {\n  content: '';\n  position: absolute;\n  z-index: -1;\n  inset: -40px -80px;\n  background: radial-gradient(closest-side, rgba(10, 7, 19, 0.62), rgba(10, 7, 19, 0.18) 62%, transparent);\n  pointer-events: none;\n}\n\n.vice-intro-kicker {\n  color: #ffd9a8;\n  font: 600 11px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.42em;\n  text-shadow: 0 1px 14px rgba(10, 7, 19, 0.9);\n  animation: vice-copy-in 700ms 620ms ease both;\n}\n\n.vice-intro-title {\n  color: #fff2e7;\n  font: 500 clamp(34px, 5.2vw, 68px)/1 Georgia, 'Times New Roman', serif;\n  letter-spacing: 0.06em;\n  text-shadow:\n    0 0 40px rgba(255, 120, 110, 0.42),\n    0 2px 26px rgba(10, 7, 19, 0.75);\n  animation: vice-copy-in 760ms 720ms cubic-bezier(.2, .8, .3, 1) both;\n}\n\n@keyframes vice-sun-rise {\n  from { transform: translateY(42%); opacity: 0; }\n  to { transform: none; opacity: 1; }\n}\n\n@keyframes vice-grid-in {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n@keyframes vice-copy-in {\n  from { opacity: 0; transform: translateY(10px); letter-spacing: 0.3em; }\n  to { opacity: 1; transform: none; }\n}\n\n@keyframes vice-intro-out {\n  to { opacity: 0; visibility: hidden; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .vice-intro { display: none; }\n}\n";

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
  var styles_default2 = ".vice-reveal {\n  opacity: 0;\n  transform: translateY(8px);\n}\n\n.vice-reveal.vice-visible {\n  opacity: 1;\n  transform: none;\n  transition:\n    opacity 420ms cubic-bezier(.22, .7, .28, 1),\n    transform 420ms cubic-bezier(.22, .7, .28, 1);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .vice-reveal,\n  .vice-reveal.vice-visible {\n    opacity: 1;\n    transform: none;\n    transition: none;\n  }\n}\n";

  // src/client/core/art.js
  var GRAIN_URI = (() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
<feColorMatrix type="saturate" values="0"/></filter>
<rect width="160" height="160" filter="url(#g)" opacity="0.5"/></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  })();
  function palmSvg(color, flip = false) {
    return `<svg viewBox="0 0 128 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
<g fill="${color}" transform="${flip ? "translate(128,0) scale(-1,1)" : ""}">
<path d="M48 200 C54 158 59 120 62 88 L73 90 C70 124 63 160 60 200 Z"/>
<path d="M64 86 C44 88 24 84 6 70 C24 80 44 82 64 80 Z"/>
<path d="M64 86 C50 84 34 78 20 68 C35 76 50 80 64 82 Z"/>
<path d="M64 85 C48 78 33 64 22 46 C36 61 50 72 64 80 Z"/>
<path d="M65 84 C54 65 50 44 56 24 C59 45 61 66 67 80 Z"/>
<path d="M66 84 C72 62 82 42 100 28 C87 49 76 68 68 81 Z"/>
<path d="M67 84 C86 78 104 66 118 48 C106 67 88 79 68 81 Z"/>
<path d="M67 84 C88 86 108 84 124 74 C107 82 86 82 68 80 Z"/>
<path d="M65 86 C54 76 46 64 42 52 C51 64 58 76 66 84 Z"/>
<path d="M64 87 C52 88 38 84 28 78 C40 83 52 84 64 83 Z"/>
</g></svg>`;
  }
  function skylineSvg(color) {
    const blocks = [
      [0, 74, 46, 46],
      [50, 58, 30, 62],
      [84, 82, 54, 38],
      [142, 46, 26, 74],
      [172, 68, 40, 52],
      [216, 88, 62, 32],
      [282, 54, 34, 66],
      [320, 76, 44, 44],
      [368, 40, 22, 80],
      [394, 66, 48, 54],
      [446, 84, 58, 36],
      [508, 60, 32, 60],
      [544, 78, 56, 42]
    ];
    const rects = blocks.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join("");
    return `<svg viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true"><g fill="${color}">${rects}</g></svg>`;
  }

  // src/client/features/scene/art.js
  var INK = "#150c24";
  function sceneArtHtml() {
    return `
    <div class="vice-sky"></div>
    <div class="vice-sun"></div>
    <div class="vice-skyline">${skylineSvg(INK)}</div>
    <div class="vice-grid"></div>
    <div class="vice-palms">${palmSvg(INK)}${palmSvg(INK, true)}</div>
    <div class="vice-grain" style="--vice-grain:url('${GRAIN_URI}')"></div>
    <div class="vice-caption">
      <strong>Sunset Strip</strong>
      <span>NEON COAST<i>★ ★ ★ ★ ★</i></span>
    </div>
  `;
  }

  // src/client/features/panel/index.js
  var MARK = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 15h16" stroke="currentColor" stroke-width="1.6"/></svg>`;
  function registerVicePanel({ ctx, React, store }) {
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
        title: () => "Neon Coast",
        guide: [{
          id: "neon-coast",
          order: 10,
          title: () => "Neon Coast",
          description: () => "A sunset postcard for your workspace.",
          icon: () => h("span", { className: "vice-guide-icon", dangerouslySetInnerHTML: { __html: MARK } })
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
            h("span", null, "SUNSET STRIP · 1986"),
            h("button", {
              type: "button",
              className: "vice-panel-back",
              onClick: () => sidebar.openTab("guide", { replaceTab: true })
            }, "工具 / TOOLS")
          ),
          h(
            "div",
            { className: "vice-panel-heading" },
            h(
              "div",
              null,
              h("p", null, "WELCOME TO"),
              h("h1", null, "Neon Coast")
            ),
            h(
              "div",
              { className: "vice-stars", "aria-label": "Decorative rating" },
              h("span", null, "VIBE"),
              h("b", null, "★★★★★")
            )
          ),
          h(
            "div",
            { className: "vice-panel-card" },
            h("div", { className: "vice-frame", dangerouslySetInnerHTML: { __html: sceneArtHtml() } })
          ),
          h(
            "div",
            { className: "vice-panel-strip" },
            h("div", { className: "vice-panel-tile is-cyan" }, h("span", null, "MIDNIGHT DRIVE")),
            h("div", { className: "vice-panel-tile is-rose" }, h("span", null, "GOLDEN HOUR"))
          ),
          h(
            "div",
            { className: "vice-panel-footer" },
            h("i", null),
            h("span", null, "ENJOY THE VIEW"),
            h("i", null)
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
  var styles_default3 = "/* Right-sidebar postcard panel. Uses the theme's own SVG art, no images. */\n\n.vice-panel {\n  container-type: inline-size;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  min-height: 100%;\n  padding: 18px;\n  overflow: auto;\n  color: var(--dsw-alias-label-primary);\n  background:\n    linear-gradient(180deg, rgba(255, 95, 146, 0.05), transparent 42%),\n    var(--dsw-alias-bg-base);\n}\n\n.vice-panel-top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  color: var(--dsw-alias-label-tertiary);\n  font: 600 8px/1.4 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.16em;\n}\n\n.vice-panel-back {\n  padding: 6px 9px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 4px;\n  color: var(--dsw-alias-label-secondary);\n  background: transparent;\n  font: inherit;\n  letter-spacing: 0.14em;\n  cursor: pointer;\n  transition: color 160ms ease, border-color 160ms ease;\n}\n\n.vice-panel-back:hover,\n.vice-panel-back:focus-visible {\n  color: var(--vice-rose);\n  border-color: var(--dsw-alias-border-selected);\n  outline: none;\n}\n\n.vice-panel-heading {\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 14px;\n  margin: 8px 0 2px;\n}\n\n.vice-panel-heading p {\n  margin: 0 0 6px;\n  color: var(--vice-rose);\n  font: 600 9px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.3em;\n}\n\n.vice-panel-heading h1 {\n  margin: 0;\n  color: var(--dsw-alias-label-primary);\n  font: 700 40px/0.95 Georgia, 'Times New Roman', serif;\n  letter-spacing: -0.055em;\n}\n\n.vice-stars {\n  display: grid;\n  justify-items: end;\n  gap: 7px;\n  color: var(--vice-gold);\n}\n\n.vice-stars span {\n  font: 600 8px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.16em;\n  opacity: 0.75;\n}\n\n.vice-stars b {\n  font: 13px/1 Georgia, serif;\n  letter-spacing: 2px;\n  opacity: 0.7;\n}\n\n/* The hero card reuses the scene frame geometry at a wider aspect. */\n.vice-panel-card {\n  position: relative;\n  overflow: hidden;\n  aspect-ratio: 1.7;\n  border: 1px solid rgba(255, 95, 146, 0.24);\n  border-radius: 10px;\n  background: #160e26;\n  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.28);\n  isolation: isolate;\n}\n\n.vice-panel-card .vice-frame {\n  position: absolute;\n  inset: 0;\n  aspect-ratio: auto;\n  max-height: none;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n}\n\n.vice-panel-card .vice-caption strong {\n  font-size: 20px;\n}\n\n.vice-panel-strip {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n\n.vice-panel-tile {\n  position: relative;\n  overflow: hidden;\n  aspect-ratio: 1.5;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 9px;\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.vice-panel-tile::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n  opacity: 0.85;\n}\n\n.vice-panel-tile.is-cyan::before {\n  background:\n    radial-gradient(circle at 70% 22%, rgba(95, 224, 234, 0.42), transparent 58%),\n    linear-gradient(168deg, #0b2b3a, #14244a 55%, #2a1a44);\n}\n\n.vice-panel-tile.is-rose::before {\n  background:\n    radial-gradient(circle at 30% 26%, rgba(255, 179, 92, 0.42), transparent 58%),\n    linear-gradient(168deg, #3a1230, #4a1740 55%, #1d0f2b);\n}\n\n.vice-panel-tile span {\n  position: absolute;\n  inset: auto 0 0;\n  padding: 16px 10px 9px;\n  color: var(--dsw-alias-label-primary-foreground);\n  background: linear-gradient(transparent, rgba(10, 5, 20, 0.72));\n  font: 600 8px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.14em;\n}\n\n.vice-panel-footer {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 8px 0 10px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.vice-panel-footer i {\n  width: 5px;\n  height: 5px;\n  background: var(--vice-hot);\n  box-shadow: 0 0 10px var(--vice-hot);\n  transform: rotate(45deg);\n}\n\n.vice-panel-footer span {\n  font: 600 8px/1.5 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.18em;\n}\n\n@container (max-width: 340px) {\n  .vice-panel-heading { align-items: flex-start; flex-direction: column; gap: 12px; }\n  .vice-stars { justify-items: start; }\n  .vice-panel-heading h1 { font-size: 34px; }\n  .vice-panel-strip { grid-template-columns: 1fr; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .vice-panel * { animation: none !important; }\n}\n\n.vice-guide-icon {\n  display: inline-flex;\n  width: 24px;\n  height: 24px;\n  color: var(--vice-hot);\n}\n\n.vice-guide-icon svg { width: 100%; height: 100%; }\n";

  // src/client/features/scene/index.js
  var HERO_SELECTOR = '[class*="_composerHero"]';
  function createScene({ body }) {
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
      <div class="vice-eyebrow"><i></i> NEON COAST <span>SUNSET STRIP · 1986</span></div>
      <div class="vice-frame">${sceneArtHtml()}</div>
      <div class="vice-scene-footer"><span>WELCOME TO</span><strong>NEON COAST</strong><i></i></div>
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
  var styles_default4 = "/* The empty-state sunset postcard. All geometry is CSS or inline SVG. */\n\nbody.vice-art-enabled [class*='_composerHero'] {\n  display: grid;\n  grid-template-columns: minmax(300px, 1.1fr) minmax(300px, 0.9fr);\n  align-content: center;\n  column-gap: clamp(28px, 4.5vw, 76px);\n  width: min(1180px, calc(100% - 88px));\n  max-width: none;\n  min-height: 100%;\n  padding: 68px 0 50px;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] > [class*='_root']:has([class*='_headline']) {\n  grid-column: 1;\n  grid-row: 1;\n  margin-bottom: 32px;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] [class*='_headline'] {\n  position: relative;\n  justify-content: flex-start;\n  gap: 14px;\n  color: var(--dsw-alias-label-primary);\n  font-size: clamp(28px, 2.4vw, 40px);\n  font-weight: 550;\n  letter-spacing: -0.045em;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] [class*='_headline']::before {\n  content: 'SUNSET VIBES · OPEN LATE';\n  position: absolute;\n  bottom: calc(100% + 20px);\n  left: 1px;\n  color: var(--vice-rose);\n  font: 600 10px/1.2 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.32em;\n  -webkit-text-stroke: 0;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] [class*='_heroWorkspaceRow'] {\n  grid-column: 1;\n  grid-row: 2;\n  min-width: 0;\n  margin-bottom: 14px;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] > [data-slot='conversation.composer.bar'] {\n  grid-column: 1;\n  grid-row: 3;\n}\n\nbody.vice-art-enabled [class*='_composerHero'] [data-composer-card='true'] {\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 16px;\n  background: var(--dsw-alias-bg-layer-1);\n  box-shadow: 0 18px 52px rgba(10, 4, 20, 0.24);\n}\n\nbody.vice-art-enabled [class*='_composerHero'] [data-composer-input='true'],\nbody.vice-art-enabled [class*='_composerHero'] [data-composer-placeholder='true'] {\n  color: var(--dsw-alias-label-primary-dimmed);\n}\n\n/* ---------- the postcard ---------- */\n\n.vice-scene {\n  grid-column: 2;\n  grid-row: 1 / 4;\n  display: flex;\n  flex-direction: column;\n  align-self: center;\n  min-width: 0;\n  pointer-events: none;\n  animation: vice-scene-in 900ms var(--vice-ease) both;\n}\n\n.vice-eyebrow {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 14px;\n  color: var(--vice-rose);\n  font: 600 9px/1.2 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.24em;\n}\n\n.vice-eyebrow i {\n  width: 5px;\n  height: 5px;\n  background: var(--vice-hot);\n  box-shadow: 0 0 10px var(--vice-hot);\n  transform: rotate(45deg);\n}\n\n.vice-eyebrow span {\n  margin-left: auto;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 8px;\n  letter-spacing: 0.1em;\n}\n\n.vice-frame {\n  position: relative;\n  overflow: hidden;\n  aspect-ratio: 3 / 4;\n  max-height: clamp(310px, 52vh, 570px);\n  border: 1px solid rgba(255, 95, 146, 0.26);\n  border-radius: 8px;\n  background: #160e26;\n  box-shadow:\n    0 26px 70px rgba(0, 0, 0, 0.34),\n    0 0 0 1px rgba(255, 179, 92, 0.06) inset;\n  isolation: isolate;\n}\n\n.vice-sky {\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(180deg, #1b1038 0%, #3a1650 26%, #7c1f5c 52%, #d2405f 72%, #ff8a4c 88%, #ffcf6b 100%);\n}\n\n.vice-sun {\n  position: absolute;\n  left: 50%;\n  top: 16%;\n  width: 58%;\n  aspect-ratio: 1;\n  translate: -50% 0;\n  border-radius: 50%;\n  background: linear-gradient(180deg, #fff3c4 0%, #ffcf6b 30%, #ff8a4c 58%, #ff4d7e 82%, #c8348f 100%);\n  filter: drop-shadow(0 0 42px rgba(255, 110, 90, 0.42));\n  -webkit-mask-image: repeating-linear-gradient(180deg, #000 0 7px, transparent 7px 9px);\n  mask-image: repeating-linear-gradient(180deg, #000 0 7px, transparent 7px 9px);\n  opacity: var(--vice-opacity, 0.72);\n}\n\n.vice-skyline {\n  position: absolute;\n  inset: auto 0 34%;\n  height: 16%;\n  opacity: 0.92;\n  filter: drop-shadow(0 -1px 12px rgba(255, 120, 120, 0.45));\n}\n\n.vice-skyline svg {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n.vice-grid {\n  position: absolute;\n  inset: auto 0 0;\n  height: 40%;\n  background:\n    repeating-linear-gradient(90deg, rgba(255, 138, 180, 0.55) 0 1px, transparent 1px 38px),\n    repeating-linear-gradient(0deg, rgba(255, 150, 190, 0.42) 0 1px, transparent 1px 26px);\n  transform: perspective(260px) rotateX(66deg);\n  transform-origin: bottom center;\n  -webkit-mask-image: linear-gradient(0deg, #000 34%, transparent 94%);\n  mask-image: linear-gradient(0deg, #000 34%, transparent 94%);\n}\n\n.vice-palms {\n  position: absolute;\n  inset: auto 0 26%;\n  height: 46%;\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  filter: drop-shadow(0 6px 18px rgba(10, 4, 20, 0.55));\n}\n\n.vice-palms svg {\n  height: 100%;\n  width: auto;\n  opacity: 0.95;\n}\n\n.vice-palms svg:first-child { align-self: flex-end; height: 88%; margin-left: 2%; }\n.vice-palms svg:last-child { height: 100%; margin-right: 3%; }\n\n.vice-grain {\n  position: absolute;\n  inset: 0;\n  background-image: var(--vice-grain);\n  opacity: 0.22;\n  mix-blend-mode: overlay;\n  pointer-events: none;\n}\n\n.vice-frame::after {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(180deg, transparent 46%, rgba(12, 6, 22, 0.86) 100%);\n  pointer-events: none;\n}\n\n.vice-caption {\n  position: absolute;\n  z-index: 2;\n  inset: auto 20px 20px;\n}\n\n.vice-caption strong {\n  display: block;\n  color: #fff2e7;\n  font: 500 clamp(20px, 1.8vw, 28px)/1.15 Georgia, 'Times New Roman', serif;\n  letter-spacing: 0.02em;\n}\n\n.vice-caption span {\n  display: flex;\n  justify-content: space-between;\n  gap: 8px;\n  margin-top: 9px;\n  color: rgba(255, 205, 205, 0.72);\n  font: 600 8px/1.2 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.16em;\n}\n\n.vice-caption i {\n  color: var(--vice-gold);\n  font-style: normal;\n  letter-spacing: 2px;\n  opacity: 0.75;\n}\n\n.vice-scene-footer {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  margin-top: 15px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.vice-scene-footer span {\n  font: 600 8px/1 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0.18em;\n}\n\n.vice-scene-footer strong {\n  color: var(--vice-rose);\n  font: 500 12px/1 Georgia, 'Times New Roman', serif;\n  letter-spacing: 0.09em;\n}\n\n.vice-scene-footer i {\n  flex: 1;\n  height: 1px;\n  background: linear-gradient(90deg, rgba(255, 95, 146, 0.5), transparent);\n}\n\nbody:not(.vice-art-enabled) .vice-scene {\n  display: none;\n}\n\n@keyframes vice-scene-in {\n  from { opacity: 0; transform: translateY(14px); }\n  to { opacity: 1; transform: none; }\n}\n\n@media (max-width: 1000px) {\n  body.vice-art-enabled [class*='_composerHero'] {\n    grid-template-columns: minmax(280px, 1fr) minmax(200px, 0.7fr);\n    column-gap: 28px;\n    width: min(860px, calc(100% - 56px));\n  }\n  .vice-frame { max-height: min(46vh, 460px); }\n}\n\n@media (max-width: 760px) {\n  body.vice-art-enabled [class*='_composerHero'] {\n    display: block;\n    width: min(620px, calc(100% - 40px));\n    padding: 90px 0 40px;\n  }\n  .vice-scene { display: none; }\n}\n";

  // src/shared/constants.js
  var PLUGIN_ID = "dsh-theme-vice";
  var CONFIG_FORM_ID = "theme-vice";
  var DEFAULTS = Object.freeze({
    enabled: "1",
    background: "1",
    opacity: "72",
    blur: "0",
    glow: "1",
    motion: "1",
    intro: "1"
  });
  var BODY_DATA_KEYS = Object.freeze(["enabled", "background", "glow", "motion"]);
  var BODY_STYLE_KEYS = Object.freeze(["opacity", "blur"]);
  var ACTIVITY_STATES = Object.freeze([
    "idle",
    "listening",
    "thinking",
    "working",
    "waiting",
    "success",
    "error",
    "cancelled"
  ]);

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
  var styles_default5 = "/* Shell surfaces and typography. Colors come from the installed token palette;\n   this sheet only adds structure and the neon trim. */\n\nbody[data-vice-enabled='1'] {\n  --vice-ink: #0a0713;\n  --vice-hot: #ff5f92;\n  --vice-gold: #ffb35c;\n  --vice-cyan: #5fe0ea;\n  --vice-rose: #ffa7c3;\n  --vice-ease: cubic-bezier(.22, .7, .28, 1);\n  --vice-hairline: var(--dsw-hairline-width, 1px);\n  background-color: var(--dsw-alias-bg-base);\n}\n\n/* ---------- shell columns ---------- */\n\nbody[data-vice-enabled='1'] [class*='_sidebarCol'] {\n  position: relative;\n  isolation: isolate;\n  background:\n    linear-gradient(168deg, rgba(255, 95, 146, 0.06), transparent 46%),\n    var(--dsw-alias-bg-base) !important;\n  border-right: 1px solid var(--dsw-alias-border-l1);\n}\n\nbody[data-vice-enabled='1'] [class*='_mainPanel'] {\n  position: relative;\n  background:\n    radial-gradient(circle at 92% -6%, rgba(255, 95, 146, 0.07), transparent 38%),\n    radial-gradient(circle at 6% 104%, rgba(95, 224, 234, 0.05), transparent 42%),\n    var(--dsw-alias-bg-base);\n}\n\n/* Neon hairline along the top of the conversation column. */\nbody[data-vice-enabled='1'] [class*='_mainPanel']::before {\n  content: '';\n  position: absolute;\n  z-index: 5;\n  inset: 0 0 auto;\n  height: var(--vice-hairline);\n  background: linear-gradient(90deg,\n    transparent,\n    rgba(255, 95, 146, 0.42),\n    rgba(255, 179, 92, 0.34),\n    rgba(95, 224, 234, 0.28),\n    transparent);\n  pointer-events: none;\n}\n\nbody[data-vice-enabled='1'] [class*='_rightbarCol'] {\n  position: relative;\n  border-left: 1px solid var(--dsw-alias-border-l1);\n  background:\n    radial-gradient(circle at 100% 0%, rgba(255, 95, 146, 0.07), transparent 40%),\n    var(--dsw-alias-bg-base);\n}\n\n/* ---------- typography ---------- */\n\nbody[data-vice-enabled='1'] [class*='_headline'] {\n  letter-spacing: -0.02em;\n}\n\nbody[data-vice-enabled='1'] [class*='_titleGroup'] {\n  letter-spacing: -0.025em;\n}\n\nbody[data-vice-glow='1'] [class*='_headline'] {\n  text-shadow: 0 0 22px rgba(255, 95, 146, 0.20);\n}\n\n/* ---------- composer ---------- */\n\nbody[data-vice-enabled='1'] [class*='_composerStack'] [class*='_root']:has(textarea) {\n  border-color: var(--dsw-alias-border-l2);\n  transition: border-color 180ms var(--vice-ease), box-shadow 180ms var(--vice-ease);\n}\n\nbody[data-vice-enabled='1'] [class*='_composerStack'] [class*='_root']:has(textarea):focus-within {\n  border-color: var(--dsw-alias-border-selected);\n  box-shadow: 0 0 0 3px rgba(255, 95, 146, 0.10);\n}\n\nbody[data-vice-glow='1'][data-vice-enabled='1'] [data-composer-card='true']:focus-within {\n  box-shadow:\n    0 0 0 1px rgba(255, 95, 146, 0.28),\n    0 0 34px rgba(255, 95, 146, 0.14),\n    0 18px 52px rgba(0, 0, 0, 0.22);\n}\n\n/* ---------- small accents ---------- */\n\nbody[data-vice-enabled='1'] [class*='_scrollbar'] {\n  background-image: linear-gradient(180deg, rgba(255, 95, 146, 0.25), rgba(95, 224, 234, 0.18));\n}\n\nbody[data-vice-glow='1'][data-vice-enabled='1'] button[class*='_primary'] {\n  box-shadow: 0 6px 22px rgba(255, 95, 146, 0.26);\n}\n\n/* Respect the reduced-motion preference everywhere in this theme. */\n@media (prefers-reduced-motion: reduce) {\n  body[data-vice-enabled='1'] * {\n    animation-duration: 1ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 1ms !important;\n  }\n}\n";

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
          styles_default5,
          styles_default4,
          styles_default3,
          styles_default,
          styles_default2
        ]);
        const theme = createThemeController({ ctx, body });
        const scene = createScene({ body });
        const unregisterPanel = registerVicePanel({ ctx, React, store });
        const intro = createIntro();
        const motion = createMotion(body);
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        scene.start();
        function sync() {
          const { values } = store.getState();
          const animations = values.enabled === "1" && values.motion === "1" && !reducedMotion.matches;
          theme.sync(values);
          scene.sync(values);
          motion.sync(animations);
          intro.sync(animations && values.intro === "1");
        }
        const unsubscribeStore = store.subscribe(sync);
        reducedMotion.addEventListener?.("change", sync);
        sync();
        ctx.effect(() => () => {
          unsubscribeStore();
          reducedMotion.removeEventListener?.("change", sync);
          motion.dispose();
          intro.dispose();
          scene.dispose();
          theme.dispose();
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
