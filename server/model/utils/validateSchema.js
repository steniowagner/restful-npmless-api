const { STRING, BOOLEAN, NUMBER, ID } = require('../dataTypes');
const checkIdValid = require('./checkIdValid');

let pathLog = [];

const throwValidationError = message => {
  pathLog = [];
  throw new Error(message);
};

const handleEnumType = ({ schema: rawSchema, data, field, path }) => {
  if (!data[field]) {
    return;
  }

  const schema = Array.isArray(rawSchema[field]) ? rawSchema[field][0] : rawSchema[field];

  if (Array.isArray(data[field])) {
    const isAllItemsRequiredIncludedArray = data[field].every(item => schema.enum.includes(item));

    if (!isAllItemsRequiredIncludedArray) {
      throwValidationError(`The field '${path}' must only include the following items: [${schema.enum}]`);
    }
  }

  if (!Array.isArray(data[field])) {
    const isDataIncludedEnum = schema.enum.includes(data[field]);

    if (!isDataIncludedEnum) {
      throwValidationError(`The field '${path}' must be one of: [${schema.enum}]`);
    }
  }
};

const handleCheckValidId = (errorMessage, id) => {
  try {
    return checkIdValid(id);
  } catch (err) {
    throwValidationError(errorMessage);
  }
};

const handleValidateRequiredField = ({ schema, data, field, path }) => {
  if (!data || typeof data[field] === 'undefined') {
    throwValidationError(`The field '${path}' is required`);
  }

  if (schema[field].enum) {
    return handleEnumType({ schema, data, field, path });
  }

  const isFieldTypeId = schema[field].type === ID;

  if (isFieldTypeId) {
    handleCheckValidId(`The field '${path}' must be of type id`, data[field]);
  }

  if (!isFieldTypeId && typeof data[field] !== schema[field].type) {
    throwValidationError(`The field '${path}' must be of type ${schema[field].type}`);
  }
 };

 const handleValidateNonRequiredField = ({ schema, data, field, path }) => {
  if (schema[field].enum) {
    return handleEnumType({ schema, data, field, path });
  }

  if (!data || !schema[field].type) {
    return;
  }

  const errorMessage = `The field '${path}' must be of type ${schema[field].type}`;
  const isSameDataType = typeof data[field] === schema[field].type;
  const isFieldTypeId = schema[field].type === ID;

  if (isFieldTypeId) {
    handleCheckValidId(errorMessage, data[field]);
  }

  if (!isFieldTypeId && data.hasOwnProperty(field) && !isSameDataType) {
    throwValidationError(errorMessage);
  }
 };

const handleFieldIsObject = ({ data, field, path }) => {
  if (!data[field]) {
    throwValidationError(`The field '${path}' is required`);
  }

  if (typeof data[field] !== 'object') {
    throwValidationError(`The field '${path}' must be an object`);
  }
};

const handleValidationArrayPrimitiveType = (arrayType, data, path) => {
  const isDataCorrectType = data.every(item => typeof item === arrayType);

  if (!isDataCorrectType) {
    throwValidationError(`All elements of '${path}' must be ${arrayType}`);
  }
};

const handleValidationArrayIdType = (ids, path) => {
  try {
    ids.every(id => checkIdValid(id));
  } catch (err) {
    throwValidationError(`All elements of '${path}' must be of type id`);
  }
};

const handleFieldIsArray = ({ schema, data, field, path }) => {
  if (!data[field] && !schema[field][0].required) {
    return;
  }

  if (!data[field] && schema[field][0].required) {
    throwValidationError(`The field '${path}' is required`);
  }

  if (data[field] && !Array.isArray(data[field])) {
    throwValidationError(`The field '${path}' must be an array`);
  }

  if (schema[field][0].enum) {
    return handleEnumType({ schema, data, field, path });
  }

  const arrayType = typeof schema[field][0].type;
  const isTypeId = schema[field][0].type === ID;
  const isArrayPrimitiveType = !isTypeId && [STRING, BOOLEAN, NUMBER]
    .some(type => type === arrayType);

  if (schema[field][0].type && isArrayPrimitiveType) {
    return handleValidationArrayPrimitiveType(arrayType, data[field], path);
  }

  if (schema[field][0].type && isTypeId) {
    return handleValidationArrayIdType(data[field], path);
  }

  if (!data[field].length) {
    pathLog = []
  }

  for (let i = 0; i < data[field].length; i++) {
    validateSchema(schema[field][0], data[field][i]);
  }
};

const validateSchema = (schema, data) => {
  for (field in schema) {
    const params = { schema, data, field };

    const isFieldTypeArray = schema[field] && Array.isArray(schema[field]);
    const isPlainObject = !isFieldTypeArray && !schema[field].enum && !schema[field].type;

    if (isFieldTypeArray) {
      pathLog.push(field);

      handleFieldIsArray({ ...params, path: pathLog.join('.') });
    }

    if (isPlainObject) {
      pathLog.push(field);

      handleFieldIsObject({ ...params, path: pathLog.join('.') });
      validateSchema(schema[field], data[field]);

      pathLog = [];
    }

    const path = [...pathLog, `${field}`].join('.');

    if (schema[field] && schema[field].required) {
      handleValidateRequiredField({ ...params, path });
    }

    if (schema[field] && !schema[field].required) {
      handleValidateNonRequiredField({ ...params, path });
    }
  }

  pathLog = [];

  return true;
};

module.exports = validateSchema;
