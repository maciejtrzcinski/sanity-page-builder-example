// Ambient declaration so TypeScript accepts global CSS side-effect imports
// (e.g. `import './globals.css'` in app/layout.tsx). Next.js handles this at
// build time, but editors / stricter TS versions raise TS2882 without it.
declare module '*.css'
