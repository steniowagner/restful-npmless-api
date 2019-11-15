const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const { EXCEPTION_MESSAGES, VALUES } = require('./constants');

const filterItemsWithQueryParams = require('./utils/filterItemsWithQueryParams');
const checkUniqueFields = require('./utils/checkUniqueFields');
const validateSchema = require('./utils/validateSchema');
const paginateItems = require('./utils/paginateItems');
const write = require('./io/write');
const read = require('./io/read');

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

  if (typeof collection !== 'string') {
    throw new Error(EXCEPTION_MESSAGES.COLLECTION_NOT_STRING);
  }

  if (!schema) {
    throw new Error(EXCEPTION_MESSAGES.MODEL_MISSED_SCHEMA);
  }

  const _handleCheckValidId = id => {
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

      await checkUniqueFields(modelInfo, data);

      const id = String(Date.now());

      await write(id, collection, data);

      return id;
    } catch (err) {
      throw err;
    }
  };

  const findAll = async (queryParams = {}) => {
    const items = await read.all(collection);
    const queryParamsKeys = Object.keys(queryParams);

    if (!queryParamsKeys.length) {
      return items;
    }

    const filteredItems = filterItemsWithQueryParams(items, schema, queryParams);

    const isPaginationSet = queryParamsKeys.includes('limit') && queryParamsKeys.includes('page');

    if (isPaginationSet) {
      return paginateItems(filteredItems, queryParams);
    }

    return filteredItems;
  };

  const findOne = async id => {
    _handleCheckValidId(id);

    return read.single(collection, id);
  };

  const findOneAndUpdate = async (id, fields) => {
    _handleCheckValidId(id);

    const dirPath = path.normalize(`${VALUES.DATA_PATH}/${collection}/${id}.json`);
    const isFileExists = await asyncExists(dirPath);

    if (isFileExists) {
      const item = await findOne(id);

      if (!Object.keys(fields).length) {
        return item;
      }

      const itemUpdated = Object.assign({}, item, fields);

      validateSchema(schema, itemUpdated);

      await checkUniqueFields(modelInfo, itemUpdated);

      await write(id, collection, itemUpdated);

      return itemUpdated;
    }

    return null;
  };

  const findOneAndRemove = async id => {
    _handleCheckValidId(id);

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
