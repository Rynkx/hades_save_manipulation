import { ALL_TRAIT_TYPES } from './trait_types';
import { mapObject, safeGetNestedProperty } from '../../utils';

const { RUN_STRUCTURED_TRAIT_TYPES, SLOT_TYPES, WEAPON_TYPES } =
    ALL_TRAIT_TYPES;

const mirrorTraits = {
    RoomRewardMaxHealthTrait: true,
    RoomRewardEmptyMaxHealthTrait: true
};

const ignoredTraits = { ...mirrorTraits };

const weaponTypesByWeaponsCacheName = {
    BowWeapon: WEAPON_TYPES.BOW,
    FistWeapon: WEAPON_TYPES.FIST,
    ShieldWeapon: WEAPON_TYPES.SHIELD,
    SpearWeapon: WEAPON_TYPES.SPEAR,
    GunWeapon: WEAPON_TYPES.GUN,
    SwordWeapon: WEAPON_TYPES.SWORD
};

function getWeaponTypeFromWeaponsCache(WeaponsCache) {
    for (const weaponName in WeaponsCache) {
        const weaponType = weaponTypesByWeaponsCacheName[weaponName];
        if (weaponType) {
            return weaponType;
        }
    }
}

const singleOptionTraitTypes = {
    [RUN_STRUCTURED_TRAIT_TYPES.SLOT]: mapObject(SLOT_TYPES, () => true),
    [RUN_STRUCTURED_TRAIT_TYPES.COMPANION]: true,
    [RUN_STRUCTURED_TRAIT_TYPES.ASPECT]: true
};

function addTraitToRunStructuredTraits(traitData, typeMatch, structuredTraits) {
    let current = structuredTraits;

    const traitSuperTypes = typeMatch.slice(0, -1);
    for (const traitType of traitSuperTypes) {
        current[traitType] ??= {};
        current = current[traitType];
    }

    const traitSpecificType = typeMatch.at(-1);
    const singleOption = safeGetNestedProperty(
        singleOptionTraitTypes,
        typeMatch
    );

    if (singleOption) {
        current[traitSpecificType] = traitData;
    } else {
        current[traitSpecificType] ??= [];
        current = current[traitSpecificType];
        current.push(traitData);
    }
}

function getRunStructuredTraitTypeMatch(typeMatch) {
    switch (true) {
        case typeMatch[2] === RUN_STRUCTURED_TRAIT_TYPES.DUO:
            return [RUN_STRUCTURED_TRAIT_TYPES.DUO];

        case typeMatch[2] === RUN_STRUCTURED_TRAIT_TYPES.SLOT:
            return [RUN_STRUCTURED_TRAIT_TYPES.SLOT, typeMatch[3]];

        case typeMatch[0] === RUN_STRUCTURED_TRAIT_TYPES.ASPECT:
            return [RUN_STRUCTURED_TRAIT_TYPES.ASPECT];

        case typeMatch[0] === RUN_STRUCTURED_TRAIT_TYPES.HAMMER:
            return [RUN_STRUCTURED_TRAIT_TYPES.HAMMER];

        default:
            return typeMatch;
    }
}

function getRunStructuredTraits(traitMap, runData) {
    const structuredTraits = {};

    const { WeaponsCache } = runData;
    const weaponType = getWeaponTypeFromWeaponsCache(WeaponsCache);
    structuredTraits[RUN_STRUCTURED_TRAIT_TYPES.WEAPON] = {
        name: weaponType,
        pom: 1
    };

    const { EndingKeepsakeName } = runData;
    structuredTraits[RUN_STRUCTURED_TRAIT_TYPES.FINAL_KEEPSAKE] = {
        name: EndingKeepsakeName,
        pom: 1
    };

    const { TraitCache } = runData;
    for (const traitName in TraitCache) {
        if (traitName in ignoredTraits) {
            continue;
        }

        const typeMatch = getRunStructuredTraitTypeMatch(
            traitMap[traitName].typeMatches[0]
        );
        const traitData = { name: traitName, pom: TraitCache[traitName] };
        addTraitToRunStructuredTraits(traitData, typeMatch, structuredTraits);
    }

    return structuredTraits;
}

export { getRunStructuredTraits };
