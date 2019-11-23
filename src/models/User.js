const { Model, dataTypes } = require('../../server/model');
const { NUMBER, STRING } = dataTypes;

const UserSchema = {
  collection: 'users',
  schema: {
    arr: [{
      child: [{
        type: STRING
      }]
    }],

  }
};

module.exports = Model(UserSchema);

/*

  arr de tipos nativos => tem o type
  arr de tipo composto => não tem o type

*/
