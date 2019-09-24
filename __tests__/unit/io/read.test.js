const assert = require('assert');

const readOperations = require('../../../src/utils/io/read');
const removeDataDir = require('./utils/removeDataDir');
const write = require('../../../src/utils/io/write');

const data = {
  username: 'steniowagner',
  name: 'Stenio',
  age: 25,
};

const collection = 'users';
const id = '123';

const testReadingCorrectly = async () => {
  const content = await readOperations.single(collection, id);
  const isDataReadCorrectly = JSON.stringify(content) === JSON.stringify(data);

  console.log(`\t➡ should read the file and return it\'s content correctly ${isDataReadCorrectly ? '✅' : '❌'}`);
  assert.strictEqual(isDataReadCorrectly, true);
};

const testReturnNullWhenFileNotExists = async () => {
  const content = await readOperations.single(collection, id);
  const isNull = content === null;

  console.log(`\t➡ should read the file and return null ${isNull ? '✅' : '❌'}`);
  assert.strictEqual(isNull, true);
};

const testRead = async () => {
  await write(id, collection, data);

  console.log('\n------- # read.test.js # -------');

  console.log('\n↳ it should return the data correctly');
  await testReadingCorrectly();

  console.log('\n↳ it should return null when the file doesn\'t exists');
  await removeDataDir();
  await testReturnNullWhenFileNotExists();

  console.log('\n------- # END # -------');

  await removeDataDir();
};

module.exports = testRead;
