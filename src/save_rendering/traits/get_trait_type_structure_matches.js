import { ALL_TRAIT_TYPES } from './trait_types';
import { isFunction, mapObject } from '../../utils';

const {
    CHAOS_TYPES,
    GOD_TYPES,
    SLOT_TYPES,
    STORY_ROOM_TYPES,
    TIER_TYPES,
    TRAIT_TYPES,
    WEAPON_TYPES
} = ALL_TRAIT_TYPES;

const FILTER = {
    AND:
        (...filters) =>
        // eslint-disable-next-line prettier/prettier
    	(traitName, traitData) =>
            // eslint-disable-next-line prettier/prettier
                filters.every(filter => filter(traitName, traitData)),

    OR:
        (...filters) =>
        // eslint-disable-next-line prettier/prettier
            (traitName, traitData) =>
            // eslint-disable-next-line prettier/prettier
                filters.some(filter => filter(traitName, traitData)),

    NOT: filter => (traitName, traitData) => !filter(traitName, traitData),

    INHERITANCE: superClass => (traitName, traitData) =>
        !!traitData?.InheritFrom?.includes(superClass),

    NAME: substring => traitName => !!traitName?.includes(substring),

    ICON: substring => (traitName, traitData) =>
        !!traitData?.Icon?.includes(substring),

    SLOT: substring => (traitName, traitData) =>
        !!traitData?.Slot?.includes(substring),

    LIST: list => traitName => !!list?.includes(traitName)
};

const TRAIT_TYPE_STRUCTURE = {
    substructure: {}
};

const TRAIT_TYPE_SUBSTRUCTURE = TRAIT_TYPE_STRUCTURE.substructure;

// WEAPON TRAITS:
const keywordByWeaponType = {
    [WEAPON_TYPES.SWORD]: 'Sword',
    [WEAPON_TYPES.SPEAR]: 'Spear',
    [WEAPON_TYPES.SHIELD]: 'Shield',
    [WEAPON_TYPES.BOW]: 'Bow',
    [WEAPON_TYPES.FIST]: 'Fist',
    [WEAPON_TYPES.GUN]: 'Gun'
};

function getWeaponTypeStructure(weaponType) {
    return { filter: FILTER.ICON(keywordByWeaponType[weaponType]) };
}

TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.ASPECT] = {
    filter: FILTER.ICON('WeaponEnchantment_'),
    substructure: mapObject(WEAPON_TYPES, getWeaponTypeStructure)
};

TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.HAMMER] = {
    filter: FILTER.ICON('Weapon_'),
    substructure: mapObject(WEAPON_TYPES, getWeaponTypeStructure)
};

// COMPANIONS AND KEEPSAKES:
TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.COMPANION] = {
    filter: FILTER.INHERITANCE('AssistTrait')
};

TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.COMPATIBILITY] = {
    filter: FILTER.LIST(['MegaRubbleTrait', 'MetaPointHealTrait'])
};

TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.KEEPSAKE] = {
    filter: FILTER.AND(
        FILTER.ICON('Keepsake'),
        FILTER.NOT(TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.COMPANION].filter),
        FILTER.NOT(TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.COMPATIBILITY].filter)
    )
};

// SHOP AND STORY ROOM TRAITS:
TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.STORY_ROOM] = {
    substructure: {
        [STORY_ROOM_TYPES.BOULDY]: {
            filter: FILTER.INHERITANCE('BouldyBlessing')
        },
        [STORY_ROOM_TYPES.EURYDICE]: {
            filter: FILTER.LIST(['SuperTemporaryBoonRarityTrait'])
        },
        [STORY_ROOM_TYPES.PATROCLUS]: {
            filter: FILTER.OR(
                FILTER.NAME('_Patroclus'),
                FILTER.LIST(['UpgradedTemporaryLastStandHealTrait'])
            )
        }
    }
};

TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.SHOP_ITEM] = {
    filter: FILTER.AND(
        FILTER.INHERITANCE('ShopTrait'),
        FILTER.NOT(
            TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.STORY_ROOM].substructure[
                STORY_ROOM_TYPES.EURYDICE
            ].filter
        ),
        FILTER.NOT(
            TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.STORY_ROOM].substructure[
                STORY_ROOM_TYPES.PATROCLUS
            ].filter
        )
    )
};

// CHAOS TRAITS:
const keywordByChaosType = {
    [CHAOS_TYPES.BLESSING]: 'ChaosBlessingTrait',
    [CHAOS_TYPES.CURSE]: 'ChaosCurseTrait'
};

function getChaosTypeStructure(chaosType) {
    return {
        filter: FILTER.INHERITANCE(keywordByChaosType[chaosType])
    };
}

TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.CHAOS] = {
    substructure: mapObject(CHAOS_TYPES, getChaosTypeStructure)
};

// MISC TRAITS:
TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.MISC] = {
    filter: FILTER.LIST([
        'UnusedWeaponBonusTraitAddGems',
        'DiscountTrait',
        'GodModeTrait',
        'UnusedWeaponBonusTrait'
    ])
};

// GOD TRAITS:

