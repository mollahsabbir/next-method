import * as assert from 'assert';

import * as vscode from 'vscode';
import { PythonParser } from '../../pythonparser'

suite('PythonParser Test Suite', () => {
	vscode.window.showInformationMessage('Start PythonParser tests.');
	
	test('findNextDefinitionRange should return correct range when not inside a match', () => {
		const document = createMockTextDocument([
			'def function1():',
			'    pass',
			'def function2():',
			'    pass'
		]);

		const currentPosition = new vscode.Position(2, 0);
		const resultRange = PythonParser.findNextDefinitionRange(document, currentPosition);

		assert.strictEqual(resultRange.start.line, 2);
		assert.strictEqual(resultRange.end.line, 2);
		assert.strictEqual(resultRange.start.character, 4);
		assert.strictEqual(resultRange.end.character, 13);
	});

	test('findPreviousDefinitionRange should return correct range when not inside a match', () => {
		const document = createMockTextDocument([
			'def function1():',
			'    pass',
			'def function2():',
			'    pass'
		]);

		const currentPosition = new vscode.Position(3, 0);
		const resultRange = PythonParser.findPreviousDefinitionRange(document, currentPosition);

		assert.strictEqual(resultRange.start.line, 2);
		assert.strictEqual(resultRange.end.line, 2);
		assert.strictEqual(resultRange.start.character, 4);
		assert.strictEqual(resultRange.end.character, 13);
	});

	test('findNextDefinitionRange should return correct range for methods when inside a match', () => {
		const document = createMockTextDocument([
			'def method1():',
			'    pass',
			'def method2():',
			'    pass'
		]);

		const currentPosition = new vscode.Position(0, 7);
		const resultRange = PythonParser.findNextDefinitionRange(document, currentPosition);

		assert.strictEqual(resultRange.start.line, 2);
		assert.strictEqual(resultRange.end.line, 2);
		assert.strictEqual(resultRange.start.character, 4);
		assert.strictEqual(resultRange.end.character, 11);
	});

	test('findPreviousDefinitionRange should return correct range for methods when inside a match', () => {
		const document = createMockTextDocument([
			'def method1():',
			'    pass',
			'def method2():',
			'    pass'
		]);

		const currentPosition = new vscode.Position(2, 7);
		const resultRange = PythonParser.findPreviousDefinitionRange(document, currentPosition);

		assert.strictEqual(resultRange.start.line, 0);
		assert.strictEqual(resultRange.end.line, 0);
		assert.strictEqual(resultRange.start.character, 4);
		assert.strictEqual(resultRange.end.character, 11);
	});

	test('findNextDefinitionRange should return correct range for class names', () => {
		const document = createMockTextDocument([
			'class MyClass:',
			'    pass',
			'class AnotherClass:',
			'    pass'
		]);

		const currentPosition = new vscode.Position(2, 0);
		const resultRange = PythonParser.findNextDefinitionRange(document, currentPosition);

		assert.strictEqual(resultRange.start.line, 2);
		assert.strictEqual(resultRange.end.line, 2);
		assert.strictEqual(resultRange.start.character, 6);
		assert.strictEqual(resultRange.end.character, 18);
	});

	test('findPreviousDefinitionRange should return correct range for class names', () => {
		const document = createMockTextDocument([
			'class MyClass:',
			'    pass',
			'class AnotherClass:',
			'    pass'
		]);

		const currentPosition = new vscode.Position(2, 0);
		const resultRange = PythonParser.findPreviousDefinitionRange(document, currentPosition);

		assert.strictEqual(resultRange.start.line, 0);
		assert.strictEqual(resultRange.end.line, 0);
		assert.strictEqual(resultRange.start.character, 6);
		assert.strictEqual(resultRange.end.character, 13);
	});

	test('findNextDefinitionRange should return correct range for main statements', () => {
		const pythonParser = new PythonParser();
		const document = createMockTextDocument([
			'if __name__ == "__main__":',
			'    pass',
			'if __name__ == "__start__":',
			'    pass',
			'if __name__ == "__main__":',
			'    pass'
		]);

		const currentPosition = new vscode.Position(2, 0);
		const resultRange = PythonParser.findNextDefinitionRange(document, currentPosition);

		assert.strictEqual(resultRange.start.line, 4);
		assert.strictEqual(resultRange.end.line, 4);
		assert.strictEqual(resultRange.start.character, 3);
		assert.strictEqual(resultRange.end.character, 25);
	});

	test('findPreviousDefinitionRange should return correct range for main statements', () => {
		const pythonParser = new PythonParser();
		const document = createMockTextDocument([
			'if __name__ == "__main__":',
			'    pass',
			'if __name__ == "__start__":',
			'    pass',
			'if __name__ == "__main__":',
			'    pass'
		]);

		const currentPosition = new vscode.Position(2, 0);
		const resultRange = PythonParser.findPreviousDefinitionRange(document, currentPosition);

		assert.strictEqual(resultRange.start.line, 0);
		assert.strictEqual(resultRange.end.line, 0);
		assert.strictEqual(resultRange.start.character, 3);
		assert.strictEqual(resultRange.end.character, 25);
	});

	test('findNextDefinitionRange should return correct range for class methods', () => {
		const document = createMockTextDocument([
			'class MyClass:',
			'    pass',
			'    def my_function():',
			'    	pass',
			'if __name__ == "__main__":',
			'    pass'
		]);

		const currentPosition = new vscode.Position(1, 0);
		const resultRange = PythonParser.findNextDefinitionRange(document, currentPosition);

		assert.strictEqual(resultRange.start.line, 2);
		assert.strictEqual(resultRange.end.line, 2);
		assert.strictEqual(resultRange.start.character, 8);
		assert.strictEqual(resultRange.end.character, 19);
	});
});

function createMockTextDocument(lines: string[]): vscode.TextDocument {
	const content = lines.join('\n');
	return {
		lineAt: (lineIndex: number) => ({ text: lines[lineIndex], lineNumber: lineIndex }),
		lineCount: lines.length,
		getText: () => content
	} as vscode.TextDocument;
}