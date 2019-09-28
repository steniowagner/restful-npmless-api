const assert = require('assert');

const { MODELS } = require('../../../src/utils/constants');
const Model = require('../../../src/models/Model');

const testFindOneAndRemove = require('./Mode.findOneAndRemove.test');
const testFindOneAndUpdate = require('./Mode.findOneAndUpdate.test');
const testFindAll = require('./Model.findAll.test');
const testFindOne = require('./Model.findOne.test');
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
    && typeof GenericModel.findOneAndUpdate === 'function'
    && typeof GenericModel.findOneAndRemove === 'function'
    && typeof GenericModel.findAll === 'function'
    && typeof GenericModel.findOne === 'function';

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
  await testFindOne();
  await testFindOneAndRemove();
  await testFindOneAndUpdate();
};

module.exports = testModel;
