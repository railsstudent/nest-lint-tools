import { Rule, SchematicContext, SchematicsException, Tree } from "@angular-devkit/schematics";
import { addPackageJsonDependency } from "@schematics/angular/utility/dependencies";
import { cspell } from "../constants";
import { Schema } from "../schema";

export function addCspell(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
      if (options.isAddCspell) {
        addPackageJsonDependency(tree, cspell);
        context.logger.info(`Added ${cspell.name}@${cspell.version}`);
        createCspellJson(tree, context);
        addNpmScript(tree, context);
      }
  
      return tree
    }
}

function createCspellJson(tree: Tree, context: SchematicContext) {    
    const content = {
        "version": "0.2",
        "language": "en",
        "words": ["nestjs", "commitlint", "dtos"],
        "flagWords": ["hte"]
    };

    tree.create('cspell.json', JSON.stringify(content, null, 2));
    context.logger.info('Added cspell.json')
    return true
}

function addNpmScript(tree: Tree, context: SchematicContext) {
  const pkgPath = 'package.json' 
  const buffer = tree.read(pkgPath)

  if (buffer === null) {
    throw new SchematicsException(`Cannot find ${pkgPath}`);
  }

  const packageJson = JSON.parse(buffer.toString());
  packageJson.scripts.cspell = 'cspell --no-must-find-files src/**/*.{ts,js}';
  tree.overwrite(pkgPath, JSON.stringify(packageJson, null, 2));
  context.logger.info('Added cspell script to package.json')

  return tree;
}
