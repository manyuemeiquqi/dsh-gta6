/**
 * Agent run signal — one source, many subscribers.
 *
 * Preferred source is the harness's own session entry: `sessions.list` carries
 * a `running` flag per session, which is the truth rather than an inference.
 * When no session is on screen (the root page, or the list has not loaded yet)
 * it falls back to the stop control, which is the only DOM-level hint available.
 *
 * Two features want this state (the wanted stars and the pet), so one observer
 * and one debounced scan are shared instead of duplicated: during a streaming
 * reply the page mutates hundreds of times.
 */

const STOP_LABELS = new Set(['停止生成', 'Stop generating'])
const SETTLE_MS = 260

export function createRunSignal({ body, sessionState }) {
  const listeners = new Set()
  let observer
  let timer
  let scheduled = false
  let running = false
  let started = false
  let unsubscribeSession = () => {}

  function readStopControl() {
    return [...document.querySelectorAll('button')]
      .some(button => STOP_LABELS.has(button.getAttribute('aria-label') || ''))
  }

  function read() {
    const session = sessionState?.current?.()
    if (session && typeof session.running === 'boolean') return session.running
    return readStopControl()
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
      unsubscribeSession = sessionState ? sessionState.subscribe(schedule) : () => {}
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
      unsubscribeSession()
      unsubscribeSession = () => {}
      listeners.clear()
      running = false
      started = false
    },
  }
}
