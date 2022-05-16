import { ALL_TRAIT_TYPES } from './trait_types';

const WEAPON_TRAIT_DEFAULTS = {
    typeMatches: [[ALL_TRAIT_TYPES.TRAIT_TYPES.WEAPON]],
    propertiesMap: {}
};

const WEAPON_TRAITS = {
    Sword: {
        label: 'Stygius',
        description: [[['The Stygian Blade']]],
        defaultAspect: 'SwordBaseUpgradeTrait',
        ...WEAPON_TRAIT_DEFAULTS
    },
    Spear: {
        label: 'Varatha',
        description: [[['The Eternal Spear']]],
        defaultAspect: 'SpearBaseUpgradeTrait',
        ...WEAPON_TRAIT_DEFAULTS
    },
    Shield: {
        label: 'Aegis',
        description: [[['The Shield of Chaos']]],
        defaultAspect: 'ShieldBaseUpgradeTrait',
        ...WEAPON_TRAIT_DEFAULTS
    },
    Bow: {
        label: 'Coronacht',
        description: [[['The Heart-Seeking Bow']]],
        defaultAspect: 'BowBaseUpgradeTrait',
        ...WEAPON_TRAIT_DEFAULTS
    },
    Fist: {
        label: 'Malphon',
        description: [[['The Twin Fists of Malphon']]],
        defaultAspect: 'FistBaseUpgradeTrait',
        ...WEAPON_TRAIT_DEFAULTS
    },
    Gun: {
        label: 'Exagryph',
        description: [[['The Adamant Rail']]],
        defaultAspect: 'GunBaseUpgradeTrait',
        ...WEAPON_TRAIT_DEFAULTS
    }
};

const weaponTraitsByWeaponsCacheName = {
    BowWeapon: 'Bow',
    FistWeapon: 'Fist',
    ShieldWeapon: 'Shield',
    SpearWeapon: 'Spear',
    GunWeapon: 'Gun',
    SwordWeapon: 'Sword'
};

function getWeaponTraitFromWeaponsCache(WeaponsCache) {
    for (const weaponName in WeaponsCache) {
        const weaponTrait = weaponTraitsByWeaponsCacheName[weaponName];
        if (weaponTrait) {
            return weaponTrait;
        }
    }
    throw `Can't find a weapon in Cache!! (${WeaponsCache})`;
}

export { WEAPON_TRAITS, getWeaponTraitFromWeaponsCache };
