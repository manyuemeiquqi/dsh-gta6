export function createIntro() {
  let shown = false
  let element
  let timer

  function play() {
    if (shown || document.querySelector('.vice-intro')) return
    shown = true

    element = document.createElement('div')
    element.className = 'vice-intro'
    element.setAttribute('aria-hidden', 'true')
    element.innerHTML = `
      <div class="vice-intro-sky"></div>
      <div class="vice-intro-sun"></div>
      <div class="vice-intro-horizon"></div>
      <div class="vice-intro-grid"></div>
      <div class="vice-intro-copy">
        <span class="vice-intro-kicker">SUNSET STRIP · 1986</span>
        <span class="vice-intro-title">NEON COAST</span>
      </div>
    `
    document.body.appendChild(element)

    timer = window.setTimeout(() => {
      element?.remove()
      element = undefined
      timer = undefined
    }, 2800)
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
