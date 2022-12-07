export function rollupReplaceWord({ from, to }) {
  return {
    name: 'transform-file',

    transform(src, id) {
      //  console.log( id); path + filename

      let code = src.replace(new RegExp(`${from}\\.`, 'g'), to + '.');

      if (to === 'browser') {
        code = code.replace(/chrome\.action|browser.action/g, 'browser.browserAction');
      }

      return {
        code,
        map: null // provide source map if available
      }
    }
  }
}