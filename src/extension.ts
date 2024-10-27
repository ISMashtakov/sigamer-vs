import * as vscode from 'vscode';
import { Preprocessor } from './preprocessor/preprocessor';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('sigame.compile', () => {
		const preprocessor = new Preprocessor();
		preprocessor.Preprocess();
		return true;
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
