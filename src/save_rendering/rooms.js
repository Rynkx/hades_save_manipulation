import { readJSON } from '../node_dependecies';

const BIOME_TYPES = {
    TARTARUS: 'TARTARUS',
    ASPHODEL: 'ASPHODEL',
    ELYSIUM: 'ELYSIUM',
    STYX: 'STYX',
    CHAOS: 'CHAOS',
    SURFACE: 'SURFACE',

    EREBUS: 'EREBUS',
    CREDITS: 'CREDITS'
};

const pathPostfixByBiome = {
    [BIOME_TYPES.TARTARUS]: 'Tartarus',
    [BIOME_TYPES.ASPHODEL]: 'Asphodel',
    [BIOME_TYPES.ELYSIUM]: 'Elysium',
    [BIOME_TYPES.STYX]: 'Styx',
    [BIOME_TYPES.CHAOS]: 'Secrets',
    [BIOME_TYPES.SURFACE]: 'Surface',

    [BIOME_TYPES.EREBUS]: null,
    [BIOME_TYPES.CREDITS]: null
};

// NOTE: Boss is a substring of MiniBoss... so it should be after it
const ROOM_TYPES = {
    BASE_ROOM: 'BASE_ROOM',
    INTRO: 'INTRO',
    PREBOSS: 'PREBOSS',
    POSTBOSS: 'POSTBOSS',

    FOUNTAIN: 'FOUNTAIN',
    MID_SHOP: 'MID_SHOP',
    STORY: 'STORY',
    CHAOS: 'CHAOS',

    COMBAT: 'COMBAT',

    STYX_HUB: 'STYX_HUB',
    STYX_MINI: 'STYX_MINI',

    MINIBOSS: 'MINIBOSS',
    BOSS: 'BOSS'
};

const ALL_ROOM_TYPES = {
    BIOME_TYPES,
    ROOM_TYPES
};

const RELEVANT_ROOM_DATA = {
    COUNT: 'RELEVANT_ROOM_DATA_COUNT',
    BOOL: 'RELEVANT_ROOM_DATA_BOOL',
    NAME: 'RELEVANT_ROOM_DATA_NAME',
    NAMES: 'RELEVANT_ROOM_DATA_NAMES'
};

const structuredRoomDataRelevance = {
    [ROOM_TYPES.BASE_ROOM]: null,
    [ROOM_TYPES.INTRO]: null,
    [ROOM_TYPES.PREBOSS]: null,
    [ROOM_TYPES.POSTBOSS]: null,

    [ROOM_TYPES.BOSS]: RELEVANT_ROOM_DATA.NAME,

    [ROOM_TYPES.MINIBOSS]: RELEVANT_ROOM_DATA.NAMES,

    [ROOM_TYPES.FOUNTAIN]: RELEVANT_ROOM_DATA.BOOL,
    [ROOM_TYPES.MID_SHOP]: RELEVANT_ROOM_DATA.BOOL,
    [ROOM_TYPES.STORY]: RELEVANT_ROOM_DATA.BOOL,

    [ROOM_TYPES.COMBAT]: RELEVANT_ROOM_DATA.COUNT,
    [ROOM_TYPES.STYX_HUB]: RELEVANT_ROOM_DATA.COUNT,
    [ROOM_TYPES.STYX_MINI]: RELEVANT_ROOM_DATA.COUNT,
    [ROOM_TYPES.CHAOS]: RELEVANT_ROOM_DATA.COUNT
};

const roomLabelsByRoomType = {
    [ROOM_TYPES.MINIBOSS]: {
        A_MiniBoss01: 'Inferno-Bombers',
        A_MiniBoss02: 'Middle Management Doomstone',
        A_MiniBoss03: 'Wretched Sneak',
        A_MiniBoss04: 'Doomstone',

        B_Wrapping01: 'Barge of Death',
        B_MiniBoss01: 'Megagorgon and Skullcrusher',
        B_MiniBoss02: "Witches' Circle",

        C_MiniBoss01: 'Asterius',
        C_MiniBoss02: 'Butterfly Ball',
        C_MiniBoss03: 'Debug only',

        D_MiniBoss01: 'Satyr Cultist',
        D_MiniBoss02: 'Gigantic Vermin',
        D_MiniBoss03: 'Tiny Vermin',
        D_MiniBoss04: 'Bother'
    },
    [ROOM_TYPES.BOSS]: {
        A_Boss01: 'Megaera',
        A_Boss02: 'Alecto',
        A_Boss03: 'Tisiphone',

        B_Boss01: 'Lernie', // ??
        B_Boss02: 'Extreme Measures Lernie', // ??

        C_Boss01: 'Theseus and Asterius',

        D_Boss01: 'Hades',

        CharonFight01: 'Charon'
    }
};

const roomTypeKeywords = {
    [ROOM_TYPES.BASE_ROOM]: 'Base',
    [ROOM_TYPES.INTRO]: 'Intro',
    [ROOM_TYPES.COMBAT]: 'Combat',
    [ROOM_TYPES.MINIBOSS]: 'MiniBoss',
    [ROOM_TYPES.FOUNTAIN]: 'Reprieve',
    [ROOM_TYPES.PREBOSS]: 'PreBoss',
    [ROOM_TYPES.POSTBOSS]: 'PostBoss',
    [ROOM_TYPES.BOSS]: 'Boss',
    [ROOM_TYPES.MID_SHOP]: 'Shop',
    [ROOM_TYPES.STORY]: 'Story',
    [ROOM_TYPES.STYX_HUB]: 'Hub',
    [ROOM_TYPES.STYX_MINI]: 'Mini',
    [ROOM_TYPES.CHAOS]: 'Secret'
};

