const crypto = require('crypto');
const fs = require('fs');

const DIR_WATCHED = 'src';

let shouldFsWait = false;
let previousHash = null;

fs.watch(DIR_WATCHED, {
  recursive: true,
}, async (event, fileName) => {
  if (shouldFsWait) {
    return;
  }

  shouldFsWait = setTimeout(() => {
    shouldFsWait = false;
  }, 500);

  const filePath = `${__dirname}/${DIR_WATCHED}/${fileName}`;

  if (fileName && event === 'change') {
    try {
      const fileContent = fs.readFileSync(filePath);
      const currentHash = crypto.createHash('md5').update(fileContent).digest("hex");

      if (currentHash === previousHash) {
        return;
      }

      previousHash = currentHash;

      console.log(`[watcher] - File ${fileName} has changed`);
    } catch (err) {
      console.error(err);
    }
  }

  if (fileName && event === 'rename') {
    try {
      const isResourceExists = fs.existsSync(filePath);
      const isDirectory = isResourceExists && fs.lstatSync(filePath).isDirectory();
      const isFile = isResourceExists && fs.lstatSync(filePath).isFile();

      let resourceType = '';

      if (isDirectory) {
        resourceType = 'Directory';
      }

      if (isFile) {
        resourceType = 'File';
      }

      console.log(`[watcher] - The ${resourceType || 'resource'} ${fileName} was created/renamed/removed`);
    } catch (err) {
      console.error(err);
    }
  }
});
