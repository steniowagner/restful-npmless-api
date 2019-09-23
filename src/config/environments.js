const config = {
  development: {
    dataDir: 'data',
    port: 3000,
  },

  test: {
    dataDir: 'data-test',
    port: 3000,
  },
};

module.exports = config[process.env.NODE_ENV];
