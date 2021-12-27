import { ALL_META_UPGRADE_TYPES } from './meta_upgrade_types';
import { isNumber } from '../../utils';

const { TREE_TYPES, MIRROR_TYPES } = ALL_META_UPGRADE_TYPES;

// -> { types: [ "PURPLE" | "GREEN" | null ], levels: [ Number | null ] }
function getRunStructuredMirror(
    metaUpgradeListsByTypeStructure,
    metaUpgradeCache
) {
    const mirror = [];

    const {
        [MIRROR_TYPES.PURPLE]: purpleList,
        [MIRROR_TYPES.GREEN]: greenList
    } = metaUpgradeListsByTypeStructure[TREE_TYPES.MIRROR];

    const mirrorOptionsLength = Math.max(purpleList.length, greenList.length);

    for (let i = 0; i < mirrorOptionsLength; ++i) {
        let name, level;
        const purpleName = purpleList?.[i];
        const purpleLevel = metaUpgradeCache?.[purpleName];
        const greenName = greenList?.[i];
        const greenLevel = metaUpgradeCache?.[greenName];

        switch (true) {
            case isNumber(purpleLevel):
                name = purpleName;
                level = purpleLevel;
                break;

            case isNumber(greenLevel):
                name = greenName;
                level = greenLevel;
                break;

            default:
                name = null;
                level = null;
                break;
        }

        if (name) {
            mirror.push({ name, level });
        }
    }

    return mirror;
}

// -> [ Number | null ]
function getRunStructuredHeat(
    metaUpgradeListsByTypeStructure,
    metaUpgradeCache
) {
    const { [TREE_TYPES.HEAT]: heatList } = metaUpgradeListsByTypeStructure;
    const heat = [];
    for (const name of heatList) {
        const value = metaUpgradeCache[name];
        if (value) {
            heat.push({ name, value });
        }
    }
    return heat;
}

function getRunStructuredMetaUpgrades(metaUpgradesData, metaUpgradeCache) {
    const { listsByTypeStructure } = metaUpgradesData;
    return {
        [TREE_TYPES.MIRROR]: getRunStructuredMirror(
            listsByTypeStructure,
            metaUpgradeCache
        ),
        [TREE_TYPES.HEAT]: getRunStructuredHeat(
            listsByTypeStructure,
            metaUpgradeCache
        )
    };
}

export { getRunStructuredMetaUpgrades };
