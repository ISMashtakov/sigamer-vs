import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	workspaceFolder: "src/test/workspace_test_runner",
	mocha: {
		timeout: 5000,
		parallel: false,
	  },
});
