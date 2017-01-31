const fileSupport = require('./../support/file-support');

const regex = {
    array: /Array<(.*)>/,
    path: /^(.*)\//
};

const toClassName = (str) => {
    return str.split('').map((char, index) => {
        return index === 0 ? char.toUpperCase() : char;
    }).join('').concat('_Sample');
};

const toDeclarations = (properties: Array<any>) => {
    return properties.map((property, index) => {
        return (index !== 0 ? '    ' : '') + `private ${property.name}: ${property.type};\n`
    }).join('');
};

const toAssignments = (properties: Array<any>) => {
    return properties.map((property) => {
        return '\n        ' + `this.${property.name} = ${parseValue(property)};`
    }).join('').concat('\n    ');
};

const parseValue = (property: any): string => {
    switch (true) {
        case regex.array.test(property.type):
            return arrayConverter(property);
        case property.type === "string":
        default:
            return `\"${property.value.toString()}\"`
    }
};

const arrayConverter = (property) => {
    let array = [],
        type = regex.array.exec(property.type)[1];
    switch (type) {
        case 'Number':
            array.push(property.value);
            break;
        case 'string':
            property.value.map((value) => {
                array.push(`"${value}"`);
            });
            break;
        default:
            property.value.map((value) => {
                array.push(JSON.stringify(value));
            });
    }
    return `[${array}]`;
};

function expand(config) {
    let name = Object.keys(config)[0];
    let conf = config[name];
    conf.name = name;
    return conf;
}

function bindPath(config) {
    config.path = this;
    return config;
}

function generateClassName(config) {
    config.className = toClassName(config.name);
    return config;
}


function generateSample(config) {
    let className = `${config.meta.component}_${config.className}`;
    return {
        component: config.meta.component,
        content: `import {Component} from "@angular/core";

@Component({
    selector: '${config.meta.ngSelector}-${config.name}',
    template: '${config.definition}'
})
export class ${className} {
    ${toDeclarations(config.properties) || ''}
    constructor() {${toAssignments(config.properties)}}
}
`,
        name: className,
        path: regex.path.exec(config.path)[0]
    };
}

function write(config) {
    let file = config.path.concat(`${config.name}.sample.ts`);
    fileSupport.writeFile(file, config.content, this.dest);
    return {
        component: config.name,
        route: file.replace('.sample.ts', ''),
        file
    };
}

function generate(config) {
    return config.samples
        .map(expand)
        .map(bindPath.bind(config.path))
        .map(generateClassName)
        .map(generateSample)
        .map(write.bind(this));
}

export {
    generate
}