const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const { VALUES } = require('../constants');

const handleCreateDir = async path => {
  const mkdirAsync = promisify(fs.mkdir);
  await mkdirAsync(path, { recursive: true });
};

const write = async (id, collection, rawData) => {
  try {
    const isDataDirExists = fs.existsSync(VALUES.DATA_PATH);
    const data = JSON.stringify(rawData);

    const destionDirectory = path.normalize(`${VALUES.DATA_PATH}/${collection}`)
    const filePath = path.normalize(`${destionDirectory}/${id}.json`);

    if (!isDataDirExists) {
      await handleCreateDir(destionDirectory);
    }

    fs.writeFileSync(filePath, data, {
      encoding: 'utf8',
    });
  } catch (err) {
    throw err;
  }
};

module.exports = write;
