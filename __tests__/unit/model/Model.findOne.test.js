const assert = require('assert');

const { USER } = require('../../../src/models/types');
const removeDataDir = require('../../utils/removeDataDir');
const write = require('../../../src/utils/io/write');
const Model = require('../../../src/models/Model');
const clearDir = require('../../utils/clearDir');

const User = Model(USER);

const data = {
  username: 'steniowagner',
  name: 'Stenio',
  age: 25,
};

const ID = '123';

const _checkResultIsNull = (item, textConditionDescription) => {
  const isNull = typeof item === 'object' && item === null;

  console.log(`\t➡ should return null when the collection ${textConditionDescription} ${isNull ? '✅' : '❌'}`);

  return isNull;
};

const shouldReturnJustOneItemById = async () => {
  const user = await User.findOne(ID);

  const isCorrectUserData = JSON.stringify(user) === JSON.stringify({
    ...data,
    id: ID,
  });

  console.log(`\t➡ should return the content of the file with id provided ${isCorrectUserData ? '✅' : '❌'}`);

  assert.strictEqual(isCorrectUserData, true);
};

const shouldReturnNullWhenCollectionDoesntExists = async () => {
  const user = await User.findOne(ID);

  const isNull = _checkResultIsNull(user, "doesn\'t exists");

  assert.strictEqual(isNull, true);
};

const shouldReturnNullWhenCollectionIsEmpty = async () => {
  const user = await User.findOne(ID);

  const isNull = _checkResultIsNull(user, "is empty");

  assert.strictEqual(isNull, true);
};

const testFindOne = async () => {
  console.log('\n↳ Testing the findOne method');

  await write(ID, USER.collection, data);

  await shouldReturnJustOneItemById();

  await clearDir(USER.collection);

  await shouldReturnNullWhenCollectionIsEmpty();

  await removeDataDir();

  await shouldReturnNullWhenCollectionDoesntExists();
};

module.exports = testFindOne;