// SLOTS:
const keywordBySlotType = {
    [SLOT_TYPES.ATTACK]: 'Melee',
    [SLOT_TYPES.SPECIAL]: 'Secondary',
    [SLOT_TYPES.CAST]: 'Ranged',
    [SLOT_TYPES.CAST_LOADED]: 'ShieldLoadAmmo_',
    [SLOT_TYPES.DASH]: 'Rush',
    [SLOT_TYPES.CALL]: 'Shout'
};

function getSlotTypeStructure(slotType) {
    return {
        filter: FILTER.SLOT(keywordBySlotType[slotType])
    };
}

function getSlotTypesSubstructure() {
    const structure = mapObject(SLOT_TYPES, getSlotTypeStructure);
    structure[SLOT_TYPES.CAST_LOADED] = {
        filter: FILTER.NAME(keywordBySlotType[SLOT_TYPES.CAST_LOADED])
    };
    structure[SLOT_TYPES.CAST] = {
        filter: FILTER.AND(
            structure[SLOT_TYPES.CAST].filter,
            FILTER.NOT(structure[SLOT_TYPES.CAST_LOADED].filter)
        )
    };
    return structure;
}

const slotTypesSubstructure = getSlotTypesSubstructure();

// TIERS:

const keywordByTierType = {
    [TIER_TYPES.SLOT]: null,
    [TIER_TYPES.TIER_1]: 'ShopTier1Trait',
    [TIER_TYPES.TIER_2]: 'ShopTier2Trait',
    [TIER_TYPES.LEGENDARY]: 'ShopTier3Trait',
    [TIER_TYPES.DUO]: 'SynergyTrait'
};

function getTierTypeStructure(tierType) {
    return {
        filter: FILTER.INHERITANCE(keywordByTierType[tierType])
    };
}

function getTierTypesSubstructure() {
    const structure = mapObject(TIER_TYPES, getTierTypeStructure);
    structure[TIER_TYPES.SLOT] = {
        substructure: slotTypesSubstructure
    };
    structure[TIER_TYPES.TIER_1] = {
        filter: FILTER.AND(
            FILTER.INHERITANCE(keywordByTierType[TIER_TYPES.TIER_1]),
            FILTER.NOT(FILTER.SLOT('')) // NOTE: hacky, just checks if there's a slot field at all
        )
    };
    return structure;
}

const tierTypesSubstructure = getTierTypesSubstructure();

// GODS:

const keywordByGodType = {
    [GOD_TYPES.ATHENA]: 'Athena',
    [GOD_TYPES.APHRODITE]: 'Aphrodite',
    [GOD_TYPES.ARTEMIS]: 'Artemis',
    [GOD_TYPES.DEMETER]: 'Demeter',
    [GOD_TYPES.ARES]: 'Ares',
    [GOD_TYPES.ZEUS]: 'Zeus',
    [GOD_TYPES.POSEIDON]: 'Poseidon',
    [GOD_TYPES.DIONYSUS]: 'Dionysus',
    [GOD_TYPES.HERMES]: 'Hermes',
    [GOD_TYPES.HADES]: 'Hades'
};

function getGodTypeStructure(godType) {
    const keyword = keywordByGodType[godType];
    return {
        filter: FILTER.AND(
            FILTER.OR(FILTER.ICON(keyword), FILTER.NAME(keyword)),
            FILTER.NOT(TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.KEEPSAKE].filter)
        ),
        substructure: tierTypesSubstructure
    };
}

function getGodTypesSubstructure() {
    const structure = mapObject(GOD_TYPES, getGodTypeStructure);
    structure[GOD_TYPES.HERMES].substructure[TIER_TYPES.TIER_1].filter =
        FILTER.OR(
            structure[GOD_TYPES.HERMES].substructure[TIER_TYPES.TIER_1].filter,
            FILTER.LIST(['RapidCastTrait', 'HermesShoutDodge'])
        );
    return structure;
}

const godTypesSubstructure = getGodTypesSubstructure();

TRAIT_TYPE_SUBSTRUCTURE[TRAIT_TYPES.GOD] = {
    substructure: godTypesSubstructure
};

// -> [ [ type ] ]
// Almost all are array of one array, only duos are arrays of 2 arrays.
// Filters and substructures. Results are only for the bottom level, at
// filtered from those off intermediate levels.
function _getTraitTypeStructureMatches(
    traitName,
    traitData,
    traitTypeStructure = TRAIT_TYPE_STRUCTURE,
    type = null
) {
    const { filter } = traitTypeStructure;
    if (isFunction(filter) && !filter(traitName, traitData)) {
        return [];
    }

    const { substructure } = traitTypeStructure;
    if (!substructure) {
        return [[type]];
    }

    let matches = [];
    for (const subType in substructure) {
        const subTypeStructureSchema = substructure[subType];
        const subMatches = _getTraitTypeStructureMatches(
            traitName,
            traitData,
            subTypeStructureSchema,
            subType
        );
        matches.push(...subMatches);
    }

    if (type) {
        matches = matches.map(match => [type, ...match]);
    }

    return matches;
}

function getTraitTypeStructureMatches(traitName, traitData) {
    return _getTraitTypeStructureMatches(
        traitName,
        traitData,
        TRAIT_TYPE_STRUCTURE,
        null
    );
}

export { getTraitTypeStructureMatches };
