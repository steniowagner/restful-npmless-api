const EXCEPTION_MESSAGES = {
  ID_NOT_PROVIDED: 'The field \'id\' is required',
  ID_TYPE_STRING: 'The type of the field \'id\' should be string',
  ID_INVALID_PATTERN: 'The received \'id\' is invalid',
  MODEL_CONFIG_MISSED: 'You must provide a Model config',
  MODEL_MISSED_COLLECTION: 'You must define a Collection for this Model',
  MODEL_MISSED_SCHEMA: 'You must define a Schema for this Model',
};

module.exports = EXCEPTION_MESSAGES;
