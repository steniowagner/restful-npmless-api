const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const { VALUES } = require('../constants');

const asyncReadFile = promisify(fs.readFile);
const asyncReadDir = promisify(fs.readdir);

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

exports.all = async collection => {
  const dirPath = path.normalize(`${VALUES.DATA_PATH}/${collection}`);
  const isDirExists = fs.existsSync(dirPath);

  if (!isDirExists) {
    return [];
  }

  const files = await asyncReadDir(dirPath);

  if (!files.length) {
    return [];
  }

  const items = await Promise.all(files.map(
    async file => this.single(collection, file.split('.json')[0]))
  );

  const itemsWithId = items.map((item, index) => {
    const id = files[index].split('.json')[0];

    return ({
      ...item,
      id,
    });
  });

  return itemsWithId;
};
