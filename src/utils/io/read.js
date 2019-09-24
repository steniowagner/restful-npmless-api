const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const { VALUES } = require('../constants');

const asyncReadFile = promisify(fs.readFile);

exports.single = async (collection, id) => {
  const filePath = path.normalize(`${VALUES.DATA_PATH}/${collection}/${id}.json`);
  const isFileExists = fs.existsSync(filePath);

  if (!isFileExists) {
    return null;
  }

  const rawData = await asyncReadFile(filePath);
  const fileContent = JSON.parse(rawData);

  return fileContent;
};
