const filterValidParams = (queryParams, schema) => {
  const validParams = Object.keys(queryParams).reduce((accumulator, current) => {
    if (typeof schema[current] !== 'undefined') {
      return Object.assign({}, accumulator, { [current]: queryParams[current] });
    }

    return accumulator;
  }, {});

  return validParams;
};

const parseWhiteSpaces = (value) => {
  const spaceRegex = new RegExp(/%20|\+/, 'g');

  return value.replace(spaceRegex, ' ');
};

const filterItems = (filters, items) => {
  const filteredItems = items.filter(item => {
    return filters.every(([field, value]) => {
      let convertedValue;

      if (Array.isArray(value)) {
        // return value.includes(item[field]);
      }

      if (typeof item[field] === 'string') {
        convertedValue = parseWhiteSpaces(String(value));
      }

      if (typeof item[field] === 'number') {
        convertedValue = Number(value);
      }

      if (typeof item[field] === 'boolean') {
        convertedValue = Boolean(value);
      }

      return item[field] === convertedValue;
    });
  });

  return filteredItems;
};

const filterItemsWithQueryParams = (items, schema, queryParams) => {
  const filteredParams = filterValidParams(queryParams, schema);
  const filters = Object.entries(filteredParams);

  if (!Object.keys(filters).length) {
    return [];
  }

  const filteredItems = filterItems(filters, items);

  return filteredItems;
};

module.exports = filterItemsWithQueryParams;
