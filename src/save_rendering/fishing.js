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

const getFishName = (biomeType, rarityType) => {
    const biomeKeyword = fishBiomeKeywordByBiome[biomeType];
    const rarityKeyword = fishRarityTypeKeywordByRarityType[rarityType];
    return `Fish_${biomeKeyword}_${rarityKeyword}_01`;
};

const buildFishData = () => {
    const fish = { map: {} };
    for (const biome in fishBiomeKeywordByBiome) {
        for (const rarity in FISH_RARITY_TYPES) {
            const fishName = getFishName(biome, rarity);
            fish.map[fishName] = { biome, rarity };
        }
    }
    return fish;
};

const fishNameRegex = /Fish_(\w*)_(\w*)_01/;

function analyzeFishName(fishName) {
    const [, fishBiomeKeyword, fishRarityKeyword] =
        fishName.match(fishNameRegex);
    return [
        fishBiomeByBiomeKeyword[fishBiomeKeyword],
        fishRarityTypeByRarityTypeKeyword[fishRarityKeyword]
    ];
}

function getKnownFish(fishData, totalFishCaught) {
    const knownFish = {};
    for (const fishName in totalFishCaught) {
        if (!fishData.map[fishName]) continue;
        knownFish[fishName] = totalFishCaught[fishName];
    }
    return knownFish;
}

function getStructuredFishingDataFromKnown(fishData, knownFish) {
    const fishAmountByRarity = {};

    for (const fishName in knownFish) {
        const [, rarityType] = analyzeFishName(fishName);
        if (!fishAmountByRarity[rarityType]) {
            fishAmountByRarity[rarityType] = 0;
        }
        const fishAmount = knownFish[fishName];
        fishAmountByRarity[rarityType] += fishAmount;
    }

    return fishAmountByRarity;
}

function getStructuredFishingData(fishData, totalFishCaught) {
    return getStructuredFishingDataFromKnown(
        fishData,
        getKnownFish(fishData, totalFishCaught)
    );
}

export {
    FISH_RARITY_TYPES,
    buildFishData,
    getKnownFish,
    getStructuredFishingDataFromKnown,
    getStructuredFishingData
};
