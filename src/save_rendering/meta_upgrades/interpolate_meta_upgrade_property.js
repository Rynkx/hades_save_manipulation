import { calculateMetaUpgradeValue } from './calculate_meta_upgrade_value';
import { percentDelta } from '../hades_utils';
import { ALL_META_UPGRADE_TYPES } from './meta_upgrade_types';

const { INTERPOLATION_PROPERTY_TYPES } = ALL_META_UPGRADE_TYPES;

// TODO: Could use interpolationData rather than inline so many percents?
// but then, the calculation of the total has no idea, so no.
function formatMetaUpgradePropertyNumber(number, metaUpgradeData) {
    const { percent, decimalPlaces } = metaUpgradeData;
    if (percent) {
        return `${percentDelta(number).toFixed(decimalPlaces ?? 0)}%`;
    }

    return `${number}`;
}

function interpolateMetaUpgradeProperty(
    metaUpgradeName,
    metaUpgradeData,
    metaUpgradeLevel,
    propertyInterpolationData,
    extraData
) {
    const { propertyType } = propertyInterpolationData;
    let value;

    switch (propertyType) {
        case INTERPOLATION_PROPERTY_TYPES.BASE:
            value = metaUpgradeData.base;
            break;

        case INTERPOLATION_PROPERTY_TYPES.DELTA:
            value = metaUpgradeData.base;
            break;

        case INTERPOLATION_PROPERTY_TYPES.DISPLAY:
            // NOTE: this one just goes
            return metaUpgradeData.displayValue;

        case INTERPOLATION_PROPERTY_TYPES.TOTAL:
            value = calculateMetaUpgradeValue(
                metaUpgradeName,
                metaUpgradeData,
                metaUpgradeLevel,
                extraData
            );
            break;

        default:
            throw new Error(`Cannot interpolate meta upgrade property ${name}`);
    }

    return formatMetaUpgradePropertyNumber(
        value,
        metaUpgradeData,
        propertyInterpolationData
    );
}

export { interpolateMetaUpgradeProperty };
