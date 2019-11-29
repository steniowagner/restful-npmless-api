const { EXCEPTION_MESSAGES } = require('../constants');
const getPathValue = require('./getPathValue');
const read = require('../io/read');

const extractUniquePaths = (schema, path = '', paths) => {
  for (field in schema) {
    const isFieldTypeArray = Array.isArray(schema[field]);
    const isComposedObject = !isFieldTypeArray && !schema[field].hasOwnProperty('type');
    const isSimpleObejct = schema[field].hasOwnProperty('type');

    if (isFieldTypeArray || isComposedObject) {
      path += `${field}.`
      extractUniquePaths(schema[field], path, paths);
    }

    if (isSimpleObejct && schema[field].unique) {
      const newPath = path ? `${path}${field}` : field;
      paths.push(newPath);
    }
  }
};

const checkUniqueFields = async (Model, object) => {
  const { collection, schema } = Model;

  const collectionItems = await read.all(collection);
  const uniqueFieldsPaths = [];

  let pathInvalidValue;

  extractUniquePaths(schema, '', uniqueFieldsPaths);

  const isRespectUniqueFields = collectionItems.every(collectionItem => {
    if (collectionItem.id === object.id) {
      return true;
    }

    return uniqueFieldsPaths.every(uniqueFieldPath => {
      const collectionItemValue = getPathValue(uniqueFieldPath, collectionItem);
      const objValue = getPathValue(uniqueFieldPath, object);

      const isValueTypeArray = Array.isArray(collectionItemValue) && Array.isArray(objValue);
      const hasDifferentValues = collectionItemValue !== objValue;
      const isValueNotSet = !collectionItemValue || !objValue;

      if (hasDifferentValues || isValueNotSet || isValueTypeArray) {
        return true;
      }

      pathInvalidValue = uniqueFieldPath;

      return false;
    });
  });

  if (isRespectUniqueFields) {
    return true;
  }

  throw new Error(`${EXCEPTION_MESSAGES.UNIQUE_FIELD_ERROR}: ${pathInvalidValue}`);
};

module.exports = checkUniqueFields;
