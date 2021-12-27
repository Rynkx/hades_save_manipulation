import { ALL_META_UPGRADE_TYPES } from './meta_upgrade_types';

const { INTERPOLATION_PROPERTY_TYPES, INTERPOLATION_TYPES } =
    ALL_META_UPGRADE_TYPES;

function getPropertyTypeFromTempTextName(tempTextName) {
    switch (tempTextName) {
        case 'BaseValue':
            return INTERPOLATION_PROPERTY_TYPES.DELTA;
        case 'StartingValue':
            return INTERPOLATION_PROPERTY_TYPES.BASE;
        case 'DisplayValue':
            return INTERPOLATION_PROPERTY_TYPES.DISPLAY;
        default:
            return null;
    }
}

function extractMetaUpgradePropertyInterpolationData(match) {
    const sign = match[1];

    const percentSign = !!match.at(-1);
    const percentFlag = !!match.at(-2);
    const percent = percentSign || percentFlag;

    const tempTextName = match.at(-3).substring(1);
    const propertyType = getPropertyTypeFromTempTextName(tempTextName);

    if (!propertyType) {
        throw new Error(
            `Found unsupported meta upgrade property in help text: ${tempTextName}`
        );
    }

    return { propertyType, percent, sign };
}

const metaUpgradeInterpolationDataExtractionByType = {
    [INTERPOLATION_TYPES.META_UPGRADE_PROPERTY]: {
        matchRegex: /(\+|-)?\{\$TempTextData(\.[\w[\]]+)+(:P|:p)?\}(%)?/g,
        extract: extractMetaUpgradePropertyInterpolationData
    }
};

export { metaUpgradeInterpolationDataExtractionByType };
