import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";
import { eslintSonarjs } from "../constants";
import { Schema } from "../schema";
import { addDependencies } from "./dependency.helper";
import { updateEslintrc } from "./eslint.helper";

export function addEslintSonarjs(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
      if (options.isAddEslintSonarJs) {
        addDependencies(tree, context, [eslintSonarjs]);
        updateEslintrc(tree, context, { eslintExtend: 'plugin:sonarjs/recommended', plugin: 'sonarjs' });
      }
  
      return tree
    }
}