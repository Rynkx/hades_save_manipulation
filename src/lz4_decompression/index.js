import { LZ4DecompressorReader } from './lz4_decompressor_reader';
import { LZ4DecompressorWriter } from './lz4_decompressor_writer';

function lz4Decompress(
    { source, ...sourceOptions },
    { destination, ...destinationOptions }
) {
    const reader = new LZ4DecompressorReader(source, sourceOptions);
    const writer = new LZ4DecompressorWriter(destination, destinationOptions);

    let literal, backOffset, duplicationLength, isFinal;
    do {
        [literal, backOffset, duplicationLength, isFinal] = reader.readBlock();
        writer.writeBlock(literal, backOffset, duplicationLength, isFinal);
    } while (!isFinal);
}

export { lz4Decompress };
