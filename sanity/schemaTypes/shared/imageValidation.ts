/**
 * Returns the asset reference of a Sanity image field, or `undefined` when no
 * asset is set. Useful in validation rules to make sub-fields (e.g. `alt`)
 * conditionally required only once an image has actually been uploaded.
 */
export function getImageAssetRef(image: unknown): string | undefined {
  if (image && typeof image === 'object' && 'asset' in image) {
    const asset = (image as {asset?: {_ref?: string}}).asset
    return asset?._ref
  }
  return undefined
}
