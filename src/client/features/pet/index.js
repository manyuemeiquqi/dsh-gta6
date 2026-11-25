/**
 * Desktop pet: Jason and Lucia, cut from Rockstar's official 4K press shots.
 *
 * They live in a fixed layer over the conversation, idle on their own, react
 * when the agent starts working, and hop once when it finishes. Two poses take
 * turns so the corner does not wear out, and the pair is draggable with edge
 * snapping; that position is the only thing kept in localStorage, since it is
 * a per-viewer convenience.
 *
 * State comes from the same signal the wanted stars use — the harness's own
 * stop control — so the two never disagree.
 */

const STORAGE_KEY = 'dsh-theme-vice:pet'
const SLEEP_AFTER_MS = 45_000
const DONE_MS = 1300
const BUBBLE_MS = 3600
const DRAG_THRESHOLD = 5
const SNAP_MARGIN = 30
const EDGE = 26
const POSE_TURN_MS = 26_000

// Two voices, not one. Jason answers in short, flat sentences; Lucia is the
// one pushing the schedule. Every line sits between 8 and 12 characters so the
// bubble never jumps width, and the place names are Vice City's own.
const LINES = [
  { who: 'JASON', line: '车没熄火，走。' },
  { who: 'JASON', line: '我数到三，一起动手。' },
  { who: 'JASON', line: '别急，先看清楚。' },
  { who: 'LUCIA', line: '这次换我开车。' },
  { who: 'LUCIA', line: '天快亮了，动作快点。' },
  { who: 'LUCIA', line: 'Ocean Beach，老地方见。' },
]

