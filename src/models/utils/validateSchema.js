let pathLog = [];

const throwValidationError = message => {
  pathLog = [];
  throw new Error(message);
};

const handleEnumType = ({ schema, data, field, path }) => {
  if (!data[field]) {
    return;
  }

  if (Array.isArray(data[field])) {
    const isAllItemsRequiredIncludedArray = data[field].every(item => schema[field].enum.includes(item));

    if (!isAllItemsRequiredIncludedArray) {
      throwValidationError(`The field '${path}' must include only the following items: [${schema[field].enum}]`);
    }
  }

  if (!Array.isArray(data[field])) {
    const isDataIncludedEnum = schema[field].enum.includes(data[field]);

    if (!isDataIncludedEnum) {
      throwValidationError(`The field '${path}' must be one of: [${schema[field].enum}]`);
    }
  }
};

const handleValidateFieldTypeArray = ({ schema, data, field, path }) => {
  if (!Array.isArray(data[field])) {
    throwValidationError(`The field '${path}' must be an array of type '${schema[field].type[0]}'`);
  }

  const isAllItemsRequiredType = data[field].every(item => typeof item === schema[field].type[0]);

  if (!isAllItemsRequiredType) {
    throwValidationError(`All items of '${path}' must be of type ${schema[field].type}`);
  }
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

const handleFieldIsObject = ({ data, field, path }) => {
  if (!data[field]) {
    throwValidationError(`The field '${path}' is required`);
  }

  if (typeof data[field] !== 'object') {
    throwValidationError(`The field '${path}' must be an object`);
  }
};

const handleFieldIsArray = ({ schema, data, field, path }) => {
  if (data[field] && !Array.isArray(data[field])) {
    throwValidationError(`The field '${path}' must be an array`);
  }

  const arrayType = typeof schema[field][0]

  if (arrayType !== 'object') {
    const isDataCorrectType = data[field].every(item => typeof item === arrayType);

    if (!isDataCorrectType) {
      throwValidationError(`All elements of '${path}' must be ${arrayType}`);
    }
  }

  const innerSchema = Object.assign({}, schema[field][0]);

  delete innerSchema.required;

  if (!data[field]) {
    throwValidationError(`The field '${path}' is required`);
  }

  if (!data[field].length) {
    throwValidationError(`The field '${path}' can't be empty`);
  }

  for (let i = 0; i < data[field].length; i++) {
    validateSchema(innerSchema, data[field][i]);
  }
};

const validateSchema = (schema, data) => {
  for (field in schema) {
    const params = { schema, data, field };

    const isFieldTypeArray = schema[field] && Array.isArray(schema[field]);

    if (isFieldTypeArray) {
      pathLog.push(field);

      handleFieldIsArray({ ...params, path: pathLog.join('.') });
    }

    if (!isFieldTypeArray && !schema[field].hasOwnProperty('type')) {
      pathLog.push(field);

      handleFieldIsObject({ ...params, path: pathLog.join('.') });
      validateSchema(schema[field], data[field]);

      pathLog = [];
    }

    const path = [...pathLog, `${field}`].join('.');

    const isFieldHasTypeArray = schema[field] && Array.isArray(schema[field].type);

    if (isFieldHasTypeArray) {
      handleValidateFieldTypeArray({ schema, data, field, path });
    }

    if (schema[field] && !isFieldHasTypeArray && schema[field].required) {
      handleValidateRequiredField({ ...params, path });
    }

    if (schema[field] && !isFieldHasTypeArray && !schema[field].required) {
      handleValidateNonRequiredField({ ...params, path });
    }

    if (schema[field] && schema[field].enum) {
      handleEnumType({ ...params, path });
    }
  }

  pathLog = [];

  return true;
};

module.exports = validateSchema;
