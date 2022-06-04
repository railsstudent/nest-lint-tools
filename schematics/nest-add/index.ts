import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { Dependency } from './interfaces';
import { Schema } from './schema';
import { getLatestDependencyVersion } from './utils';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function nestAdd(options: Schema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());

    return chain([
      addEslintRxjs(options)
    ])
  };
}

function addEslintRxjs(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.isAddEslintRxjs) {
      const dependency: Dependency = {
        name: 'eslint-plugin-rxjs',
        type: NodeDependencyType.Dev
      }

      getLatestDependencyVersion(dependency.name).then(
        ({ name, version }) => {
          context.logger.info(`Added ${name}@${version}`);
          const nodeDependency: NodeDependency = {
            name,
            version,
            type: dependency.type,
          };
          addPackageJsonDependency(tree, nodeDependency);
        }
      ).then(() => {
        updateEslintrc(tree, context)
      })
      .then(() => tree) as ReturnType<Rule>;
    }
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
        const modifiedEslintJsFile = `${eslintJsFile.substring(0, idxNextCloseBracket)}'plugin:rxjs/recommended'\n${eslintJsFile.substring(idxNextCloseBracket)}`
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
