function isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
}

function isString(s) {
    return typeof s === 'string';
}

function isNumber(n) {
    return typeof n === 'number';
}

function isArray(a) {
    return Array.isArray(a);
}

function isFunction(f) {
    return typeof f === 'function';
}

function sortedObject(object) {
    const result = {};
    const sortedKeys = Object.keys(object).sort();
    for (const key of sortedKeys) {
        result[key] = object[key];
    }
    return result;
}

function mapObject(object, entryCallback) {
    const mapped = {};

    for (const key in object) {
        const value = object[key];

        const entryResult = entryCallback(key, value);
        const [mappedKey, mappedValue] = isArray(entryResult)
            ? entryResult
            : [key, entryResult];

        mapped[mappedKey] = mappedValue;
    }

    return mapped;
}

function reverseObject(object) {
    const result = {};

    for (const key in object) {
        const value = object[key];
        result[value] = key;
    }

    return result;
}

function safeMergeObjects(...args) {
    const merged = {};

    for (const arg of args) {
        if (isPlainObject(arg)) {
            Object.assign(merged, arg);
        }
    }

    return merged;
}

function safeGetNestedProperty(object, keys) {
    let current = object;

    for (const key of keys) {
        current = current?.[key];
    }

    return current;
}

// NOTE: could be an issue with multi-platform?
// shouldn't be, looks supported
function deeplog(thing) {
    console.dir(thing, { depth: null });
}

export {
    isPlainObject,
    isNumber,
    isArray,
    isString,
    isFunction,
    sortedObject,
    mapObject,
    reverseObject,
    safeMergeObjects,
    safeGetNestedProperty,
    deeplog
};
