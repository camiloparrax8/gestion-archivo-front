import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = path.resolve(__dirname, 'src')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': src,
      '@ui': path.resolve(src, 'ui'),
      '@shared': path.resolve(src, 'shared'),
      '@features': path.resolve(src, 'features'),
      '@core': path.resolve(src, 'core'),
      '@api': path.resolve(src, 'api'),
      '@config': path.resolve(src, 'config'),
      '@hooks': path.resolve(src, 'hooks'),
      '@context': path.resolve(src, 'context'),
      '@components': path.resolve(src, 'components'),
      '@pages': path.resolve(src, 'pages'),
      '@routes': path.resolve(src, 'routes'),
      '@app': path.resolve(src, 'app'),
      '@mui-theme': path.resolve(src, 'mui-theme'),
    },
  },
})
