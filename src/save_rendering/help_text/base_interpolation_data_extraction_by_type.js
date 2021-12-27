import { BASE_INTERPOLATION_TYPES } from './base_interpolation_types';

const baseInterpolationDataExtractionByType = {
    [BASE_INTERPOLATION_TYPES.KEYWORD]: {
        // (word)
        matchRegex: /\{\$Keywords\.(\w*)\}/g,
        extract: ([, keywordName], { helpText }) =>
            helpText[keywordName].DisplayName
    },

    [BASE_INTERPOLATION_TYPES.FORMAT]: {
        // (word)
        matchRegex: /{#(\w*)}/g,
        extract: null
    },

    [BASE_INTERPOLATION_TYPES.ICON]: {
        // (word)
        matchRegex: /\{!Icons\.(\w*)\}/g,
        extract: ([, iconName]) => iconName
    }
};

export { baseInterpolationDataExtractionByType };
