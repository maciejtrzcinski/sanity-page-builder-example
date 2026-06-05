/**
 * Cross-cutting values made available to every section renderer. Empty-ish here;
 * add things your renderers need (search params, feature flags, settings, …).
 */
export type RenderContext = {
  readonly searchParams?: {[key: string]: string | string[] | undefined}
}
