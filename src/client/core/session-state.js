/**
 * Session state — the real numbers behind the right-hand panel.
 *
 * The harness keeps a list store (`ctx.sessions.list`) whose snapshot holds one
 * entry per session, keyed by id. Each entry carries the display title, a
 * `running` flag, and a `projectionValues` bag with token usage and the model
 * selection. That is a proper signal, not a scrape of rendered text.
 *
 * The id of the session on screen is published by the conversation region as
 * `data-conversation-session`. Only that one element is watched; the listener
 * is reattached lazily if React swaps the element out.
 */

const REGION_SELECTOR = '[data-conversation-session]'

export function createSessionState({ ctx }) {
  const listeners = new Set()
  let snapshot
  let watched
  let observer
  let sessionId

  function emit() {
    for (const listener of listeners) listener()
  }

  function attach() {
    const element = document.querySelector(REGION_SELECTOR)
    if (!element || element === watched) return
    observer?.disconnect()
    watched = element
    sessionId = element.getAttribute('data-conversation-session') || undefined
    if (!sessionId) return
    observer = new MutationObserver(() => {
      const next = watched.getAttribute('data-conversation-session') || undefined
      if (next === sessionId) return
      sessionId = next
      emit()
    })
    observer.observe(watched, { attributes: true, attributeFilter: ['data-conversation-session'] })
  }

  function current() {
    attach()
    if (!sessionId || !snapshot) return null
    const entry = snapshot.byId?.[sessionId]
    if (!entry) return null
    const values = entry.projectionValues || {}
    const usage = values.tokenUsage || {}
    const model = values.modelSelection?.lastUsed || values.modelSelection?.next || null
    return {
      title: entry.displayTitle || values.title || '',
      running: entry.running === true,
      agentPreset: values.agentPreset || '',
      model: model?.model || '',
      effort: model?.reasoningEffort || '',
      inputTokens: usage.uncachedInputTokens ?? 0,
      outputTokens: usage.outputTokens ?? 0,
      cacheReadTokens: usage.cacheReadTokens ?? 0,
    }
  }

  ctx.inject(['sessions'], child => {
    const list = child.sessions.list
    snapshot = list.getSnapshot()
    emit()
    const unsubscribe = list.subscribe(() => {
      snapshot = list.getSnapshot()
      emit()
    })
    ctx.effect(() => () => unsubscribe())
  })

  return {
    current,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    dispose() {
      observer?.disconnect()
      observer = undefined
      watched = undefined
      listeners.clear()
    },
  }
}
