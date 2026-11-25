/**
 * Agent run signal — one observer, many subscribers.
 *
 * The harness exposes no public "the agent is working" flag. The stop control
 * is the only reliable signal, and its label is localised, hence matching on
 * either language.
 *
 * Two features want this state (the wanted stars and the pet), and both used to
 * observe the whole document independently. During a streaming reply the page
 * mutates hundreds of times, so that meant hundreds of full-document button
 * scans, twice over. This module keeps a single observer and a single scan,
 * debounced, and fans the result out.
 */

const STOP_LABELS = new Set(['停止生成', 'Stop generating'])
const SETTLE_MS = 260

export function createRunSignal({ body }) {
  const listeners = new Set()
  let observer
  let timer
  let scheduled = false
  let running = false
  let started = false

  function read() {
    return [...document.querySelectorAll('button')]
      .some(button => STOP_LABELS.has(button.getAttribute('aria-label') || ''))
  }

  function publish() {
    scheduled = false
    const next = read()
    if (next === running) return
    running = next
    for (const listener of listeners) listener(running)
  }

  function schedule() {
    if (scheduled) return
    scheduled = true
    window.clearTimeout(timer)
    timer = window.setTimeout(publish, SETTLE_MS)
  }

  return {
    start() {
      if (started) return
      started = true
      running = read()
      observer = new MutationObserver(schedule)
      observer.observe(body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-label', 'disabled'],
      })
    },

    /** Current state, for a subscriber that mounts mid-run. */
    get() {
      return running
    },

    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    dispose() {
      window.clearTimeout(timer)
      timer = undefined
      scheduled = false
      observer?.disconnect()
      observer = undefined
      listeners.clear()
      running = false
      started = false
    },
  }
}
