import { readDirectory } from '../../node_dependecies';
import { getTraitTypeStructureMatches } from './get_trait_type_structure_matches';
import { ALL_TRAIT_TYPES } from './trait_types';

const { TRAIT_TYPES } = ALL_TRAIT_TYPES;

const ICON_DATA_BY_TRAIT_TYPE = {
    [TRAIT_TYPES.ASPECT]: {
        location: 'textures/GUI/Screens/WeaponEnchantmentIcons',
        prefix: 'WeaponEnchantment_'
    },
    [TRAIT_TYPES.HAMMER]: {
        location: 'textures/GUI/Screens/WeaponIcons',
        prefix: 'Weapon_',
        inlined: {
            GunShotgunTrait: 'gun_shotgun_trait_02.png',
            GunHeavyBulletTrait: 'gun_dash_ammo_trait_04.png',
            GunGrenadeClusterTrait: 'gun_grenade_cluster_trait_05.png',
            GunMinigunTrait: 'gun_minigun_trait_01.png',
            SpearSpinChargeAreaDamageTrait:
                'spear_throw_elective_charge_11.png',
            FistDetonateBoostTrait: 'fist_gilgamesh_02.png',
            FistDashAttackHealthBufferTrait: 'fist_armor_break_01.png'
        }
    },
    [TRAIT_TYPES.KEEPSAKE]: {
        location: 'textures/GUI/Screens/AwardMenu',
        prefix: 'Keepsake_',
        inlined: {
            ReincarnationTrait: 'lucky_tooth_02.png',
            LowHealthDamageTrait: 'skull_earing_11.png',
            FastClearDodgeBonusTrait: 'feather.png',
            ChamberStackTrait: 'bloom_22.png',
            ChaosBoonTrait: 'cosmic_egg_18.png'
        }
    },
    [TRAIT_TYPES.COMPANION]: {
        location: 'textures/GUI/Screens/AwardMenu/Legendary',
        prefix: 'Keepsake_',
        postfix: '_Plush',
        inlined: {
            SisyphusAssistTrait: 'Sisyphus_01.png' // inlined because icon spelled 'sisiyphus' in TraitData
        }
    },
    [TRAIT_TYPES.SHOP_ITEM]: {
        location: 'textures/GUI/Screens/ShopIcons',
        prefix: 'Shop_',
        inlined: {
            TemporaryForcedSecretDoorTrait: 'light_of_ixion_08.png',
            TemporaryLastStandHealTrait: 'kiss_of_styx_13.png',
            TemporaryImprovedWeaponTrait: 'cyclops_jerky_01.png',
            TemporaryImprovedRangedTrait: 'braid_of_atlas_04.png',
            TemporaryImprovedSecondaryTrait: 'jerky_22.png',
            TemporaryMoveSpeedTrait: 'ignited_ichor_09.png',
            TemporaryDoorHealTrait: 'hydralite_05.png',
            TemporaryForcedChallengeSwitchTrait: 'trove_tracker_07.png',
            TemporaryPreloadSuperGenerationTrait: 'net_20.png'
        }
    },
    [TRAIT_TYPES.CHAOS]: {
        location: 'textures/GUI/Screens/Chaos',
        prefix: 'Boon_Chaos_',
        inlined: {
            ChaosBlessingBackstabTrait: 'backstab_15.png',
            ChaosBlessingAlphaStrikeTrait: 'alpha_strike_14.png'
        }
    },
    [TRAIT_TYPES.GOD]: {
        location: 'textures/GUI/Screens/BoonIcons',
        prefix: 'Boon_',
        inlined: {
            PoseidonPickedUpMinorLootTrait: 'Poseidon_06_Large.png', // NOTE: weird no description trait
            RegeneratingCappedSuperTrait: 'Zeus_Aphrodite_01.png',
            CurseSickTrait: 'Ares_Aphrodite_01.png',
            PoisonCritVulnerabilityTrait: 'Dionyuss_Artemis_01.png',
            StationaryRiftTrait: 'Ares_Demeter_01.png',
            AutoRetaliateTrait: 'Zeus_Ares_01.png',
            LightningCloudTrait: 'Zeus_Dionysus_01.png'
        }
    },
    [TRAIT_TYPES.COMPATIBILITY]: {
        location: 'textures/GUI/Screens/AwardMenu',
        prefix: 'Keepsake_' // ?
    },
    [TRAIT_TYPES.STORY_ROOM]: {
        location: 'textures/GUI/Screens/ShopIcons',
        prefix: 'Shop_', // ?
        inlined: {
            SuperTemporaryBoonRarityTrait: 'pom_porridge.png',
            BouldyBlessing_None:
                'textures/GUI/Screens/BoonIcons/bouldy_blessing.png',
            BouldyBlessing_Money:
                'textures/GUI/Screens/BoonIcons/bouldy_blessing.png',
            BouldyBlessing_Speed:
                'textures/GUI/Screens/BoonIcons/bouldy_blessing.png',
            BouldyBlessing_Special:
                'textures/GUI/Screens/BoonIcons/bouldy_blessing.png',
            BouldyBlessing_Attack:
                'textures/GUI/Screens/BoonIcons/bouldy_blessing.png',
            BouldyBlessing_Armor:
                'textures/GUI/Screens/BoonIcons/bouldy_blessing.png',
            BouldyBlessing_Ranged:
                'textures/GUI/Screens/BoonIcons/bouldy_blessing.png',
            TemporaryDoorHealTrait_Patroclus: 'hydralite_05.png',
            UpgradedTemporaryLastStandHealTrait: 'kiss_of_styx_13.png',
            TemporaryImprovedWeaponTrait_Patroclus: 'cyclops_jerky_01.png'
        }
    },
    [TRAIT_TYPES.MISC]: {
        location: 'textures/GUI/Screens/BoonIcons',
        prefix: 'Boon_', // ??
        inlined: {
            UnusedWeaponBonusTraitAddGems: 'Meta_Gathered_Darkerness_Large.png',
            GodModeTrait: 'godmode.png',
            UnusedWeaponBonusTrait: 'Meta_Gathered_Darkness_Large.png'
        }
    }
};

