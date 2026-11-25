import { GRAIN_URI } from '../../core/art.js'

const SHARD_COUNT = 5
const LIFE_MS = 3000

export function createIntro({ assets }) {
  let shown = false
  let element
  let timer

  function play() {
    if (shown || document.querySelector('.vice-intro')) return
    shown = true

    const shards = Array.from({ length: SHARD_COUNT }, (_, index) => `
      <span class="vice-intro-shard"
        style="--vice-shard-left:${index * 20}%;
               --vice-shard-position:${index * 25}%;
               --vice-shard-delay:${240 + index * 70}ms"></span>`).join('')

    element = document.createElement('div')
    element.className = 'vice-intro'
    element.setAttribute('aria-hidden', 'true')
    element.style.setProperty('--vice-poster', `url("${assets.poster}")`)
    element.style.setProperty('--vice-grain', `url("${GRAIN_URI}")`)
    element.innerHTML = `
      <div class="vice-intro-stage">
        <div class="vice-intro-shards">${shards}</div>
        <img class="vice-intro-logo" src="${assets.logo}" alt="">
        <div class="vice-intro-flare"></div>
        <div class="vice-intro-grain"></div>
      </div>
      <div class="vice-intro-line"></div>
    `
    document.body.appendChild(element)

    timer = window.setTimeout(() => {
      element?.remove()
      element = undefined
      timer = undefined
    }, LIFE_MS)
  }

  return {
    sync(active) {
      if (active) play()
    },
    dispose() {
      if (timer !== undefined) window.clearTimeout(timer)
      timer = undefined
      element?.remove()
      element = undefined
    },
  }
}
