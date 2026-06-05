import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  // Resize images through the Sanity CDN (see sanity/lib/imageLoader.ts) instead
  // of Next's optimizer. A custom loader can't be passed as a prop from a Server
  // Component, so it's configured globally here.
  images: {
    loader: 'custom',
    loaderFile: './sanity/lib/imageLoader.ts',
  },
}

export default nextConfig
