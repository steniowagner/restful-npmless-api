const { EXCEPTION_MESSAGES, VALUES } = require('../constants');

const checkIdValid = id => {
  if (!id) {
    throw new Error(EXCEPTION_MESSAGES.ID_NOT_PROVIDED);
  }

  if (typeof id !== 'string') {
    throw new Error(EXCEPTION_MESSAGES.ID_TYPE_STRING);
  }

  if (id.length !== VALUES.ID_LENGHT || isNaN(id)) {
    throw new Error(EXCEPTION_MESSAGES.ID_INVALID_PATTERN);
  }

  return true;
};

module.exports = checkIdValid;
