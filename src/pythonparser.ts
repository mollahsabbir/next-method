import * as vscode from 'vscode';

export class PythonParser {

    private static findAllDefinitionsRange(document: vscode.TextDocument): vscode.Range[] {
        const methodPattern = /^[\t ]*def\s+(\w+)\s*\(/;
        const classPattern = /^[\t ]*class\s+(\w+)\s*:/;
        const mainPattern = /^[\t ]*if\s+(__name__\s*==\s*"__main__"):/;
        
        let patterns: RegExp[] = [methodPattern, classPattern, mainPattern];

        const allRanges: vscode.Range[] = [];
        
        for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
            const line = document.lineAt(lineIndex).text;
    
            let match: RegExpExecArray | null;
            
            patterns.forEach((pattern: RegExp) => {
                if ((match = pattern.exec(line))) {
                    const range = new vscode.Range(
                        new vscode.Position(lineIndex, PythonParser.secondGroupStartingIndex(match))
                        , new vscode.Position(lineIndex, PythonParser.secondGroupEndingIndex(match)));
                    allRanges.push(range);
                }
            });
        }
    
        return allRanges;
    }
    
    public static findNextDefinitionRange(document: vscode.TextDocument, currentPosition: vscode.Position): vscode.Range {
        const allRanges = PythonParser.findAllDefinitionsRange(document);
    
        for (const range of allRanges) {
            if (range.start.isAfter(currentPosition)) {
                return range;
            }
        }
    
        return new vscode.Range(currentPosition, currentPosition);
    }
    
    public static findPreviousDefinitionRange(document: vscode.TextDocument, currentPosition: vscode.Position): vscode.Range {
        const allRanges = PythonParser.findAllDefinitionsRange(document);
        let previousRange = null;
    
        for (const range of allRanges) {
            if (
                range.start.isBefore(currentPosition)
                && range.end.isBefore(currentPosition)
                && (previousRange === null || range.start.isAfter(previousRange.start))
            ) {
                previousRange = range;
            }
        }
    
        if (previousRange === null) {
            return new vscode.Range(currentPosition, currentPosition);
        }
    
        return previousRange;
    }

    private static secondGroupStartingIndex(match : RegExpExecArray): number {
        return match[0].indexOf(match[1]) + match.index;
    }

    private static secondGroupEndingIndex(match : RegExpExecArray): number {
        return PythonParser.secondGroupStartingIndex(match) + match[1].length;
    }
}