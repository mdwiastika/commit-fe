import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Commit',
    short_name: 'Commit',
    description: 'A platform to learn programming and design skills.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icons/icon192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
