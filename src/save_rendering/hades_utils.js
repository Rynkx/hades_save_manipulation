import { isArray, isString } from '../utils';

function percentDelta(number) {
    return (number - 1) * 100;
}

function unPercentDelta(percentDelta) {
    return percentDelta / 100 + 1;
}

function buildHadesInheritanceChain(key, object) {
    const inheritanceChain = [key];

    const { InheritFrom } = object[key];

    if (isString(InheritFrom)) {
        inheritanceChain.push(
            ...buildHadesInheritanceChain(InheritFrom, object)
        );
    }

    if (isArray(InheritFrom)) {
        for (const inheritKey of InheritFrom) {
            inheritanceChain.push(
                ...buildHadesInheritanceChain(inheritKey, object)
            );
        }
    }
    return inheritanceChain.reverse();
}

function hadesSourceResolveInheritance(object) {
    const resolvedObject = {};

    for (const key in object) {
        const resolvedKeyValuePair = {};

        const inheritanceChain = buildHadesInheritanceChain(key, object);
        for (const superKey of inheritanceChain) {
            Object.assign(resolvedKeyValuePair, object[superKey]);
        }

        resolvedObject[key] = resolvedKeyValuePair;
    }

    return resolvedObject;
}

export { percentDelta, unPercentDelta, hadesSourceResolveInheritance };
