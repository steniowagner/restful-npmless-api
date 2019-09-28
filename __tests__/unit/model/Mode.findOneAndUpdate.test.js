const assert = require('assert');

const { MODELS } = require('../../../src/utils/constants');
const removeDataDir = require('../../utils/removeDataDir');
const Model = require('../../../src/models/Model');

const User = Model(MODELS.USER);

const data = {
  username: 'steniowagner',
  name: 'Stenio',
  age: 25,
};

const shouldUpdateItemCorrectly = async () => {
  const id = await User.create(data);

  const fieldsToUpdate = {
    username: 'wagnerstenio',
    name: {
      type: 'string',
      key: 'value'
    },
  };

  const itemUpdated = await User.findOneAndUpdate(id, fieldsToUpdate);

  const isItemUpdatedCorrectly = JSON.stringify({
    ...data,
    ...fieldsToUpdate,
    id,
  }) === JSON.stringify(itemUpdated);

  console.log(`\t➡ should update the content of the file ${id}.json with the provided content ${isItemUpdatedCorrectly ? '✅' : '❌'}`);
  assert.deepStrictEqual(itemUpdated, {
    ...data,
    ...fieldsToUpdate,
    id,
  });
};

const shouldReturnNullWhenItemDoesntExists = async () => {
  const itemUpdated = await User.findOneAndUpdate('1234567890123');

  console.log(`\t➡ should return null when the file doens\'t exists ${!itemUpdated ? '✅' : '❌'}`);

  assert.deepStrictEqual(itemUpdated, null);
};

const shouldThrowExceptionWhenIdNotProvided = async () => {
  try {
    await User.findOneAndUpdate();
  } catch (err) {
    const isCorrectException = err.message === 'The field \'id\' is required';

    console.log(`\t➡ should throw an exception when id isn't provided ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const shouldThrowExceptionWhenIdNotString = async () => {
  try {
    await User.findOneAndUpdate(1234567890123);
  } catch (err) {
    const isCorrectException = err.message === 'The type of the field \'id\' should be string';

    console.log(`\t➡ should throw an exception when id isn't a string ${isCorrectException ? '✅' : '❌'}`);

    assert.deepStrictEqual(isCorrectException, true);
  }
};

const shouldThrowExceptionWhenDifferentLength = async () => {
  try {
    await User.findOneAndUpdate('123');
  } catch (err) {
    const isCorrectException = err.message === 'The received \'id\' is invalid';

    console.log(`\t➡ should throw an exception when id aren't following the default pattern of 13 characters ${isCorrectException ? '✅' : '❌'}`);

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
