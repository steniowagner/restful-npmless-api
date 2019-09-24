const { promisify } = require('util');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const { VALUES } = require('../../../src/utils/constants');
const removeDataDir = require('./utils/removeDataDir');
const write = require('../../../src/utils/io/write');

const asyncReadFile = promisify(fs.readFile);

const data = {
  usernamme: 'steniowagner',
  name: 'Stenio',
  age: 25,
};

const collection = 'users';
const id = '123';

const directoryPath = path.normalize(`${VALUES.DATA_PATH}/${collection}`);
const filePath = path.normalize(`${directoryPath}/${id}.json`);

const afterEach = async () => await removeDataDir();

const getFileContent = async () => {
  const rawData = await asyncReadFile(filePath);
  const fileContent = JSON.parse(rawData);

  return fileContent;
};

const testCreateResourcesWhenDoesntExists = async () => {
  await write(id, collection, data);

  const isDirectoryCreated = fs.existsSync(directoryPath);
  const isFileCreated = fs.existsSync(filePath);

  console.log(`\t➡ should create the directory when it doesn't exists ${isDirectoryCreated ? '✅' : '❌'}`);
  assert.strictEqual(isDirectoryCreated, true);

  console.log(`\t➡ should create the file .json file with the data when the directory doesn't exists ${isFileCreated ? '✅' : '❌'}\n`);
  assert.strictEqual(isFileCreated, true);
};

const testContainsExpectedData = async () => {
  await write(id, collection, data);

  const fileContent = await getFileContent(collection, id);
  const isExpectedData = JSON.stringify(fileContent) === JSON.stringify(data);

  console.log(`\t➡ should create the .json file with the correct data ${isExpectedData ? '✅' : '❌'}\n`);
  assert.strictEqual(isExpectedData, true);
};

const testShouldOverrideExistentData = async () => {
  const newData = {
    usernamme: 'wagnerstenio',
    name: 'Wagner',
    age: 25,
  };

  await write(id, collection, data);
  await write(id, collection, newData);

  const fileContent = await getFileContent(collection, id);
  const isExpectedData = JSON.stringify(fileContent) === JSON.stringify(newData);

  console.log(`\t➡ should override existent data with the new one ${isExpectedData ? '✅' : '❌'}\n`);
  assert.strictEqual(isExpectedData, true);
};

const writeTest = async () => {
  console.log('\n------- # write.test.js # -------');

  console.log('\n↳ it should create resources when they doesn\'t exists');
  await testCreateResourcesWhenDoesntExists();
  await afterEach();

  console.log('\n↳ it should create the file with the correct content');
  await testContainsExpectedData();
  await afterEach();

  console.log('\n↳ it should overrides the file with the new content');
  await testShouldOverrideExistentData();
  await afterEach();
};

module.exports = writeTest;
