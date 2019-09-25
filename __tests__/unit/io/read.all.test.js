const { promisify } = require('util');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const { VALUES }  = require('../../../src/utils/constants');
const removeDataDir = require('./utils/removeDataDir');
const write = require('../../../src/utils/io/write');
const read = require('../../../src/utils/io/read');

const data = {
  username: 'steniowagner',
  name: 'Stenio',
  age: 25,
};

const collection = 'users';

const items = Array(10).fill(data).map((item, index) => ({
  username: `${data.username}${index}`,
  name: `${data.username}${index}`,
  age: data.age + index,
}));

const testReadingCorrectly = async () => {
  const content = await read.all(collection);
  const isDataReadCorrectly = content.every((itemContent, index) =>
    JSON.stringify(itemContent) === JSON.stringify(items[index]));

  console.log(`\t➡ should read the collection directory and return all it\'s data correctly ${isDataReadCorrectly ? '✅' : '❌'}`);
  assert.strictEqual(isDataReadCorrectly, true);
};

const testReturnEmptyArrayCollectionFolderNotExists = async () => {
  const content = await read.all(collection);

  const isReadCorrectly = Array.isArray(content) === true && !content.length;

  console.log(`\t➡ should read an inexistent directory and return an empty array ${isReadCorrectly ? '✅' : '❌'}`);
  assert.strictEqual(isReadCorrectly, true);
};

const testReturnEmptyArrayCollectionFolderIsEmpty = async () => {
  const emptyDirPath = path.normalize(`${VALUES.DATA_PATH}/${collection}`);

  const mkdirAsync = promisify(fs.mkdir);
  await mkdirAsync(emptyDirPath, { recursive: true });

  const content = await read.all(collection);

  const isReadCorrectly = Array.isArray(content) === true && !content.length;

  console.log(`\t➡ should read an empty directory and return an empty array ${isReadCorrectly ? '✅' : '❌'}`);
  assert.strictEqual(isReadCorrectly, true);
};

const testReadAll = async () => {
  console.log('\n------- # read.all.test.js # -------');

  await Promise.all(items.map(async item => write(item.username, collection, item)));

  console.log('\n↳ it should return the data correctly from the collection directory');
  await testReadingCorrectly();

  await removeDataDir();

  await testReturnEmptyArrayCollectionFolderNotExists();

  await testReturnEmptyArrayCollectionFolderIsEmpty();

  await removeDataDir();
};

module.exports = testReadAll;
