const paginateItems = (items, { limit, page }) => {
  const begin = Math.abs(page) * limit;
  const end = (Math.abs(page) * limit) + limit;

  const paginatedItems = items.slice(begin, end);

  return paginatedItems;
};

module.exports = paginateItems;