function structureRoomData(rawRoomData) {
    const roomData = { ...rawRoomData };
    const structure = {};
    for (const roomTypeName in ROOM_TYPES) {
        const roomType = ROOM_TYPES[roomTypeName];
        structure[roomType] = [];
    }
    rooms: for (const roomName in roomData) {
        if (roomName in inlinedTypesByRoom) {
            structure[inlinedTypesByRoom[roomName]].push(roomName);
            delete roomData[roomName];
            continue;
        }
        for (const roomType in roomTypeKeywords) {
            const roomTypeKeyword = roomTypeKeywords[roomType];
            if (roomName.includes(roomTypeKeyword)) {
                structure[roomType].push(roomName);
                delete roomData[roomName];
                continue rooms;
            }
        }
    }
    return structure;
}

const inlinedTypesByRoom = {
    RoomOpening: ROOM_TYPES.INTRO,
    RoomSimple01: ROOM_TYPES.COMBAT,
    B_Wrapping01: ROOM_TYPES.MINIBOSS
};

function getFullBiomePath(biome, hadesSourceRoomDataDirectory) {
    const biomePathPostfix = pathPostfixByBiome[biome];
    if (!biomePathPostfix) {
        return null;
    }
    return `${hadesSourceRoomDataDirectory}/RoomData${biomePathPostfix}.json`;
}

// NOTE: those are in RoomData but there's way too much test stuff there, so inlined.
const inlinedRoomData = {
    [BIOME_TYPES.EREBUS]: {
        [ROOM_TYPES.BOSS]: ['CharonFight01'],
        [ROOM_TYPES.COMBAT]: [
            'RoomChallenge01',
            'RoomChallenge02',
            'RoomChallenge03',
            'RoomChallenge04'
        ]
    },
    [BIOME_TYPES.CREDITS]: {
        [ROOM_TYPES.STORY]: [
            'Return06',
            'Return05',
            'Return04',
            'Return03',
            'Return02',
            'Return01'
        ]
    }
};

async function hadesSourceBuildRoomsData(hadesSourceRoomDataDirectory) {
    const listsByTypeStructure = {};
    for (const biomeName in BIOME_TYPES) {
        const biome = BIOME_TYPES[biomeName];
        const roomDataPath = getFullBiomePath(
            biome,
            hadesSourceRoomDataDirectory
        );
        const rawRoomData = roomDataPath ? await readJSON(roomDataPath) : {};
        listsByTypeStructure[biome] = structureRoomData(rawRoomData);
    }
    for (const biomeType in inlinedRoomData) {
        const biomeData = inlinedRoomData[biomeType];
        for (const roomType in biomeData) {
            const roomData = biomeData[roomType];
            listsByTypeStructure[biomeType][roomType].push(...roomData);
        }
    }

    const map = {};
    for (const biome in listsByTypeStructure) {
        const biomeRoomData = listsByTypeStructure[biome];
        for (const roomType in biomeRoomData) {
            const roomList = biomeRoomData[roomType];
            for (const roomName of roomList) {
                const typeMatch = [biome, roomType];
                const label = roomLabelsByRoomType?.[roomType]?.[roomName];
                map[roomName] = { typeMatch, label };
            }
        }
    }
    return { listsByTypeStructure, map };
}

function getKnownRooms(roomMap, roomCountCache) {
    const knownRooms = {};
    for (const roomName in roomCountCache) {
        if (!roomMap[roomName]) continue;
        knownRooms[roomName] = roomCountCache[roomName];
    }
    return knownRooms;
}

function getRunStructuredRoomsFromKnown(roomMap, knownRooms) {
    const structured = {};
    for (const roomName in knownRooms) {
        const roomCount = knownRooms[roomName];
        const [biome, roomType] = roomMap[roomName].typeMatch;
        if (!structured[biome]) {
            structured[biome] = {};
        }
        const biomeData = structured[biome];
        switch (structuredRoomDataRelevance[roomType]) {
            case RELEVANT_ROOM_DATA.COUNT:
                if (!biomeData[roomType]) {
                    biomeData[roomType] = 0;
                }
                biomeData[roomType] += roomCount;
                break;
            case RELEVANT_ROOM_DATA.BOOL:
                biomeData[roomType] = true;
                break;
            case RELEVANT_ROOM_DATA.NAME:
                biomeData[roomType] = roomName;
                break;
            case RELEVANT_ROOM_DATA.NAMES:
                if (!biomeData[roomType]) {
                    biomeData[roomType] = [];
                }
                biomeData[roomType].push(roomName);
                break;
            default:
        }
    }
    return structured;
}
// TODO: More work here, { CHAOS: { CHAOS: [] } } is weird.
function getRunStructuredRooms(roomMap, roomCountCache) {
    return getRunStructuredRoomsFromKnown(
        roomMap,
        getKnownRooms(roomMap, roomCountCache)
    );
}

// TODO: Death room data.

export {
    ALL_ROOM_TYPES,
    hadesSourceBuildRoomsData,
    getKnownRooms,
    getRunStructuredRoomsFromKnown,
    getRunStructuredRooms
};
