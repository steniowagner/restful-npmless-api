const { promisify } = require('util');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const { VALUES } = require('../../../../server/model/constants');
const { GenericModel, GenericSchema, genericData } = require('./GenericModel');
const removeDataDir = require('../../../utils/removeDataDir');

const asyncReadFile = promisify(fs.readFile);

const shouldReturnIdWhenCreate = async () => {
  const id = await GenericModel.create(genericData);

  const isIdCorrectFormat = id.split('').length === VALUES.ID_LENGHT;
  console.log(`\t➡ should returns an id with ${VALUES.ID_LENGHT} characters ${isIdCorrectFormat ? '✅' : '❌'}`);
  assert.strictEqual(isIdCorrectFormat, true);

  const isIdCorrectType = typeof id === 'string';
  console.log(`\t➡ should returns an id with String type ${isIdCorrectType ? '✅' : '❌'}`);
  assert.strictEqual(isIdCorrectType, true);
};

const shouldCreateDataCorrectly = async () => {
  const id = await GenericModel.create(genericData);

  const filePath = path.normalize(`${VALUES.DATA_PATH}/${GenericSchema.collection}/${id}.json`);

  const rawData = await asyncReadFile(filePath);
  const fileContent = JSON.parse(rawData);
  const isItemCreatedCorrectly = JSON.stringify(fileContent) === JSON.stringify(genericData);

  console.log(`\t➡ should create data correctly ${isItemCreatedCorrectly ? '✅' : '❌'}`);
};

const testCreate = async () => {
  console.log('\n↳ Testing the create method');

  await shouldCreateDataCorrectly();

  await shouldReturnIdWhenCreate();

  await removeDataDir();
};

module.exports = testCreate;
