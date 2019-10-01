const { promisify } = require('util');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const { VALUES } = require('../../../src/utils/constants');
const { USER } = require('../../../src/models/types');
const removeDataDir = require('../../utils/removeDataDir');
const Model = require('../../../src/models/Model');

const asyncReadFile = promisify(fs.readFile);

const data = {
  username: 'steniowagner',
  name: 'Stenio',
  email: 'stenio.wagner1@gmail.com',
};

const User = Model(USER);

const shouldReturnIdWhenCreate = async () => {
  const id = await User.create(data);

  const isIdCorrectFormat = id.split('').length === VALUES.ID_LENGHT;
  console.log(`\t➡ should returns an id with ${VALUES.ID_LENGHT} characters ${isIdCorrectFormat ? '✅' : '❌'}`);
  assert.strictEqual(isIdCorrectFormat, true);

  const isIdCorrectType = typeof id === 'string';
  console.log(`\t➡ should returns an id with String type ${isIdCorrectType ? '✅' : '❌'}`);
  assert.strictEqual(isIdCorrectType, true);
};

const shouldCreateDataCorrectly = async () => {
  const id = await User.create(data);

  const filePath = path.normalize(`${VALUES.DATA_PATH}/${USER.collection}/${id}.json`);

  const rawData = await asyncReadFile(filePath);
  const fileContent = JSON.parse(rawData);
  const isItemCreatedCorrectly = JSON.stringify(fileContent) === JSON.stringify(data);

  console.log(`\t➡ should create data correctly ${isItemCreatedCorrectly ? '✅' : '❌'}`);
};

const testCreate = async () => {
  console.log('\n↳ Testing the create method');

  await shouldCreateDataCorrectly();

  await shouldReturnIdWhenCreate();

  await removeDataDir();
};

module.exports = testCreate;
