import { createConfigStore } from './core/config-store.js'
import { createRunSignal } from './core/run-signal.js'
import { createSessionState } from './core/session-state.js'
import { installStyles } from './core/styles.js'
import { registerBrandMark } from './features/brand/index.js'
import brandStyles from './features/brand/styles.css'
import conversationStyles from './features/conversation/styles.css'
import { createIntro } from './features/intro/index.js'
import introStyles from './features/intro/styles.css'
import { createMotion } from './features/motion/index.js'
import motionStyles from './features/motion/styles.css'
import { createNudge } from './features/nudge/index.js'
import nudgeStyles from './features/nudge/styles.css'
import { registerVicePanel } from './features/panel/index.js'
import panelStyles from './features/panel/styles.css'
import { createPet } from './features/pet/index.js'
import petStyles from './features/pet/styles.css'
import { createScene } from './features/scene/index.js'
import sceneStyles from './features/scene/styles.css'
import { createThemeController } from './features/theme/index.js'
import themeStyles from './features/theme/styles.css'
import toolsStyles from './features/tools/styles.css'
import { createWantedMeter } from './features/wanted/index.js'
import wantedStyles from './features/wanted/styles.css'
import { ASSETS, CONFIG_FORM_ID, DEFAULTS, PLUGIN_ID } from '../shared/constants.js'

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
        conversationStyles,
        toolsStyles,
        brandStyles,
        sceneStyles,
        panelStyles,
        petStyles,
        wantedStyles,
        introStyles,
        motionStyles,
        nudgeStyles,
      ])
      const theme = createThemeController({ ctx, body })
      const scene = createScene({ body, assets: ASSETS })
      const sessionState = createSessionState({ ctx })
      const unregisterPanel = registerVicePanel({ ctx, React, store, assets: ASSETS, sessionState })
      let sidebarRight
      ctx.inject(['sidebarRight'], child => { sidebarRight = child.sidebarRight })
      const unregisterBrand = registerBrandMark()
      const runSignal = createRunSignal({ body, sessionState })
      const wanted = createWantedMeter({ body, signal: runSignal })
      const intro = createIntro({ assets: ASSETS })
      const motion = createMotion(body)
      const nudge = createNudge({ body })
      const pet = createPet({
        body,
        assets: ASSETS,
        signal: runSignal,
        sessionState,
        openPanel: () => sidebarRight?.openTab('vice-coast'),
      })
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

      runSignal.start()
      scene.start()
      wanted.start()

      function sync() {
        const { values } = store.getState()
        const animations = values.enabled === '1'
          && values.motion === '1'
          && !reducedMotion.matches
        theme.sync(values)
        scene.sync(values)
        motion.sync(animations)
        intro.sync(animations && values.intro === '1')
        pet.sync(values)
        nudge.sync(values)
      }

      const unsubscribeStore = store.subscribe(sync)
      reducedMotion.addEventListener?.('change', sync)
      sync()

      ctx.effect(() => () => {
        unsubscribeStore()
        reducedMotion.removeEventListener?.('change', sync)
        motion.dispose()
        nudge.dispose()
        intro.dispose()
        pet.dispose()
        wanted.dispose()
        runSignal.dispose()
        scene.dispose()
        theme.dispose()
        unregisterBrand()
        unregisterPanel()
        sessionState.dispose()
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
