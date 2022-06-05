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

export const commitlintCli: NodeDependency = {
    name: '@commitlint/cli',
    type: NodeDependencyType.Dev,
    version: '~17.0.2'
}

export const commitlintConfigConvention: NodeDependency = {
    name: '@commitlint/config-conventional',
    type: NodeDependencyType.Dev,
    version: '~17.0.2'
}


export const husky: NodeDependency = {
    name: 'husky',
    type: NodeDependencyType.Dev,
    version: '~8.0.1'
}