const config = {
  development: {
    dataDir: 'database',
  },

  test: {
    dataDir: 'database-test',
  },
};

module.exports = config[process.env.NODE_ENV];
