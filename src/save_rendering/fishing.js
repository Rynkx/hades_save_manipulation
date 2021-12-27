import { reverseObject } from '../utils';
import { ALL_ROOM_TYPES } from './rooms';

// TODO: This should be subtype of all rarity types but that's not implemented.
const FISH_RARITY_TYPES = {
    COMMON: 'COMMON',
    RARE: 'RARE',
    LEGENDARY: 'LEGENDARY'
};

const fishBiomeKeywordByBiome = {
    [ALL_ROOM_TYPES.BIOME_TYPES.TARTARUS]: 'Tartarus',
    [ALL_ROOM_TYPES.BIOME_TYPES.ASPHODEL]: 'Asphodel',
    [ALL_ROOM_TYPES.BIOME_TYPES.ELYSIUM]: 'Elysium',
    [ALL_ROOM_TYPES.BIOME_TYPES.STYX]: 'Styx',
    [ALL_ROOM_TYPES.BIOME_TYPES.SURFACE]: 'Surface',
    [ALL_ROOM_TYPES.BIOME_TYPES.CHAOS]: 'Chaos'
};

const fishBiomeByBiomeKeyword = reverseObject(fishBiomeKeywordByBiome);

const fishRarityTypeKeywordByRarityType = {
    [FISH_RARITY_TYPES.COMMON]: 'Common',
    [FISH_RARITY_TYPES.RARE]: 'Rare',
    [FISH_RARITY_TYPES.LEGENDARY]: 'Legendary'
};

const fishRarityTypeByRarityTypeKeyword = reverseObject(
    fishRarityTypeKeywordByRarityType
);

const fishNameRegex = /Fish_(\w*)_(\w*)_01/;

function analyzeFishName(fishName) {
    const [, fishBiomeKeyword, fishRarityKeyword] =
        fishName.match(fishNameRegex);
    return [
        fishBiomeByBiomeKeyword[fishBiomeKeyword],
        fishRarityTypeByRarityTypeKeyword[fishRarityKeyword]
    ];
}

function getStructuredFishingData(totalFishCaught) {
    const fishAmountByRarity = {};

    for (const fishName in totalFishCaught) {
        const [, rarityType] = analyzeFishName(fishName);
        if (!fishAmountByRarity[rarityType]) {
            fishAmountByRarity[rarityType] = 0;
        }
        const fishAmount = totalFishCaught[fishName];
        fishAmountByRarity[rarityType] += fishAmount;
    }

    return fishAmountByRarity;
}

export { getStructuredFishingData, FISH_RARITY_TYPES };
