import { hadesSourceResolveInheritance } from '../hades_utils';

function hadesSourceBuildHelpText(hadesSourceHelpText) {
    const helpText = {};
    for (const helpTextEntry of hadesSourceHelpText.Texts) {
        helpText[helpTextEntry.Id] = helpTextEntry;
    }
    return hadesSourceResolveInheritance(helpText);
}

export { hadesSourceBuildHelpText };
