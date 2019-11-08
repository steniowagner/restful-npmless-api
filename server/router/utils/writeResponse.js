const writeResponse = (res, statusCode, bodyResponse) => {
  res.writeHead(statusCode);
  res.write(JSON.stringify(bodyResponse));
  res.end();
};

module.exports = writeResponse;
