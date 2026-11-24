import { GRAIN_URI, palmSvg, skylineSvg } from '../../core/art.js'

const INK = '#150c24'

/**
 * Compose the postcard frame's inner markup: sky, sun, skyline, grid, palms, grain.
 * @returns {string} HTML for `.vice-frame`'s children.
 */
export function sceneArtHtml() {
  return `
    <div class="vice-sky"></div>
    <div class="vice-sun"></div>
    <div class="vice-skyline">${skylineSvg(INK)}</div>
    <div class="vice-grid"></div>
    <div class="vice-palms">${palmSvg(INK)}${palmSvg(INK, true)}</div>
    <div class="vice-grain" style="--vice-grain:url('${GRAIN_URI}')"></div>
    <div class="vice-caption">
      <strong>Sunset Strip</strong>
      <span>NEON COAST<i>★ ★ ★ ★ ★</i></span>
    </div>
  `
}
