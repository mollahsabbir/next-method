import * as vscode from 'vscode';
import { Command } from './constants';
import { PythonParser } from './pythonparser'


function moveCursorTo(editor: vscode.TextEditor, range: vscode.Range): void {
    editor.selection = new vscode.Selection(range.start, range.end);
    editor.revealRange(range);
}

function registerCommandWithRanges(
    commandName: string,
    rangeProvider: (document: vscode.TextDocument, startPosition: vscode.Position) => vscode.Range
): vscode.Disposable {
    return vscode.commands.registerCommand(commandName, () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'python') {
            const document = editor.document;
            const currentPosition = editor.selection.active;
            const range = rangeProvider(document, currentPosition);
            moveCursorTo(editor, range);
        }
    });
}

export function activate(context: vscode.ExtensionContext) {

	const disposable1 = registerCommandWithRanges(Command.NEXT_DEFINITION, PythonParser.findNextDefinitionRange);
    const disposable2 = registerCommandWithRanges(Command.PREVIOUS_DEFINITION, PythonParser.findPreviousDefinitionRange);

    context.subscriptions.push(disposable1, disposable2);
}

export function deactivate() {}
