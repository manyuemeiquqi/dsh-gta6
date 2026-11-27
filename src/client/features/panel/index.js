import { radarSvg } from '../../core/art.js'

function formatTokens(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(Math.round(n))
}

export function registerVicePanel({ ctx, React, store, assets, sessionState }) {
  let unregister = () => {}

  ctx.inject(['sidebarRightTabs', 'sidebarRight'], child => {
    const tabs = child.sidebarRightTabs
    const sidebar = child.sidebarRight
    const h = React.createElement

    unregister = tabs.register({
      id: 'vice-coast',
      kind: 'vice-coast',
      priority: 'extension',
      title: () => 'Vice City',
      guide: [{
        id: 'neon-coast',
        order: 10,
        title: () => 'Vice City',
        description: () => 'Leonida, neon nights, and your next move.',
        icon: () => h('img', { src: assets.logo, alt: '', className: 'vice-guide-icon' }),
      }],
    })

    function Panel() {
      const [, refresh] = React.useReducer(value => value + 1, 0)
      React.useEffect(() => store.subscribe(refresh), [store])
      React.useEffect(() => sessionState.subscribe(refresh), [sessionState])
      if (store.getState().values.enabled !== '1') return null

      const session = sessionState.current()
      const total = session ? session.inputTokens + session.outputTokens : 0
      const model = session?.model ? session.model.toUpperCase() : '—'
      const detail = session
        ? [session.effort.toUpperCase(), session.agentPreset.toUpperCase()].filter(Boolean).join(' · ')
        : 'NO SESSION'

      return h('div', { className: 'vice-panel' },
        h('div', { className: 'vice-panel-top' },
          h('span', null, 'GRAND THEFT AUTO VI'),
          h('button', {
            type: 'button',
            className: 'vice-panel-back',
            onClick: () => sidebar.openTab('guide', { replaceTab: true }),
          }, '工具 / LEONIDA')),
        h('div', { className: 'vice-panel-heading' },
          h('div', null,
            h('p', null, 'WELCOME TO'),
            h('h1', null, 'Vice City')),
          h('div', { className: 'vice-wanted-panel', 'aria-label': 'Wanted level decoration' },
            h('span', null, 'WANTED'), h('b', null, '★★★★★★'))),
        h('div', { className: 'vice-panel-card' },
          h('img', { src: assets.postcard, alt: 'Vice City postcard artwork' }),
          h('div', { className: 'vice-panel-card-shade' }),
          h('span', null, 'VISIT LEONIDA')),
        h('div', { className: 'vice-panel-meter' },
          h('div', { className: 'vice-panel-radar', dangerouslySetInnerHTML: { __html: radarSvg('#ff5f92') } }),
          h('div', { className: 'vice-panel-radio' },
            h('span', null, 'SESSION'),
            h('strong', { title: session?.title || '' }, session?.title || '—')),
          h('div', { className: 'vice-panel-speed', 'aria-hidden': true },
            h('span', { className: 'vice-panel-speed-needle' }),
            h('b', null, formatTokens(total)),
            h('i', null, 'TOK'))),
        h('div', { className: 'vice-checker', 'aria-hidden': true }),
        h('div', { className: 'vice-panel-strip' },
          h('figure', null,
            h('img', { src: assets.cheetah, alt: 'Grotti Cheetah in Vice City' }),
            h('figcaption', null, 'GROTTI CHEETAH')),
          h('figure', null,
            h('img', { src: assets.beachNight, alt: 'Vice Beach at night' }),
            h('figcaption', null, 'VICE BEACH · 917'))),
        h('div', { className: 'vice-panel-crime' },
          h('span', { className: 'vice-panel-siren' }),
          h('div', null,
            h('b', null, model),
            h('i', null, detail))),
        h('div', { className: 'vice-panel-footer' },
          h('img', { src: assets.logo, alt: 'Grand Theft Auto VI', className: 'vice-panel-logo' }),
          h('div', { className: 'vice-panel-footer-text' },
            h('span', null, session?.running ? 'RUN IN PROGRESS' : 'AWAIT YOUR NEXT MOVE'),
            h('a', {
              className: 'vice-panel-star',
              href: 'https://github.com/manyuemeiquqi/dsh-gta6',
              target: '_blank',
              rel: 'noreferrer noopener',
              title: '在 GitHub 上给这个项目点个 star',
            }, '★ STAR ON GITHUB'))))
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
