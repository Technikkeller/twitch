import fs from 'fs';
import { join } from 'path';

const testFolders = ['test', 'tests', '__test__', '__tests__'];

const testFoldersInPackages = fs
	.readdirSync(join(__dirname, 'packages'))
	.filter(
		file =>
			fs.lstatSync(join(__dirname, 'packages', file)).isDirectory() &&
			fs
				.readdirSync(join(__dirname, 'packages', file))
				.some(
					subfile =>
						testFolders.includes(subfile) &&
						fs.lstatSync(join(__dirname, 'packages', file, subfile)).isDirectory()
				)
	)
	.map(dir =>
		join(
			__dirname,
			'packages',
			dir,
			fs.readdirSync(join(__dirname, 'packages', dir)).find(folder => testFolders.includes(folder))
		)
	);

module.exports = {
	roots: [...testFoldersInPackages],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
