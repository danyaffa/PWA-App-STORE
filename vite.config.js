import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SafeLaunch — Trusted PWA Store',
        short_name: 'SafeLaunch',
        description: 'The trusted PWA app store with AI-powered safety scanning.',
        theme_color: '#00e5a0',
        background_color: '#0a0a0f',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ],
        shortcuts: [
          { name: 'Browse Store', url: '/store' },
          { name: 'Submit App',   url: '/publish' },
          { name: 'Dashboard',    url: '/dashboard' }
        ]
      }
    })
  ],
  server: { port: 3000 }
})
