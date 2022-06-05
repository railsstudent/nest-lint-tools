import { NodeDependency, NodeDependencyType } from "@schematics/angular/utility/dependencies";

export const eslintPluginRxjs: NodeDependency = {
    name: 'eslint-plugin-rxjs',
    type: NodeDependencyType.Dev,
    version: '~5.0.2'
}

export const cspell: NodeDependency = {
    name: 'cspell',
    type: NodeDependencyType.Dev,
    version: '~6.1.1'
}
