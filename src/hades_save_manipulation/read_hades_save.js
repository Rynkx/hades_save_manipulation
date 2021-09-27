import adler32 from 'adler-32';

import { PRIMITIVE_TYPES } from '../array_buffer_manipulation';
import { lz4Decompress } from '../lz4_decompression';
import { LuabinsReader, LUABINS_TYPES } from '../luabins_manipulation';

import {
    FILE_SIGNATURE,
    SUPPORTED_SAVE_VERSIONS,
    LUA_STATE_DECOMPRESSED_BYTE_SIZE_BY_SAVE_VERSION,
    SAVE_CHECKSUM_OFFSET
} from './hades_save_constants';

function signedToUnsigned(signed) {
    return signed >>> 0;
}

function getHadesSaveChecksum(saveArrayBuffer) {
    const target = new Uint8Array(saveArrayBuffer.buffer, SAVE_CHECKSUM_OFFSET);
    const signedChecksum = adler32.buf(target);
    const unsignedChecksum = signedToUnsigned(signedChecksum);
    return unsignedChecksum;
}

function readHadesSaveFromArrayBuffer(saveArrayBuffer) {
    const save = {};

    const readableSave = new LuabinsReader(saveArrayBuffer);

    save.file_signature = readableSave.read(PRIMITIVE_TYPES.UINT32);
    if (save.file_signature !== FILE_SIGNATURE)
        throw new Error('Wrong file signature.');

    save.checksum = readableSave.read(PRIMITIVE_TYPES.UINT32);
    const checksum = getHadesSaveChecksum(readableSave.byteView);
    if (save.checksum !== checksum)
        throw new Error(
            `Non-matching checksum. Expected: ${save.checksum}, got: ${checksum}.`
        );

    save.version = readableSave.read(PRIMITIVE_TYPES.UINT32);
    if (!SUPPORTED_SAVE_VERSIONS.includes(save.version))
        throw new Error(
            `Only save version 16 supported. This save is version ${save.version}`
        );

    save.timestamp = readableSave.read(PRIMITIVE_TYPES.UINT64);
    save.location = readableSave.read(LUABINS_TYPES.STRING);
    save.runs = readableSave.read(PRIMITIVE_TYPES.UINT32);
    save.active_meta_points = readableSave.read(PRIMITIVE_TYPES.UINT32);
    save.active_shrine_points = readableSave.read(PRIMITIVE_TYPES.UINT32);
    save.god_mode_enabled = readableSave.read(PRIMITIVE_TYPES.BOOL8);
    save.hell_mode_enabled = readableSave.read(PRIMITIVE_TYPES.BOOL8);
    save.lua_keys = readableSave.read([
        LUABINS_TYPES.ARRAY_LP32,
        LUABINS_TYPES.STRING
    ]);
    save.current_map_name = readableSave.read(LUABINS_TYPES.STRING);
    save.start_next_map = readableSave.read(LUABINS_TYPES.STRING);

    const compressed_lua_state_size = readableSave.read(PRIMITIVE_TYPES.UINT32);
    const decompressed_lua_state = new ArrayBuffer(
        LUA_STATE_DECOMPRESSED_BYTE_SIZE_BY_SAVE_VERSION[save.version]
    );
    lz4Decompress(
        {
            source: readableSave.byteView,
            offset: readableSave.index,
            length: compressed_lua_state_size
        },
        { destination: decompressed_lua_state }
    );
    save.lua_state = new LuabinsReader(decompressed_lua_state).readLuabins();

    return save;
}

export { readHadesSaveFromArrayBuffer };
