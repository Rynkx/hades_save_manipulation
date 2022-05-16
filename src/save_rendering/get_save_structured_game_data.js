import { isNumber } from '../utils';
import { filterRelevantSaveData } from './filter_relevant_save_data';
import { getKnownFish, getStructuredFishingDataFromKnown } from './fishing';
import {
    getKnownRunData,
    getRunStructuredGameDataFromKnown
} from './get_run_structured_game_data';

function getKnownSaveData(hadesSourceSave, gameData) {
    // TODO: filter... actually coerces RunHistory to an array, so it's necessary
    // but performance?
    const { TotalCaughtFish, NumCerberusPettings, RunHistory } =
        filterRelevantSaveData(hadesSourceSave);

    // NOTE: old runs have missing data, namely traits for the oldest and
    // heat/mirror settings for the newer ones
    const potentialRuns = RunHistory.map(function (runData, runIndex) {
        try {
            return getKnownRunData(gameData, runData);
        } catch (error) {
            return { error, runNumber: runIndex + 1 };
        }
    });
    const runs = potentialRuns.filter(run => !run.error);
    const errors = potentialRuns.filter(run => !!run.error);

    const fish = getKnownFish(gameData.fishData, TotalCaughtFish);

    const cerberusPets = NumCerberusPettings;
    if (!isNumber(cerberusPets)) {
        throw `Cerberus pets not a number! (${cerberusPets})`;
    }

    return {
        runs,
        errors,
        fish,
        cerberusPets
    };
}

function getSaveStructuredGameDataFromKnown(knownSaveData, gameData) {
    return {
        runs: knownSaveData?.runs.map(run =>
            getRunStructuredGameDataFromKnown(gameData, run)
        ),
        errors: knownSaveData?.errors,
        cerberusPets: knownSaveData.cerberusPets,
        fish: getStructuredFishingDataFromKnown(
            gameData.fishData,
            knownSaveData.fish
        )
    };
}

function getSaveStructuredGameData(hadesSourceSave, gameData) {
    return getSaveStructuredGameDataFromKnown(
        getKnownSaveData(hadesSourceSave, gameData),
        gameData
    );
}

export {
    getKnownSaveData,
    getSaveStructuredGameDataFromKnown,
    getSaveStructuredGameData
};
