const VALUES = {
  DATA_PATH: `${__dirname.split('/src/')[0]}/data`,
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
