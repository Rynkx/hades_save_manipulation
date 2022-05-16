import { ALL_TRAIT_TYPES } from './trait_types';
import { isString, mapObject, safeGetNestedProperty } from '../../utils';
import { getWeaponTraitFromWeaponsCache } from './weapon_traits';

const { RUN_STRUCTURED_TRAIT_TYPES, SLOT_TYPES } = ALL_TRAIT_TYPES;

const singleOptionTraitTypes = {
    [RUN_STRUCTURED_TRAIT_TYPES.SLOT]: mapObject(SLOT_TYPES, () => true),
    [RUN_STRUCTURED_TRAIT_TYPES.COMPANION]: true,
    [RUN_STRUCTURED_TRAIT_TYPES.ASPECT]: true,
    [RUN_STRUCTURED_TRAIT_TYPES.WEAPON]: true
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

// NOTE:
// weapon traits are artificially inserted
// final keepsake is extracted
// some traits are not in the map (probably old) and filtered
// those were found in haelian's save
/*
	{
		RoomRewardMaxHealthTrait: true,
		ShieldRushPunchTrait: true,
		RoomRewardEmptyMaxHealthTrait: true,
		ChaosBlessingGemTrait: true,
		ChaosBlessingTrapDamageTrait: true,
		MarkedDropGoldTrait: true,
		DionysusNullifyProjectileTrait: true,
		MultiLaserTrait: true,
		GunFinalBulletTrait: true
	}
*/
function getKnownTraits(traitMap, runData) {
    const knownTraits = {
        [RUN_STRUCTURED_TRAIT_TYPES.FINAL_KEEPSAKE]: null,
        traits: {}
    };

    const { EndingKeepsakeName } = runData;
    if (isString(EndingKeepsakeName) && !!traitMap[EndingKeepsakeName]) {
        knownTraits[RUN_STRUCTURED_TRAIT_TYPES.FINAL_KEEPSAKE] = {
            name: EndingKeepsakeName,
            pom: 1
        };
    }

    const { WeaponsCache } = runData;
    const weaponTrait = getWeaponTraitFromWeaponsCache(WeaponsCache);
    knownTraits.traits[weaponTrait] = 1;

    const { TraitCache } = runData;
    for (const traitName in TraitCache) {
        if (!traitMap[traitName]) {
            continue;
        }

        knownTraits.traits[traitName] = TraitCache[traitName];
    }

    let hasExplicitAspect = false;
    for (const traitName in knownTraits.traits) {
        if (
            traitMap[traitName].typeMatches[0][0] ===
            ALL_TRAIT_TYPES.TRAIT_TYPES.ASPECT
        ) {
            hasExplicitAspect = true;
        }
    }
    if (!hasExplicitAspect) {
        const { defaultAspect } = traitMap[weaponTrait];
        knownTraits.traits[defaultAspect] = 1;
    }

    return knownTraits;
}

function getRunStructuredTraitsFromKnown(traitMap, knownTraits) {
    const structuredTraits = {};

    const { [RUN_STRUCTURED_TRAIT_TYPES.FINAL_KEEPSAKE]: finalKeepsake } =
        knownTraits;
    structuredTraits[RUN_STRUCTURED_TRAIT_TYPES.FINAL_KEEPSAKE] = finalKeepsake;

    const { traits } = knownTraits;
    for (const traitName in traits) {
        const typeMatch = getRunStructuredTraitTypeMatch(
            traitMap[traitName].typeMatches[0]
        );
        const traitData = { name: traitName, pom: traits[traitName] };
        addTraitToRunStructuredTraits(traitData, typeMatch, structuredTraits);
    }

    if (!structuredTraits[ALL_TRAIT_TYPES.TRAIT_TYPES.WEAPON]) {
        throw `No weapon!`;
    }
    if (!structuredTraits[ALL_TRAIT_TYPES.TRAIT_TYPES.ASPECT]) {
        throw `No aspect!`;
    }
    return structuredTraits;
}

function getRunStructuredTraits(traitMap, runData) {
    return getRunStructuredTraitsFromKnown(
        traitMap,
        getKnownTraits(traitMap, runData)
    );
}

export {
    getKnownTraits,
    getRunStructuredTraitsFromKnown,
    getRunStructuredTraits
};
