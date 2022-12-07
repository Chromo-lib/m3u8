import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { rollupReplaceWord } from './plugin';

console.log('process ===> ', process.env.BROWSER, process.env.NODE_ENV);
const isChrome = process.env.BROWSER === undefined ? true : process.env.BROWSER === 'chrome';
const from = isChrome ? 'browser' : 'chrome'; // this var for replaceWord plugin
const to = isChrome ? 'chrome' : 'browser'; // this var for replaceWord plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      ...rollupReplaceWord({ from, to }),
      enforce: 'pre'
    },
    react()
  ]
});