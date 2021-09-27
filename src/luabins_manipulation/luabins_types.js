const LUABINS_TYPES = {
    NIL: 'NIL',
    FALSE: 'FALSE',
    TRUE: 'TRUE',
    NUMBER: 'NUMBER',
    TYPE_PREFIX: 'TYPE_PREFIX',
    LENGTH_PREFIX8: 'LENGTH_PREFIX8',
    LENGTH_PREFIX32: 'LENGTH_PREFIX32',

    VALUE_TP: 'VALUE_TP',
    ARRAY_LP8: 'ARRAY_LP8',
    ARRAY_LP32: 'ARRAY_LP32',
    STRING: 'STRING',
    TABLE: 'TABLE'
};

const LUABINS_VALUE_TYPE_PREFIXES = {
    [LUABINS_TYPES.NIL]: 0x2d, // 45
    [LUABINS_TYPES.FALSE]: 0x30, // 48
    [LUABINS_TYPES.TRUE]: 0x31, // 49
    [LUABINS_TYPES.NUMBER]: 0x4e, // 78
    [LUABINS_TYPES.STRING]: 0x53, // 83
    [LUABINS_TYPES.TABLE]: 0x54 // 84
};

const LUABINS_TYPE_PREFIX_TO_TYPE = (function () {
    const result = {};
    for (const type in LUABINS_VALUE_TYPE_PREFIXES) {
        const prefix = LUABINS_VALUE_TYPE_PREFIXES[type];
        result[prefix] = type;
    }
    return result;
})();

export {
    LUABINS_TYPES,
    LUABINS_VALUE_TYPE_PREFIXES,
    LUABINS_TYPE_PREFIX_TO_TYPE
};
