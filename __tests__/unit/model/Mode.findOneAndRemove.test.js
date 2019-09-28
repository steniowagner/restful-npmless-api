const { promisify } = require('util');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const { MODELS, VALUES } = require('../../../src/utils/constants');
const removeDataDir = require('../../utils/removeDataDir');
const Model = require('../../../src/models/Model');
const clearDir = require('../../utils/clearDir');

const User = Model(MODELS.USER);

const collectionPath = path.normalize(`${VALUES.DATA_PATH}/${MODELS.USER.collection}`);
const asyncExists = promisify(fs.exists);

const data = {
  username: 'steniowagner',
  name: 'Stenio',
  age: 25,
};

const shouldRemoveItemCorrectly = async () => {
  const id = await User.create(data);

  await User.findOneAndRemove(id);

  const isItemExists = await asyncExists(path.join(collectionPath, `${id}.json`));

  console.log(`\t➡ should remove the file ${id}.json from the collection folder ${!isItemExists ? '✅' : '❌'}`);

  assert.strictEqual(!isItemExists, true);

  await clearDir(MODELS.USER.collection);
};

const shouldReturnRemovedItemWhenRemovedCorrectly = async () => {
  const id = await User.create(data);

  const itemRemoved = await User.findOneAndRemove(id);

  const isReturningRemovedItem = JSON.stringify({
    ...data,
    id,
  }) === JSON.stringify(itemRemoved);

  console.log(`\t➡ should return the content of the removed file ${isReturningRemovedItem ? '✅' : '❌'}`);

  assert.deepStrictEqual(itemRemoved, {
    ...data,
    id,
  });

  await clearDir(MODELS.USER.collection);
};

const shouldReturnNullWhenItemDoesntExists = async () => {
  const itemRemoved = await User.findOneAndRemove('1234567890123');

  console.log(`\t➡ should return null when the file doens\'t exists ${!itemRemoved ? '✅' : '❌'}`);

  assert.deepStrictEqual(itemRemoved, null);
};

const shouldThrowExceptionWhenIdNotProvided = async () => {
  try {
    await User.findOneAndRemove();
  } catch (err) {
    const isCorrectException = err.message === 'The field \'id\' is required';

    console.log(`\t➡ should throw an exception when id isn't provided ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const shouldThrowExceptionWhenIdNotString = async () => {
  try {
    await User.findOneAndRemove(1234567890123);
  } catch (err) {
    const isCorrectException = err.message === 'The type of the field \'id\' should be string';

    console.log(`\t➡ should throw an exception when id isn't a string ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const shouldThrowExceptionWhenDifferentLength = async () => {
  try {
    await User.findOneAndRemove('123');
  } catch (err) {
    const isCorrectException = err.message === 'The received \'id\' is invalid';

    console.log(`\t➡ should throw an exception when id aren't following the default pattern of 13 characters ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const testFindOneAndRemove = async () => {
  console.log('\n↳ Testing the findOneAndRemove method');

  await shouldRemoveItemCorrectly();
  await shouldReturnRemovedItemWhenRemovedCorrectly();
  await shouldReturnNullWhenItemDoesntExists();
  await shouldThrowExceptionWhenIdNotProvided();
  await shouldThrowExceptionWhenIdNotString();
  await shouldThrowExceptionWhenDifferentLength();

  await removeDataDir();
};

module.exports = testFindOneAndRemove;
