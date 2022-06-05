import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";
import { addPackageJsonDependency } from "@schematics/angular/utility/dependencies";
import { cspell } from "../constants";
import { Schema } from "../schema";

export function addCspell(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
      if (options.isAddCspell) {
        addPackageJsonDependency(tree, cspell);
        context.logger.info(`Added ${cspell.name}@${cspell.version}`);
        copyCspellJson(tree, context)
      }
  
      return tree
    }
}

function copyCspellJson(tree: Tree, context: SchematicContext) {    
    const content = {
        "version": "0.2",
        "language": "en",
        "words": ["nestjs", "commitlint", "dtos"],
        "flagWords": ["hte"]
    };

    tree.create('cspell.json', JSON.stringify(content, null, 2)
    );
    context.logger.info('Added cspell.json')
    return true
}