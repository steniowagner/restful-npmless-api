const config = {
  development: {
    dataDir: 'database',
  },
};

module.exports = config[process.env.NODE_ENV];
