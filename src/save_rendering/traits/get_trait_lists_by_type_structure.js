import { getTraitTypeStructureMatches } from './get_trait_type_structure_matches';

function addTraitMatchToTraitListsByTypeStructure(
    traitName,
    traitMatch,
    traitListsByTypeStructure
) {
    let current = traitListsByTypeStructure;

    const superTypes = traitMatch.slice(0, -1);
    for (const traitType of superTypes) {
        current[traitType] ??= {};
        current = current[traitType];
    }

    const specificType = traitMatch.at(-1);
    current[specificType] ??= [];
    current = current[specificType];

    current.push(traitName);
}

function getTraitListsByTypeStructure(traitMap) {
    const traitListsByTypeStructure = {};
    for (const traitName in traitMap) {
        const traitData = traitMap[traitName];

        const traitMatches = getTraitTypeStructureMatches(traitName, traitData);

        for (const traitMatch of traitMatches) {
            addTraitMatchToTraitListsByTypeStructure(
                traitName,
                traitMatch,
                traitListsByTypeStructure
            );
        }
    }
    return traitListsByTypeStructure;
}

export { getTraitListsByTypeStructure };
