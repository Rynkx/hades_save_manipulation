import {
    baseInterpolationDataExtractionByType,
    buildTableInterpolationTemplate,
    BASE_INTERPOLATION_TYPES
} from './help_text';

// TODO: Checks possible for requirements, descriptions.

const clearMessagesInterpolationDataExtractionByType = {
    [BASE_INTERPOLATION_TYPES.ICON]: {
        matchRegex:
            baseInterpolationDataExtractionByType[BASE_INTERPOLATION_TYPES.ICON]
                .matchRegex,
        extract: null
    }
};

function hadesSourceBuildClearMessagesData(
    hadesSourceClearMessagesData,
    helpText
) {
    const clearMessagesData = {};

    for (const clearMessageName in hadesSourceClearMessagesData) {
        const { DebugOnly, GameStateRequirements } =
            hadesSourceClearMessagesData[clearMessageName];

        if (DebugOnly) {
            continue;
        }

        const requirements = GameStateRequirements;

        const descriptionTemplate = helpText[clearMessageName].DisplayName;
        const description = buildTableInterpolationTemplate(
            descriptionTemplate,
            clearMessagesInterpolationDataExtractionByType
        )[0][0][0];

        clearMessagesData[clearMessageName] = {
            description,
            requirements
        };
    }

    return clearMessagesData;
}

export { hadesSourceBuildClearMessagesData };
