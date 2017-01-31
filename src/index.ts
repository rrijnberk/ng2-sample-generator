const fsup = require('./file-support');
const defaults = {
    configFile: 'sgconfig.json'
};
const globalConfig = {};
const rgen = require('./routes-generator');
const sgen = require('./sample-generator');

let appConfig = {};

function applyParameters() {
    process.argv
        .map(processArgument)
        .filter((param) => param);
}

function processArgument(val, index) {
    switch(val) {
        case '-c':
        case '--config':
            override('configFile', process.argv[index + 1]);
            break;
    }
}

function initializeGlobalConfig() {
    Object.keys(defaults).forEach((key) => {
        globalConfig[key] = defaults[key];
    });
}

function override(key, value) {
    if(value) { globalConfig[key] = value; }
}

function parseRoutes(components) {
    rgen.generate.bind(appConfig)(components);
    return components;
}

function parseSamples(configs) {
    return configs
        .map(sgen.generate.bind(appConfig))
}

function readFiles(files) {
    return files
        .map(fsup.readFile.bind(appConfig));
}

function reduce(array) {
    return array.reduce((a,b) => {
        return a.concat(b);
    });
}

function generateSampleApp() {
    initializeGlobalConfig();
    applyParameters();
    appConfig = fsup.loadConfig(globalConfig);

    /** Now the work starts **/
    fsup.scanFiles(appConfig)
        .then(readFiles)
        .then(parseSamples)
        .then(reduce)
        .then(parseRoutes)
        // .then((configs) => {
        //     configs.map(console.log)
        // })
    ;
}

export {
    generateSampleApp
}