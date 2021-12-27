// NOTE: those have no descriptions, specially inlined in traitmap
const inlinedPreferredTraitNamesForDescription = {
    PoseidonPickedUpMinorLootTrait: 'RandomMinorLootDrop',
    HarvestBoonTrait: 'HarvestBoonDrop'
};

function getPreferredTraitNameForDescription(traitName, helpText) {
    const inlinedPreferred =
        inlinedPreferredTraitNamesForDescription[traitName];
    if (inlinedPreferred) return inlinedPreferred;

    const tray = `${traitName}_Tray`;
    if (tray in helpText) return tray;

    const initial = `${traitName}_Initial`;
    if (initial in helpText) return initial;

    return traitName;
}

export { getPreferredTraitNameForDescription };
