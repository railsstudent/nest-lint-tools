import { chain, Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, getPackageJsonDependency, NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { Dependency } from './interfaces';
import { Schema } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function nestAdd(options: Schema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());

    return chain([
      addEslintRxjs(options),
      addStrictMode(options)
    ])
  };
}

function addEslintRxjs(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.isAddEslintRxjs) {
      const dependency: Dependency = {
        name: 'eslint-plugin-rxjs',
        type: NodeDependencyType.Dev,
        version: '~5.0.2'
      }

      const nodeDependency: NodeDependency = {
        name: dependency.name,
        version: dependency.version,
        type: dependency.type,
      };

      addPackageJsonDependency(tree, nodeDependency);
      context.logger.info(`Added ${dependency.name}@${dependency.version}`);
      updateEslintrc(tree, context)
    }

    return tree
  }
}

function updateEslintrc(tree: Tree, context: SchematicContext) {
  const eslintPaths = ['.eslintrc.js', '.eslintrc.json']
  let isEslintFileFound = false
  for (const eslintPath of eslintPaths) {
    const buffer = tree.read(eslintPath); 
    if (buffer !== null) {
      isEslintFileFound = true
      if (eslintPath.endsWith('.json')) {
        const eslintFile = JSON.parse(buffer.toString());
        eslintFile.extends = [...eslintFile.extends, 'plugin:rxjs/recommended']; 
        tree.overwrite(eslintPath, JSON.stringify(eslintFile, null, 2));
      } else if (eslintPath.endsWith('.js')) {
        const eslintJsFile = buffer.toString()
        const idxExtends = eslintJsFile.indexOf('extends: [')
        const idxNextCloseBracket = eslintJsFile.indexOf(']', idxExtends)
        const modifiedEslintJsFile = `${eslintJsFile.substring(0, idxNextCloseBracket)},'plugin:rxjs/recommended'\n${eslintJsFile.substring(idxNextCloseBracket)}`
        tree.overwrite(eslintPath, modifiedEslintJsFile);
      }
      context.logger.info(`Added 'plugin:rxjs/recommended' to ${eslintPath}`)
      break;
    }
  }
  
  if (!isEslintFileFound) { 
    context.logger.info('Eslintrc file not found')
  }
}

function addStrictMode(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.isAddStrictMode) {
      const tsConfigPath = "tsconfig.json"
      const buffer = tree.read(tsConfigPath); 
      if (buffer === null) {
        throw new SchematicsException(`Could not find ${tsConfigPath}.`);
      }

      const tsConfigFile = JSON.parse(buffer.toString());
      const compilerOptions = tsConfigFile.compilerOptions
      compilerOptions.strict = true
      compilerOptions.strictPropertyInitialization = false
      compilerOptions.noImplicitAny = false
      compilerOptions.noImplicitThis = true
      compilerOptions.noUnusedParameters = true
      compilerOptions.noUnusedLocals = true
      compilerOptions.noUncheckedIndexedAccess = true

      const packagePath = 'package.json'
      const typeScriptDependency = getPackageJsonDependency(tree, 'typescript', packagePath)
      if (typeScriptDependency) {
        const [, minor = '0', ] = typeScriptDependency.version.split('.')
        if (parseInt(minor) >= 4) {
          compilerOptions.useUnknownInCatchVariables = true         
        }     
      }

      tree.overwrite(tsConfigPath, JSON.stringify(tsConfigFile, null, 2));
      context.logger.info(`Added strict mode to ${tsConfigPath}`) 
    }
    return tree
  }
}