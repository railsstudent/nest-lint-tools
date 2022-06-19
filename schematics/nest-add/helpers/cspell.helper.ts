import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics'
import { cspell, CSPELL_CONFIG } from '../constants'
import { Schema } from '../schema'
import { addDependencies } from './dependency.helper'

export function addCspell(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.isAddCspell) {
      addDependencies(tree, context, [cspell])
      createCspellJson(tree, context)
      addNpmScript(tree, context)
    }

    return tree
  }
}

function createCspellJson(tree: Tree, context: SchematicContext) {
  const configName = 'cspell.json'
  if (!tree.exists(configName)) {
    tree.create(configName, JSON.stringify(CSPELL_CONFIG, null, 2))
    context.logger.info(`Added ${configName}`)
  } else {
    context.logger.info(`Found ${configName}, skip this step`)
  }
}

function addNpmScript(tree: Tree, context: SchematicContext) {
  const pkgPath = 'package.json'
  const buffer = tree.read(pkgPath)

  if (buffer === null) {
    throw new SchematicsException(`Cannot find ${pkgPath}`)
  }

  const packageJson = JSON.parse(buffer.toString())
  if (!packageJson.scripts.cspell) {
    packageJson.scripts.cspell = 'cspell --no-must-find-files src/**/*.{ts,js}'
    tree.overwrite(pkgPath, JSON.stringify(packageJson, null, 2))
    context.logger.info('Added cspell script to package.json')
  } else {
    context.logger.info('Found cspell script, skip this step')
  }
}
