import {
    ReadableArrayBuffer,
    ENDIANNESS,
    PRIMITIVE_TYPES
} from '../array_buffer_manipulation';

import { DEFAULT_LZ4_DECOMPRESSOR_OPEN_OPTIONS } from './lz4_decompressor_open_options';

class LZ4DecompressorReader extends ReadableArrayBuffer {
    constructor(
        arrayBuffer,
        {
            offset = DEFAULT_LZ4_DECOMPRESSOR_OPEN_OPTIONS.offset,
            byteLength = DEFAULT_LZ4_DECOMPRESSOR_OPEN_OPTIONS.byteLength
        } = DEFAULT_LZ4_DECOMPRESSOR_OPEN_OPTIONS
    ) {
        super(arrayBuffer, {
            offset,
            byteLength,
            endianness: ENDIANNESS.LITTLE
        });
    }

    readToken() {
        const byte = this.read(PRIMITIVE_TYPES.UINT8);
        const literalLength = Math.floor(byte / 16);
        const duplicationLength = byte % 16;
        return [literalLength, duplicationLength];
    }

    readLsic() {
        let sum = 0;
        let number;

        do {
            number = this.read(PRIMITIVE_TYPES.UINT8);
            sum += number;
        } while (number === 255);

        return sum;
    }

    readBlock() {
        let [literalLength, duplicationLength] = this.readToken();
        if (literalLength === 15) {
            literalLength += this.readLsic();
        }
        const literal = this.readByteView(literalLength);

        let backOffset;
        let isFinal = !this.remainingBytes();
        if (!isFinal) {
            backOffset = this.read(PRIMITIVE_TYPES.UINT16);
            if (duplicationLength === 15) {
                duplicationLength += this.readLsic();
            }
            duplicationLength += 4;
        }

        return [literal, backOffset, duplicationLength, isFinal];
    }
}

export { LZ4DecompressorReader };
