import {
    ReadableArrayBuffer,
    ENDIANNESS,
    ENCODING,
    PRIMITIVE_TYPES
} from '../array_buffer_manipulation';

import { LUABINS_TYPES, LUABINS_TYPE_PREFIX_TO_TYPE } from './luabins_types';
import { DEFAULT_LUABINS_READER_OPTIONS } from './default_luabins_manipulator_options';

function insertIntoObject(table, key, value) {
    table[key] = value;
}

function insertIntoArray(table, key, value) {
    table.push(value);
}

class LuabinsReader extends ReadableArrayBuffer {
    constructor(
        arrayBuffer,
        {
            offset = DEFAULT_LUABINS_READER_OPTIONS.offset,
            byteLength = DEFAULT_LUABINS_READER_OPTIONS.byteLength,
            interpretAsArray = DEFAULT_LUABINS_READER_OPTIONS.interpretAsArray
        } = DEFAULT_LUABINS_READER_OPTIONS
    ) {
        super(arrayBuffer, {
            offset,
            byteLength,
            endianness: ENDIANNESS.LITTLE,
            encoding: ENCODING.UTF8
        });
        this.interpretAsArray = interpretAsArray;
    }

    read(type) {
        let _type, extraTypes;
        if (Array.isArray(type)) {
            [_type, ...extraTypes] = type;
        } else {
            _type = type;
        }
        switch (_type) {
            case LUABINS_TYPES.NIL:
                return null;
            case LUABINS_TYPES.FALSE:
                return false;
            case LUABINS_TYPES.TRUE:
                return true;
            case LUABINS_TYPES.NUMBER:
                return super.read(PRIMITIVE_TYPES.FLOAT64);
            case LUABINS_TYPES.TYPE_PREFIX:
                return super.read(PRIMITIVE_TYPES.UINT8);
            case LUABINS_TYPES.LENGTH_PREFIX8:
                return super.read(PRIMITIVE_TYPES.UINT8);
            case LUABINS_TYPES.LENGTH_PREFIX32:
                return super.read(PRIMITIVE_TYPES.UINT32);

            case LUABINS_TYPES.STRING:
                return this.readString();
            case LUABINS_TYPES.ARRAY_LP8:
                return this.readArrayLp(extraTypes[0], PRIMITIVE_TYPES.UINT8);
            case LUABINS_TYPES.ARRAY_LP32:
                return this.readArrayLp(extraTypes[0], PRIMITIVE_TYPES.UINT32);
            case LUABINS_TYPES.VALUE_TP:
                return this.readValueTp();
            case LUABINS_TYPES.TABLE:
                return this.readTable();
            default:
                return super.read(_type);
        }
    }

    readString() {
        const length = super.read(PRIMITIVE_TYPES.UINT32);
        return super.read(PRIMITIVE_TYPES.STRING_NN, { length });
    }

    readArrayLp(contentType, lengthType) {
        const length = super.read(lengthType);
        const result = [];
        for (let i = 0; i < length; ++i) {
            result.push(this.read(contentType));
        }
        return result;
    }

    readValueTp() {
        const typePrefix = this.read(LUABINS_TYPES.TYPE_PREFIX);
        const type = LUABINS_TYPE_PREFIX_TO_TYPE[typePrefix];
        return this.read(type);
    }

    readKeyValuePair() {
        const key = this.read(LUABINS_TYPES.VALUE_TP);
        const value = this.read(LUABINS_TYPES.VALUE_TP);
        return [key, value];
    }

    readTable() {
        const arraySize = super.read(PRIMITIVE_TYPES.UINT32);
        const hashSize = super.read(PRIMITIVE_TYPES.UINT32);
        const totalSize = arraySize + hashSize;

        if (totalSize < 1) return {};

        let [key, value] = this.readKeyValuePair();
        let [table, insert] =
            this.interpretAsArray && key === 1
                ? [[], insertIntoArray]
                : [{}, insertIntoObject];
        insert(table, key, value);

        for (let i = 1; i < totalSize; ++i) {
            [key, value] = this.readKeyValuePair();
            insert(table, key, value);
        }

        return table;
    }

    readLuabins() {
        return this.read([LUABINS_TYPES.ARRAY_LP8, LUABINS_TYPES.VALUE_TP]);
    }
}

export { LuabinsReader };
