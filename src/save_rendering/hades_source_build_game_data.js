import { readJSON, writeFile } from '../node_dependecies';
import { isString } from '../utils';
import { hadesSourceBuildClearMessagesData } from './clear_messages';
import { createImageAssets } from './create_image_assets';
import { buildFishData } from './fishing';
import { hadesSourceBuildHelpText } from './help_text';
import { hadesSourceBuildMetaUpgradesData } from './meta_upgrades';
import { hadesSourceBuildRoomsData } from './rooms';
import { hadesSourceBuildTraitsData } from './traits';

async function hadesSourceBuildGameData(
    {
        hadesSourceHelpTextPath,
        hadesSourceMetaUpgradesDataPath,
        hadesSourceTraitsDataPath,
        hadesSourceRoomsDataDirectory,
        hadesSourceClearMessagesDataPath,
        hadesSourceGuiPackagePath
    },
    assetsDestinationPath
) {
    const helpText = hadesSourceBuildHelpText(
        await readJSON(hadesSourceHelpTextPath)
    );

    const metaUpgradesData = hadesSourceBuildMetaUpgradesData(
        await readJSON(hadesSourceMetaUpgradesDataPath),
        helpText
    );

    const traitsData = await hadesSourceBuildTraitsData(
        await readJSON(hadesSourceTraitsDataPath),
        helpText,
        hadesSourceGuiPackagePath
    );

    const roomsData = await hadesSourceBuildRoomsData(
        hadesSourceRoomsDataDirectory
    );

    const clearMessagesData = hadesSourceBuildClearMessagesData(
        await readJSON(hadesSourceClearMessagesDataPath),
        helpText
    );

    const fishData = buildFishData();

    const gameData = {
        metaUpgradesData,
        traitsData,
        roomsData,
        clearMessagesData,
        fishData
    };

    if (isString(assetsDestinationPath)) {
        await createImageAssets(
            gameData,
            hadesSourceGuiPackagePath,
            assetsDestinationPath
        );
        for (const key in metaUpgradesData.map) {
            delete metaUpgradesData.map[key].iconLocation;
        }
        for (const key in traitsData.map) {
            delete traitsData.map[key].iconLocation;
        }
        await writeFile(
            `${assetsDestinationPath}/gameData.json`,
            JSON.stringify(gameData)
        );
    }

    return gameData;
}

export { hadesSourceBuildGameData };
