const userSchema = require('./schemas/user');

const types = {
  USER: {
    collection: 'users',
    schema: userSchema,
  },
};

module.exports = types;
