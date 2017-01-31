const fileSupport = require('./file-support');

function generateImports(components) {
    return components.map((component) => {
        return `import {${component.component}} from './${component.file.replace(/\.ts$/, '')}';\n`
    }).join('');
}

function generateRoutes(components) {
    return components.map((component) => {

        return `\n    { path: '${component.route}', component: ${component.component} }`;
    });
}

function generateRouteFile(components) {
    return `import {RouterModule, Routes} from '@angular/router';

${generateImports(components)}
const routes: Routes = [${generateRoutes(components)}
];

export const routing = RouterModule.forRoot(routes, {
    useHash: true
});
`
}

function generate(components) {
    let routeContent = generateRouteFile(components);
    fileSupport.writeFile('sample.routes.ts', routeContent, this.dest);
    return components;
}

export {
    generate
}