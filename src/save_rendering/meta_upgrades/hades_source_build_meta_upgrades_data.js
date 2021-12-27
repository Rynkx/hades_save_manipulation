import { ALL_META_UPGRADE_TYPES } from './meta_upgrade_types';
import { safeMergeObjects } from '../../utils';
import {
    baseInterpolationDataExtractionByType,
    buildTableInterpolationTemplate
} from '../help_text';
import { hadesSourceGetMetaUpgradeIconLocation } from './hades_source_get_meta_upgrade_icon_location';
import { metaUpgradeInterpolationDataExtractionByType } from './meta_upgrade_interpolation_data_extraction_by_type';

const { TREE_TYPES, MIRROR_TYPES } = ALL_META_UPGRADE_TYPES;

function getMetaUpgradeCosts(hadesSourceMetaUpgradeData) {
    const { Cost, CostTable, MaxInvestment } = hadesSourceMetaUpgradeData;
    if (Cost && CostTable) {
        return [Cost, ...CostTable];
    }

    if (Cost && MaxInvestment) {
        const costs = new Array(MaxInvestment);
        costs.fill(Cost);
        return costs;
    }

    return [...CostTable];
}

function hadesSourceBuildMetaUpgradeBaseData(hadesSourceMetaUpgradeData) {
    const {
        BaseValue,
        ChangeValue,
        DisplayValue,

        FormatAsPercent,
        DecimalPlaces
    } = hadesSourceMetaUpgradeData;

    const costs = getMetaUpgradeCosts(hadesSourceMetaUpgradeData);

    return {
        base: BaseValue ?? ChangeValue,
        delta: ChangeValue,
        displayValue: DisplayValue,

        costs,

        showTotal: costs.length > 1,
        percent: FormatAsPercent,
        decimalPlaces: DecimalPlaces
    };
}

const inlinePercentFormatting = {
    percent: true
};

const inlinedMetaUpgradeBaseData = {
    BiomeSpeedShrineUpgrade: {
        delta: -2
    },
    AmmoMetaUpgrade: {
        base: 1,
        delta: 1
    },
    EnemySpeedShrineUpgrade: inlinePercentFormatting,
    EnemyHealthShrineUpgrade: inlinePercentFormatting,
    EnemyCountShrineUpgrade: inlinePercentFormatting,
    ShopPricesShrineUpgrade: inlinePercentFormatting,
    HealingReductionShrineUpgrade: inlinePercentFormatting,
    EnemyDamageShrineUpgrade: inlinePercentFormatting,
    DuoRarityBoonDropMetaUpgrade: inlinePercentFormatting,
    RunProgressRewardMetaUpgrade: inlinePercentFormatting,
    GodEnhancementMetaUpgrade: inlinePercentFormatting,
    InterestMetaUpgrade: inlinePercentFormatting,
    PerfectDashMetaUpgrade: inlinePercentFormatting,
    EpicBoonDropMetaUpgrade: inlinePercentFormatting,
    RareBoonDropMetaUpgrade: inlinePercentFormatting
};

// NOTE: All meta upgrades have a DisplayName like {$Keywords.keyword}
// where the actual texts are on the keyword entry.
function buildMetaUpgradeTexts(helpText, metaUpgradeName) {
    const metaUpgradeDescription = helpText[metaUpgradeName].DisplayName;
    const keyword = metaUpgradeDescription.slice(11, -1);
    const { DisplayName: label, Description: hadesSourceDescription } =
        helpText[keyword];

    const interpolationDataExtractionByType = safeMergeObjects(
        baseInterpolationDataExtractionByType,
        metaUpgradeInterpolationDataExtractionByType
    );
    const description = buildTableInterpolationTemplate(
        hadesSourceDescription,
        interpolationDataExtractionByType,
        { helpText }
    );

    return {
        label,
        description
    };
}

function hadesSourceBuildMetaUpgradesTypeData(hadesSourceMetaUpgradesData) {
    const { MetaUpgradeOrder, ShrineUpgradeOrder } =
        hadesSourceMetaUpgradesData;

    const purpleList = MetaUpgradeOrder.map(([purple]) => purple);
    const greenList = MetaUpgradeOrder.map(([, green]) => green);
    const heatList = ShrineUpgradeOrder;

    const listsByTypeStructure = {
        [TREE_TYPES.MIRROR]: {
            [MIRROR_TYPES.PURPLE]: purpleList,
            [MIRROR_TYPES.GREEN]: greenList
        },
        [TREE_TYPES.HEAT]: ShrineUpgradeOrder
    };

    const typeMap = {};
    purpleList.forEach(name => {
        typeMap[name] = [TREE_TYPES.MIRROR, MIRROR_TYPES.PURPLE];
    });
    greenList.forEach(name => {
        typeMap[name] = [TREE_TYPES.MIRROR, MIRROR_TYPES.GREEN];
    });
    heatList.forEach(name => {
        typeMap[name] = [TREE_TYPES.HEAT];
    });

    return { listsByTypeStructure, typeMap };
}

function hadesSourceBuildMetaUpgradeData(
    name,
    types,
    hadesSourceData,
    helpText
) {
    const baseData = hadesSourceBuildMetaUpgradeBaseData(hadesSourceData);
    const inlinedBaseData = inlinedMetaUpgradeBaseData[name];
    const mergedBaseData = safeMergeObjects(baseData, inlinedBaseData);

    const texts = buildMetaUpgradeTexts(helpText, name);

    const iconLocation = hadesSourceGetMetaUpgradeIconLocation(types, name);

    return {
        ...mergedBaseData,
        ...texts,
        types,
        iconLocation
    };
}

function hadesSourceBuildMetaUpgradesData(
    hadesSourceMetaUpgradesData,
    helpText
) {
    const { listsByTypeStructure, typeMap } =
        hadesSourceBuildMetaUpgradesTypeData(hadesSourceMetaUpgradesData);

    const map = {};

    for (const name in typeMap) {
        const types = typeMap[name];
        const hadesSourceData =
            hadesSourceMetaUpgradesData.MetaUpgradeData[name];
        map[name] = hadesSourceBuildMetaUpgradeData(
            name,
            types,
            hadesSourceData,
            helpText
        );
    }
    return { listsByTypeStructure, map };
}

export { hadesSourceBuildMetaUpgradesData };
