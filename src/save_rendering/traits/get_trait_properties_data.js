import { isArray, isNumber, isPlainObject } from '../../utils';

// RESTRUCTURE

// NOTE: Aren't extracted, referenced by tooltip directly.
const directlyAccessedProperties = {
    RemainingUses: true,
    SuperDuration: true,
    TooltipSpreadRate: true,
    PomLevelBonus: true,
    MoneyPerRoom: true,
    Min: true,
    Max: true,
    AmmoDropUseDelay: true
};

const directlyAccessedPropertyConfig = { SkipAutoExtract: true };

function getShallowPropertiesDataFromObjectAndKey(object, key) {
    const { [key]: value, ...objectRest } = object;
    switch (true) {
        case key === 'ExtractValue': {
            const { ExtractAs, ...propertyConfig } = value;
            return [
                {
                    propertyName: ExtractAs,
                    propertyConfig,
                    propertyCalculation: objectRest
                }
            ];
        }

        case key === 'ExtractValues': {
            return value.map(function (entry) {
                const { Key, ExtractAs, ...propertyConfig } = entry;
                return {
                    propertyName: ExtractAs,
                    propertyConfig,
                    propertyCalculation: object[Key]
                };
            });
        }

        case key in directlyAccessedProperties: {
            return [
                {
                    propertyName: key,
                    propertyConfig: directlyAccessedPropertyConfig,
                    propertyCalculation: value
                }
            ];
        }

        default:
            return [];
    }
}

function isPropertyAutoExtractable(propertyData) {
    const { propertyConfig, propertyCalculation } = propertyData;
    return (
        !propertyConfig?.SkipAutoExtract &&
        !propertyConfig?.External &&
        !propertyCalculation?.SkipAutoExtract // TODO: not sure if necessary.
    );
}

function getEmptyStructuredPropertiesData() {
    return {
        propertiesMap: {},
        autoExtractableList: []
    };
}

function updateStructuredPropertiesData(
    structuredPropertiesData,
    propertyData
) {
    const { propertiesMap, autoExtractableList } = structuredPropertiesData;
    const { propertyName, propertyConfig, propertyCalculation } = propertyData;

    propertiesMap[propertyName] = {
        propertyConfig,
        propertyCalculation
    };

    if (isPropertyAutoExtractable(propertyData)) {
        autoExtractableList.push(propertyName);
    }
}

function mergeIntoStructuredPropertiesData(destination, source) {
    Object.assign(destination.propertiesMap, source.propertiesMap);
    destination.autoExtractableList.push(...source.autoExtractableList);
}

function getStructuredPropertiesDataObject(object) {
    const structuredPropertiesData = getEmptyStructuredPropertiesData();

    for (const key in object) {
        const shallowPropertiesData = getShallowPropertiesDataFromObjectAndKey(
            object,
            key
        );

        if (shallowPropertiesData.length > 0) {
            shallowPropertiesData.forEach(function (propertyData) {
                updateStructuredPropertiesData(
                    structuredPropertiesData,
                    propertyData
                );
            });
        } else {
            mergeIntoStructuredPropertiesData(
                structuredPropertiesData,
                getStructuredPropertiesData(object[key])
            );
        }
    }

    return structuredPropertiesData;
}

function getStructuredPropertiesDataArray(array) {
    const structuredPropertiesData = getEmptyStructuredPropertiesData();

    for (const value of array) {
        mergeIntoStructuredPropertiesData(
            structuredPropertiesData,
            getStructuredPropertiesData(value)
        );
    }

    return structuredPropertiesData;
}

function getStructuredPropertiesData(value) {
    switch (true) {
        case isArray(value):
            return getStructuredPropertiesDataArray(value);

        case isPlainObject(value):
            return getStructuredPropertiesDataObject(value);

        default:
            return getEmptyStructuredPropertiesData();
    }
}

// FIX CALCULATION

