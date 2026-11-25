import { radarSvg } from '../../core/art.js'

/**
 * Compose the postcard frame: official artwork, wanted-level stars, radar, and
 * a location caption.
 * @param {Record<string, string>} assets - plugin asset references.
 * @returns {string} HTML for `.vice-frame`'s children.
 */
export function sceneArtHtml(assets) {
  return `
    <img class="vice-shot" src="${assets.rooftop}" alt="">
    <div class="vice-shade"></div>
    <div class="vice-wanted">
      <span>WANTED</span>
      <b>★★★★★★</b>
    </div>
    <div class="vice-radar">${radarSvg('#ff5f92')}</div>
    <div class="vice-caption">
      <strong>Vice City</strong>
      <span>LEONIDA · 1986<i>★ ★ ★ ★ ★</i></span>
    </div>
  `
}
