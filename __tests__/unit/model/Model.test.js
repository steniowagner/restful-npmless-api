const assert = require('assert');

const { USER } = require('../../../src/models/types');
const { EXCEPTION_MESSAGES } = require('../../../src/utils/constants');
const Model = require('../../../src/models/Model');
const testFindOneAndRemove = require('./Mode.findOneAndRemove.test');
const testFindOneAndUpdate = require('./Mode.findOneAndUpdate.test');
const testValidateSchema = require('./validateSchema.test');
const testFindAll = require('./Model.findAll.test');
const testFindOne = require('./Model.findOne.test');
const testCreate = require('./Model.create.test');

const shouldThrowExceptionNoModelProvided = () => {
  try {
    const GenericModel = Model();
  } catch (err) {
    const isThrowingCorrectException = err.message === EXCEPTION_MESSAGES.MODEL_CONFIG_MISSED;
    console.log(`\t➡ should throw an exception when the Model is created without any config ${isThrowingCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isThrowingCorrectException, true);
  }
};

const shouldThrowExceptionNoCollectionProvided = () => {
  try {
    const GenericModel = Model({});
  } catch (err) {
    const isThrowingCorrectException = err.message === EXCEPTION_MESSAGES.MODEL_MISSED_COLLECTION;
    console.log(`\t➡ should throw an exception when the Model is created without a collection ${isThrowingCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isThrowingCorrectException, true);
  }
};

const shouldThrowExceptionNoSchemaProvided = () => {
  try {
    const GenericModel = Model({ collection: 'any' });
  } catch (err) {
    const isThrowingCorrectException = err.message === EXCEPTION_MESSAGES.MODEL_MISSED_SCHEMA;
    console.log(`\t➡ should throw an exception when the Model is created without a schema ${isThrowingCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isThrowingCorrectException, true);
  }
};

const shouldReturnMethodsCorrectlyWhenCreated = () => {
  const GenericModel = Model(USER);
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
  shouldThrowExceptionNoSchemaProvided();
  shouldReturnMethodsCorrectlyWhenCreated();

  testValidateSchema();

  await testCreate();
  await testFindAll();
  await testFindOne();
  await testFindOneAndRemove();
  await testFindOneAndUpdate();
};

module.exports = testModel;
