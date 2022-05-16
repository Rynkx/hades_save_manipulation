import { readHadesSaveFromArrayBuffer } from '../hades_save_manipulation';
import { deeplog } from '../utils';
import fsPromises from 'fs/promises';
import { hadesSourceBuildGameData } from '../save_rendering/hades_source_build_game_data';
import { readFile, setNodeDependencies, writeFile } from '../node_dependecies';
import { getSaveStructuredGameData } from '../save_rendering';
import { SJSON } from '../sjson';
import { getKnownSaveData } from '../save_rendering/get_save_structured_game_data';

import { ALL_META_UPGRADE_TYPES } from '../save_rendering/meta_upgrades';
import { ALL_TRAIT_TYPES } from '../save_rendering/traits';
import { ALL_ROOM_TYPES } from '../save_rendering/rooms';
import { FISH_RARITY_TYPES } from '../save_rendering/fishing';

setNodeDependencies({ fsPromises });

// Sorry for this!
// the lua/*.json files are the lua table in the file serialized to json
// same goes for the stuff in SourceRoomsDataDir, there should be lua->jsons there
// and the gui folder should be the unpacked assets

const RAW_SOURCE_DATA_DIR = 'D:/Hadescapes/raw_source_data';
const PROCESSED_SOURCE_DATA_DIR = 'D:/Hadescapes/processed_source_data';

const hadesSourceDataPaths = {
    hadesSourceHelpTextPath: `${PROCESSED_SOURCE_DATA_DIR}/HelpText.en.json`,
    hadesSourceMetaUpgradesDataPath: `${PROCESSED_SOURCE_DATA_DIR}/lua/MetaUpgradeData.json`,
    hadesSourceTraitsDataPath: `${PROCESSED_SOURCE_DATA_DIR}/lua/TraitData.json`,
    hadesSourceRoomsDataDirectory: `${PROCESSED_SOURCE_DATA_DIR}/lua`,
    hadesSourceClearMessagesDataPath: `${PROCESSED_SOURCE_DATA_DIR}/lua/RunClearMessageData.json`,
    hadesSourceGuiPackagePath: `${PROCESSED_SOURCE_DATA_DIR}/packages/1_hq/GUI`
};

const assetsDestinationPath = `${PROCESSED_SOURCE_DATA_DIR}/assets`;

async function getGameData() {
    return await hadesSourceBuildGameData(hadesSourceDataPaths);
}
async function saveGameData() {
    await hadesSourceBuildGameData(hadesSourceDataPaths, assetsDestinationPath);
    const ALL_TYPES = {
        ALL_META_UPGRADE_TYPES,
        ALL_TRAIT_TYPES,
        ALL_ROOM_TYPES,
        FISH_RARITY_TYPES
    };
    await writeFile(
        `${assetsDestinationPath}/allTypes.json`,
        JSON.stringify(ALL_TYPES)
    );
}

async function getSave(location) {
    const rawSaveArrayBuffer = await readFile(
        `${RAW_SOURCE_DATA_DIR}/${location}`
    );
    return readHadesSaveFromArrayBuffer(rawSaveArrayBuffer);
}
async function testKnownSave(location) {
    const gameData = await getGameData();
    const processedSave = await getSave(location);
    const { errors, fish, cerberusPets, runs } = getKnownSaveData(
        processedSave,
        gameData
    );
    deeplog(runs.slice(0, 3));
    deeplog(runs.slice(-3));
    deeplog(fish);
    deeplog(cerberusPets);
    deeplog(runs.length);
    deeplog(errors.length);
}

async function testStructuredSave(location) {
    const gameData = await getGameData();
    const processedSave = await getSave(location);
    const { errors, fish, cerberusPets, runs } = getSaveStructuredGameData(
        processedSave,
        gameData
    );
    deeplog(runs.slice(0, 3));
    deeplog(runs.slice(-3));
    deeplog(fish);
    deeplog(cerberusPets);
    deeplog(runs.length);
    deeplog(errors.length);
}

async function saveParsedHelpText() {
    const rawHelpTextString = await readFile(
        `${RAW_SOURCE_DATA_DIR}/HelpText.en.sjson`,
        'utf-8'
    );
    const processedHelpText = SJSON.parse(rawHelpTextString);
    await writeFile(
        `${PROCESSED_SOURCE_DATA_DIR}/HelpText.en.json`,
        JSON.stringify(processedHelpText)
    );
}

async function testBoth(location) {
    await testKnownSave(location);
    await testStructuredSave(location);
}

testBoth;

// So it doesn't cause lint errors, sorry...
saveGameData;
saveParsedHelpText;
