export function parseFilterParams(query) {
  const { type: contactType, isFavourite } = query;
  const filters = {};
  if (contactType) {
    filters.contactType = contactType;
  }
  if (isFavourite !== undefined) {
    filters.isFavourite = isFavourite === 'true';
  }
  return filters;
}
