import { PRIMITIVE_TYPES } from '../primitives/primitive_types';
import {
    isPrimitiveTypeSupportedByDataView,
    DATAVIEW_SUPPORTED_PRIMTIVE_TYPES_INTERFACES,
    getEndiannessFlag,
    utfStringFromByteView
} from '../array_buffer_utils';
import { OpenableArrayBuffer } from './openable_array_buffer';
import { ENCODING, ENDIANNESS } from '../primitives/primitive_options';

const DEFAULT_ARRAY_BUFFER_READ_OPTIONS = {
    endianness: undefined,
    encoding: undefined,
    length: undefined
};

class ReadableArrayBuffer extends OpenableArrayBuffer {
    read(
        type,
        {
            endianness = DEFAULT_ARRAY_BUFFER_READ_OPTIONS.endianness,
            encoding = DEFAULT_ARRAY_BUFFER_READ_OPTIONS.encoding,
            length = DEFAULT_ARRAY_BUFFER_READ_OPTIONS.length
        } = DEFAULT_ARRAY_BUFFER_READ_OPTIONS
    ) {
        if (isPrimitiveTypeSupportedByDataView(type)) {
            return this.readDataViewType(type, endianness);
        }

        switch (true) {
            case isPrimitiveTypeSupportedByDataView(type):
                return this.readDataViewType(type, endianness);

            case type === PRIMITIVE_TYPES.BOOL8:
                return this.readBool8();

            case type === PRIMITIVE_TYPES.STRING_NN:
                return this.readStringNN(length, encoding);

            case type === PRIMITIVE_TYPES.UINT64:
                return this.readUint64(endianness);

            case type === PRIMITIVE_TYPES.INT64:
            case type === PRIMITIVE_TYPES.STRING_NT:
            default:
                throw new Error(`Unsupported type: ${type}`);
        }
    }

    readByteView(byteLength) {
        const result = this.getNextByteView(byteLength);
        this.incrementIndex(byteLength);
        return result;
    }

    readDataViewType(type, endianness) {
        const resolvedEndianness = endianness ?? this.endianness;

        const { getter, bytes } =
            DATAVIEW_SUPPORTED_PRIMTIVE_TYPES_INTERFACES[type];

        const result = this.dataView[getter](
            this.index,
            getEndiannessFlag(resolvedEndianness)
        );

        this.incrementIndex(bytes);

        return result;
    }

    readBool8() {
        return !!this.read(PRIMITIVE_TYPES.UINT8);
    }

    readStringNN(length, encoding) {
        const byteView = this.readByteView(length);

        const resolvedEncoding = encoding ?? this.encoding;
        switch (resolvedEncoding) {
            case ENCODING.UTF8:
            case ENCODING.UTF16:
                return utfStringFromByteView(byteView);

            default:
                throw new Error(
                    `Unsupported string encoding: ${resolvedEncoding}`
                );
        }
    }

    readUint64(endianness) {
        const first = this.read(PRIMITIVE_TYPES.UINT32);
        const second = this.read(PRIMITIVE_TYPES.UINT32);
        const resolvedEndianness = endianness ?? this.endianness;
        return resolvedEndianness === ENDIANNESS.LITTLE
            ? first + second * 2 ** 32
            : first * 2 ** 32 + second;
    }
}

export { ReadableArrayBuffer };
