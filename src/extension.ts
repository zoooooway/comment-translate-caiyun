// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ITranslateRegistry } from 'comment-translate-manager';
import { CaiyunTranslate } from './caiyunTranslate';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	//Expose the plug-in
	return {
		extendTranslate: function (registry: ITranslateRegistry) {
			registry('caiyun', CaiyunTranslate);
		}
	};
}

// This method is called when your extension is deactivated
export function deactivate() { }
