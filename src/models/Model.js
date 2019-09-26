const write = require('../utils/io/write');
const read = require('../utils/io/read');

const Model = ({ collection }) => {
  if (!collection) {
    throw new Error('You must define a Collection for this Model');
  }

  const findAll = async () => read.all(collection);

  const create = async data => {
    try {
      const id = Date.now();

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
