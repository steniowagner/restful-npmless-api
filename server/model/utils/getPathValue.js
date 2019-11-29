const getPathValue = (path, object) => {
  const fields = path.split('.');
  let value;

  for (let i = 0; i < fields.length; i++) {
    if (value && !value[fields[i]]) {
      return null;
    }

    value = object[fields[i]] || value[fields[i]];
  }

  return value;
};

module.exports = getPathValue;
