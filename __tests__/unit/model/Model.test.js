const assert = require('assert');

const { MODELS } = require('../../../src/utils/constants');
const removeDataDir = require('../../utils/removeDataDir');
const Model = require('../../../src/models/Model');

const testFindAll = require('./Model.findAll.test');
const testCreate = require('./Model.create.test');

const shouldThrowExceptionNoModelProvided = () => {
  try {
    const GenericModel = Model();
  } catch (err) {
    const isThrowingCorrectException = err.message === "You must provide a Model config";
    console.log(`\t➡ should throw an exception when the Model is created without any config ${isThrowingCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isThrowingCorrectException, true);
  }
};

const shouldThrowExceptionNoCollectionProvided = () => {
  try {
    const GenericModel = Model({});
  } catch (err) {
    const isThrowingCorrectException = err.message === "You must define a Collection for this Model";
    console.log(`\t➡ should throw an exception when the Model is created without a collection reference ${isThrowingCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isThrowingCorrectException, true);
  }
};

const shouldReturnMethodsCorrectlyWhenCreated = () => {
  const GenericModel = Model(MODELS.USER);
  const isReturningDataCorrectlyWhenCreated = typeof GenericModel.create === 'function'
    && typeof GenericModel.findAll === 'function';

  console.log(`\t➡ should returns the methods correctly ${isReturningDataCorrectlyWhenCreated ? '✅' : '❌'}`);
  assert.strictEqual(isReturningDataCorrectlyWhenCreated, true);
};

const testModel = async () => {
  console.log('\n------- # Model.test.js # -------');

  console.log('\n↳ Testing the Model creation');
  shouldThrowExceptionNoModelProvided();
  shouldThrowExceptionNoCollectionProvided();
  shouldReturnMethodsCorrectlyWhenCreated();

  await testCreate();
  await testFindAll();
};

module.exports = testModel;
