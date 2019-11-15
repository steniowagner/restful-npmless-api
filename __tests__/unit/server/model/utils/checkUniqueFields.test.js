const assert = require('assert');

const { EXCEPTION_MESSAGES } = require('../../../../../server/model/constants');
const checkUniqueFields = require('../../../../../server/model/utils/checkUniqueFields');
const clearTestDatabase = require('../../../../utils/clearTestDatabase');
const { dataTypes } = require('../../../../../server/model');
const { write } = require('../../../../../server/model/io');
const { STRING } = dataTypes;

const TestSchema = {
  collection: 'test',
  schema: {
    field1: {
      type: STRING,
      required: true,
      unique: true,
    },
    field2: {
      type: STRING,
      required: true,
    },
    field3: {
      'field31': {
        type: STRING,
        required: true,
        unique: true,
      },
      'field32': {
        'field321': {
          type: STRING,
          required: true,
          unique: true,
        },
      }
    }
  }
};

const uniqueObject = {
  field1: 'value-field1',
  field2: 'value-field2',
  field3: {
    'field31': 'value-field3.1',
    'field32': {
      'field321': 'value-field3.2.1',
    }
  }
};

const testCheckUniqueFields = async () => {
  console.log('\n------- # checkUniqueFields.test.js # -------');

  console.log('\n↳ Testing the checkUniqueFields method');

  const checkUniqueFieldsCreationSimpleValue = async () => {
    try {
      await write(Date.now(), TestSchema.collection, uniqueObject);

      await checkUniqueFields(TestSchema, uniqueObject);
    } catch (err) {
      const isResultCorrect = `${EXCEPTION_MESSAGES.UNIQUE_FIELD_ERROR}: field1` === err.message;
      console.log(`\t➡ should throw an exception when try to create an object with unique field that already exists (non-nested) ${isResultCorrect ? '✅' : '❌'}`);

      assert.strictEqual(`${EXCEPTION_MESSAGES.UNIQUE_FIELD_ERROR}: field1`, err.message);
    }
  }

  const checkUniqueFieldsCreationNestedValue = async () => {
    try {
      await write(Date.now(), TestSchema.collection, uniqueObject);

      await checkUniqueFields(TestSchema, {
        ...uniqueObject,
        field1: 'new-value-field1',
      });
    } catch (err) {
      const isResultCorrect = `${EXCEPTION_MESSAGES.UNIQUE_FIELD_ERROR}: field3.field31` === err.message;
      console.log(`\t➡ should throw an exception when try to create an object with unique field that already exists (nested) ${isResultCorrect ? '✅' : '❌'}`);

      assert.strictEqual(`${EXCEPTION_MESSAGES.UNIQUE_FIELD_ERROR}: field3.field31`, err.message);
    }
  };

  const checkUniqueFieldsCreationDeepNestedValue = async () => {
    try {
      await write(Date.now(), TestSchema.collection, uniqueObject);

      await checkUniqueFields(TestSchema, {
        field1: 'new-value-field1',
        field2: 'value-field2',
        field3: {
          'field31': 'new-value-field3.1',
          'field32': {
            'field321': 'value-field3.2.1',
          }
        }
      });
    } catch (err) {
      const isResultCorrect = `${EXCEPTION_MESSAGES.UNIQUE_FIELD_ERROR}: field3.field32.field321` === err.message;
      console.log(`\t➡ should throw an exception when try to create an object with unique field that already exists (nested) ${isResultCorrect ? '✅' : '❌'}`);

      assert.strictEqual(`${EXCEPTION_MESSAGES.UNIQUE_FIELD_ERROR}: field3.field32.field321`, err.message);
    }
  };

  await checkUniqueFieldsCreationSimpleValue();

  await clearTestDatabase(TestSchema.collection);

  await checkUniqueFieldsCreationNestedValue();

  await clearTestDatabase(TestSchema.collection);

  await checkUniqueFieldsCreationDeepNestedValue();

  await clearTestDatabase(TestSchema.collection);
};

module.exports = testCheckUniqueFields;
