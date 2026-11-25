/**
 * Wanted level.
 *
 * GTA's wanted meter is the one piece of game language that maps cleanly onto
 * an agent's real state: the street is quiet until the agent starts working.
 * While a run is in flight the harness shows its stop control, so that button
 * is the signal — no text scraping, no guessing from message contents.
 *
 * The level is published on `body[data-vice-wanted]` and the artwork reads it
 * from CSS, so a single observer drives every star on screen.
 */

const STOP_LABEL = '停止生成'
const SETTLE_MS = 260

export function createWantedMeter({ body }) {
  let observer
  let timer
  let level = 0

  function read() {
    const running = [...document.querySelectorAll('button')]
      .some(button => (button.getAttribute('aria-label') || '') === STOP_LABEL)
    return running ? 6 : 0
  }

  function apply(next) {
    if (next === level) return
    level = next
    if (next > 0) {
      body.dataset.viceWanted = String(next)
      body.setAttribute('data-vice-wanted', String(next))
    } else {
      delete body.dataset.viceWanted
      body.removeAttribute('data-vice-wanted')
    }
  }

  function schedule() {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => apply(read()), SETTLE_MS)
  }

  return {
    start() {
      apply(read())
      observer = new MutationObserver(schedule)
      observer.observe(body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-label', 'disabled'],
      })
    },
    dispose() {
      window.clearTimeout(timer)
      timer = undefined
      observer?.disconnect()
      observer = undefined
      apply(0)
    },
  }
}
