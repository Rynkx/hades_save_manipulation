import { ENDIANNESS } from './primitives/primitive_options';
import { PRIMITIVE_TYPES } from './primitives/primitive_types';

function isArrayBuffer(value) {
    return value instanceof ArrayBuffer;
}

function isArrayBufferView(value) {
    return (
        value && isArrayBuffer(value.buffer) && value.byteLength !== undefined
    );
}

function getEndiannessFlag(endianness) {
    return endianness === ENDIANNESS.LITTLE;
}

const DATAVIEW_SUPPORTED_PRIMITIVE_TYPES = {
    [PRIMITIVE_TYPES.INT8]: {
        name: 'Int8',
        bytes: 1
    },
    [PRIMITIVE_TYPES.INT16]: {
        name: 'Int16',
        bytes: 2
    },
    [PRIMITIVE_TYPES.INT32]: {
        name: 'Int32',
        bytes: 4
    },

    [PRIMITIVE_TYPES.UINT8]: {
        name: 'Uint8',
        bytes: 1
    },
    [PRIMITIVE_TYPES.UINT16]: {
        name: 'Uint16',
        bytes: 2
    },
    [PRIMITIVE_TYPES.UINT32]: {
        name: 'Uint32',
        bytes: 4
    },

    [PRIMITIVE_TYPES.FLOAT32]: {
        name: 'Float32',
        bytes: 4
    },
    [PRIMITIVE_TYPES.FLOAT64]: {
        name: 'Float64',
        bytes: 8
    }
};

function isPrimitiveTypeSupportedByDataView(type) {
    return !!DATAVIEW_SUPPORTED_PRIMITIVE_TYPES[type];
}

const DATAVIEW_PREFIX = {
    SETTER: 'set',
    GETTER: 'get'
};

const DATAVIEW_SUPPORTED_PRIMTIVE_TYPES_INTERFACES = (function () {
    const result = {};
    for (const key in DATAVIEW_SUPPORTED_PRIMITIVE_TYPES) {
        const { name, bytes } = DATAVIEW_SUPPORTED_PRIMITIVE_TYPES[key];
        result[key] = {
            setter: `${DATAVIEW_PREFIX.SETTER}${name}`,
            getter: `${DATAVIEW_PREFIX.GETTER}${name}`,
            bytes
        };
    }
    return result;
})();

function utfStringFromByteView(byteView) {
    return String.fromCharCode.apply(null, byteView);
}

function byteViewFromUtfString(utfString) {
    const byteView = new Uint8Array(utfString.length);
    for (let i = 0; i < utfString.length; ++i) {
        byteView[i] = utfString.charCodeAt(i);
    }
    return byteView;
}

export {
    isArrayBuffer,
    isArrayBufferView,
    getEndiannessFlag,
    isPrimitiveTypeSupportedByDataView,
    DATAVIEW_SUPPORTED_PRIMTIVE_TYPES_INTERFACES,
    utfStringFromByteView,
    byteViewFromUtfString
};
