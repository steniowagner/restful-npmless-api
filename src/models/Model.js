const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const { VALUES } = require('../../src/utils/constants');

const write = require('../utils/io/write');
const read = require('../utils/io/read');

const asyncUnlink = promisify(fs.unlink);
const asyncExists = promisify(fs.exists);

const Model = modelInfo => {
  if (!modelInfo) {
    throw new Error('You must provide a Model config');
  }

  const { collection } = modelInfo;

  if (!collection) {
    throw new Error('You must define a Collection for this Model');
  }

  const _handleCheckIdValid = id => {
    if (!id) {
      throw new Error('The field \'id\' is required');
    }

    if (typeof id !== 'string') {
      throw new Error('The type of the field \'id\' should be string');
    }

    if (id.length !== 13) {
      throw new Error('The received \'id\' is invalid');
    }
  };

  const create = async data => {
    try {
      const id = String(Date.now());

      await write(id, collection, data);

      return id;
    } catch (err) {
      throw err;
    }
  };

  const findAll = async () => read.all(collection);

  const findOne = async id => read.single(collection, id);

  const findOneAndUpdate = async (id, fields) => {
    _handleCheckIdValid(id);

    const dirPath = path.normalize(`${VALUES.DATA_PATH}/${collection}/${id}.json`);
    const isFileExists = await asyncExists(dirPath);

    if (isFileExists) {
      const item = await findOne(id);
      const itemUpdated = Object.assign({}, item, fields);

      await write(id, collection, itemUpdated);

      return itemUpdated;
    }

    return null;
  };

  const findOneAndRemove = async id => {
    _handleCheckIdValid(id);

    const dirPath = path.normalize(`${VALUES.DATA_PATH}/${collection}/${id}.json`);
    const isFileExists = await asyncExists(dirPath);

    if (isFileExists) {
      const itemRemoved = await findOne(id);

      await asyncUnlink(dirPath);

      return itemRemoved;
    }

    return null;
  };

  return {
    findOneAndUpdate,
    findOneAndRemove,
    findOne,
    findAll,
    create,
  };
};

module.exports = Model;
