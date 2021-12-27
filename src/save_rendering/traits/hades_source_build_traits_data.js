import { hadesSourceFilterTraitMap } from './hades_source_filter_trait_map';
import { getTraitListsByTypeStructure } from './get_trait_lists_by_type_structure';
import { hadesSourceGetTraitsIconLocation } from './hades_source_get_traits_icon_location';
import { getPreferredTraitNameForDescription } from './get_preferred_trait_name_for_description';
import {
    baseInterpolationDataExtractionByType,
    buildTableInterpolationTemplate
} from '../help_text';
import { safeMergeObjects } from '../../utils';
import { traitInterpolationDataExtractionByType } from './trait_interpolation_data_extraction_by_type';
import { getTraitTypeStructureMatches } from './get_trait_type_structure_matches';
import { getTraitPropertiesData } from './get_trait_properties_data';
import { filterTraitPropertiesMapUsedInDescription } from './filter_trait_properties_map_used_in_description';

function getTraitData(traitName, traitData, helpText) {
    const preferredTraitNameForDescription =
        getPreferredTraitNameForDescription(traitName, helpText);
    const { DisplayName: label, Description: hadesSourceDescription } =
        helpText[preferredTraitNameForDescription];

    const traitPropertiesData = getTraitPropertiesData(traitData);

    const propertiesMap = filterTraitPropertiesMapUsedInDescription(
        traitPropertiesData,
        hadesSourceDescription
    );

    const description = buildTableInterpolationTemplate(
        hadesSourceDescription,
        safeMergeObjects(
            baseInterpolationDataExtractionByType,
            traitInterpolationDataExtractionByType
        ),
        { helpText, traitPropertiesData }
    );

    const typeMatches = getTraitTypeStructureMatches(traitName, traitData);
    return {
        label,
        description,
        typeMatches,
        propertiesMap
    };
}

async function hadesSourceBuildTraitsData(
    hadesSourceTraitData,
    helpText,
    hadesSourceGuiPackagePath
) {
    const traitMap = hadesSourceFilterTraitMap(hadesSourceTraitData, helpText);

    const listsByTypeStructure = getTraitListsByTypeStructure(traitMap);

    const traitsIconLocation = await hadesSourceGetTraitsIconLocation(
        traitMap,
        hadesSourceGuiPackagePath
    );

    const map = {};

    for (const traitName in traitMap) {
        const traitData = traitMap[traitName];

        map[traitName] = getTraitData(traitName, traitData, helpText);
        map[traitName].iconLocation = traitsIconLocation[traitName];
    }

    return { listsByTypeStructure, map };
}

export { hadesSourceBuildTraitsData };
