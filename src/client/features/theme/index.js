import { BODY_DATA_KEYS, BODY_STYLE_KEYS, PLUGIN_ID } from '../../../shared/constants.js'
import { ASSETS } from '../../../shared/constants.js'
import { palette } from './palette.js'

function datasetName(key) {
  return `vice${key[0].toUpperCase()}${key.slice(1)}`
}

export function createThemeController({ ctx, body }) {
  let restore

  function install() {
    if (!restore) restore = ctx.theme.overrideTokens(PLUGIN_ID, palette)
  }

  function uninstall() {
    restore?.()
    restore = undefined
  }

  return {
    sync(values) {
      if (values.enabled === '1') install()
      else uninstall()

      for (const key of BODY_DATA_KEYS) {
        if (values.enabled === '1') body.dataset[datasetName(key)] = values[key]
        else delete body.dataset[datasetName(key)]
      }

      if (values.enabled === '1') {
        body.style.setProperty('--vice-opacity', String(Number(values.opacity) / 100))
        body.style.setProperty('--vice-blur', `${Number(values.blur)}px`)
        body.style.setProperty('--vice-logo', `url("${ASSETS.logo}")`)
        body.style.setProperty('--vice-poster', `url("${ASSETS.poster}")`)
      } else {
        for (const key of BODY_STYLE_KEYS) body.style.removeProperty(`--vice-${key}`)
      }
    },

    dispose() {
      uninstall()
      for (const key of BODY_DATA_KEYS) delete body.dataset[datasetName(key)]
      for (const key of BODY_STYLE_KEYS) body.style.removeProperty(`--vice-${key}`)
    },
  }
}
