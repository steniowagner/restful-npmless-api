const assert = require('assert');

const filterItemsWithQueryParams = require('../../../../../server/model/utils/filterItemsWithQueryParams');
const { STRING, BOOLEAN, NUMBER } = require('../../../../../server/model/dataTypes');

const Schema = {
  isOnline: {
    type: BOOLEAN,
  },
  email: {
    type: STRING
  },
  name: {
    type: STRING
  },
  age: {
    type: NUMBER,
  },
};

const items = Array(30).fill({}).map((_, index) => {
  const label = index % 2 === 0 ? 'odd' : 'even';

  return ({
    email: `${label}-email`,
    name: `${label} name`,
    isOnline: label === 'odd',
    age: label === 'odd' ? 25 : 20,
  });
});

const shouldReturnItemsMatchedCorrectly = () => {
  const queryParams = {
    email: 'odd-email',
  };

  const result = filterItemsWithQueryParams(items, Schema, queryParams);

  const isResultCorrect = result.every((resultItem, index) => {
    return JSON.stringify(resultItem) === JSON.stringify({
      email: 'odd-email',
      name: 'odd name',
      isOnline: true,
      age: 25,
    });
  }) && result.length === 15;

  console.log(`\t➡ should return an array with the items that matches with the query params ${isResultCorrect ? '✅' : '❌'}`);

  assert.strictEqual(Array.isArray(result), true);
  assert.strictEqual(result.length, 15);
};

const shouldReturnEmptyArrayQueryDoesntMatch = () => {
  const queryParams = {
    other: 'param',
    another: 'param',
  };

  const result = filterItemsWithQueryParams(items, Schema, queryParams);
  const isResultCorrect = Array.isArray(result) && result.length === 0;

  console.log(`\t➡ should return an empty array when query params doens't match with the data ${isResultCorrect ? '✅' : '❌'}`);

  assert.strictEqual(Array.isArray(result), true);
  assert.strictEqual(result.length, 0);
};

const shouldReturnCorrectlyQueryParamsMessed = () => {
  const queryParams = {
    email: 'odd-email',
    other: 'param',
    another: 'param',
  };

  const result = filterItemsWithQueryParams(items, Schema, queryParams);

  const isResultCorrect = result.every((resultItem, index) => {
    return JSON.stringify(resultItem) === JSON.stringify({
      email: 'odd-email',
      name: 'odd name',
      isOnline: true,
      age: 25,
    });
  }) && result.length === 15;

  console.log(`\t➡ should return an array with the items that matches with only the params that matches with the schema ${isResultCorrect ? '✅' : '❌'}`);

  assert.strictEqual(Array.isArray(result), true);
  assert.strictEqual(result.length, 15);
};

const shouldReturnCorrectlyUsingWhiteSpaces = () => {
  const resultWithPercent20 = filterItemsWithQueryParams(items, Schema, {
    name: 'odd%20name',
  });

  const isResultWithPercent20Correct = resultWithPercent20.every((resultItem, index) => {
    return JSON.stringify(resultItem) === JSON.stringify({
      email: 'odd-email',
      name: 'odd name',
      isOnline: true,
      age: 25,
    });
  }) && resultWithPercent20.length === 15;

  console.log(`\t➡ should return an array with the items that matches with query and use %20 for white spaces ${isResultWithPercent20Correct ? '✅' : '❌'}`);

  assert.strictEqual(Array.isArray(resultWithPercent20), true);
  assert.strictEqual(resultWithPercent20.length, 15);

  const resultWithPlus = filterItemsWithQueryParams(items, Schema, {
    name: 'odd+name',
  });

  const isResultWithPlusCorrect = resultWithPlus.every((resultItem, index) => {
    return JSON.stringify(resultItem) === JSON.stringify({
      email: 'odd-email',
      name: 'odd name',
      isOnline: true,
      age: 25,
    });
  }) && resultWithPlus.length === 15;

  console.log(`\t➡ should return an array with the items that matches with query and use '+' for white spaces ${isResultWithPlusCorrect ? '✅' : '❌'}`);

  assert.strictEqual(Array.isArray(resultWithPlus), true);
  assert.strictEqual(resultWithPlus.length, 15);
};

const testFilterItemsWithQueryParams = () => {
  console.log('\n------- # filterItemsWithQueryParams.test.js # -------');

  console.log('\n↳ Testing the filterItemsWithQueryParams method');

  shouldReturnItemsMatchedCorrectly();
  shouldReturnEmptyArrayQueryDoesntMatch();
  shouldReturnCorrectlyQueryParamsMessed();
  shouldReturnCorrectlyUsingWhiteSpaces();
};

module.exports = testFilterItemsWithQueryParams;
