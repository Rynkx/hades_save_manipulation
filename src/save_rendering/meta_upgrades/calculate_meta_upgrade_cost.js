function calculateMetaUpgradeCost(metaUpgradeData, metaUpgradeLevel) {
    const { costs } = metaUpgradeData;
    return costs
        .slice(0, metaUpgradeLevel)
        .reduce((sum, current) => sum + current, 0);
}

export { calculateMetaUpgradeCost };
