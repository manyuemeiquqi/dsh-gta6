import { sceneArtHtml } from '../scene/art.js'

const MARK = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 15h16" stroke="currentColor" stroke-width="1.6"/></svg>`

export function registerVicePanel({ ctx, React, store }) {
  let unregister = () => {}

  ctx.inject(['sidebarRightTabs', 'sidebarRight'], child => {
    const tabs = child.sidebarRightTabs
    const sidebar = child.sidebarRight
    const h = React.createElement

    unregister = tabs.register({
      id: 'vice-coast',
      kind: 'vice-coast',
      priority: 'extension',
      title: () => 'Neon Coast',
      guide: [{
        id: 'neon-coast',
        order: 10,
        title: () => 'Neon Coast',
        description: () => 'A sunset postcard for your workspace.',
        icon: () => h('span', { className: 'vice-guide-icon', dangerouslySetInnerHTML: { __html: MARK } }),
      }],
    })

    function Panel() {
      const [, refresh] = React.useReducer(value => value + 1, 0)
      React.useEffect(() => store.subscribe(refresh), [store])
      if (store.getState().values.enabled !== '1') return null

      return h('div', { className: 'vice-panel' },
        h('div', { className: 'vice-panel-top' },
          h('span', null, 'SUNSET STRIP · 1986'),
          h('button', {
            type: 'button',
            className: 'vice-panel-back',
            onClick: () => sidebar.openTab('guide', { replaceTab: true }),
          }, '工具 / TOOLS')),
        h('div', { className: 'vice-panel-heading' },
          h('div', null,
            h('p', null, 'WELCOME TO'),
            h('h1', null, 'Neon Coast')),
          h('div', { className: 'vice-stars', 'aria-label': 'Decorative rating' },
            h('span', null, 'VIBE'), h('b', null, '★★★★★'))),
        h('div', { className: 'vice-panel-card' },
          h('div', { className: 'vice-frame', dangerouslySetInnerHTML: { __html: sceneArtHtml() } })),
        h('div', { className: 'vice-panel-strip' },
          h('div', { className: 'vice-panel-tile is-cyan' }, h('span', null, 'MIDNIGHT DRIVE')),
          h('div', { className: 'vice-panel-tile is-rose' }, h('span', null, 'GOLDEN HOUR'))),
        h('div', { className: 'vice-panel-footer' },
          h('i', null), h('span', null, 'ENJOY THE VIEW'), h('i', null)))
    }

    child.slots.inject('sidebar.right.pane.tab', function* () {
      yield child.slots.register({
        name: 'sidebar.right.pane.tab',
        key: 'vice-coast',
        order: 10,
      }, Panel)
    })
  })

  return () => unregister()
}
