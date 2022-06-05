import { Tree, SchematicContext, SchematicsException } from "@angular-devkit/schematics";
import { exec } from "child_process";

export function addCommitMessageHook(tree: Tree, context: SchematicContext) {
    const commitMsg = `#!/bin/sh
  . "\$(dirname "\$0")/_/husky.sh"
  
  npx --no -- commitlint --edit "\${1}"
  `;
  
    const commitMsgFilename = '.husky/commit-msg';
    if (!tree.exists(commitMsgFilename)) {
        tree.create(commitMsgFilename, commitMsg);
        context.logger.info(`Added ${commitMsgFilename}`);
    
        exec(`chmod a+x ${commitMsgFilename}`);
        context.logger.info(`Made commit-msg hook executable`);
    } else {
        context.logger.info(`Found ${commitMsgFilename}, skip this step`);
    }
  
    return tree
  }
  
  export function addHuskyPrepareScript(tree: Tree, context: SchematicContext) {
    const pkgPath = 'package.json' 
    const buffer = tree.read(pkgPath)
  
    if (buffer === null) {
      throw new SchematicsException(`Cannot find ${pkgPath}`);
    }
    
    const packageJson = JSON.parse(buffer.toString());
    if (!packageJson.scripts.prepare) {
        exec('npx husky install');
        context.logger.info('Enable husky hooks');
    
        packageJson.scripts.prepare = 'husky install';
        tree.overwrite(pkgPath, JSON.stringify(packageJson, null, 2));
        context.logger.info('Added husky prepare script to package.json');
    
        exec('npm run prepare');
        context.logger.info('Executed npm run prepare');
    } else {
        context.logger.info('Found husky prepare script, skip this step');
    }
  
    return tree;
  }