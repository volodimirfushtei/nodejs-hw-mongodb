function parseFilterParams(query) {
  const filters = {};

  if (query.name) {
    filters.name = { $regex: query.name, $options: 'i' };
  }

  if (query.phoneNumber) {
    filters.phoneNumber = query.phoneNumber;
  }

  if (query.email) {
    filters.email = query.email;
  }

  if (query.isFavourite) {
    filters.isFavourite = query.isFavourite === 'true';
  }

  if (query.contactType) {
    filters.contactType = query.contactType;
  }

  return filters;
}
export { parseFilterParams };
