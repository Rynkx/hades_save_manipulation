import { ALL_TRAIT_TYPES } from './trait_types';

const newTotalRegex = /.*NewTotal\[?([0-9])]?.*/;
const displayDeltaRegex = /.*DisplayDelta\[?([0-9])]?.*/;
const oldTotalRegex = /.*OldTotal\[?([0-9])]?.*/;
const calculatedPropertyRegexes = [
    newTotalRegex,
    displayDeltaRegex,
    oldTotalRegex
];

function extractPropertyDataFromTooltipName(tooltipName, traitPropertiesData) {
    let index = null;

    for (const regex of calculatedPropertyRegexes) {
        if (regex.test(tooltipName)) {
            index = tooltipName.match(regex)[1];
        }
    }

    if (index) {
        const { autoExtractableList } = traitPropertiesData;
        return {
            propertyName: autoExtractableList[Number(index) - 1],
            calculated: true
        };
    }

    return { propertyName: tooltipName, calculated: false };
}

// (fullMatch, sign, ...wordsStartDot, percentFlag, percentSign)
function analyzeTooltipTemplate(match, { traitPropertiesData }) {
    const sign = match[1];

    const percentSign = !!match.at(-1);
    const percentFlag = !!match.at(-2);
    const percent = percentSign || percentFlag;

    const { propertyName, calculated } = extractPropertyDataFromTooltipName(
        match.at(-3).substring(1),
        traitPropertiesData
    );

    return { propertyName, calculated, percent, sign };
}

const traitInterpolationDataExtractionByType = {
    [ALL_TRAIT_TYPES.INTERPOLATION_TYPES.TRAIT_PROPERTY]: {
        // (sign, wordsStartDot..., percentFlag, percentSign)
        matchRegex: /(\+|-)?\{\$TooltipData(\.[\w[\]]+)+(:P|:p)?\}(%)?/g,
        extract: analyzeTooltipTemplate
    }
};

export { traitInterpolationDataExtractionByType };
