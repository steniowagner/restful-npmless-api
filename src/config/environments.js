const config = {
  development: {
    port: 3000,
    hashingSecret: 'AIDNTBTLPDDEHMOZOVO!',
  },

  test: {
    port: 3000,
    hashingSecret: 'AIDNTBTLPDDEHMOZOVO!',
  },
};

module.exports = config[process.env.NODE_ENV];
