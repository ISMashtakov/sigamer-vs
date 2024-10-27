import path from "path";
import * as fs from 'fs';
import { BUILD_FOLDER, CONTENT_FILE, EXPECT_FILE } from "../constants";
import assert from 'assert';

export const WORKSPACES_DIR = path.join('..', '..', 'src', 'test', 'workspaces');
export const RUNNER_WORKSPACE_DIR = path.join('..', '..', 'src', 'test', 'workspace_test_runner');

export function prepareWorkspace(testFolder: string, file: string) {
	const fullFile = path.join(WORKSPACES_DIR, testFolder, file);

	// // Clean folder
	fs.readdirSync(RUNNER_WORKSPACE_DIR).forEach((file) => {
		for(var i = 0; i < 5; i++){
			try{
				fs.rmSync(path.join(RUNNER_WORKSPACE_DIR, file), { recursive: true, force: true });
			}
			catch(e){
                console.log(e);
                continue;
            }
			break;
		}
	});	

	if (fs.lstatSync(fullFile).isDirectory()){
		fs.cpSync(fullFile, RUNNER_WORKSPACE_DIR, {recursive: true});
	} else {
		console.warn(fullFile + ' is not a directory');
	}
}

export function assertBuild() {
	compareExpect();
}

function compareExpect() {
    const expectPath = path.join(RUNNER_WORKSPACE_DIR, EXPECT_FILE);
    const contentPath = path.join(RUNNER_WORKSPACE_DIR, BUILD_FOLDER, CONTENT_FILE);
	console.log(contentPath);
    if (fs.existsSync(expectPath)){
        assert.ok(fs.existsSync(contentPath), "Content file not exists");

		const expectContent = fs.readFileSync(expectPath,'utf8');
		const content = fs.readFileSync(contentPath,'utf8');
        assert.equal(content, expectContent, "Content not equal expected"); 
	}
}