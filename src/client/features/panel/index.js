import { radarSvg } from '../../core/art.js'

export function registerVicePanel({ ctx, React, store, assets }) {
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
      if (store.getState().values.enabled !== '1') return null

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
            h('span', null, 'RADIO'),
            h('strong', null, '98.6 FM · NON STOP POP')),
          h('div', { className: 'vice-panel-speed', 'aria-hidden': true },
            h('span', { className: 'vice-panel-speed-needle' }),
            h('b', null, '186'),
            h('i', null, 'MPH'))),
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
            h('b', null, 'VCPD'),
            h('i', null, 'HEAT · LEVEL 6'))),
        h('div', { className: 'vice-panel-footer' },
          h('img', { src: assets.logo, alt: 'Grand Theft Auto VI', className: 'vice-panel-logo' }),
          h('span', null, 'AWAIT YOUR NEXT MOVE')))
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
