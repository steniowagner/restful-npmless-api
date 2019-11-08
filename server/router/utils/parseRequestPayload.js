const { StringDecoder } = require('string_decoder');
const { EXCEPTION_MESSAGES } = require('../constants');

const decoder = new StringDecoder('utf-8');

const onFinishPayloadStreaming = (resolve, reject, buffer) => {
  try {
    const payload = JSON.parse(buffer);

    resolve(payload);
  } catch (err) {
    reject(new Error(EXCEPTION_MESSAGES.INVALID_PAYLOAD));
  }
};

const parseRequestPayload = request => {
  let buffer = '';

  return new Promise((resolve, reject) => {
    request.on('data', data => {
      buffer += decoder.write(data);
    });

    request.on('end', () => {
      buffer += decoder.end();

      onFinishPayloadStreaming(resolve, reject, buffer);
    });

    request.on('error', err => reject(err));
  });
};

module.exports = parseRequestPayload;
