import { sceneArtHtml } from './art.js'

const HERO_SELECTOR = '[class*="_composerHero"]'

export function createScene({ body, assets }) {
  let scene
  let observer
  let scheduled = 0
  let enabled = false

  function remove() {
    scene?.remove()
    scene = undefined
  }

  function mount(hero) {
    if (scene && scene.parentElement === hero) return
    remove()
    scene = document.createElement('div')
    scene.className = 'vice-scene'
    scene.innerHTML = `
      <div class="vice-eyebrow" aria-hidden="true"><i></i> GRAND THEFT AUTO VI <span>LEONIDA · 2026</span></div>
      <div class="vice-frame" aria-hidden="true">${sceneArtHtml(assets)}</div>
      <div class="vice-scene-footer">
        <span aria-hidden="true">WELCOME TO</span>
        <strong aria-hidden="true">VICE CITY</strong>
        <i aria-hidden="true"></i>
        <a class="vice-scene-star" href="https://github.com/manyuemeiquqi/dsh-gta6" target="_blank" rel="noreferrer noopener" title="在 GitHub 上给这个项目点个 star"><span class="vice-scene-star-glyph" aria-hidden="true">★</span> STAR ON GITHUB</a>
      </div>
    `
    hero.appendChild(scene)
  }

  function sync() {
    if (!enabled) {
      remove()
      return
    }
    const hero = document.querySelector(HERO_SELECTOR)
    if (!hero) {
      remove()
      return
    }
    mount(hero)
  }

  function schedule() {
    if (scheduled) return
    scheduled = requestAnimationFrame(() => {
      scheduled = 0
      sync()
    })
  }

  return {
    sync(values) {
      enabled = values.enabled === '1' && values.background === '1'
      body.classList.toggle('vice-art-enabled', enabled)
      schedule()
    },
    start() {
      observer = new MutationObserver(schedule)
      observer.observe(body, { childList: true, subtree: true })
      window.addEventListener('resize', schedule)
    },
    dispose() {
      observer?.disconnect()
      observer = undefined
      cancelAnimationFrame(scheduled)
      scheduled = 0
      window.removeEventListener('resize', schedule)
      body.classList.remove('vice-art-enabled')
      remove()
    },
  }
}
