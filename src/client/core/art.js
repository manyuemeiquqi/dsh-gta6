// Original artwork for this theme: hand-authored SVG geometry plus a generated
// grain filter. Nothing here is derived from third-party media.

/** Grain overlay encoded as a data URI (SVG feTurbulence). */
export const GRAIN_URI = (() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
<feColorMatrix type="saturate" values="0"/></filter>
<rect width="160" height="160" filter="url(#g)" opacity="0.5"/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
})()

/**
 * One palm silhouette.
 * @param {string} color - fill color.
 * @param {boolean} flip - mirror horizontally.
 * @returns {string} SVG markup with a 0 0 120 200 viewBox.
 */
export function palmSvg(color, flip = false) {
  // Long arching fronds with drooping tips, on a curved tapering trunk.
  return `<svg viewBox="0 0 128 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
<g fill="${color}" transform="${flip ? 'translate(128,0) scale(-1,1)' : ''}">
<path d="M48 200 C54 158 59 120 62 88 L73 90 C70 124 63 160 60 200 Z"/>
<path d="M64 86 C44 88 24 84 6 70 C24 80 44 82 64 80 Z"/>
<path d="M64 86 C50 84 34 78 20 68 C35 76 50 80 64 82 Z"/>
<path d="M64 85 C48 78 33 64 22 46 C36 61 50 72 64 80 Z"/>
<path d="M65 84 C54 65 50 44 56 24 C59 45 61 66 67 80 Z"/>
<path d="M66 84 C72 62 82 42 100 28 C87 49 76 68 68 81 Z"/>
<path d="M67 84 C86 78 104 66 118 48 C106 67 88 79 68 81 Z"/>
<path d="M67 84 C88 86 108 84 124 74 C107 82 86 82 68 80 Z"/>
<path d="M65 86 C54 76 46 64 42 52 C51 64 58 76 66 84 Z"/>
<path d="M64 87 C52 88 38 84 28 78 C40 83 52 84 64 83 Z"/>
</g></svg>`
}

/**
 * A blocky skyline silhouette.
 * @param {string} color - fill color.
 * @returns {string} SVG markup with a 0 0 600 120 viewBox.
 */
export function skylineSvg(color) {
  const blocks = [
    [0, 74, 46, 46], [50, 58, 30, 62], [84, 82, 54, 38], [142, 46, 26, 74],
    [172, 68, 40, 52], [216, 88, 62, 32], [282, 54, 34, 66], [320, 76, 44, 44],
    [368, 40, 22, 80], [394, 66, 48, 54], [446, 84, 58, 36], [508, 60, 32, 60],
    [544, 78, 56, 42],
  ]
  const rects = blocks.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')
  return `<svg viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true"><g fill="${color}">${rects}</g></svg>`
}

/**
 * A small four-point spark used as a decorative mark.
 * @param {string} color - fill color.
 * @returns {string} SVG markup with a 0 0 12 12 viewBox.
 */
export function sparkSvg(color) {
  return `<svg viewBox="0 0 12 12" aria-hidden="true"><path fill="${color}" d="M6 0 L7.4 4.6 L12 6 L7.4 7.4 L6 12 L4.6 7.4 L0 6 L4.6 4.6 Z"/></svg>`
}
