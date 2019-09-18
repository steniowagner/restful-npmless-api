const crypto = require('crypto');
const fs = require('fs');

const fileWatched = './src/server.js';

let shouldFsWait = false;
let previousHash = null;

fs.watch(fileWatched, async (event, fileName) => {
  if (shouldFsWait) {
    return;
  }

  if (fileName && event === 'change') {
    shouldFsWait = setTimeout(() => {
      shouldFsWait = false;
    }, 500);

    const fileContent = fs.readFileSync(fileWatched);
    const currentHash = crypto.createHash('md5').update(fileContent).digest("hex");

    if (currentHash === previousHash) {
      return;
    }

    previousHash = currentHash;

    console.log(`[watcher] - File ${fileName} has changed`);
  }
});
