const { promisify } = require('util');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const { VALUES }  = require('../../../src/utils/constants');
const removeDataDir = require('../../utils/removeDataDir');
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
  await Promise.all(items.map(async item => write(item.username, collection, item)));

  const content = await read.all(collection);

  const isDataReadCorrectly = content.every((itemContent, index) =>
    JSON.stringify({
      username: itemContent.username,
      name: itemContent.name,
      age: itemContent.age,
    }) === JSON.stringify(items[index]));

  console.log(`\t➡ should read the collection directory and return all it\'s data correctly ${isDataReadCorrectly ? '✅' : '❌'}`);
  assert.deepStrictEqual(isDataReadCorrectly, true);

  await removeDataDir();
};

const testReturnEmptyArrayCollectionFolderNotExists = async () => {
  const content = await read.all(collection);

  const isArray = Array.isArray(content) === true;
  console.log(`\t➡ should read an inexistent directory and return an array ${isArray ? '✅' : '❌'}`);
  assert.strictEqual(Array.isArray(content), true);

  const isEmptyArray = content.length === 0;
  console.log(`\t➡ should read an inexistent directory and return an empty array ${isEmptyArray ? '✅' : '❌'}`);
  assert.strictEqual(isEmptyArray, true);
};

const testReturnEmptyArrayCollectionFolderIsEmpty = async () => {
  const emptyDirPath = path.normalize(`${VALUES.DATA_PATH}/${collection}`);

  const mkdirAsync = promisify(fs.mkdir);
  await mkdirAsync(emptyDirPath, { recursive: true });

  const content = await read.all(collection);

  const isArray = Array.isArray(content) === true;
  console.log(`\t➡ should read an empty directory and return an array ${isArray ? '✅' : '❌'}`);
  assert.strictEqual(isArray, true);

  const isEmptyArray = content.length === 0;
  console.log(`\t➡ should read an empty directory and return an empty array ${isEmptyArray ? '✅' : '❌'}`);
  assert.strictEqual(isEmptyArray, true);
};

const testReadAll = async () => {
  console.log('\n------- # read.all.test.js # -------');

  console.log('\n↳ Testing method to read all the data of all files from a directory');

  await testReadingCorrectly();

  await testReturnEmptyArrayCollectionFolderNotExists();

  await testReturnEmptyArrayCollectionFolderIsEmpty();

  await removeDataDir();
};

module.exports = testReadAll;
