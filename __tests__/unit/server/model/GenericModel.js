const { Model, dataTypes } = require('../../../../server/model');

const GenericSchema = {
  collection: 'generic',
  schema: {
    stringField: {
      type: dataTypes.STRING,
      required: true,
    },
    numberField: {
      type: dataTypes.NUMBER,
      required: true,
    },
    booleanField: {
      type: dataTypes.BOOLEAN,
      required: true,
    },
  }
};

const genericData = {
  stringField: 'StringField',
  booleanField: true,
  numberField: 21,
};

module.exports = {
  GenericModel: Model(GenericSchema),
  GenericSchema,
  genericData,
};
