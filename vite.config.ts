import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import tsconfigPaths from 'vite-tsconfig-paths'
import { type UserConfig, defineConfig } from 'vitest/config'
import pkg from './package.json'

// https://vite.dev/config/
const version = pkg.version

// isProduction
const isProduction = process.env.NODE_ENV === 'production'

const config = (mode: string): UserConfig => {
  return {
    server: {
      host: true,
      port: 5173
    },
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      mode === 'analyze' &&
        visualizer({
          open: true,
          filename: './analyze/stats.html',
          gzipSize: true
        })
    ],
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(version)
    },
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
    esbuild: isProduction
      ? {
          drop: ['debugger'],
          pure: [
            'console.log',
            'console.info',
            'console.table',
            'console.time',
            'console.timeEnd',
            'console.trace'
          ]
        }
      : {}
  }
}

export default defineConfig(({ mode }) => config(mode))
