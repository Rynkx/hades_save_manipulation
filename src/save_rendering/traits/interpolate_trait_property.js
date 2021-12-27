import { isFunction, safeGetNestedProperty } from '../../utils';
import { percentDelta } from '../hades_utils';

// TODO: Unsupported trait properties formats.
/*
const unsupportedExtractedValueFormats = {
    SeekDuration: true,
    PercentOfBase: true,
    AmmoDelayDivisor: true,
    ExistingAmmoDropDelay: true,
    TotalMetaUpgradeChangeValue: true,
    HealingDrop: true,
    AmmoReloadDivisor: true,
    ExistingAmmoReloadDelay: true,
    PercentHeal: true,
    ExistingWrathStocks: true,
    WrathStocks: true,
    EXWrathDuration: true,
    ExWrathDuration: true,
    MultiplyByBase: true,
    EasyModeMultiplier: true
};
*/

function formatTraitPropertyNumber(
    number,
    propertyData,
    propertyInterpolationData
) {
    let { percent, sign } = propertyInterpolationData;
    const { Format, decimalPlaces } = propertyData;

    switch (Format) {
        case 'Percent':
            percent = true;
            number = number * 100;
            break;

        case 'PercentDelta':
            percent = true;
            number = percentDelta(number);
            sign = number > 1 ? '+' : sign;
            break;

        case 'NegativePercentDelta':
            percent = true;
            number = -1 * percentDelta(number);
            break;
    }

    return `${sign ?? ''}${number.toFixed(decimalPlaces)}${percent ? '%' : ''}`;
}

const inlinedTraitPropertyTemplates = {
    'BlockedEnemyTypes[1]': 'Flame Wheel foes'
};

// TODO: Trait upgrades, reference get_trait_properties_data.
function defaultTraitPropertyValueCalculation(
    traitData,
    traitUpgradeLevels,
    propertyInterpolationData
) {
    const { propertyName } = propertyInterpolationData;
    const [low, high] = traitData.propertiesMap[propertyName].baseNumbersRange;
    return low + 0.5 * (high - low);
}

const specialTraitPropertyValueCalculation = {};

function traitPropertyValueCalculation(
    traitName,
    traitData,
    traitUpgradeLevels,
    propertyInterpolationData,
    extraData
) {
    const { propertyName } = propertyInterpolationData;
    const specialCalculation = safeGetNestedProperty(
        specialTraitPropertyValueCalculation,
        [traitName, propertyName]
    );
    const calculation = isFunction(specialCalculation)
        ? specialCalculation
        : defaultTraitPropertyValueCalculation;

    return calculation(
        traitData,
        traitUpgradeLevels,
        propertyInterpolationData,
        extraData
    );
}

function interpolateTraitProperty(
    traitName,
    traitData,
    traitUpgradeLevels,
    propertyInterpolationData,
    extraData
) {
    const { propertyName } = propertyInterpolationData;

    const inlinedTraitPropertyTemplate =
        inlinedTraitPropertyTemplates[propertyName];
    if (inlinedTraitPropertyTemplate) return inlinedTraitPropertyTemplate;

    const calculatedValue = traitPropertyValueCalculation(
        traitName,
        traitData,
        traitUpgradeLevels,
        propertyInterpolationData,
        extraData
    );

    const propertyData = traitData.propertiesMap[propertyName];
    const formattedValue = formatTraitPropertyNumber(
        calculatedValue,
        propertyData,
        propertyInterpolationData
    );

    return formattedValue;
}

export { interpolateTraitProperty };
