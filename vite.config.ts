import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import { type UserConfig, defineConfig } from 'vitest/config'

// https://vite.dev/config/
const config = (mode: string): UserConfig => {
  return {
    server: {
      host: true,
      port: 5173
    },
    plugins: [
      react(),
      tailwindcss(),
      mode === 'analyze' &&
        visualizer({
          open: true,
          filename: './analyze/stats.html',
          gzipSize: true
        })
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test-setup.ts',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/e2e/**',
        '**/src/components/ui/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
}

export default defineConfig(({ mode }) => config(mode))
