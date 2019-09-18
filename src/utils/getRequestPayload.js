const { StringDecoder } = require('string_decoder');

const decoder = new StringDecoder('utf-8');

const onFinishPayloadStreaming = (resolve, reject, buffer) => {
  try {
    const payload = JSON.parse(buffer);

    resolve(payload);
  } catch (err) {
    reject(new Error('Payload must be an Object'));
  }
};

const getRequestPayload = request => {
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

module.exports = getRequestPayload;
