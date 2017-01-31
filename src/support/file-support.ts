const fs = require('fs');
const glob = require('glob');
const path = require('path');
const regex = {
    pathDirs: /(.*?)\//g
};

function copy(source, target) {
    fs.createReadStream(source).pipe(fs.createWriteStream(target));
}

function ensureDirExists(target) {
    let workPath = path.resolve('');
    getMatches(regex.pathDirs, target)
        .map((dir) => {
            workPath = path.resolve(workPath, dir);
            if (!fs.existsSync(workPath)) {
                fs.mkdirSync(workPath);
            }
        });
}

function getMatches(rgx, source): Array<any> {
    let m, matches = [];
    do {
        m = rgx.exec(source);
        if (m) {
            matches.push(m[1]);
        }
    } while (m);
    return matches;
}

function loadConfig(globalConfig) {
    return require(path.resolve(globalConfig.configFile));
}

function loadGlob(pattern, cwd) {
    let promise = new Promise((resolve) => {
        glob(pattern, {
                cwd: (cwd || '')
            },
            (err, files) => {
                resolve(files);
            });
        });
    return promise;
}

function readFile(file) {
    let filePath = path.resolve('', this.src.cwd, file);
    let config = require(filePath);
    config.path = file;
    return config;
}

function scanFiles(appConfig) {
    let promises = [].concat(appConfig.src.files).map((pattern) => {
        return loadGlob(pattern, appConfig.src.cwd);
    });
    return Promise.all(promises).then((files) => {
        return files.reduce((a, b) => {
            return a.concat(b);
        });
    });
}

function writeFile(target, content, prefix = 'tmp/') {
    let path = prefix.concat('/').replace('//', '/').concat(target);
    ensureDirExists(path);
    fs.writeFileSync(path, content);
}

export {
    copy,
    loadConfig,
    readFile,
    scanFiles,
    writeFile
}