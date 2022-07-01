import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { husky, lintStaged } from '../constants'
import { Schema } from '../schema'
import { addDependencies } from './dependency.helper'
import { addHuskyPrepareScript, addPreCommitHook } from './husky.helper'

export function addLintStaged(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.isAddLintStaged) {
      addDependencies(tree, context, [lintStaged, husky])
      createLintStagedJson(tree, context, options)
      addHuskyPrepareScript(tree, context)
      addPreCommitHook(tree, context)
    }

    return tree
  }
}

function createLintStagedJson(tree: Tree, context: SchematicContext, options: Schema) {
  const eslintCommands: string[] = []
  if (options.isAddCspell) {
    eslintCommands.push('cspell .')
  }
  eslintCommands.push('eslint --fix --max-warnings 0')

  const content = {
    '*.ts': eslintCommands,
  }

  const configName = '.lintstagedrc.json'
  if (tree.exists(configName)) {
    const originalFilename = `${configName}.original`
    tree.rename(configName, originalFilename)
    context.logger.info(`Rename ${configName} to ${originalFilename}`)
  }

  tree.create(configName, JSON.stringify(content, null))
  context.logger.info(`Added ${configName}`)
}
