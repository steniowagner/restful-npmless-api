const write = require('../utils/io/write');
const read = require('../utils/io/read');

const Model = modelInfo => {
  if (!modelInfo) {
    throw new Error('You must provide a Model config');
  }

  const { collection } = modelInfo;

  if (!collection) {
    throw new Error('You must define a Collection for this Model');
  }

  const findAll = async () => read.all(collection);

  const create = async data => {
    try {
      const id = String(Date.now());

      await write(id, collection, data);

      return id;
    } catch (err) {
      throw err;
    }
  };

  return {
    findAll,
    create,
  };
};

module.exports = Model;
