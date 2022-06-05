import { Tree, SchematicContext, SchematicsException } from "@angular-devkit/schematics";
import { exec } from "child_process";

export function addCommitMessageHook(tree: Tree, context: SchematicContext) {
    const commitMsg = `#!/bin/sh
  . "\$(dirname "\$0")/_/husky.sh"
  
  npx --no -- commitlint --edit "\${1}"
  `;
  
    const commitMsgFilename = '.husky/commit-msg';
    tree.create(commitMsgFilename, commitMsg);
    context.logger.info(`Added ${commitMsgFilename}`);
  
    exec(`chmod a+x ${commitMsgFilename}`);
    context.logger.info(`Made commit-msg hook executable`);
  
    return tree
  }
  
  export function addHuskyPrepareScript(tree: Tree, context: SchematicContext) {
    const pkgPath = 'package.json' 
    const buffer = tree.read(pkgPath)
  
    if (buffer === null) {
      throw new SchematicsException(`Cannot find ${pkgPath}`);
    }
  
    exec('npx husky install');
    context.logger.info('Enable husky hooks');
  
    const packageJson = JSON.parse(buffer.toString());
    packageJson.scripts.prepare = 'husky install';
    tree.overwrite(pkgPath, JSON.stringify(packageJson, null, 2));
    context.logger.info('Added husky prepare script to package.json');
  
    exec('npm run prepare');
    context.logger.info('Executed npm run prepare');
  
    return tree;
  }