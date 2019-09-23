const { exec } = require('child_process');
const { promisify } = require('util');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const { VALUES } = require('../../../src/utils/constants');
const write = require('../../../src/utils/io/write');

let directoryPath = '';
let filePath = '';

const asyncReadFile = promisify(fs.readFile);
const asyncExec = promisify(exec);

const data = {
  usernamme: 'steniowagner',
  name: 'Stenio',
  age: 25,
};

const getPathDirNormalized = collection => {
  return path.normalize(`${VALUES.DATA_PATH}/${collection}`);
};

const afterEach = async () => {
  const isWin = process.platform === "win32";

  const removeDir =
    isWin ?
      () => asyncExec(`rmdir /Q /S ${VALUES.DATA_PATH}`)
      : () => asyncExec(`rm -Rf ${VALUES.DATA_PATH}`);

  await removeDir();
};

const getFileContent = async (collection, filename) => {
  directoryPath = getPathDirNormalized(collection);
  filePath = path.normalize(`${directoryPath}/${filename}.json`);

  const rawData = await asyncReadFile(filePath);
  const fileContent = JSON.parse(rawData);

  return fileContent;
};

const testCreateResourcesWhenDoesntExists = async () => {
  await write('123', 'users', data);

  directoryPath = getPathDirNormalized('users');
  filePath = path.normalize(`${directoryPath}/123.json`);

  const isDirectoryCreated = fs.existsSync(directoryPath);
  const isFileCreated = fs.existsSync(filePath);

  console.log(`\t➡ should create the directory when it doesn't exists ${isDirectoryCreated ? '✅' : '❌'}`);
  assert.strictEqual(isDirectoryCreated, true);

  console.log(`\t➡ should create the file .json file with the data when the directory doesn't exists ${isFileCreated ? '✅' : '❌'}`);
  assert.strictEqual(isFileCreated, true);
};

const testContainsExpectedData = async () => {
  await write('123', 'users', data);

  const fileContent = await getFileContent('users', '123');
  const isExpectedData = JSON.stringify(fileContent) === JSON.stringify(data);

  assert.deepStrictEqual(fileContent, data);
  console.log(`\t➡ should create the .json file with the correct data ${isExpectedData ? '✅' : '❌'}`);
};

const testShouldOverrideExistentData = async () => {
  const newData = {
    usernamme: 'wagnerstenio',
    name: 'Wagner',
    age: 25,
  };

  await write('123', 'users', data);
  await write('123', 'users', newData);

  const fileContent = await getFileContent('users', '123');
  const isExpectedData = JSON.stringify(fileContent) === JSON.stringify(newData);

  assert.deepStrictEqual(fileContent, newData);
  console.log(`\t➡ should override existent data with the new one ${isExpectedData ? '✅' : '❌'}`);
};

const writeTest = async () => {
  console.log('\n------- # write.test.js # -------');

  console.log('\n↳ it should create resources when they doesn\'t exists');
  await testCreateResourcesWhenDoesntExists();
  afterEach();

  console.log('\n↳ it should create the file with the correct content');
  await testContainsExpectedData();
  afterEach();

  console.log('\n↳ it should overrides the file with the new content');
  await testShouldOverrideExistentData();
  afterEach();

  console.log('\n------- # END # -------');
};

module.exports = writeTest;
