import { Tree, SchematicContext, SchematicsException } from "@angular-devkit/schematics";
import { NodePackageInstallTask, RunSchematicTask } from "@angular-devkit/schematics/tasks";
import { HuskySchema } from "../../husky-tasks/husky-schema"

export function addCommitMessageHook(tree: Tree, context: SchematicContext) {
    const commitMsg = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "\${1}"
  `;
  
    const commitMsgFilePath = '.husky/commit-msg';
    if (!tree.exists(commitMsgFilePath)) {
      tree.create(commitMsgFilePath, commitMsg);
      context.logger.info(`Added ${commitMsgFilePath}`);    
      const copiedOptions: HuskySchema = { 
        commitMsgFilePath,
      }
      context.addTask(new RunSchematicTask('commit-msg-hook', copiedOptions));
    } else {
        context.logger.info(`Found ${commitMsgFilePath}, skip this step`);
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
      const installTaskId = context.addTask(new NodePackageInstallTask());
      const copiedOptions: HuskySchema = { 
        enableGitHooksScript: 'npm run prepare',
      }
      context.addTask(new RunSchematicTask('husky-prepare', copiedOptions), [installTaskId]);
    } else {
      context.logger.info('Found husky prepare script, skip this step');
    }
  
    return tree;
  }