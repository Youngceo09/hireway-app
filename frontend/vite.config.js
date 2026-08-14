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
      // We set devOptions to true so we can test it locally too
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'HireWay',
        short_name: 'HireWay',
        description: 'HireWay Student Matching Platform',
        theme_color: '#2563eb',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3135/3135673.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3135/3135673.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})