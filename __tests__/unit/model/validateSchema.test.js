const assert = require('assert');

const validateSchema = require('../../../src/models/utils/validateSchema');
const { STRING, NUMBER } = require('../../../src/models/schemas/dataTypes');

const schema = {
  username: {
    type: STRING,
    required: true,
  },
  name: {
    type: STRING,
  },
  sex: {
    enum: ['M', 'F'],
    type: STRING,
  },
  address: {
    country: {
      type: STRING,
      required: true,
    },
    state: {
      type: STRING,
    },
    city: {
      type: STRING,
    },
    latLng: {
      lat: {
        type: NUMBER,
        required: true,
      },
      lng: {
        type: NUMBER,
      },
    }
  }
};

const schemaWithArray = {
  ...schema,
  contacts: [
    {
      required: true,
      type: {
        required: true,
        type: STRING,
        enum: ['mobile', 'landline']
      },
      name: {
        type: STRING,
        required: true,
      },
      number: {
        type: STRING,
        required: true,
      },
    }
  ],
};

const schemaWithNestedArray = {
  ...schema,
  arr: [
    {
      required: true,
      nestedArr: [{
        required: true,
        field: {
          required: true,
          type: STRING,
        },
      }],
    },
  ],
};

const shouldValidateSchemaCorrectly = () => {
  const data = {
    username: 'steniowagner',
    name: 'Stenio Wagner',
    sex: 'M',
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
    console.log(`\t➡ should throw an exception when a required field has wrong type ${isCorrectException ? '✅' : '❌'}`);
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
    console.log(`\t➡ should throw an exception when a required nested field has wrong type ${isCorrectException ? '✅' : '❌'}`);
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
    console.log(`\t➡ should throw an exception when a non-required field has wrong type ${isCorrectException ? '✅' : '❌'}`);
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
    console.log(`\t➡ should throw an exception when a non-required nested field has wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenShouldHaveObject = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      address: 'any',
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

const shouldValidateSchemaWithEnumCorrectly = () => {
  const schemaWithEnum = {
    ...schema,
    sex: {
      type: STRING,
      enum: ['M', 'F'],
    },
  };

  const data = {
    username: 'steniowagner',
    name: 'Stenio Wagner',
    sex: 'M',
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

  const isValidSchema = validateSchema(schemaWithEnum, data);
  console.log(`\t➡ should validate and return true when the data follows the schema (with enum)${isValidSchema ? '✅' : '❌'}`);
  assert.strictEqual(isValidSchema, true);
};

const shouldTrowErrorWhenEnumHasWrongType = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      sex: 'other',
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
    const isCorrectException = err.message === "The field 'sex' must be one of: [M,F]";
    console.log(`\t➡ should throw an exception when the schema define an enum and the data has a different type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldValidateSchemaCorrectlyWithArrays = () => {
  const data = {
    username: 'steniowagner',
    name: 'Stenio Wagner',
    sex: 'M',
    address: {
      country: 'Brazil',
      state: 'Ceará',
      city: 'Fortaleza',
      latLng: {
        lat: 123321,
        lng: -321123,
      }
    },
    contacts: [
      {
        type: 'mobile',
        name: 'Dandara',
        number: '123-456-789'
      },
      {
        type: 'mobile',
        name: 'Pernetinha',
        number: '789-456-123'
      }
    ],
  };

  const isValidSchema = validateSchema(schemaWithArray, data);
  console.log(`\t➡ should validate and return true when the data follows the schema and have an array ${isValidSchema ? '✅' : '❌'}`);
  assert.strictEqual(isValidSchema, true);
};

const shouldThrowErrorWhenRequiredArrayFieldIsMissed = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      sex: 'M',
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

    validateSchema(schemaWithArray, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'contacts' is required";
    console.log(`\t➡ should throw an exception when the schema has a array required and the data doesn't provide it ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenRequiredArrayFieldHasWrongType = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      sex: 'M',
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lat: 123321,
          lng: -321123,
        }
      },
      contacts: true,
    };

    validateSchema(schemaWithArray, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'contacts' must be an array";
    console.log(`\t➡ should throw an exception when the schema has a array required and the data provide it with the wrong type${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenRequiredNestedArrayFieldHasWrongType = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      sex: 'M',
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lat: 123321,
          lng: -321123,
        }
      },
      arr: [
        {
          nestedArr: true
        }
      ],
    };
    validateSchema(schemaWithNestedArray, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'arr.nestedArr' must be an array";
    console.log(`\t➡ should throw an exception when the schema has an array that has a nested array with wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenRequiredArrayIsEmpty = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      sex: 'M',
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lat: 123321,
          lng: -321123,
        }
      },
      arr: [],
    };

    validateSchema(schemaWithNestedArray, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'arr' can't be empty";
    console.log(`\t➡ should throw an exception when a required array is empty ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenRequiredNestedArrayFieldIsMissed = () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      sex: 'M',
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lat: 123321,
          lng: -321123,
        }
      },
      arr: [{}],
    };

    validateSchema(schemaWithNestedArray, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'arr.nestedArr' is required";
    console.log(`\t➡ should throw an exception when a required array has a missed nested required array ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenRequiredNestedArrayHasWrongType= () => {
  try {
    const data = {
      username: 'steniowagner',
      name: 'Stenio Wagner',
      sex: 'M',
      address: {
        country: 'Brazil',
        state: 'Ceará',
        city: 'Fortaleza',
        latLng: {
          lat: 123321,
          lng: -321123,
        }
      },
      arr: [{
        nestedArr: true
      }],
    };

    validateSchema(schemaWithNestedArray, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'arr.nestedArr' must be an array";
    console.log(`\t➡ should throw an exception when a required nested array has wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenNonRequiredArrayHasWrongType = () => {
  try {
    const data = {
      arr: true,
    };

    const schemaWithNestedArray = {
      arr: [
        {
          field: {
            type: STRING,
          },
        },
      ],
    };

    validateSchema(schemaWithNestedArray, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'arr' must be an array";
    console.log(`\t➡ should throw an exception when a required nested array has wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenNonRequiredNestedArrayHasWrongType = () => {
  try {
    const data = {
      arr: [{
        nestedArr: 'any',
      }],
    };

    const schemaWithNestedArray = {
      arr: [
        {
          nestedArr: [{
            field: {
              type: STRING,
            },
          }],
        },
      ],
    };

    validateSchema(schemaWithNestedArray, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'arr.nestedArr' must be an array";
    console.log(`\t➡ should throw an exception when a non-required nested array has wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenNonRequiredArrayHasPrimitiveTypesProvideWrongType = () => {
  try {
    const data = {
      arr: [1],
    };

    const schemaWithNestedArray = {
      arr: [STRING],
    };

    validateSchema(schemaWithNestedArray, data);
  } catch (err) {
    const isCorrectException = err.message === "All elements of 'arr' must be string";
    console.log(`\t➡ should throw an exception when a non-required array has primitive type and receive data with wrong type${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenRequiredArrayEnumHasWrongType = () => {
  try {
    const data = {
      name: 'Stenio Wagner',
      degrees: 'other',
    };

    const schema = {
      name: {
        type: STRING,
      },
      degrees: {
        required: true,
        enum: ['associate', 'bachelor', 'master', 'phD'],
        type: [STRING],
      },
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'degrees' must be an array of type 'string'";
    console.log(`\t➡ should throw an exception when a required array of enums has wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenNonRequiredArrayEnumHasWrongType = () => {
  try {
    const data = {
      name: 'Stenio Wagner',
      degrees: 'other',
    };

    const schema = {
      name: {
        type: STRING,
      },
      degrees: {
        enum: ['associate', 'bachelor', 'master', 'phD'],
        type: [STRING],
      },
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'degrees' must be an array of type 'string'";
    console.log(`\t➡ should throw an exception when a non-required array of enums has wrong type ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenRequiredArrayEnumHasValueOutOfEnum = () => {
  try {
    const data = {
      name: 'Stenio Wagner',
      degrees: ['other'],
    };

    const schema = {
      name: {
        type: STRING,
      },
      degrees: {
        required: true,
        enum: ['associate', 'bachelor', 'master', 'phD'],
        type: [STRING],
      },
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'degrees' must include only the following items: [associate,bachelor,master,phD]";
    console.log(`\t➡ should throw an exception when a required array of enums receive a value out of enum ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldThrowErrorWhenNonRequiredArrayEnumHasValueOutOfEnum = () => {
  try {
    const data = {
      name: 'Stenio Wagner',
      degrees: ['other'],
    };

    const schema = {
      name: {
        type: STRING,
      },
      degrees: {
        enum: ['associate', 'bachelor', 'master', 'phD'],
        type: [STRING],
      },
    };

    validateSchema(schema, data);
  } catch (err) {
    const isCorrectException = err.message === "The field 'degrees' must include only the following items: [associate,bachelor,master,phD]";
    console.log(`\t➡ should throw an exception when a non-required array of enums receive a value out of enum ${isCorrectException ? '✅' : '❌'}`);
    assert.strictEqual(isCorrectException, true);
  }
};

const shouldAcceptArrayEnumsCorrectly = () => {
  const data = {
    name: 'Stenio Wagner',
    degrees: ['associate', 'phD'],
  };

  const schema = {
    name: {
      type: STRING,
    },
    degrees: {
      enum: ['associate', 'bachelor', 'master', 'phD'],
      type: [STRING],
    },
  };

  const isSchemaValid = validateSchema(schema, data);
  console.log(`\t➡ should return true when the define enums correctly ${isSchemaValid ? '✅' : '❌'}`);
  assert.strictEqual(isSchemaValid, true);
};

const testValidateSchema = () => {
  console.log('\n------- # validateSchema.test.js # -------');

  console.log('\n↳ Testing the validateSchema method');

  shouldThrowErrorWhenRequiredFieldIsMissed();
  shouldThrowErrorWhenRequiredFieldHasWrongType();
  shouldThrowErrorWhenRequiredNestedFieldIsMissed();
  shouldThrowErrorWhenRequiredNestedFieldHasWrongType();

  shouldThrowErrorWhenNonRequiredFieldHasWrongType();
  shouldThrowErrorWhenNonRequiredNestedFieldHasWrongType();

  shouldValidateSchemaCorrectly();

  shouldThrowErrorWhenShouldHaveObject();
  shouldThrowErrorWhenMissedObject();

  shouldTrowErrorWhenEnumHasWrongType();
  shouldValidateSchemaWithEnumCorrectly();

  shouldValidateSchemaCorrectlyWithArrays();
  shouldThrowErrorWhenRequiredArrayFieldIsMissed();
  shouldThrowErrorWhenRequiredArrayFieldHasWrongType();

  shouldThrowErrorWhenRequiredNestedArrayFieldHasWrongType();
  shouldThrowErrorWhenRequiredNestedArrayFieldIsMissed();
  shouldThrowErrorWhenRequiredNestedArrayHasWrongType();
  shouldThrowErrorWhenRequiredArrayIsEmpty();
  shouldThrowErrorWhenNonRequiredArrayHasWrongType();
  shouldThrowErrorWhenNonRequiredNestedArrayHasWrongType();
  shouldThrowErrorWhenNonRequiredArrayHasPrimitiveTypesProvideWrongType();

  shouldThrowErrorWhenRequiredArrayEnumHasWrongType();
  shouldThrowErrorWhenNonRequiredArrayEnumHasWrongType();
  shouldThrowErrorWhenRequiredArrayEnumHasValueOutOfEnum();
  shouldThrowErrorWhenNonRequiredArrayEnumHasValueOutOfEnum();

  shouldAcceptArrayEnumsCorrectly();
};

module.exports = testValidateSchema;
