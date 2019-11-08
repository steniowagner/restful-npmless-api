const EXCEPTION_MESSAGES = {
  MODEL_MISSED_COLLECTION: 'You must define a Collection for this Model',
  COLLECTION_NOT_STRING: 'Collections must be defined as a string',
  ID_TYPE_STRING: 'The type of the field \'id\' should be string',
  MODEL_MISSED_SCHEMA: 'You must define a Schema for this Model',
  MODEL_CONFIG_MISSED: 'You must provide a Model config',
  ID_INVALID_PATTERN: 'The received \'id\' is invalid',
  ID_NOT_PROVIDED: 'The field \'id\' is required',
};

module.exports = EXCEPTION_MESSAGES;
