export function createConfigStore(form, defaults) {
  const listeners = new Set()
  const pending = new Map()
  let snapshot = form.getSnapshot()

  function reconcile() {
    for (const [key, operation] of pending) {
      if (!operation.failed && snapshot.value?.[key] === operation.value) pending.delete(key)
    }
  }

  function emit() {
    for (const listener of listeners) listener()
  }

  const unsubscribeForm = form.subscribe(() => {
    snapshot = form.getSnapshot()
    reconcile()
    emit()
  })

  function getState() {
    const values = { ...defaults, ...(snapshot.value || {}) }
    for (const [key, operation] of pending) values[key] = operation.value
    return {
      snapshot,
      values,
      failed: [...pending.values()].some(operation => operation.failed),
    }
  }

  async function update(key, value) {
    if (snapshot.status !== 'ready' || snapshot.writable !== true) return false
    pending.set(key, { value, failed: false })
    emit()
    try {
      const ok = await form.set(key, value)
      snapshot = form.getSnapshot()
      const operation = pending.get(key)
      if (operation?.value !== value) return ok
      if (ok && snapshot.value?.[key] === value) pending.delete(key)
      else operation.failed = true
      emit()
      return ok
    } catch {
      const operation = pending.get(key)
      if (operation?.value === value) operation.failed = true
      emit()
      return false
    }
  }

  return {
    getState,
    update,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    dispose() {
      unsubscribeForm()
      listeners.clear()
      pending.clear()
    },
  }
}
