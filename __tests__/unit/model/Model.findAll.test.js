const assert = require('assert');

const { MODELS } = require('../../../src/utils/constants');
const removeDataDir = require('../../utils/removeDataDir');
const write = require('../../../src/utils/io/write');
const Model = require('../../../src/models/Model');
const clearDir = require('../../utils/clearDir');

const User = Model(MODELS.USER);

const data = {
  username: 'steniowagner',
  name: 'Stenio',
  age: 25,
};

const NUM_ITEMS = 10;

const items = Array(NUM_ITEMS).fill(data).map((_, index) => ({
  username: `${data.username}${index}`,
  name: `${data.username}${index}`,
  age: data.age + index,
}));

const shouldReturnAnArray = async () => {
  const content = await User.findAll();

  const isArray = Array.isArray(content);
  console.log(`\t➡ should return an array ${isArray ? '✅' : '❌'}`);
  assert.strictEqual(isArray, true);
};

const shouldReturnAnArrayWithCorrectLength = async () => {
  const content = await User.findAll();

  const hasCorrectLength = content.length === NUM_ITEMS;
  console.log(`\t➡ should return an array with correct length ${hasCorrectLength ? '✅' : '❌'}`);
  assert.strictEqual(content.length, NUM_ITEMS);
};

const shoudlFindAllDataCorrectly = async () => {
  const content = await User.findAll();

  const isDataReadCorrectly = content.every((itemContent, index) =>
    JSON.stringify({
      username: itemContent.username,
      name: itemContent.name,
      age: itemContent.age,
    }) === JSON.stringify(items[index]));

  console.log(`\t➡ should find all data from the collection ${isDataReadCorrectly ? '✅' : '❌'}`);

  assert.strictEqual(isDataReadCorrectly, true);
};

const shouldReturnEmptyArrayWhenCollectionIsEmpty = async () => {
  const content = await User.findAll();

  const isDataReadCorrectly = content.length === 0;

  console.log(`\t➡ should return an empty array when collection folder is empty ${isDataReadCorrectly ? '✅' : '❌'}`);
  assert.strictEqual(isDataReadCorrectly, true);
};

const shouldReturnEmptyArrayWhenCollectionDoesntExists = async () => {
  const content = await User.findAll();

  const isDataReadCorrectly = content.length === 0;

  console.log(`\t➡ should return an empty array when collection folder doesn\'t exists ${isDataReadCorrectly ? '✅' : '❌'}`);
  assert.strictEqual(isDataReadCorrectly, true);
};

const testFindAll = async () => {
  console.log('\n↳ Testing the findAll method');

  await Promise.all(items.map(async item => write(item.username, MODELS.USER.collection, item)));

  await shouldReturnAnArray();

  await shouldReturnAnArrayWithCorrectLength();

  await shoudlFindAllDataCorrectly();

  await clearDir(MODELS.USER.collection);

  await shouldReturnEmptyArrayWhenCollectionIsEmpty();

  await removeDataDir();

  await shouldReturnEmptyArrayWhenCollectionDoesntExists();
};

module.exports = testFindAll;
