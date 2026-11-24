import { createConfigStore } from './core/config-store.js'
import { installStyles } from './core/styles.js'
import { createIntro } from './features/intro/index.js'
import introStyles from './features/intro/styles.css'
import { createMotion } from './features/motion/index.js'
import motionStyles from './features/motion/styles.css'
import { registerVicePanel } from './features/panel/index.js'
import panelStyles from './features/panel/styles.css'
import { createScene } from './features/scene/index.js'
import sceneStyles from './features/scene/styles.css'
import { createThemeController } from './features/theme/index.js'
import themeStyles from './features/theme/styles.css'
import { CONFIG_FORM_ID, DEFAULTS, PLUGIN_ID } from '../shared/constants.js'

window.__ModuleLoader__.load({
  id: PLUGIN_ID,
  factory(require) {
    const React = require('react')

    function apply(ctx) {
      const body = document.body
      const form = ctx.configForms.get(CONFIG_FORM_ID)
      const store = createConfigStore(form, DEFAULTS)
      const removeStyles = installStyles(PLUGIN_ID, [
        themeStyles,
        sceneStyles,
        panelStyles,
        introStyles,
        motionStyles,
      ])
      const theme = createThemeController({ ctx, body })
      const scene = createScene({ body })
      const unregisterPanel = registerVicePanel({ ctx, React, store })
      const intro = createIntro()
      const motion = createMotion(body)
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

      scene.start()

      function sync() {
        const { values } = store.getState()
        const animations = values.enabled === '1'
          && values.motion === '1'
          && !reducedMotion.matches
        theme.sync(values)
        scene.sync(values)
        motion.sync(animations)
        intro.sync(animations && values.intro === '1')
      }

      const unsubscribeStore = store.subscribe(sync)
      reducedMotion.addEventListener?.('change', sync)
      sync()

      ctx.effect(() => () => {
        unsubscribeStore()
        reducedMotion.removeEventListener?.('change', sync)
        motion.dispose()
        intro.dispose()
        scene.dispose()
        theme.dispose()
        unregisterPanel()
        store.dispose()
        removeStyles()
      }, 'vice: feature lifecycle')
    }

    return {
      name: PLUGIN_ID,
      inject: ['slots', 'configForms', 'theme'],
      apply,
    }
  },
})
