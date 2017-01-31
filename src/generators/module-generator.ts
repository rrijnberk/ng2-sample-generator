const fileSupport = require('./../support/file-support');

function getBaseImports() {
   return `import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

import {SampleApp} from './sample.component';`;
}

function generateImports(components) {
    return components.map((component) => {
        return `import {${component.component}} from './${component.file.replace(/\.ts$/, '')}';\n`
    }).join('');
}

function generateModuleFile(components) {
    return `${getBaseImports()}

import {ComponentsModule} from '../../src/app/components.module';

${generateImports(components)}

import {routing} from './sample.routes';

const samples = [${listComponents(components)}
];

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        ComponentsModule,
        routing
    ],
    declarations: [
        SampleApp,
        ...samples
    ],
    bootstrap:    [ SampleApp ]
})
export class SampleModule { }

platformBrowserDynamic().bootstrapModule(SampleModule);
`
}

function generate(components) {
    fileSupport.writeFile('sample.module.ts', generateModuleFile(components), this.dest);
    return components;
}

function listComponents(components) {
    return components.map((component) => '\n    '.concat(component.component));
}

export {
    generate
}