import { strings } from '@angular-devkit/core'
import { apply, mergeWith, Rule, SchematicContext, SchematicsException, template, Tree, url } from '@angular-devkit/schematics'
import { cspell } from '../constants'
import { Schema } from '../schema'
import { addDependencies } from './dependency.helper'

export function addCspell(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.isAddCspell) {
      addDependencies(tree, context, [cspell])
      addNpmScript(tree, context)

      const sourceTemplates = url('../files/cspell')
      const sourceParametrizedTemplates = apply(sourceTemplates, [template({ ...options, ...strings })])
      return mergeWith(sourceParametrizedTemplates)
    }

    return tree
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
