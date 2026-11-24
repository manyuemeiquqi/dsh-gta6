const REVEAL_SELECTOR = [
  '[data-message-id]',
  '[data-turn-id]',
  '[class*="_messageRow"]',
  '[class*="_turnContainer"]',
  '[class*="_conversationTurn"]',
  '[class*="_messageItem"]',
].join(',')

const SCROLL_ROOT_SELECTOR = [
  '[class*="_scrollBody"]',
  '[class*="_scrollArea"]',
  '[class*="_scrollRegion"]',
].join(',')

const SKIP_SELECTOR = '.vice-intro, .vice-panel, nav, [role="navigation"]'

export function createMotion(body) {
  let active = false
  let cleanup
  let generation = 0

  function stop() {
    generation += 1
    cleanup?.()
    cleanup = undefined
    active = false
  }

  function start() {
    if (active) return
    active = true
    const current = ++generation

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('vice-visible')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' })

    function mark(element) {
      if (!(element instanceof HTMLElement)
        || element.classList.contains('vice-reveal')
        || element.closest(SKIP_SELECTOR)) return
      requestAnimationFrame(() => {
        if (generation !== current
          || !element.isConnected
          || element.offsetHeight < 32
          || element.offsetWidth < 180) return
        element.classList.add('vice-reveal')
        observer.observe(element)
      })
    }

    document.querySelectorAll(REVEAL_SELECTOR).forEach(mark)
    document.querySelectorAll(
      '[class*="_mainPanel"] [class*="_scrollBody"] > *, [class*="_mainPanel"] [class*="_scrollArea"] > *, [class*="_mainPanel"] [class*="_scrollRegion"] > *',
    ).forEach(mark)

    const mutations = new MutationObserver(records => {
      for (const record of records) {
        for (const added of record.addedNodes) {
          if (!(added instanceof HTMLElement)) continue
          if (added.matches(REVEAL_SELECTOR)) mark(added)
          added.querySelectorAll(REVEAL_SELECTOR).forEach(mark)
          const scrollRoot = added.closest(SCROLL_ROOT_SELECTOR)
          if (!scrollRoot || !scrollRoot.closest('[class*="_mainPanel"]')) continue
          let block = added
          while (block.parentElement && block.parentElement !== scrollRoot) block = block.parentElement
          mark(block)
        }
      }
    })
    mutations.observe(body, { childList: true, subtree: true })

    cleanup = () => {
      mutations.disconnect()
      observer.disconnect()
      document.querySelectorAll('.vice-reveal').forEach(element => {
        element.classList.remove('vice-reveal', 'vice-visible')
      })
    }
  }

  return {
    sync(next) {
      if (next === active) return
      if (next) start()
      else stop()
    },
    dispose: stop,
  }
}
