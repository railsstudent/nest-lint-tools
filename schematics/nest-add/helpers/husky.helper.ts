import { Tree, SchematicContext, SchematicsException } from "@angular-devkit/schematics";

export function addCommitMessageHook(tree: Tree, context: SchematicContext) {
    const commitMsg = `#!/bin/sh
. "\$(dirname "\$0")/_/husky.sh"

npx --no -- commitlint --edit "\${1}"
  `;
  
    const commitMsgFilename = '.husky/commit-msg';
    if (!tree.exists(commitMsgFilename)) {
        tree.create(commitMsgFilename, commitMsg);
        context.logger.info(`Added ${commitMsgFilename}`);    
        context.logger.info(`
        Please run the following command to make ${commitMsgFilename} executable:
          chmod a+x ${commitMsgFilename}
        `);

    } else {
        context.logger.info(`Found ${commitMsgFilename}, skip this step`);
    }
  
    return tree
  }

  export function addPreCommitHook(tree: Tree, context: SchematicContext) {
    const preCommit = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
    
npx --no-install lint-staged    
  `;
  
    const preCommitFilename = '.husky/pre-commit';
    if (!tree.exists(preCommitFilename)) {
      tree.create(preCommitFilename, preCommit);
      context.logger.info(`Added ${preCommitFilename}`);    
      context.logger.info(`
      Please run the following command to make ${preCommitFilename} executable:
        chmod a+x ${preCommitFilename}
      `);
    } else {
        context.logger.info(`Found ${preCommitFilename}, skip this step`);
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
      packageJson.scripts.prepare = 'husky install';
      tree.overwrite(pkgPath, JSON.stringify(packageJson, null, 2));
      context.logger.info('Added husky prepare script to package.json');
  
      context.logger.info(`
      Please run the following command to enable git hooks:
        npm run prepare
      `);
    } else {
      context.logger.info('Found husky prepare script, skip this step');
    }
  
    return tree;
  }