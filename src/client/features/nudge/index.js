const STORAGE_KEY = 'dsh-gta6:star-nudge'
const REPO = 'https://github.com/manyuemeiquqi/dsh-gta6'
const SHOW_DELAY_MS = 4200
const VISIBLE_MS = 10000
const FADE_MS = 420

function alreadySeen() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return true
  }
}

function markSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* private mode: fail closed, do not nag again this session */
  }
}

export function createNudge({ body }) {
  let el
  let showTimer = 0
  let hideTimer = 0
  let enabled = false
  let shown = false

  function clearTimers() {
    clearTimeout(showTimer)
    clearTimeout(hideTimer)
    showTimer = 0
    hideTimer = 0
  }

  function dismiss() {
    if (!el) return
    clearTimers()
    markSeen()
    el.dataset.state = 'leaving'
    const node = el
    el = undefined
    window.setTimeout(() => node.remove(), FADE_MS)
  }

  function build() {
    const node = document.createElement('div')
    node.className = 'vice-nudge'
    node.dataset.state = 'entering'
    node.innerHTML = `
      <a class="vice-nudge-body" href="${REPO}" target="_blank" rel="noreferrer noopener">
        <span class="vice-nudge-star" aria-hidden="true">★</span>
        <span class="vice-nudge-text">
          <b>Vice City 已启用</b>
          <i>喜欢的话，去 GitHub 点个 star</i>
        </span>
      </a>
      <button class="vice-nudge-close" type="button" aria-label="关闭提示">×</button>
    `
    node.querySelector('.vice-nudge-close').addEventListener('click', event => {
      event.preventDefault()
      event.stopPropagation()
      dismiss()
    })
    node.querySelector('.vice-nudge-body').addEventListener('click', () => markSeen())
    return node
  }

  function show() {
    if (shown || !enabled || el) return
    if (alreadySeen()) return
    shown = true
    el = build()
    body.appendChild(el)
    requestAnimationFrame(() => {
      if (el) el.dataset.state = 'shown'
    })
    hideTimer = window.setTimeout(dismiss, VISIBLE_MS)
  }

  return {
    sync(values) {
      enabled = values.enabled === '1'
      if (!enabled) {
        clearTimers()
        el?.remove()
        el = undefined
        return
      }
      if (!showTimer && !shown) showTimer = window.setTimeout(show, SHOW_DELAY_MS)
    },
    dispose() {
      clearTimers()
      el?.remove()
      el = undefined
    },
  }
}
