import { Rule, SchematicContext, SchematicsException, Tree } from "@angular-devkit/schematics";
import { NODE_VERSION_FILE } from "../enums";
import { Schema } from "../schema";

export function addNodeVersion(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        addEngines(tree, context, options.nodeVersion);
        generateNodeVersionFile(tree, context, options.nodeVersionFile);
        return tree
    }
}

function addEngines(tree: Tree, context: SchematicContext, nodeVersion: number) {
    const pkgPath = 'package.json' 
    const buffer = tree.read(pkgPath)
  
    if (buffer === null) {
      throw new SchematicsException(`Cannot find ${pkgPath}`);
    }
  
    const packageJson = JSON.parse(buffer.toString());
    if (!packageJson?.engines?.node) {
        packageJson.engines = {
            node: nodeVersion
        }
        tree.overwrite(pkgPath, JSON.stringify(packageJson, null, 2));
        context.logger.info(`Added ${nodeVersion} to package.json`)
    } else {
        context.logger.info(`Found node version in ${pkgPath}, skip this step`)
    }
  
    return tree;
}
  
function generateNodeVersionFile(tree: Tree, context: SchematicContext, nodeVersionFile: string) {
    const enumNodeVersionFile = nodeVersionFile as NODE_VERSION_FILE;
    if (enumNodeVersionFile === NODE_VERSION_FILE.NODE_VERSION) {
        const nodeConfigFilename = '.node-version';
        context.logger.info(`Created ${nodeConfigFilename}`);
    } else if (enumNodeVersionFile === NODE_VERSION_FILE.NVMRC) {
        const nodeConfigFilename = '.nvmrc';
        context.logger.info(`Created ${nodeConfigFilename}`);
    } else if (enumNodeVersionFile === NODE_VERSION_FILE.NONE) {
        context.logger.info('No node version configuration created')
    }

    return tree;
  }