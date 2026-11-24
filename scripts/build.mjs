import { copyFile, rename, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const clientTemp = resolve(root, '.client.js.tmp')
const hostTemp = resolve(root, '.index.js.tmp')

async function cleanup() {
  await Promise.all([
    rm(clientTemp, { force: true }),
    rm(hostTemp, { force: true }),
  ])
}

await cleanup()

try {
  await build({
    entryPoints: [resolve(root, 'src/client/index.js')],
    outfile: clientTemp,
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['chrome120'],
    loader: { '.css': 'text' },
    legalComments: 'none',
    charset: 'utf8',
    minify: false,
    banner: { js: '/* Generated from src/ by scripts/build.mjs. Do not edit directly. */' },
  })

  await copyFile(resolve(root, 'src/host/index.cjs'), hostTemp)
  await rename(clientTemp, resolve(root, 'client.js'))
  await rename(hostTemp, resolve(root, 'index.js'))
  console.log('Built index.js and client.js')
} catch (error) {
  await cleanup()
  throw error
}
