import * as del from 'del'

(async () => {
	const deletedFilePaths = await del(['./schematics/**/*.js', './schematics/**/*.js.map', './schematics/**/*.d.ts']);
	console.log('Deleted files:\n', deletedFilePaths.join('\n'));
})();