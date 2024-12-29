function parseFilterParams(query) {
  const filters = {};

  if (query.isFavourite) {
    filters.isFavourite = query.isFavourite === 'true';
  }

  if (query.contactType) {
    filters.contactType = query.contactType;
  }

  return filters;
}
export { parseFilterParams };
