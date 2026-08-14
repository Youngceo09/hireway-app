import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'HireWay Student Matching',
        short_name: 'HireWay',
        description: 'Find your future with HireWay',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',      // THIS hides the browser bars
        orientation: 'portrait',
        start_url: '.',              // Tells the app where to begin
        scope: '/',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3135/3135673.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3135/3135673.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})