const config = require('../../config/environments');
const crypto = require('crypto');

const encryptStringWithSHA256 = value => {
  const isValidValue = typeof value === 'string' && value.length;

  if (!isValidValue) {
    throw new Error('The value to be encrypted must be a string.');
  }

  return crypto.createHmac('sha256', config.hashingSecret)
    .update(value).digest('hex');
};

module.exports = encryptStringWithSHA256;
