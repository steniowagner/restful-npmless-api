const config = {
  development: {
    port: 3000,
  },

  test: {
    port: 3000,
  },
};

module.exports = config[process.env.NODE_ENV];
