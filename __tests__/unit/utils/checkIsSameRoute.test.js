const assert = require('assert');

const checkIsSameRoute = require('../../../src/utils/api/checkIsSameRoute');

const checkIsSameRoutetTest = () => {
  assert.deepStrictEqual(checkIsSameRoute('/user/#id/cart/#cart_id/item/#item_id', 'user/123//////cart////333//////item/5555'), true);
  assert.deepStrictEqual(checkIsSameRoute('/user/#id/cart/#cart_id/item/#item_id', 'user/123/cart/333/item/5555'), true);
  assert.deepStrictEqual(checkIsSameRoute('/user/#id/payment', 'user/123/payment'), true);
  assert.deepStrictEqual(checkIsSameRoute('/user/#id/payment', 'user///123/payment'), true);
  assert.deepStrictEqual(checkIsSameRoute('/user/#id/some', 'user/123/some'), true);
  assert.deepStrictEqual(checkIsSameRoute('/user/#id', 'user///123'), true);
  assert.deepStrictEqual(checkIsSameRoute('/user/#id', 'user/123'), true);

  assert.deepStrictEqual(checkIsSameRoute('/user/#id/other', 'user//123//this'), false);
  assert.deepStrictEqual(checkIsSameRoute('/user/#id/other', 'user/123/this'), false);
  assert.deepStrictEqual(checkIsSameRoute('/user/#id', 'user////123/foo'), false);
  assert.deepStrictEqual(checkIsSameRoute('/user/#id', 'what/user/123'), false);
  assert.deepStrictEqual(checkIsSameRoute('/qwe/#id', 'user///123'), false);
};

module.exports = checkIsSameRoutetTest;
