import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// export vite config
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    // polyfill global for aws cognito
    global: 'window',
  }
})