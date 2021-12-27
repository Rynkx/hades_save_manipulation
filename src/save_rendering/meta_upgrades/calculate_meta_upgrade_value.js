import { isFunction } from '../../utils';
import { percentDelta, unPercentDelta } from '../hades_utils';

function defaultMetaUpgradeValueCalculation(metaUpgradeData, metaUpgradeLevel) {
    const { percent } = metaUpgradeData;

    let base = metaUpgradeData.base;
    let delta = metaUpgradeData.delta;

    if (percent) {
        base = percentDelta(base);
        delta = percentDelta(delta);
    }

    let value = base + (metaUpgradeLevel - 1) * delta;

    if (percent) {
        value = unPercentDelta(value);
    }

    return value;
}

// TODO: Add support for the meta upgrade property dependent on god count.
const specialMetaUpgradeValueCalculation = {};

function calculateMetaUpgradeValue(
    metaUpgradeName,
    metaUpgradeData,
    metaUpgradeLevel,
    extraData
) {
    const specialCalculation =
        specialMetaUpgradeValueCalculation[metaUpgradeName];

    const calculation = isFunction(specialCalculation)
        ? specialCalculation
        : defaultMetaUpgradeValueCalculation;

    return calculation(metaUpgradeData, metaUpgradeLevel, extraData);
}

export { calculateMetaUpgradeValue };
