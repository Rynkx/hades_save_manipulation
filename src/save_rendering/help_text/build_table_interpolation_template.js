import { isString } from '../../utils';
import { extractInterpolationData } from './extract_interpolation_data';

function concatenateAdjacentStringsInArray(array) {
    if (array.length < 2) {
        return array;
    }
    const result = [array[0]];
    for (let i = 1; i < array.length; ++i) {
        const current = array[i];
        const previous = result.at(-1);
        if (isString(previous) && isString(current)) {
            result[result.length - 1] = `${previous}${current}`;
        } else {
            result.push(current);
        }
    }
    return result;
}

// -> [ string | { type, data } ]
function buildInterpolationTemplate(
    string,
    interpolationDataExtractionByType,
    extraData
) {
    const interpolationTemplate = [];

    const interpolationData = extractInterpolationData(
        string,
        interpolationDataExtractionByType,
        extraData
    );

    let substringStart = 0;
    for (const { type, data, start, end } of interpolationData) {
        const substring = string.slice(substringStart, start);
        if (substring.length > 0) {
            interpolationTemplate.push(substring);
        }

        if (data !== null) {
            interpolationTemplate.push({ type, data });
        }

        substringStart = end;
    }

    const finalSubstring = string.slice(substringStart, string.length);
    if (finalSubstring.length > 0) {
        interpolationTemplate.push(finalSubstring);
    }

    return concatenateAdjacentStringsInArray(interpolationTemplate);
}

// -> [ [ string ] ]
function buildTableTemplate(string) {
    return string
        .replace(/ +/g, ' ') // normalize whitespace
        .split('\n') // by row
        .map(
            row =>
                row
                    .split('Column 380') // by column
                    .map(line => line.trim()) // trim side whitespace
        );
}

// -> [ [ [ string | { type, value } ] ] ]
function buildTableInterpolationTemplate(
    string,
    interpolationDataExtractionByType,
    extraData
) {
    const matrixTemplate = buildTableTemplate(string);
    const matrixInterpolationrTemplate = matrixTemplate.map(row =>
        row.map(column =>
            buildInterpolationTemplate(
                column,
                interpolationDataExtractionByType,
                extraData
            )
        )
    );
    return matrixInterpolationrTemplate;
}

export { buildTableInterpolationTemplate };
