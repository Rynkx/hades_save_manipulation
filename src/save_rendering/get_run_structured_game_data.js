import { getRunStructuredMetaUpgrades } from './meta_upgrades';
import { getRunStructuredRooms } from './rooms';
import { getRunStructuredTraits } from './traits';

function getRunStructuredGameData(gameData, runData) {
    const {
        GameplayTime,
        Cleared,
        EndingRoomName,
        RunClearMessage,

        EndingMoney,

        ShrinePointsCache,
        MetaUpgradeCache,

        EndingKeepsakeName,
        WeaponsCache,
        TraitCache,

        RoomCountCache
    } = runData;
    const { metaUpgradesData, traitsData, roomsData } = gameData;

    const metaUpgrades = getRunStructuredMetaUpgrades(
        metaUpgradesData,
        MetaUpgradeCache
    );
    const traits = getRunStructuredTraits(traitsData.map, {
        EndingKeepsakeName,
        WeaponsCache,
        TraitCache
    });
    const rooms = getRunStructuredRooms(roomsData.map, RoomCountCache);

    return {
        heat: ShrinePointsCache,
        time: GameplayTime,

        cleared: Cleared,
        deathRoom: !Cleared && EndingRoomName,
        clearMessage: RunClearMessage?.Name,

        money: EndingMoney,

        metaUpgrades,
        traits,
        rooms
    };
}

export { getRunStructuredGameData };
