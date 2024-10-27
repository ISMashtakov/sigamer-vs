import assert from 'assert';
import path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { assertBuild, prepareWorkspace, WORKSPACES_DIR } from './helpers';
import settings from './settings';


const TEST_FOLDER = 'compile';

suite('Test compile', () => {
	const rootPath = path.join(WORKSPACES_DIR, TEST_FOLDER);

	fs.readdirSync(rootPath).forEach((file) => {
		if (!file.match(settings.testPattern)) {
			return;
		}

		test(file, async () => {
			prepareWorkspace(TEST_FOLDER, file);

			let success = await vscode.commands.executeCommand('sigame.compile');
			await new Promise(resolve => setTimeout(resolve, 1000));

			assert.ok(success);

			assertBuild();
		});
	});	
});
