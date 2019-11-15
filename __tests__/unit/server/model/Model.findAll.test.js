const assert = require('assert');

const { GenericModel, GenericSchema, genericData } = require('./GenericModel');
const clearTestDatabase = require('../../../utils/clearTestDatabase');
const removeDataDir = require('../../../utils/removeDataDir');
const { write } = require('../../../../server/model/io');

const NUM_ITEMS = 10;

const items = Array(NUM_ITEMS).fill(genericData).map((_, index) => ({
  stringField: `${genericData.stringField}${index}`,
  numberField: `${genericData.numberField}${index}`,
  booleanField: `${genericData.booleanField}${index}`,
}));

const shouldReturnAnArray = async () => {
  const content = await GenericModel.findAll();

  const isArray = Array.isArray(content);
  console.log(`\t➡ should return an array ${isArray ? '✅' : '❌'}`);
  assert.strictEqual(isArray, true);
};

const shouldReturnAnArrayWithCorrectLength = async () => {
  const content = await GenericModel.findAll();

  const hasCorrectLength = content.length === NUM_ITEMS;
  console.log(`\t➡ should return an array with correct length ${hasCorrectLength ? '✅' : '❌'}`);
  assert.strictEqual(content.length, NUM_ITEMS);
};

const shoudlFindAllDataCorrectly = async () => {
  const content = await GenericModel.findAll();

  const isDataReadCorrectly = content.every((itemContent, index) =>
    JSON.stringify({
      stringField: itemContent.stringField,
      numberField: itemContent.numberField,
      booleanField: itemContent.booleanField,
    }) === JSON.stringify(items[index]));

  console.log(`\t➡ should find all data from the collection ${isDataReadCorrectly ? '✅' : '❌'}`);

  assert.strictEqual(isDataReadCorrectly, true);
};

const shouldReturnEmptyArrayWhenCollectionIsEmpty = async () => {
  const content = await GenericModel.findAll();

  const isDataReadCorrectly = content.length === 0;

  console.log(`\t➡ should return an empty array when collection folder is empty ${isDataReadCorrectly ? '✅' : '❌'}`);
  assert.strictEqual(isDataReadCorrectly, true);
};

const shouldReturnEmptyArrayWhenCollectionDoesntExists = async () => {
  const content = await GenericModel.findAll();

  const isDataReadCorrectly = content.length === 0;

  console.log(`\t➡ should return an empty array when collection folder doesn\'t exists ${isDataReadCorrectly ? '✅' : '❌'}`);
  assert.strictEqual(isDataReadCorrectly, true);
};

const testFindAll = async () => {
  console.log('\n↳ Testing the findAll method');

  await Promise.all(items.map(async item => write(item.stringField, GenericSchema.collection, item)));

  await shouldReturnAnArray();

  await shouldReturnAnArrayWithCorrectLength();

  await shoudlFindAllDataCorrectly();

  await clearTestDatabase(GenericSchema.collection);

  await shouldReturnEmptyArrayWhenCollectionIsEmpty();

  await removeDataDir();

  await shouldReturnEmptyArrayWhenCollectionDoesntExists();
};

module.exports = testFindAll;
