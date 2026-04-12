import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteObfuscateFile } from 'vite-plugin-obfuscator'

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE || '/',
  plugins: [
    vue(),
    mode === 'production' && viteObfuscateFile({
      options: {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.5,
        transformObjectKeys: false,
        unicodeEscapeSequence: false,
        renameGlobals: false,
        selfDefending: false,
        debugProtection: false,
        disableConsoleOutput: false,
        rotateStringArray: true,
        splitStrings: false,
      },
    }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  server: { port: 3333, open: true },
  build: {
    target: 'es2022',
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: false, drop_debugger: true, passes: 3, ecma: 2022 },
      mangle: { toplevel: true },
      format: { ecma: 2022 },
    },
    chunkSizeWarningLimit: 800,
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('pixi.js') || id.includes('pixi-live2d-display')) return 'live2d'
          if (id.includes('node_modules/vue')) return 'vue-vendor'
          if (id.includes('src/scripts/routes/')) return 'routes'
          if (id.includes('src/engine/')) return 'engine'
        },
      },
    },
  },
}))
