export const transformer = {
  // entity to db
  to(value: any) {
    return value;
  },
  // db to entity
  from(value: any) {
    return +value || 0;
  },
};
