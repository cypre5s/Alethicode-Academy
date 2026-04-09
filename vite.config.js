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
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.6,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.3,
        stringArray: true,
        stringArrayEncoding: ['rc4'],
        stringArrayThreshold: 0.7,
        transformObjectKeys: true,
        unicodeEscapeSequence: false,
        renameGlobals: false,
        selfDefending: true,
        debugProtection: true,
        debugProtectionInterval: 2000,
        disableConsoleOutput: false,
        rotateStringArray: true,
        splitStrings: true,
        splitStringsChunkLength: 8,
      },
    }),
  ].filter(Boolean),
  server: { port: 3333, open: true },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: false, drop_debugger: true, passes: 2 },
      mangle: { toplevel: true },
    },
  },
}))
