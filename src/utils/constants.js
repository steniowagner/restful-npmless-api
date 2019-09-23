const path = require('path');

const env = require('../config/environments');

const srcFolderNormalized = path.normalize('/src/');

const VALUES = {
  DATA_PATH: path.normalize(`${__dirname.split(srcFolderNormalized)[0]}/${env.dataDir}`),
  KILL_PROCESS_FLAG: 'SIGKILL',
  ROUTE_PARAM_FLAG: '#',
};

const HTTP_METHODS = {
  DELETE: 'DELETE',
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
};

const ENTITIES = {
  USER: 'USER',
};

module.exports = {
  HTTP_METHODS,
  ENTITIES,
  VALUES,
};
