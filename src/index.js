export { readHadesSaveFromArrayBuffer } from './hades_save_manipulation';
export { BASE_INTERPOLATION_TYPES } from './help_text';

export { hadesSourceBuildGameData } from './hades_source_build_game_data';

export {
    ALL_META_UPGRADE_TYPES,
    interpolateMetaUpgradeProperty,
    calculateMetaUpgradeCost,
    calculateMetaUpgradeValue,
    getKnownMetaUpgrades,
    getRunStructuredMetaUpgradesFromKnown,
    getRunStructuredMetaUpgrades,
    ALL_TRAIT_TYPES,
    interpolateTraitProperty,
    getKnownTraits,
    getRunStructuredTraitsFromKnown,
    getRunStructuredTraits,
    ALL_ROOM_TYPES,
    getKnownRooms,
    getRunStructuredRoomsFromKnown,
    getRunStructuredRooms,
    FISH_RARITY_TYPES,
    buildFishData,
    getKnownFish,
    getStructuredFishingDataFromKnown,
    getStructuredFishingData,
    getKnownRunData,
    getRunStructuredGameDataFromKnown,
    getRunStructuredGameData,
    getKnownSaveData,
    getSaveStructuredGameDataFromKnown,
    getSaveStructuredGameData
} from './save_rendering';

import gameData from './gameData.json';
export { gameData };

export { SJSON } from './sjson';

export { setNodeDependencies } from './node_dependecies';
// TODO:
// NOTE: reexports of any type aren't followed by default in vscode
// jsconfig maxNodeModuleJsDepth can be used to get autocomplete.
// Add support for dual builds (esm/commonjs) in npm
// no real tree shaking for commonjs
// Documentation
// Misc UI stuff, the borders and frames
// Keyword descriptions
// Character data
