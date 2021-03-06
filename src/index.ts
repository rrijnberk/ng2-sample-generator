const fsup = require('./support/file-support');
const defaults = {
    configFile: 'sgconfig.json'
};
const globalConfig = {};
const mgen = require('./generators/module-generator');
const rgen = require('./generators/routes-generator');
const sgen = require('./generators/sample-generator');

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

function parseModule(components) {
    mgen.generate.bind(appConfig)(components);
    return components;
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
        .then(parseModule)
        // .then((configs) => {
        //     configs.map(console.log)
        // })
    ;

    fsup.copy('src/files/sample.component.ts',
        appConfig.dest
            .concat('/')
            .replace('//', '/')
            .concat('sample.component.ts'));
}

export {
    generateSampleApp
}