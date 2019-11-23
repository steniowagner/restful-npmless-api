const assert = require('assert');

const { EXCEPTION_MESSAGES } = require('../../../../server/model/constants');
const { Model } = require('../../../../server/model');

const testFilterItemsWithQueryParams = require('./utils/filterItemsWithQueryParams.test');
const testCheckUniqueFields = require('./utils/checkUniqueFields.test');
const testFindOneAndRemove = require('./Model.findOneAndRemove.test');
const testFindOneAndUpdate = require('./Model.findOneAndUpdate.test');
const testValidateSchema = require('./utils/validateSchema.test');
const testPaginateItems = require('./utils/paginateItems.test');
const removeDataDir = require('../../../utils/removeDataDir');
const testFindAll = require('./Model.findAll.test');
const testFindOne = require('./Model.findOne.test');
const { GenericModel } = require('./GenericModel');
const testCreate = require('./Model.create.test');

const shouldThrowExceptionNoModelProvided = () => {
  try {
    Model();
  } catch (err) {
    const isThrowingCorrectException = err.message === EXCEPTION_MESSAGES.MODEL_CONFIG_MISSED;
    console.log(`\t➡ should throw an exception when the Model is created without any config ${isThrowingCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isThrowingCorrectException, true);
  }
};

const shouldThrowExceptionNoCollectionProvided = () => {
  try {
    Model({});
  } catch (err) {
    const isThrowingCorrectException = err.message === EXCEPTION_MESSAGES.MODEL_MISSED_COLLECTION;
    console.log(`\t➡ should throw an exception when the Model is created without a collection ${isThrowingCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isThrowingCorrectException, true);
  }
};

const shouldThrowExceptionNoSchemaProvided = () => {
  try {
    Model({ collection: 'any' });
  } catch (err) {
    const isThrowingCorrectException = err.message === EXCEPTION_MESSAGES.MODEL_MISSED_SCHEMA;
    console.log(`\t➡ should throw an exception when the Model is created without a schema ${isThrowingCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isThrowingCorrectException, true);
  }
};

const shouldReturnMethodsCorrectlyWhenCreated = () => {
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

  await testCheckUniqueFields();

  testFilterItemsWithQueryParams();
  testPaginateItems();

  await removeDataDir();
};

module.exports = testModel;
