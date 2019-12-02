const getPathValue = require('./getPathValue');
const setPathValue = require('./setPathValue');
const { read } = require('../io');

const handlePopulateField = async ({ itemsToPopulate, collection, populatePath, item, }) => {
  const valueToPopulate = await read.single(collection, itemsToPopulate);

  return setPathValue(populatePath, item, valueToPopulate);
};

const populate = async (item, schema, options) => {
  const { populate: populatePath } = options;

  const itemsToPopulate = getPathValue(populatePath, item);
  const populateSchemaPath = getPathValue(populatePath, schema);

  if (!Array.isArray(populateSchemaPath)) {
    return handlePopulateField({
      itemsToPopulate: itemsToPopulate.toString(),
      collection: populateSchemaPath.collection,
      populatePath,
      item,
    });
  }

  const { collection } = populateSchemaPath[0];

  const itemsPopulated = await Promise.all(itemsToPopulate.map(async itemToPopulate => {
    return await read.single(collection, itemToPopulate.toString());
  }));

  return setPathValue(populatePath, item, itemsPopulated);
};

module.exports = populate;
