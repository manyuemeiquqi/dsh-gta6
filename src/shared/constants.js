export const PLUGIN_ID = 'dsh-theme-vice'
export const CONFIG_FORM_ID = 'theme-vice'

export const DEFAULTS = Object.freeze({
  enabled: '1',
  background: '1',
  opacity: '72',
  blur: '0',
  glow: '1',
  motion: '1',
  intro: '1',
})

export const BODY_DATA_KEYS = Object.freeze(['enabled', 'background', 'glow', 'motion'])
export const BODY_STYLE_KEYS = Object.freeze(['opacity', 'blur'])

/** Activity states the theme understands; kept here so features share one list. */
export const ACTIVITY_STATES = Object.freeze([
  'idle',
  'listening',
  'thinking',
  'working',
  'waiting',
  'success',
  'error',
  'cancelled',
])
