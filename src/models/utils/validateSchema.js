let pathLog = [];

const throwValidationError = message => {
  pathLog = [];
  throw new Error(message);
};

const handleValidateRequiredField = ({ schema, data, field, path }) => {
  if (!data || !data.hasOwnProperty(field)) {
    throwValidationError(`The field '${path}' is required`);
  }

  if (typeof data[field] !== schema[field].type) {
    throwValidationError(`The field '${path}' must be of type ${schema[field].type}`);
  }
 };

 const handleValidateNonRequiredField = ({ schema, data, field, path }) => {
   if (!data || !schema[field].type) {
    return;
  }

  const isSameDataType = typeof data[field] === schema[field].type;

  if (data.hasOwnProperty(field) && !isSameDataType) {
    throwValidationError(`The field '${path}' must be of type ${schema[field].type}`);
  }
 };

const handleFieldIsObject = ({ schema, data, field, path }) => {
  if (!data[field]) {
    throwValidationError(`The field '${path}' is required`);
  }

  if (typeof data[field] !== 'object') {
    throwValidationError(`The field '${path}' must be an object`);
  }
};

const validateSchema = (schema, data) => {
  for (field in schema) {
    const params = { schema, data, field };

    if (!schema[field].hasOwnProperty('type')) {
      pathLog.push(field);

      handleFieldIsObject({ ...params, path: pathLog.join('.') });
      validateSchema(schema[field], data[field]);

      pathLog = [];
    }

    if (schema[field] && schema[field].required) {
      handleValidateRequiredField({ ...params, path: [...pathLog, `${field}`].join('.') });
    }

    if (schema[field] && !schema[field].required) {
      handleValidateNonRequiredField({ ...params, path: [...pathLog, `${field}`].join('.') });
    }
  }

  pathLog = [];

  return true;
};

module.exports = validateSchema;