// TODO: External trait properies data validation.
const inlinedExternalPropertiesData = {
    DamageOverTime: { Duration: 4, MaxStacks: 5, Cooldown: 0.5 },
    ReduceDamageOutput: { Duration: 3, Modifier: -0.3 },
    AthenaBackstabVulnerability: { Duration: 5 },
    DemeterSlow: {
        Duration: 8,
        ElapsedTimeMultiplier: 4,
        MaxStacks: 10
    },
    DionysusField: { TotalFuse: 5, Fuse: 0.25 },
    DemeterProjectile: { TotalFuse: 5 },
    MarkTargetSpin: { Duration: 10 },
    MarkBondTarget: { Duration: 7 },
    RangedWeapon: { DamageLow: 50 },
    BowSplitShot: { NumProjectiles: 9 },
    DamageOverDistance: { Duration: 10, Cooldown: 0.2 }, // duration?
    CritVulnerability: { Duration: 5 } // who knows, can't find it
};

function fixStructuredPropertyCalculationData(structuredPropertyData) {
    let { propertyCalculation } = structuredPropertyData;

    if (isNumber(propertyCalculation)) {
        propertyCalculation = { JustNumber: propertyCalculation };
    }

    if (!isPlainObject(propertyCalculation)) {
        propertyCalculation = {};
    }

    const { propertyConfig } = structuredPropertyData;
    const { External } = propertyConfig;

    if (External) {
        const { BaseName, BaseProperty } = propertyConfig;
        propertyCalculation.JustNumber =
            inlinedExternalPropertiesData[BaseName][BaseProperty];
    }

    // NOTE: this looks ugly.
    structuredPropertyData.propertyCalculation = propertyCalculation;
}

// FORMAT:

// TODO: Trait properties with no numbers/special calculation.

// NOTE: Usually depend on runtime info.
/*
5 traits: 
GodModeTrait AmmoReloadTrait BowLoadAmmoTrait ShieldLoadAmmo_DionysusRangedTrait AmmoReclaimTrait
 
const noNumbersFound = {
	// USED. only one, and one inheritance, should just inline, but multipliers are gone? wrong property?
    TooltipDamageBeowulf: 0, 
    TooltipWrathStocks: 0, // NOT USED. on most calls, and a few others, should be easy to inline
    
	TooltipTotalAmmoDelay: 0, // USED(all 3).hera, and the 2 hermes boons (from mirror upgrades), calculate based on aspect AND on which trait it is
    HealingReduction: 0, // NOT USED. heat, calculate based on mirror

    TooltipAccumulatedBonus: 0, // NOT USED if we use preferredtraitname. can't know. plume and thanatos
    TooltipEasyModeDefense: 0 // USED. can't know. easy mode damage multiplier
};
*/

const NO_NUMBERS_PLACEHOLDER = -17;

function getBaseNumbersRangeFromPropertyCalculation(propertyCalculation) {
    const { BaseMin, BaseMax, BaseValue, ChangeValue, JustNumber } =
        propertyCalculation;

    switch (true) {
        case isNumber(BaseMin):
            return [BaseMin, BaseMax];
        case isNumber(BaseValue):
            return [BaseValue, BaseValue];
        case isNumber(ChangeValue):
            return [ChangeValue, ChangeValue];
        case isNumber(JustNumber):
            return [JustNumber, JustNumber];
        default:
            return [NO_NUMBERS_PLACEHOLDER, NO_NUMBERS_PLACEHOLDER];
    }
}

