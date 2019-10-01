const assert = require('assert');

const { VALUES, EXCEPTION_MESSAGES } = require('../../../src/utils/constants');
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

const ID = '1234567890123';

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

  assert.deepStrictEqual({
    ...data,
    id: ID,
  }, user);
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


const shouldThrowExceptionWhenIdNotProvided = async () => {
  try {
    await User.findOne();
  } catch (err) {
    const isCorrectException = err.message === EXCEPTION_MESSAGES.ID_NOT_PROVIDED;

    console.log(`\t➡ should throw an exception when id isn't provided ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const shouldThrowExceptionWhenIdNotString = async () => {
  try {
    await User.findOne(1234567890123);
  } catch (err) {
    const isCorrectException = err.message === EXCEPTION_MESSAGES.ID_TYPE_STRING;

    console.log(`\t➡ should throw an exception when id isn't a string ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const shouldThrowExceptionWhenDifferentLength = async () => {
  try {
    await User.findOne('123');
  } catch (err) {
    const isCorrectException = err.message === EXCEPTION_MESSAGES.ID_INVALID_PATTERN;

    console.log(`\t➡ should throw an exception when id aren't following the default pattern of ${VALUES.ID_LENGHT} characters ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};


const testFindOne = async () => {
  console.log('\n↳ Testing the findOne method');

  await write(ID, USER.collection, data);

  await shouldReturnJustOneItemById();

  await clearDir(USER.collection);

  await shouldReturnNullWhenCollectionIsEmpty();

  await removeDataDir();

  await shouldReturnNullWhenCollectionDoesntExists();

  await shouldThrowExceptionWhenIdNotProvided();

  await shouldThrowExceptionWhenIdNotString();

  await shouldThrowExceptionWhenDifferentLength();
};

module.exports = testFindOne;
