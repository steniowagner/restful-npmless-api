const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const { VALUES } = require('../../server/model/constants');

const asyncReadDir = promisify(fs.readdir);
const asyncUnlink = promisify(fs.unlink);

const clearTestDatabase = async dir => {
  try {
    const dirPath = path.normalize(`${VALUES.DATA_PATH}/${dir}`);
    const files = await asyncReadDir(dirPath);

    return Promise.all(files.map(async file => asyncUnlink(path.join(dirPath, file))));
  } catch (err) {
    console.log(err);
  }
};

module.exports = clearTestDatabase;
