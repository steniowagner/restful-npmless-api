const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const { EXCEPTION_MESSAGES, VALUES } = require('../utils/constants');

const validateSchema = require('./utils/validateSchema');
const write = require('../utils/io/write');
const read = require('../utils/io/read');

const asyncUnlink = promisify(fs.unlink);
const asyncExists = promisify(fs.exists);

const Model = modelInfo => {
  if (!modelInfo) {
    throw new Error(EXCEPTION_MESSAGES.MODEL_CONFIG_MISSED);
  }

  const { collection, schema } = modelInfo;

  if (!collection) {
    throw new Error(EXCEPTION_MESSAGES.MODEL_MISSED_COLLECTION);
  }

  if (!schema) {
    throw new Error(EXCEPTION_MESSAGES.MODEL_MISSED_SCHEMA);
  }

  const _handleCheckIdValid = id => {
    if (!id) {
      throw new Error(EXCEPTION_MESSAGES.ID_NOT_PROVIDED);
    }

    if (typeof id !== 'string') {
      throw new Error(EXCEPTION_MESSAGES.ID_TYPE_STRING);
    }

    if (id.length !== VALUES.ID_LENGHT) {
      throw new Error(EXCEPTION_MESSAGES.ID_INVALID_PATTERN);
    }
  };

  const create = async data => {
    try {
      validateSchema(schema, data);

      const id = String(Date.now());

      await write(id, collection, data);

      return id;
    } catch (err) {
      throw err;
    }
  };

  const findAll = async () => read.all(collection);

  const findOne = async id => {
    _handleCheckIdValid(id);

    return read.single(collection, id);
  };

  const findOneAndUpdate = async (id, fields) => {
    _handleCheckIdValid(id);

    const dirPath = path.normalize(`${VALUES.DATA_PATH}/${collection}/${id}.json`);
    const isFileExists = await asyncExists(dirPath);

    if (isFileExists) {
      const item = await findOne(id);

      if (!Object.keys(fields).length) {
        return item;
      }

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
