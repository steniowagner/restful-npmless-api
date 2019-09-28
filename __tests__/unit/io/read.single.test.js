const assert = require('assert');

const removeDataDir = require('../../utils/removeDataDir');
const write = require('../../../src/utils/io/write');
const read = require('../../../src/utils/io/read');

const data = {
  username: 'steniowagner',
  name: 'Stenio',
  age: 25,
};

const collection = 'users';
const id = '123';

const testReadingCorrectly = async () => {
  const content = await read.single(collection, id);
  const isDataReadCorrectly = JSON.stringify(content) === JSON.stringify(data);

  console.log(`\t➡ should read the file and return it\'s content correctly ${isDataReadCorrectly ? '✅' : '❌'}`);
  assert.strictEqual(isDataReadCorrectly, true);
};

const testReturnNullWhenFileNotExists = async () => {
  const content = await read.single(collection, id);
  const isNull = content === null;

  console.log(`\t➡ should read the file and return null ${isNull ? '✅' : '❌'}`);
  assert.strictEqual(isNull, true);
};

const testReadSingle = async () => {
  await write(id, collection, data);

  console.log('\n------- # read.single.test.js # -------');

  console.log('\n↳ Testing method to read data of a single file from data directory');
  await testReadingCorrectly();

  await removeDataDir();
  await testReturnNullWhenFileNotExists();

  await removeDataDir();
};

module.exports = testReadSingle;
