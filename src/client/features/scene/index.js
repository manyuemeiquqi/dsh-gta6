import { sceneArtHtml } from './art.js'

const HERO_SELECTOR = '[class*="_composerHero"]'

export function createScene({ body }) {
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
    scene.setAttribute('aria-hidden', 'true')
    scene.innerHTML = `
      <div class="vice-eyebrow"><i></i> NEON COAST <span>SUNSET STRIP · 1986</span></div>
      <div class="vice-frame">${sceneArtHtml()}</div>
      <div class="vice-scene-footer"><span>WELCOME TO</span><strong>NEON COAST</strong><i></i></div>
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
