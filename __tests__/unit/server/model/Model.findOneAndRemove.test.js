const { promisify } = require('util');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const { VALUES, EXCEPTION_MESSAGES } = require('../../../../server/model/constants');
const removeDataDir = require('../../../utils/removeDataDir');
const clearDir = require('../../../utils/clearDir');

const { GenericModel, GenericSchema, genericData } = require('./GenericModel');

const collectionPath = path.normalize(`${VALUES.DATA_PATH}/${GenericSchema.collection}`);
const asyncExists = promisify(fs.exists);

const shouldRemoveItemCorrectly = async () => {
  const id = await GenericModel.create(genericData);

  await GenericModel.findOneAndRemove(id);

  const isItemExists = await asyncExists(path.join(collectionPath, `${id}.json`));

  console.log(`\t➡ should remove the file ${id}.json from the collection folder ${!isItemExists ? '✅' : '❌'}`);

  assert.strictEqual(!isItemExists, true);

  await clearDir(GenericSchema.collection);
};

const shouldReturnRemovedItemWhenRemovedCorrectly = async () => {
  const id = await GenericModel.create(genericData);

  const itemRemoved = await GenericModel.findOneAndRemove(id);

  const isReturningRemovedItem = JSON.stringify({
    ...genericData,
    id,
  }) === JSON.stringify(itemRemoved);

  console.log(`\t➡ should return the content of the removed file ${isReturningRemovedItem ? '✅' : '❌'}`);

  assert.deepStrictEqual(itemRemoved, {
    ...genericData,
    id,
  });

  await clearDir(GenericSchema.collection);
};

const shouldReturnNullWhenItemDoesntExists = async () => {
  const itemRemoved = await GenericModel.findOneAndRemove('1234567890123');

  console.log(`\t➡ should return null when the file doens\'t exists ${!itemRemoved ? '✅' : '❌'}`);

  assert.deepStrictEqual(itemRemoved, null);
};

const shouldThrowExceptionWhenIdNotProvided = async () => {
  try {
    await GenericModel.findOneAndRemove();
  } catch (err) {
    const isCorrectException = err.message === EXCEPTION_MESSAGES.ID_NOT_PROVIDED;

    console.log(`\t➡ should throw an exception when id isn't provided ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const shouldThrowExceptionWhenIdNotString = async () => {
  try {
    await GenericModel.findOneAndRemove(1234567890123);
  } catch (err) {
    const isCorrectException = err.message === EXCEPTION_MESSAGES.ID_TYPE_STRING;

    console.log(`\t➡ should throw an exception when id isn't a string ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const shouldThrowExceptionWhenDifferentLength = async () => {
  try {
    await GenericModel.findOneAndRemove('123');
  } catch (err) {
    const isCorrectException = err.message === EXCEPTION_MESSAGES.ID_INVALID_PATTERN;

    console.log(`\t➡ should throw an exception when id aren't following the default pattern of ${VALUES.ID_LENGHT} characters ${isCorrectException ? '✅' : '❌'}`);

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
