import { WritableArrayBuffer, ENDIANNESS } from '../array_buffer_manipulation';

import { DEFAULT_LZ4_DECOMPRESSOR_OPEN_OPTIONS } from './lz4_decompressor_open_options';

class LZ4DecompressorWriter extends WritableArrayBuffer {
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

    duplicateBytes(backOffset, duplicationLength) {
        let start = this.index - backOffset;
        const end = start + duplicationLength;
        let step;

        while (start < end) {
            step = Math.min(end, this.index) - start;
            this.writeByteView(this.getInnerByteView(start, step));
            start += step;
        }
    }

    writeBlock(literal, backOffset, duplicationLength, isFinal) {
        this.writeByteView(literal);
        if (!isFinal) {
            this.duplicateBytes(backOffset, duplicationLength);
        }
    }
}

export { LZ4DecompressorWriter };
