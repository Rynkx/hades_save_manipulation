import { hadesSourceResolveInheritance } from '../hades_utils';

// Listed in Lua TraitData, under a comment.
const deprecatedTraits = [
    // 'GunHeavyBulletTrait', // It's in the list, but in the game.

    'BowDashFanTrait',
    'BowWideShotTrait',
    'BowCloseRangeDamageTrait',
    'BowRandomExplosionTrait',

    'FistChargeAttackTrait',

    'GunFinalBulletTrait',
    'GunDashAmmoTrait',

    'SwordConsecutiveFirstStrikeTrait',
    'SwordRandomExplosionTrait',
    'SwordSecondaryBlinkTrait',

    'SpearSpinAura',
    'SpearSpinChargeExplosions',
    'SpearThrowFarRangeDamage',

    'ShieldDamageReductionTrait',
    'ShieldDamageBarrierTrait',
    'ShieldSlowChargeDamage',
    'ShieldThrowJumpDamageTrait',
    'ShieldThrowSingleTargetTrait',
    'ShieldRushPunchTrait',
    'ShieldBashReflectTrait',

    'ChaosBlessingGemTrait',
    'ChaosBlessingGemTrait_Complete',
    'ChaosBlessingTrapDamageTrait',
    'ChaosBlessingTrapDamageTrait_Complete',
    'ChaosBlessingHealTrait',

    'HermesRushAreaSlow',
    'HermesPlannedRushTrait',

    'BonusAmmoDropTrait',
    'CollisionTouchTrait',
    'DeathDefianceFreezeTimeTrait',
    'DionysusNullifyProjectileTrait',
    'MarkedDropGoldTrait'
];

// Found by hand.
const unusedTraits = [
    'ChaosCurseDashAttackTrait',

    'SpearThrowObjectAOETrait',
    'BowTransitionTapFireTrait',
    'SwordThirdStrikeChargeTrait' // Matches zeus because of icon
];

const traitsToRemoveList = [...deprecatedTraits, ...unusedTraits];

const usedNoDescriptionTraits = {
    PoseidonPickedUpMinorLootTrait: true
};

// hadesSourceTraitData: { TraitData: {}, ... }
function hadesSourceFilterTraitMap(hadesSourceTraitData, helpText) {
    const traitMap = hadesSourceResolveInheritance(
        hadesSourceTraitData.TraitData
    );

    for (const traitName in traitMap) {
        if (
            !(traitName in helpText) &&
            !(traitName in usedNoDescriptionTraits)
        ) {
            delete traitMap[traitName];
        }
    }

    for (const traitName of traitsToRemoveList) {
        delete traitMap[traitName];
    }

    return traitMap;
}

export { hadesSourceFilterTraitMap };
