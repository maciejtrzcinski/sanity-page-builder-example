// Imports sanity/seed.ndjson into the dataset configured in .env.local.
// Run with `pnpm seed`. Re-runnable: `--replace` overwrites docs by _id.
//
// Local images live in sanity/seed_images and are described once in
// sanity/seed_images/manifest.ndjson (filename + `aspects` metadata, e.g. alt).
// Documents reference an image by a `"seedImage:<key>"` string token; here we
// expand each token into an image object whose `_sanityAsset` points at the
// absolute file path. `sanity dataset import` then uploads the file (using the
// CLI's auth — no extra token needed) and rewrites it to a real asset
// reference. We import a generated copy (gitignored) so seed.ndjson stays a
// clean, machine-independent source.
import {spawnSync} from 'node:child_process'
import {existsSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local')
}

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
if (!dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_DATASET — set it in .env.local first.')
  process.exit(1)
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(root, 'sanity', 'seed_images')
const sourceNdjson = join(root, 'sanity', 'seed.ndjson')
const manifestNdjson = join(imagesDir, 'manifest.ndjson')
const generatedNdjson = join(root, 'sanity', '.seed.with-assets.ndjson')

// key -> { filename, aspects } from the image manifest.
const manifest = new Map()
for (const line of readFileSync(manifestNdjson, 'utf8').split('\n')) {
  const trimmed = line.trim()
  if (!trimmed) continue
  const entry = JSON.parse(trimmed)
  manifest.set(entry.key, entry)
}

const TOKEN = /^seedImage:(.+)$/

// Build the image object the importer understands: `_sanityAsset` is uploaded
// and replaced with `asset: {_ref}`. `key` is set for array members (e.g. an
// image inside a Portable Text body); object fields don't need one.
function imageFromToken(key, {arrayMember}) {
  const entry = manifest.get(key)
  if (!entry) throw new Error(`Unknown seedImage key: ${key}`)
  // `@sanity/import` requires a scheme: `image@<protocol>://…`. A `file://` URL
  // to the absolute path makes it upload the local file.
  const fileUrl = pathToFileURL(join(imagesDir, entry.filename)).href
  const image = {_type: 'image', _sanityAsset: `image@${fileUrl}`}
  if (arrayMember) image._key = key
  if (entry.aspects?.alt) image.alt = entry.aspects.alt
  return image
}

// Replace every `"seedImage:<key>"` string with its image object, in place.
function expandTokens(value) {
  if (Array.isArray(value)) {
    return value.map((item) => {
      const match = typeof item === 'string' && item.match(TOKEN)
      return match ? imageFromToken(match[1], {arrayMember: true}) : expandTokens(item)
    })
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      const match = typeof v === 'string' && v.match(TOKEN)
      value[k] = match ? imageFromToken(match[1], {arrayMember: false}) : expandTokens(v)
    }
  }
  return value
}

const docs = readFileSync(sourceNdjson, 'utf8')
  .split('\n')
  .filter((line) => line.trim())
  .map((line) => JSON.stringify(expandTokens(JSON.parse(line))))

writeFileSync(generatedNdjson, docs.join('\n') + '\n')

let status = 1
try {
  const result = spawnSync(
    'pnpm',
    ['exec', 'sanity', 'dataset', 'import', generatedNdjson, '--dataset', dataset, '--replace'],
    {stdio: 'inherit'},
  )
  status = result.status ?? 1
} finally {
  rmSync(generatedNdjson, {force: true})
}

process.exit(status)
