import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path';

const isChrome = process.env.BROWSER === undefined ? true : process.env.BROWSER === 'chrome';

if (!isChrome) {

  const files = readdirSync(process.cwd() + '/dist');

  files.forEach(file => {
    if (file.includes('.js') && /\.js$/gi.test(file)) {
      const content = readFileSync(resolve(process.cwd(), 'dist', file), 'utf8');
      const rep = content.replace(/chrome\./g, 'browser.');
      const reps = rep.replace(/chrome\.action|browser.action/g, 'browser.browserAction');
      writeFileSync(resolve(process.cwd(), 'dist', file), reps);
    }
  });

  const content = readFileSync(resolve(process.cwd(), 'manifest-v2.json'), 'utf8');
  writeFileSync(resolve(process.cwd(), 'dist', 'manifest.json'), content);
}