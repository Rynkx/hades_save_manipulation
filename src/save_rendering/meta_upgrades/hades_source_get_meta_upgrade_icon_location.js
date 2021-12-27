import { ALL_META_UPGRADE_TYPES } from './meta_upgrade_types';

const { MIRROR_TYPES, TREE_TYPES } = ALL_META_UPGRADE_TYPES;

const META_UPGRADE_ICON_FOLDERS = {
    [TREE_TYPES.MIRROR]: {
        [MIRROR_TYPES.PURPLE]: 'textures/GUI/Screens/MirrorIcons',
        [MIRROR_TYPES.GREEN]: 'textures/GUI/Screens/MirrorBIcons'
    },
    [TREE_TYPES.HEAT]: 'textures/GUI/Screens/ShrineIcons'
};

const META_UPGRADE_ICON_NAMES = {
    [TREE_TYPES.MIRROR]: {
        [MIRROR_TYPES.PURPLE]: {
            BackstabMetaUpgrade: 'shadow presence.png',
            DoorHealMetaUpgrade: 'chthonic vitality.png',
            ExtraChanceMetaUpgrade: 'death defiance.png',
            StaminaMetaUpgrade: 'greater reflex.png',
            StoredAmmoVulnerabilityMetaUpgrade: 'boiling blood.png',
            AmmoMetaUpgrade: 'infernal soul.png',
            MoneyMetaUpgrade: 'deep pockets.png',
            HealthMetaUpgrade: 'thick skin.png',
            VulnerabilityEffectBonusMetaUpgrade: 'priveleged status.png', // priveleged...
            RareBoonDropMetaUpgrade: 'olympian favor.png',
            EpicBoonDropMetaUpgrade: "god's pride.png",
            RerollMetaUpgrade: 'fated authority.png'
        },

        [MIRROR_TYPES.GREEN]: {
            FirstStrikeMetaUpgrade: 'Fiery_Presence.png',
            DarknessHealMetaUpgrade: 'Dark_Regeneration.png',
            ExtraChanceReplenishMetaUpgrade: 'Stubborn_Defiance.png',
            PerfectDashMetaUpgrade: 'Greater_Celerity.png',
            StoredAmmoSlowMetaUpgrade: 'First_Blood.png',
            ReloadAmmoMetaUpgrade: 'Stygian_Soul.png',
            InterestMetaUpgrade: 'Golden_Touch.png',
            HighHealthDamageMetaUpgrade: 'High_Confidence.png',
            GodEnhancementMetaUpgrade: 'Family_Favorite.png',
            RunProgressRewardMetaUpgrade: 'Gods_Envy.png',
            DuoRarityBoonDropMetaUpgrade: 'Unifying_Bond.png',
            RerollPanelMetaUpgrade: 'Fated_Persuasion.png'
        }
    },
    [TREE_TYPES.HEAT]: {
        EnemyDamageShrineUpgrade: 'hard labor.png',
        HealingReductionShrineUpgrade: 'lasting consequences.png',
        ShopPricesShrineUpgrade: 'convenience fee.png',
        EnemyCountShrineUpgrade: 'jury duty.png',
        BossDifficultyShrineUpgrade: 'extreme measures.png',
        EnemyHealthShrineUpgrade: 'calisthenics program.png',
        EnemyEliteShrineUpgrade: 'benefits package.png',
        MinibossCountShrineUpgrade: 'middle management.png',
        ForceSellShrineUpgrade: 'underworld customs.png',
        EnemySpeedShrineUpgrade: 'forced overtime.png',
        TrapDamageShrineUpgrade: 'heightened security.png',
        MetaUpgradeStrikeThroughShrineUpgrade: 'budget cuts.png',
        EnemyShieldShrineUpgrade: 'damage control.png',
        ReducedLootChoicesShrineUpgrade: 'no choice.png', // ??
        BiomeSpeedShrineUpgrade: 'tight deadline.png',
        NoInvulnerabilityShrineUpgrade: 'personal liability.png' // ??
    }
};

function traverseByMetaUpgradeTypes(object, [treeType, mirrorType]) {
    return mirrorType ? object[treeType][mirrorType] : object[treeType];
}

function hadesSourceGetMetaUpgradeIconLocation(
    metaUpgradeTypes,
    metaUpgradeName
) {
    const prefix = traverseByMetaUpgradeTypes(
        META_UPGRADE_ICON_FOLDERS,
        metaUpgradeTypes
    );

    const iconName = traverseByMetaUpgradeTypes(
        META_UPGRADE_ICON_NAMES,
        metaUpgradeTypes
    )[metaUpgradeName];

    return `${prefix}/${iconName}`;
}

export { hadesSourceGetMetaUpgradeIconLocation };
