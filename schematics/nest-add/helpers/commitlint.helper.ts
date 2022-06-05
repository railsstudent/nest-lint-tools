import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";
import { addPackageJsonDependency } from "@schematics/angular/utility/dependencies";
import { commitlintCli, commitlintConfigConvention, husky } from "../constants";
import { Schema } from "../schema";
import { addCommitMessageHook, addHuskyPrepareScript } from "./husky.helper";

export function addCommitlint(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
      if (options.isAddCommitlint) {
        const dependencies = [commitlintCli, commitlintConfigConvention, husky]
        for (const dependency of dependencies) {
            addPackageJsonDependency(tree, dependency);
            context.logger.info(`Added ${dependency.name}@${dependency.version}`);
    
        }
        createCommitlintConfig(tree, context);
        addHuskyPrepareScript(tree, context);
        addCommitMessageHook(tree, context);
      }
  
      return tree
    }
}

function createCommitlintConfig(tree: Tree, context: SchematicContext) {    
  const configName = 'commitlint.config.js'
  if (!tree.exists(configName)) {
    tree.create(configName, `module.exports = { extends: ['@commitlint/config-conventional'] };`);
    context.logger.info(`Added ${configName}`)
  } else {
    context.logger.info(`Found ${configName}, skip this step`)
  }
  
  return tree
}
