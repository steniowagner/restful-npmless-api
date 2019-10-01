const assert = require('assert');

const validateSchema = require('../../../src/models/utils/validateSchema');
const DataTypes = require('../../../src/models/schemas/dataTypes');

const schema = {
  username: {
    type: DataTypes.STRING,
    required: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  address: {
    country: {
      type: DataTypes.STRING,
      required: true,
    },
    state: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    latLng: {
      lat: {
        type: DataTypes.NUMBER,
        required: true,
      },
      lng: {
        type: DataTypes.NUMBER,
      },
    }
  }
};

const validateSchemaCorrectly = () => {
  const data = {
    username: 'steniowagner',
    name: 'Stenio Wagner',
    address: {
      country: 'Brazil',
      state: 'Ceará',
      city: 'Fortaleza',
      latLng: {
        lat: 123321,
        lng: -321123,
      }
    },
  };

  const isValidSchema = validateSchema(schema, data);
  console.log(`\t➡ should validate and return true when the data follows the schema ${isValidSchema ? '✅' : '❌'}`);
  assert.strictEqual(isValidSchema, true);
};

const shouldThrowErrorWhenRequiredFieldIsMissed = () => {
  try {
    const data = {
      // username: 'steniowagner',
      name: 'Stenio Wagner',
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lat: 123321,
          lng: -321123,
        }
      },
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'username' is required";
    console.log(`\t➡ should throw an exception when a required field is missed ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenRequiredFieldHasWrongType = () => {
  try {
    const data = {
      username: 123,
      name: 'Stenio Wagner',
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lat: 123321,
          lng: -321123,
        }
      },
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'username' must be of type string";
    console.log(`\t➡ should throw an exception when a required field has a wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenRequiredNestedFieldIsMissed = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lng: -321123,
        }
      },
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'address.latLng.lat' is required";
    console.log(`\t➡ should throw an exception when a required nested field is missed ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenRequiredNestedFieldHasWrongType = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lat: '123',
          lng: -321123,
        }
      },
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'address.latLng.lat' must be of type number";
    console.log(`\t➡ should throw an exception when a required nested field has a wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenNonRequiredFieldHasWrongType = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 123,
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lat: 123,
          lng: -321123,
        }
      },
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'name' must be of type string";
    console.log(`\t➡ should throw an exception when a non-required field has a wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenNonRequiredNestedFieldHasWrongType = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lat: 123,
          lng: '-321123',
        }
      },
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'address.latLng.lng' must be of type number";
    console.log(`\t➡ should throw an exception when a non-required nested field has a wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenShouldHaveObject = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      address: 'any'
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'address' must be an object";
    console.log(`\t➡ should throw an exception when the schema define an object but the data provide a different type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenMissedObject = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'address' is required";
    console.log(`\t➡ should throw an exception when the schema define an object but the data doesn't provide it ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const testValidateSchema = () => {
  console.log('\n------- # validateSchema.test.js # -------');

  console.log('\n↳ Testing the validateSchema method');

  validateSchemaCorrectly();

  shouldThrowErrorWhenRequiredFieldIsMissed();
  shouldThrowErrorWhenRequiredFieldHasWrongType();
  shouldThrowErrorWhenRequiredNestedFieldIsMissed();
  shouldThrowErrorWhenRequiredNestedFieldHasWrongType();

  shouldThrowErrorWhenNonRequiredFieldHasWrongType();
  shouldThrowErrorWhenNonRequiredNestedFieldHasWrongType();

  shouldThrowErrorWhenShouldHaveObject();
  shouldThrowErrorWhenMissedObject();
};

module.exports = testValidateSchema;
