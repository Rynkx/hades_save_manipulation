import { isFunction } from '../../utils';

function getMatchBoundaries(match) {
    return [match.index, match.index + match[0].length];
}

// -> [ { type, data, start, end } ]
// NOTE: Sorted by start, no nested matches.
function extractInterpolationData(
    string,
    interpolationDataExtractionByType,
    extraData
) {
    const interpolationData = [];

    for (const type in interpolationDataExtractionByType) {
        const { matchRegex, extract } = interpolationDataExtractionByType[type];

        const matches = string.matchAll(matchRegex);
        for (const match of matches) {
            const data = isFunction(extract)
                ? extract(match, extraData)
                : extract;
            const [start, end] = getMatchBoundaries(match);

            interpolationData.push({
                type,
                data,
                start,
                end
            });
        }
    }

    interpolationData.sort((a, b) => a.start - b.start);

    return interpolationData;
}

export { extractInterpolationData };
