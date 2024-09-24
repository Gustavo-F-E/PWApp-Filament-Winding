import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Filament Path Generator',
    short_name: 'Filament Path Generator',
    description: 'A Progressive Web App built with Next.js. Creada por Gustavo Francisco Eichhorn',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    lang: 'es-AR',
    icons: [
      {
        "src": "/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-144x144.png",
        "sizes": "144x144",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      },
      {
        "src": "/favicon-32x32.png",
        "sizes": "32x32",
        "type": "image/png"
      },
      {
        "src": "/favicon-16x16.png",
        "sizes": "16x16",
        "type": "image/png"
      },
    ],
    "screenshots": [
      {
        "src": "/desktop-screenshot.png",
        "sizes": "1280x800",
        "type": "image/png",
      },
      {
        "src": "/mobile-screenshot.png",
        "sizes": "375x667",
        "type": "image/png"
      }
    ],
  }
}