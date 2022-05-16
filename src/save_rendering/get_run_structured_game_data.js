import { isNumber, isString } from '../utils';
import {
    getKnownMetaUpgrades,
    getRunStructuredMetaUpgradesFromKnown
} from './meta_upgrades/get_run_structured_meta_upgrades';
import { getKnownRooms, getRunStructuredRoomsFromKnown } from './rooms';
import {
    getKnownTraits,
    getRunStructuredTraitsFromKnown
} from './traits/get_run_structured_traits';

function getRunKnownOtherData(gameData, runData) {
    const {
        GameplayTime,
        Cleared,
        EndingRoomName,
        RunClearMessage,

        EndingMoney,

        ShrinePointsCache
    } = runData;

    const heat = ShrinePointsCache;
    if (!isNumber(heat)) {
        throw `Heat is not a number! (${heat})`;
    }

    const time = GameplayTime;
    if (!isNumber(time)) {
        throw `Time is not a number! (${time})`;
    }

    const cleared = !!Cleared;
    const deathRoom = isString(!Cleared && EndingRoomName)
        ? EndingRoomName
        : null;

    // Ignore wrong messages, not too important
    const clearMessage =
        isString(RunClearMessage?.Name) &&
        gameData.clearMessagesData[RunClearMessage?.Name]
            ? RunClearMessage?.Name
            : null;

    const money = EndingMoney;
    if (!isNumber(money)) {
        throw `Money is not a number! (${money})`;
    }
    return {
        heat,
        time,
        cleared,
        deathRoom,
        clearMessage,
        money
    };
}
function getKnownRunData(gameData, runData) {
    const otherData = getRunKnownOtherData(gameData, runData);
    const {
        MetaUpgradeCache,

        EndingKeepsakeName,
        WeaponsCache,
        TraitCache,

        RoomCountCache
    } = runData;
    const { metaUpgradesData, traitsData, roomsData } = gameData;
    const metaUpgrades = getKnownMetaUpgrades(
        metaUpgradesData,
        MetaUpgradeCache
    );
    const traits = getKnownTraits(traitsData.map, {
        EndingKeepsakeName,
        WeaponsCache,
        TraitCache
    });
    const rooms = getKnownRooms(roomsData.map, RoomCountCache);
    return {
        ...otherData,
        metaUpgrades: metaUpgrades,
        traits,
        rooms
    };
}

function getRunStructuredGameDataFromKnown(gameData, knownRunData) {
    const { metaUpgradesData, traitsData, roomsData } = gameData;
    const {
        metaUpgrades: knownMetaUpgrades,
        rooms: knownRooms,
        traits: knownTraits,
        ...otherData
    } = knownRunData;
    const metaUpgrades = getRunStructuredMetaUpgradesFromKnown(
        metaUpgradesData,
        knownMetaUpgrades
    );
    const traits = getRunStructuredTraitsFromKnown(traitsData.map, knownTraits);
    const rooms = getRunStructuredRoomsFromKnown(roomsData.map, knownRooms);
    return {
        ...otherData,

        metaUpgrades,
        traits,
        rooms
    };
}

function getRunStructuredGameData(gameData, runData) {
    return getRunStructuredGameDataFromKnown(
        gameData,
        getKnownRunData(gameData, runData)
    );
}

export {
    getKnownRunData,
    getRunStructuredGameDataFromKnown,
    getRunStructuredGameData
};
