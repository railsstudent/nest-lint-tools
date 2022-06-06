import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { exec } from 'child_process';
import { HuskySchema } from './husky-schema';

export function enableGitHooks(options: HuskySchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.enableGitHooksScript) {
      exec(options.enableGitHooksScript);
      context.logger.info(`Executed ${options.enableGitHooksScript} to enable git hooks`);
    }
    return tree;
  };
}

export function commitMsgExecutable(options: HuskySchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.commitMsgFilePath) {
      exec(`chmod a+x ${options.commitMsgFilePath}`);
      context.logger.info(`Made ${options.commitMsgFilePath} executable`);
    }

    return tree;
  };
}
