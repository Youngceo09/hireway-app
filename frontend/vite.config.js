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
  manifest: {
    name: 'HireWay Student Match',
    short_name: 'HireWay',
    description: 'Smart Student Job Matching Platform',
    theme_color: '#2563eb',
    background_color: '#ffffff',
    display: 'standalone', // CRITICAL: This hides the browser UI
    start_url: '/',        // CRITICAL: Tells the app where to start
    scope: '/',
    icons: [
      {
        src: 'https://cdn-icons-png.flaticon.com/512/3135/3135673.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: 'https://cdn-icons-png.flaticon.com/512/3135/3135673.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }
})