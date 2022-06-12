import * as del from 'del'
;(async () => {
  const deletedFilePaths = await del(['./schematics/**/*.spec.{js,js.map,d.ts}'])
  console.log('Deleted files:\n', deletedFilePaths.join('\n'))
})()
