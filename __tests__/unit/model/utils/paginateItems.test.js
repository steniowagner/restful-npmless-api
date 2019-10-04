const assert = require('assert');

const paginateItems = require('../../../../src/models/utils/paginateItems');

const items = Array(100).fill({}).map((_, index) => ({
  name: `name-${index}`,
}));

const LIMIT = 10;

const checkResult = (items, page, limit) => {
  for (let i = 0; i < items.length; i++) {
    if (JSON.stringify(items[i]) !== JSON.stringify({
      name: `name-${(page * limit) + i}`
    })) {
      return false;
    }
  }

  return true;
};

const performTest = page => {
  let isResultCorrect;
  let itemsPaginated;

  itemsPaginated = paginateItems(items, { page, limit: LIMIT });
  isResultCorrect = checkResult(itemsPaginated, page, LIMIT);

  console.log(`\t➡ should paginate items in [${page}, ${LIMIT}] ${isResultCorrect ? '✅' : '❌'}`);
  assert.strictEqual(isResultCorrect, true);
};

const shouldPaginateCorrectlyWithNegativePages = () => {
  let isResultCorrect;
  let itemsPaginated;

  itemsPaginated = paginateItems(items, { page: -2, limit: LIMIT });
  isResultCorrect = checkResult(itemsPaginated, 2, LIMIT);

  console.log(`\t➡ should paginate items in correctly when page is negative ${isResultCorrect ? '✅' : '❌'}`);
  assert.strictEqual(isResultCorrect, true);
};

const testPaginateItems = () => {
  console.log('\n------- # paginateItems.test.js # -------');

  console.log('\n↳ Testing the paginateItems method');

  performTest(4);

  performTest(3);

  performTest(2);

  performTest(1);

  performTest(0);

  performTest(5);

  performTest(9);

  performTest(6);

  performTest(8);

  performTest(7);

  performTest(70);

  shouldPaginateCorrectlyWithNegativePages();
};

module.exports = testPaginateItems;
