import { filterRelevantSaveData } from './filter_relevant_save_data';
import { getStructuredFishingData } from './fishing';
import { getRunStructuredGameData } from './get_run_structured_game_data';

function getSaveStructuredGameData(hadesSourceSave, gameData) {
    // TODO: filter... actually coerces RunHistory to an array, so it's necessary
    // but performance?
    const { TotalCaughtFish, NumCerberusPettings, RunHistory } =
        filterRelevantSaveData(hadesSourceSave);
    const runs = RunHistory.map(function (runData) {
        return getRunStructuredGameData(gameData, runData);
    });

    const fish = getStructuredFishingData(TotalCaughtFish);

    const cerberusPets = NumCerberusPettings;

    return {
        runs,
        fish,
        cerberusPets
    };
}

export { getSaveStructuredGameData };