function doesTraitIconNameMatchDirectoryIconName(
    traitType,
    traitIconName,
    directoryIconName
) {
    const prefix = ICON_DATA_BY_TRAIT_TYPE?.[traitType]?.prefix;
    const postfix = ICON_DATA_BY_TRAIT_TYPE?.[traitType]?.postfix;

    const keyword = traitIconName
        .slice(
            prefix ? prefix.length : 0,
            postfix ? -1 * postfix.length : traitIconName.length - 1
        )
        .toLowerCase();

    return directoryIconName.toLowerCase().includes(keyword);
}

// TODO: Do away with this matching system and use regexes

const iconMatchOverridesByTraitType = {
    [TRAIT_TYPES.CHAOS]: function (_, traitIconName, directoryIconName) {
        const type = traitIconName
            .slice(ICON_DATA_BY_TRAIT_TYPE[TRAIT_TYPES.CHAOS].prefix.length, -3)
            .toLowerCase();
        const number = traitIconName.slice(-2);
        return (
            directoryIconName.includes(type) &&
            directoryIconName.includes(number)
        );
    },

    [TRAIT_TYPES.ASPECT]: function (_, traitIconName, directoryIconName) {
        const weapon = traitIconName
            .slice(
                ICON_DATA_BY_TRAIT_TYPE[TRAIT_TYPES.ASPECT].prefix.length,
                -2
            )
            .toLowerCase();

        const aspectNumber = String(Number(traitIconName.at(-1)) - 1);
        const aspectDetails = aspectNumber === '0' ? 'base' : aspectNumber;

        return (
            directoryIconName.includes(weapon) &&
            directoryIconName.includes(aspectDetails)
        );
    },

    [TRAIT_TYPES.HAMMER]: function (_, traitIconName, directoryIconName) {
        const weapon = traitIconName
            .slice(
                ICON_DATA_BY_TRAIT_TYPE[TRAIT_TYPES.HAMMER].prefix.length,
                -3
            )
            .toLowerCase();

        const hammerNumber = traitIconName.slice(-2);

        return (
            directoryIconName.includes(weapon) &&
            directoryIconName.includes(hammerNumber)
        );
    },

    [TRAIT_TYPES.GOD]: function (_, traitIconName, directoryIconName) {
        const god = traitIconName.slice(
            ICON_DATA_BY_TRAIT_TYPE[TRAIT_TYPES.GOD].prefix.length,
            -3
        );
        let number = traitIconName.slice(-2);
        if (number === '00') {
            number = 'secondary';
        }
        return (
            directoryIconName.startsWith(`${god}_${number}`) ||
            directoryIconName.startsWith(traitIconName)
        );
    }
};

async function getDirectoryIconsByTraitType(hadesSourceGuiPackagePath) {
    const directoryIconsByType = {};

    for (const traitType in TRAIT_TYPES) {
        const { location } = ICON_DATA_BY_TRAIT_TYPE[traitType];
        directoryIconsByType[traitType] = await readDirectory(
            `${hadesSourceGuiPackagePath}/${location}`
        );
    }

    return directoryIconsByType;
}

function resolveFullIconLocation(match, traitType) {
    if (match.includes('/')) return match;
    return `${ICON_DATA_BY_TRAIT_TYPE[traitType].location}/${match}`;
}

function getTraitIconLocation(traitName, traitData, directoryIconsByType) {
    const traitType = getTraitTypeStructureMatches(traitName, traitData)[0][0];

    let match;

    const inlinedIconLocation =
        ICON_DATA_BY_TRAIT_TYPE[traitType]?.inlined?.[traitName];

    if (inlinedIconLocation) {
        match = inlinedIconLocation;
    } else {
        const baseFilter =
            iconMatchOverridesByTraitType[traitType] ??
            doesTraitIconNameMatchDirectoryIconName;

        const filter = directoryIconName =>
            baseFilter(traitType, traitData.Icon, directoryIconName);

        const directoryIcons = directoryIconsByType[traitType];

        match = directoryIcons.filter(filter)[0];
    }

    return resolveFullIconLocation(match, traitType);
}

async function hadesSourceGetTraitsIconLocation(
    traitMap,
    hadesSourceGuiPackagePath
) {
    const traitsIconLocation = {};

    const directoryIconsByType = await getDirectoryIconsByTraitType(
        hadesSourceGuiPackagePath
    );

    for (const traitName in traitMap) {
        const traitData = traitMap[traitName];

        traitsIconLocation[traitName] = getTraitIconLocation(
            traitName,
            traitData,
            directoryIconsByType
        );
    }

    return traitsIconLocation;
}

export { hadesSourceGetTraitsIconLocation };
