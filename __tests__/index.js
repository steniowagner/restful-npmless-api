const checkIsSameRouteTest = require('./unit/server/router/utils/checkIsSameRoute.test');
const getRequestParams = require('./unit/server/router/utils/getRequestParams.test');
const parseRequest = require('./unit/server/router/utils/parseRequest.test');
const readSingleTest = require('./unit/server/model/io/read.single.test');
const readAllTest = require('./unit/server/model/io/read.all.test');
const writeTest = require('./unit/server/model/io/write.test');
const modelTest = require('./unit/server/model/Model.test');

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
