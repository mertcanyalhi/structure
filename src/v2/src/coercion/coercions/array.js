const Errors = require('../../../../errors');

module.exports = {
  isCoerced: () => false, // always tries to coerce array types
  nullValue() {
    throw Errors.arrayOrIterable();
  },
  coerce(rawValue, attributeDefinition) {
    if (rawValue === undefined) {
      return;
    }

    assertIterable(rawValue);

    const items = extractItems(rawValue);

    const instance = createInstance(attributeDefinition);

    return fillInstance(instance, items, attributeDefinition);
  },
};

function assertIterable(value) {
  if (!isIterable(value)) {
    throw Errors.arrayOrIterable();
  }
}

function isIterable(value) {
  return value !== undefined && (value.length != null || value[Symbol.iterator]);
}

function extractItems(iterable) {
  if (!Array.isArray(iterable) && iterable[Symbol.iterator]) {
    return Array(...iterable);
  }

  return iterable;
}

function createInstance(typeDefinition) {
  const type = typeDefinition.resolveType();
  return new type();
}

function fillInstance(instance, items, attributeDefinition) {
  for (let i = 0; i < items.length; i++) {
    instance.push(attributeDefinition.itemTypeDefinition.coerce(items[i]));
  }

  return instance;
}
