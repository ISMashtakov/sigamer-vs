import {readFileSync, existsSync, writeFileSync, mkdir, rmSync} from 'fs';
import path from 'path';
import * as vscode from 'vscode';
import { BUILD_FOLDER, CONTENT_FILE, MAIN_FILE } from '../constants';

export class Preprocessor {

    includeRegex = new RegExp('###\\s*include\\s*"(?<path>[^"]+)"\\s*###');

    GetFileContent(file: string): string {
        const workspace = vscode.workspace.workspaceFolders;
        if (workspace) {
            const fullFile = path.join(workspace[0].uri.fsPath, file);
            if (existsSync(fullFile)){
                const content = readFileSync(fullFile,'utf8');
                return content;
            }
        }

        throw new Error(`File ${file} does not exist`);
    }

    ProcessIncludes(content: string, includedPaths: string[]): string {
        return content.replace(this.includeRegex, (_, includePath) => {
            if (includedPaths.includes(includePath)) {
                throw new Error(`Circular include detected: ${includedPaths} + ${path}`);
            }
            const includeContent = this.GetFileContent(includePath);

            return this.ProcessIncludes(includeContent, includedPaths.concat(includePath));
        });
    }

    CollectFiles(): string {
        var content = this.GetFileContent(MAIN_FILE);
        content = this.ProcessIncludes(content, [MAIN_FILE]);

        return content;
    }

    Preprocess(): void {
        const content = this.CollectFiles();
        
        const workspace = vscode.workspace.workspaceFolders;
        if (workspace) {
            const buildPath = path.join(workspace[0].uri.fsPath, BUILD_FOLDER);
            if (existsSync(buildPath)){
                rmSync(buildPath, { recursive: true });
            }
            mkdir(buildPath, () => {
                writeFileSync(path.join(buildPath, CONTENT_FILE), content, {flush: true});
            });
        }

    }

}