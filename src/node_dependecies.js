const nodeDependencies = {
    fsPromises: null
};

function setNodeDependencies(dependencies) {
    Object.assign(nodeDependencies, dependencies);
}

async function doesFileExist(path) {
    try {
        await nodeDependencies.fsPromises.access(path);
        return true;
    } catch (error) {
        return false;
    }
}

async function readFile(path, ...args) {
    return await nodeDependencies.fsPromises.readFile(path, ...args);
}

async function readJSON(path) {
    const string = await readFile(path, 'utf-8');
    return JSON.parse(string);
}

async function readDirectory(path) {
    return await nodeDependencies.fsPromises.readdir(path);
}

async function copyFile(from, to) {
    return await nodeDependencies.fsPromises.copyFile(from, to);
}

async function makeDirectory(path) {
    return await nodeDependencies.fsPromises.mkdir(path, { recursive: true });
}

async function writeFile(path, data) {
    return await nodeDependencies.fsPromises.writeFile(path, data);
}

export {
    setNodeDependencies,
    doesFileExist,
    readFile,
    readJSON,
    readDirectory,
    makeDirectory,
    copyFile,
    writeFile
};
