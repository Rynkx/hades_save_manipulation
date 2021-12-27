import { isPlainObject } from '../utils';

const HADES_SAVE_FILTER_SCHEMA = {
    lua_state: [
        {
            GameState: {
                TotalCaughtFish: true,
                ConsecutiveClears: true,
                TraitsTaken: true,
                EnemyKills: true,
                RecordClearedShrineThreshold: true,
                EncountersCompletedCache: true,
                WeaponUnlocks: true,
                TimesClearedWeapon: true,
                WeaponRecordsClearTime: true,
                LifetimeResourcesSpent: true,
                TotalRequiredEnemyKills: true,
                ClearedWithMetaUpgrades: true,
                NPCInteractions: true,
                NumCerberusPettings: true,
                EnemySpawns: true,
                WeaponKills: true,
                EncountersOccurredCache: true,
                MetaUpgrades: true,
                TimesCleared: true,
                CompletedRunsCache: true,
                MetaUpgradeState: true,
                ConsecutiveClearsRecord: true,
                LifetimeResourcesGained: true,
                EnemyDamage: true,
                Resources: true,
                EnemyEliteAttributeKills: true,
                WeaponRecordsShrinePoints: true,
                KeepsakeChambers: true,
                ItemInteractions: true,
                ObjectivesFailed: true,
                LootPickups: true,
                RunHistory: [
                    {
                        GameplayTime: true,
                        Cleared: true,
                        EndingRoomName: true,
                        RunClearMessage: { Name: true },

                        RunDepthCache: true,
                        EndingMoney: true,

                        MetaPointsCache: true,
                        ShrinePointsCache: true,
                        MetaUpgradeCache: true,

                        EndingKeepsakeName: true,
                        WeaponsCache: true,
                        TraitCache: true,

                        RoomCountCache: true
                    }
                ]
            }
        }
    ]
};

function filter(entry, filterSchema) {
    switch (true) {
        case entry === undefined:
            return null;

        case filterSchema === true:
            return entry;

        case Array.isArray(filterSchema) && Array.isArray(entry):
            return filterArray(entry, filterSchema);

        case Array.isArray(filterSchema) && isPlainObject(entry):
            return filterArray(coerceLuaObjectToArray(entry), filterSchema);

        case isPlainObject(filterSchema) && isPlainObject(entry):
            return filterObject(entry, filterSchema);

        default:
            throw new Error("Entry and schema don't match.");
    }
}

function filterObject(object, filterSchema) {
    const result = {};
    for (const subEntryName in filterSchema) {
        const subFilterSchema = filterSchema[subEntryName];
        const subEntry = object[subEntryName];
        result[subEntryName] = filter(subEntry, subFilterSchema);
    }
    return result;
}

function coerceLuaObjectToArray(object) {
    const coercedArray = [];
    for (const index in object) {
        coercedArray[index - 1] = object[index];
    }
    return coercedArray;
}

function filterArray(array, filterSchema) {
    const result = [];

    for (let subEntryIndex = 0; subEntryIndex < array.length; ++subEntryIndex) {
        const subFilterSchema = filterSchema[subEntryIndex] ?? filterSchema[0];
        const subEntry = array[subEntryIndex];
        result.push(filter(subEntry, subFilterSchema));
    }
    return result;
}

function filterRelevantSaveData(save) {
    const relevant = filter(save, HADES_SAVE_FILTER_SCHEMA).lua_state[0]
        .GameState;
    return relevant;
}

export { filterRelevantSaveData };
