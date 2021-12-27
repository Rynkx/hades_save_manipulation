import { extractInterpolationData } from '../help_text';
import { traitInterpolationDataExtractionByType } from './trait_interpolation_data_extraction_by_type';

function filterTraitPropertiesMapUsedInDescription(
    traitPropertiesData,
    description
) {
    const filteredPropertiesMap = {};

    const interpolationData = extractInterpolationData(
        description,
        traitInterpolationDataExtractionByType,
        { traitPropertiesData }
    );

    const { propertiesMap } = traitPropertiesData;

    for (const interpolationEntry of interpolationData) {
        const { propertyName } = interpolationEntry.data;
        filteredPropertiesMap[propertyName] = propertiesMap[propertyName];
    }

    return filteredPropertiesMap;
}

export { filterTraitPropertiesMapUsedInDescription };
