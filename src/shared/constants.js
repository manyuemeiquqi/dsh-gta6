export const PLUGIN_ID = 'dsh-theme-vice'
export const CONFIG_FORM_ID = 'theme-vice'

export const ASSETS = Object.freeze({
  poster: 'plugins/dsh-theme-vice/assets/poster_full-25ce00b5d601.jpg',
  logo: 'plugins/dsh-theme-vice/assets/poster_logo-8eb6649ac961.png',
  rooftop: 'plugins/dsh-theme-vice/assets/jason-lucia-rooftop.webp',
  postcard: 'plugins/dsh-theme-vice/assets/vice-city.webp',
  cheetah: 'plugins/dsh-theme-vice/assets/cheetah.webp',
  beachNight: 'plugins/dsh-theme-vice/assets/vice-beach-night.webp',
  street: 'plugins/dsh-theme-vice/assets/leonida-street.webp',
  nightlife: 'plugins/dsh-theme-vice/assets/nightlife.webp',
  pet: 'plugins/dsh-theme-vice/assets/pet-keyart-56a1afa1c5df.png',
  petAlt: 'plugins/dsh-theme-vice/assets/pet-roof-b179a351be25.png',
})

export const DEFAULTS = Object.freeze({
  enabled: '1',
  background: '1',
  opacity: '72',
  blur: '0',
  glow: '1',
  motion: '1',
  intro: '1',
  pet: '1',
})

export const BODY_DATA_KEYS = Object.freeze(['enabled', 'background', 'glow', 'motion', 'pet'])
export const BODY_STYLE_KEYS = Object.freeze(['opacity', 'blur'])
