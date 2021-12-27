import { copyFile, makeDirectory } from '../node_dependecies';

function resolveExtension(path) {
    if (path.endsWith('.png')) return path;
    return `${path}.png`;
}

async function createImageAssets(gameData, guiPackagePath, destination) {
    const iconDir = `${destination}/icons`;
    const metaUpgradeIconDir = `${iconDir}/metaUpgrades`;
    const traitIconDir = `${iconDir}/traits`;
    await Promise.all([
        makeDirectory(metaUpgradeIconDir),
        makeDirectory(traitIconDir)
    ]);

    const copyMetaUpgradeIcons = Object.entries(
        gameData.metaUpgradesData.map
    ).map(([name, { iconLocation }]) => {
        copyFile(
            resolveExtension(`${guiPackagePath}/${iconLocation}`),
            resolveExtension(`${metaUpgradeIconDir}/${name}`)
        );
    });

    const copyTraitIcons = Object.entries(gameData.traitsData.map).map(
        ([name, { iconLocation }]) => {
            copyFile(
                resolveExtension(`${guiPackagePath}/${iconLocation}`),
                resolveExtension(`${traitIconDir}/${name}`)
            );
        }
    );

    await Promise.all([...copyMetaUpgradeIcons, ...copyTraitIcons]);
}

export { createImageAssets };
