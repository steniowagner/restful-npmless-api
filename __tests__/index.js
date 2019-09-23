const checkIsSameRouteTest = require('./unit/utils/checkIsSameRoute.test');
const getRequestParams = require('./unit/utils/getRequestParams.test');
const parseRequest = require('./unit/utils/parseRequest.test');
const writeTest = require('./unit/io/write.test');

(async () => {
  console.log('\n🏁  Testing the API!');

  await writeTest();
  checkIsSameRouteTest();
  getRequestParams();
  parseRequest();
})();