export function createPet({ body, assets }) {
  let host
  let stage
  let layers = []
  let bubble
  let observer
  let bubbleTimer
  let sleepTimer
  let doneTimer
  let poseTimer
  let running = false
  let state = 'idle'
  let pose = 0
  let position = readPosition()
  let drag = null
  let lastLine = -1

  function readPosition() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!Number.isFinite(parsed?.x) || !Number.isFinite(parsed?.y)) return null
      return { x: parsed.x, y: parsed.y }
    } catch {
      return null
    }
  }

  function savePosition(next) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage blocked: the pet simply forgets where it was */
    }
  }

  function clampPosition(x, y) {
    const width = host.offsetWidth || 160
    const height = host.offsetHeight || 170
    return {
      x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - width)),
      y: Math.min(Math.max(0, y), Math.max(0, window.innerHeight - height)),
    }
  }

  /** Pull the pair to whichever edge they were dropped nearest. */
  function snapPosition(next) {
    const width = host.offsetWidth || 160
    const height = host.offsetHeight || 170
    const rightEdge = window.innerWidth - width - EDGE
    const bottomEdge = window.innerHeight - height - EDGE
    const snapped = { ...next }

    if (Math.abs(next.x - EDGE) < SNAP_MARGIN) snapped.x = EDGE
    else if (Math.abs(next.x - rightEdge) < SNAP_MARGIN) snapped.x = rightEdge

    if (Math.abs(next.y - EDGE) < SNAP_MARGIN) snapped.y = EDGE
    else if (Math.abs(next.y - bottomEdge) < SNAP_MARGIN) snapped.y = bottomEdge

    return snapped
  }

  function applyPosition() {
    if (!position) return
    position = clampPosition(position.x, position.y)
    host.style.left = `${position.x}px`
    host.style.top = `${position.y}px`
    host.style.right = 'auto'
    host.style.bottom = 'auto'
  }

  function showPose(index) {
    if (index === pose || layers.length < 2) return
    pose = index
    layers.forEach((layer, i) => layer.classList.toggle('is-active', i === index))
  }

  function setState(next) {
    if (next === state || !host) return
    state = next
    host.dataset.state = next
    window.clearTimeout(doneTimer)
    if (next === 'done') doneTimer = window.setTimeout(() => setState(running ? 'working' : 'idle'), DONE_MS)
    // The pair shifts pose when the work starts, and settles back when it ends.
    if (next === 'working') showPose(1)
    else if (next === 'done') showPose(0)
  }

  function armSleep() {
    window.clearTimeout(sleepTimer)
    sleepTimer = window.setTimeout(() => {
      if (!running) setState('sleep')
    }, SLEEP_AFTER_MS)
  }

  function armPoseTurn() {
    window.clearTimeout(poseTimer)
    poseTimer = window.setTimeout(() => {
      if (state === 'idle') showPose(pose === 0 ? 1 : 0)
      armPoseTurn()
    }, POSE_TURN_MS)
  }

  function applyRunning(next) {
    if (next === running) return
    running = next
    if (running) {
      window.clearTimeout(sleepTimer)
      setState('working')
    } else {
      setState('done')
      armSleep()
    }
  }

  function readRunning() {
    // The harness exposes no public "agent is working" flag, so the stop
    // control is the signal. Its label is localised, hence the match on either.
    return [...document.querySelectorAll('button')].some(button => {
      const label = button.getAttribute('aria-label') || ''
      return label === '停止生成' || label === 'Stop generating'
    })
  }

  function say() {
    if (!bubble) return
    let index = Math.floor(Math.random() * LINES.length)
    if (LINES.length > 1 && index === lastLine) index = (index + 1) % LINES.length
    lastLine = index
    const { who, line } = LINES[index]
    const name = document.createElement('b')
    name.className = 'vice-pet-who'
    name.textContent = who
    const text = document.createElement('span')
    text.textContent = line
    bubble.replaceChildren(name, text)
    bubble.dataset.who = who.toLowerCase()
    bubble.hidden = false
    window.clearTimeout(bubbleTimer)
    bubbleTimer = window.setTimeout(() => {
      if (bubble) bubble.hidden = true
    }, BUBBLE_MS)
  }

  function onPointerDown(event) {
    if (event.button !== 0) return
    const rect = host.getBoundingClientRect()
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    }
    host.setPointerCapture?.(event.pointerId)
    host.classList.add('is-dragging')
    window.clearTimeout(sleepTimer)
    if (state === 'sleep') setState('idle')
    event.preventDefault()
  }

  function onPointerMove(event) {
    if (!drag || event.pointerId !== drag.pointerId) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) drag.moved = true
    if (!drag.moved) return
    position = clampPosition(drag.originX + dx, drag.originY + dy)
    applyPosition()
  }

  function onPointerUp(event) {
    if (!drag || event.pointerId !== drag.pointerId) return
    host.releasePointerCapture?.(event.pointerId)
    host.classList.remove('is-dragging')
    const moved = drag.moved
    drag = null
    if (moved) {
      if (position) {
        position = snapPosition(position)
        applyPosition()
        savePosition(position)
      }
      armSleep()
    } else {
      say()
    }
  }

  function onResize() {
    if (!position) return
    const clamped = clampPosition(position.x, position.y)
    if (clamped.x === position.x && clamped.y === position.y) return
    position = clamped
    applyPosition()
    savePosition(position)
  }

  function onClick(event) {
    // A drag already handled the pointer; keep the synthetic click quiet.
    if (drag) return
    event.preventDefault()
  }

  function mount() {
    if (host) return

    host = document.createElement('div')
    host.className = 'vice-pet'
    host.setAttribute('role', 'img')
    host.setAttribute('aria-label', 'Jason 与 Lucia')

    bubble = document.createElement('div')
    bubble.className = 'vice-pet-bubble'
    bubble.hidden = true

    stage = document.createElement('div')
    stage.className = 'vice-pet-stage'

    layers = [assets.pet, assets.petAlt].filter(Boolean).map((src, index) => {
      const layer = document.createElement('img')
      layer.className = 'vice-pet-layer'
      layer.src = src
      layer.alt = ''
      layer.draggable = false
      if (index === 0) layer.classList.add('is-active')
      stage.appendChild(layer)
      return layer
    })

    host.append(bubble, stage)
    body.appendChild(host)

    applyPosition()
    host.addEventListener('pointerdown', onPointerDown)
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerup', onPointerUp)
    host.addEventListener('pointercancel', onPointerUp)
    host.addEventListener('click', onClick)
    window.addEventListener('resize', onResize)

    observer = new MutationObserver(() => applyRunning(readRunning()))
    observer.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label'] })

    running = readRunning()
    state = running ? 'working' : 'idle'
    pose = 0
    host.dataset.state = state
    if (running) showPose(1)
    else armSleep()
    armPoseTurn()
  }

  function unmount() {
    observer?.disconnect()
    observer = undefined
    window.clearTimeout(bubbleTimer)
    window.clearTimeout(sleepTimer)
    window.clearTimeout(doneTimer)
    window.clearTimeout(poseTimer)
    if (!host) return
    host.removeEventListener('pointerdown', onPointerDown)
    host.removeEventListener('pointermove', onPointerMove)
    host.removeEventListener('pointerup', onPointerUp)
    host.removeEventListener('pointercancel', onPointerUp)
    host.removeEventListener('click', onClick)
    window.removeEventListener('resize', onResize)
    host.remove()
    host = undefined
    stage = undefined
    layers = []
    bubble = undefined
    drag = null
    running = false
    state = 'idle'
    pose = 0
  }

  return {
    sync(values) {
      const visible = values.enabled === '1' && values.pet === '1'
      if (visible) mount()
      else unmount()
    },

    dispose() {
      unmount()
    },
  }
}
