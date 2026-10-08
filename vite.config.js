import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { rollupReplaceWord } from './plugin.js';

console.log('process ===> ', process.env.BROWSER, process.env.NODE_ENV);
const isChrome = process.env.BROWSER === undefined ? true : process.env.BROWSER === 'chrome';
const from = isChrome ? 'browser' : 'chrome';
const to = isChrome ? 'chrome' : 'browser';

export default defineConfig({
  plugins: [
    {
      ...rollupReplaceWord({ from, to }),
      enforce: 'pre'
    },
    react(),
    tailwindcss()
  ]
});