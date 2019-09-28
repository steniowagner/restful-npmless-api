const checkIsSameRouteTest = require('./unit/utils/checkIsSameRoute.test');
const getRequestParams = require('./unit/utils/getRequestParams.test');
const parseRequest = require('./unit/utils/parseRequest.test');
const readSingleTest = require('./unit/io/read.single.test');
const readAllTest = require('./unit/io/read.all.test');
const modelTest = require('./unit/model/Model.test');
const writeTest = require('./unit/io/write.test');

(async () => {
  console.log('\n🏁  Testing the API!');

  await writeTest();

  await readAllTest();

  await readSingleTest();

  await modelTest();

  checkIsSameRouteTest();

  getRequestParams();

  parseRequest();
})();
