import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";
import { eslintPluginRxjs } from "../constants";
import { Schema } from "../schema";
import { addDependencies } from "./dependency.helper";

export function addEslintRxjs(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
      if (options.isAddEslintRxjs) {
        addDependencies(tree, context, [eslintPluginRxjs]);
        updateEslintrc(tree, context);
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
  