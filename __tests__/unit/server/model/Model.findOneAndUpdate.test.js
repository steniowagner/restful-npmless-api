const assert = require('assert');

const { VALUES } = require('../../../../server/model/constants');
const { GenericModel, genericData } = require('./GenericModel');
const removeDataDir = require('../../../utils/removeDataDir');

const shouldUpdateItemCorrectly = async () => {
  const id = await GenericModel.create(genericData);

  const fieldsToUpdate = {
    stringField: 'wagnerstenio',
  };

  const itemUpdated = await GenericModel.findOneAndUpdate(id, fieldsToUpdate);

  const isItemUpdatedCorrectly = JSON.stringify({
    ...genericData,
    ...fieldsToUpdate,
    id,
  }) === JSON.stringify(itemUpdated);

  console.log(`\t➡ should update the content of the file ${id}.json with the provided content ${isItemUpdatedCorrectly ? '✅' : '❌'}`);
  assert.deepStrictEqual(itemUpdated, {
    ...genericData,
    ...fieldsToUpdate,
    id,
  });
};

const shouldReturnNullWhenItemDoesntExists = async () => {
  const itemUpdated = await GenericModel.findOneAndUpdate('1234567890123');

  console.log(`\t➡ should return null when the file doens\'t exists ${!itemUpdated ? '✅' : '❌'}`);

  assert.deepStrictEqual(itemUpdated, null);
};

const shouldThrowExceptionWhenIdNotProvided = async () => {
  try {
    await GenericModel.findOneAndUpdate();
  } catch (err) {
    const isCorrectException = err.message === 'The field \'id\' is required';

    console.log(`\t➡ should throw an exception when id isn't provided ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const shouldThrowExceptionWhenIdNotString = async () => {
  try {
    await GenericModel.findOneAndUpdate(1234567890123);
  } catch (err) {
    const isCorrectException = err.message === 'The type of the field \'id\' should be string';

    console.log(`\t➡ should throw an exception when id isn't a string ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const shouldThrowExceptionWhenDifferentLength = async () => {
  try {
    await GenericModel.findOneAndUpdate('123');
  } catch (err) {
    const isCorrectException = err.message === 'The received \'id\' is invalid';

    console.log(`\t➡ should throw an exception when id aren't following the default pattern of ${VALUES.ID_LENGHT} characters ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const testFindOneAndUpdate = async () => {
  console.log('\n↳ Testing the findOneAndUpdate method');

  await shouldUpdateItemCorrectly();

  await shouldReturnNullWhenItemDoesntExists();

  await shouldThrowExceptionWhenIdNotProvided();

  await shouldThrowExceptionWhenIdNotString();

  await shouldThrowExceptionWhenDifferentLength();

  await removeDataDir();
};

module.exports = testFindOneAndUpdate;
