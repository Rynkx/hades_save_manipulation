import { isArrayBufferView, isArrayBuffer } from '../array_buffer_utils';
import { ENDIANNESS, ENCODING } from '../primitives/primitive_options';

const DEFAULT_ARRAY_BUFFER_OPEN_OPTIONS = {
    offset: undefined,
    length: undefined,
    endianness: ENDIANNESS.BIG,
    encoding: ENCODING.UTF8
};

// TODO: rename?

class OpenableArrayBuffer {
    constructor(
        arrayBuffer,
        {
            offset = DEFAULT_ARRAY_BUFFER_OPEN_OPTIONS.offset,
            byteLength = DEFAULT_ARRAY_BUFFER_OPEN_OPTIONS.byteLength,
            endianness = DEFAULT_ARRAY_BUFFER_OPEN_OPTIONS.endianness,
            encoding = DEFAULT_ARRAY_BUFFER_OPEN_OPTIONS.encoding
        } = DEFAULT_ARRAY_BUFFER_OPEN_OPTIONS
    ) {
        if (!isArrayBuffer(arrayBuffer) && !isArrayBufferView(arrayBuffer)) {
            throw new Error('Argument not an ArrayBuffer or ArrayBufferView.');
        }
        const buffer =
            arrayBuffer instanceof ArrayBuffer
                ? arrayBuffer
                : arrayBuffer.buffer;

        this.dataView = new DataView(buffer, offset, byteLength);
        this.byteView = new Uint8Array(buffer, offset, byteLength);
        this.index = 0;
        this.encoding = encoding;
        this.endianness = endianness;
    }

    remainingBytes() {
        return this.dataView.byteLength - this.index;
    }

    incrementIndex(bytes) {
        this.index += bytes;
    }

    getInnerByteView(offset, byteLength) {
        return this.byteView.subarray(offset, offset + byteLength);
    }

    getNextByteView(byteLength) {
        return this.getInnerByteView(this.index, byteLength);
    }
}

export { OpenableArrayBuffer };