// TODO: Trait upgrade data extraction
// it's pommable/upgradable if it has basemin/basevalue (traitscripts 361)
// rarity:
/* 
	if valueToRamp.SourceIsMultiplier then
		local delta = value - 1
		value = 1 + delta * rarityMultiplier
	elseif valueToRamp.SourceIsNegativeMultiplier then
		local delta = 1 - value * rarityMultiplier
		value = 1 + delta
	else
		value = value * rarityMultiplier
	end
*/
// pomming:
/* 
	if args.FakeStackNum and args.FakeStackNum > 1 then
		value = 0
		if valueToRamp.SourceIsMultiplier or valueToRamp.SourceIsNegativeMultiplier then
			value = 1
		end
		if valueToRamp.IdenticalMultiplier ~= nil then
			local fakeStackNum = args.FakeStackNum - 1
			-- Brute force for the time being
			for i = numExisting, numExisting + fakeStackNum do
				local diminishingMultiplier = valueToRamp.IdenticalMultiplier.DiminishingReturnsMultiplier or TraitMultiplierData.DefaultDiminishingReturnsMultiplier
				local totalDiminishingMultiplier = math.pow(diminishingMultiplier, i - 1 )
				local minMultiplier = valueToRamp.MinMultiplier or TraitMultiplierData.DefaultMinMultiplier
				local totalMultiplier = (1 + valueToRamp.IdenticalMultiplier.Value) * totalDiminishingMultiplier

				if totalMultiplier < minMultiplier then
					totalMultiplier = minMultiplier
				end
				if i == 0 then
					if valueToRamp.SourceIsMultiplier then
						local delta = baseValue - 1
						value = 1 + delta * rarityMultiplier
					elseif valueToRamp.SourceIsNegativeMultiplier then
						local delta = 1 - baseValue * rarityMultiplier
						value = 1 + delta
					else
						value = baseValue * rarityMultiplier
					end
				else
					if valueToRamp.SourceIsMultiplier then
						local delta = baseValue - 1
						local adjustedValue = delta * totalMultiplier
						value = value + adjustedValue

					elseif valueToRamp.SourceIsNegativeMultiplier then
						local delta = 1 - baseValue * totalMultiplier
						value = value + delta
					else
						local adjustedValue = baseValue * totalMultiplier
						value = value + adjustedValue
					end
				end
				value = ProcessValue( value, valueToRamp )
			end
		else
			if valueToRamp.SourceIsMultiplier then
				value = value + ( baseValue - 1 ) * args.FakeStackNum
			else
				value = value + baseValue * args.FakeStackNum
			end
		end
	else
		if hasIdentical and valueToRamp.IdenticalMultiplier ~= nil then
			local diminishingMultiplier = valueToRamp.IdenticalMultiplier.DiminishingReturnsMultiplier or TraitMultiplierData.DefaultDiminishingReturnsMultiplier
			local totalDiminishingMultiplier = math.pow(diminishingMultiplier, numExisting - 1 )
			local minMultiplier = valueToRamp.MinMultiplier or TraitMultiplierData.DefaultMinMultiplier
			local totalMultiplier = (1 + valueToRamp.IdenticalMultiplier.Value) * totalDiminishingMultiplier
			if totalMultiplier < minMultiplier then
				totalMultiplier = minMultiplier
			end

			if valueToRamp.SourceIsMultiplier then
				local delta = value - 1
				local adjustedValue = delta * totalMultiplier
				value = 1 + adjustedValue
			elseif valueToRamp.SourceIsNegativeMultiplier then
				local delta = 1 - value * totalMultiplier
				value = 1 + delta
			else
				local adjustedValue = value * totalMultiplier
				value = adjustedValue
			end
		end
	end
*/

function getPropertyCalculationMultipliers(propertyCalculation) {
    const { IdenticalMultiplier, MinMultiplier, CustomRarityMultiplier } =
        propertyCalculation;
    return { IdenticalMultiplier, MinMultiplier, CustomRarityMultiplier };
}

// NOTE: propertyData needs to be "fixed"
function getFormattedStructuredPropertyData(structuredPropertyData) {
    const { propertyConfig, propertyCalculation } = structuredPropertyData;

    const baseNumbersRange =
        getBaseNumbersRangeFromPropertyCalculation(propertyCalculation);

    const multipliers = getPropertyCalculationMultipliers(propertyCalculation);

    const { Format } = propertyConfig;

    const decimalPlaces =
        propertyConfig.DecimalPlaces ?? propertyCalculation.DecimalPlaces ?? 0;

    return {
        baseNumbersRange,
        multipliers,
        Format,
        decimalPlaces
    };
}

// INJECT:

function injectTraitDataIntoFormattedPropertyData(
    traitData,
    formattedPropertyData
) {
    const { multipliers } = formattedPropertyData;
    multipliers.RarityLevels =
        multipliers.CustomRarityMultiplier ?? traitData.RarityLevels;
    delete multipliers.CustomRarityMultiplier;
}

// FINAL:

function getTraitPropertiesData(traitData) {
    const structuredPropertiesData = getStructuredPropertiesData(traitData);

    const { propertiesMap } = structuredPropertiesData;
    for (const propertyName in propertiesMap) {
        fixStructuredPropertyCalculationData(propertiesMap[propertyName]);

        propertiesMap[propertyName] = getFormattedStructuredPropertyData(
            propertiesMap[propertyName]
        );

        injectTraitDataIntoFormattedPropertyData(
            traitData,
            propertiesMap[propertyName]
        );
    }

    return structuredPropertiesData;
}

export { getTraitPropertiesData };
