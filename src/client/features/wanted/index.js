/**
 * Wanted level.
 *
 * GTA's wanted meter is the one piece of game language that maps cleanly onto
 * an agent's real state: the street is quiet until the agent starts working.
 *
 * The level is published on `body[data-vice-wanted]` and the artwork reads it
 * from CSS, so one signal drives every star on screen. The observing itself
 * lives in `core/run-signal.js`, shared with the pet.
 */

const MAX_LEVEL = 6

export function createWantedMeter({ body, signal }) {
  let level = 0
  let unsubscribe = () => {}

  function apply(running) {
    const next = running ? MAX_LEVEL : 0
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

  return {
    start() {
      apply(signal.get())
      unsubscribe = signal.subscribe(apply)
    },
    dispose() {
      unsubscribe()
      unsubscribe = () => {}
      apply(false)
    },
  }
}
