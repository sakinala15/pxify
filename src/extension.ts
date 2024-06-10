const vscode = require('vscode');

// Default base font size
let baseFontSize: number = 16;

function changeBaseFontSize() {
    vscode.window.showInputBox({
        prompt: 'Enter the new base font size (in pixels)',
        value: baseFontSize.toString(),
        validateInput: (value: string) => {
            const parsedValue = parseInt(value);
            if (isNaN(parsedValue) || parsedValue <= 0) {
                return 'Please enter a valid positive number.';
            }
            return null;
        }
    }).then((value: any) => {
        if (value) {
            baseFontSize = parseInt(value);
            vscode.window.showInformationMessage(`Base font size changed to ${baseFontSize}px.`);
        }
    });
}

function convertPxToRem(text: any) {
    return text.replace(/(\d*\.?\d+)px/g, (match: any, pxValue: any) => {
        const remValue = parseFloat(pxValue) / baseFontSize; // Assuming base font size is 16px
        return `${remValue}rem`;
    });
}

function convertPxToEm(text: any) {
    // Conversion logic for px to em
    return text.replace(/(\d*\.?\d+)px/g, (match: any, pxValue: any) => {
        const emValue = parseFloat(pxValue) / baseFontSize; // Assuming base font size is 16px
        return `${emValue}em`;
    });
}

function convertRemToPx(remValue: any): any {
    return remValue.replace(/(\d+(\.\d+)?)rem/g, (match: any, pxValue: any) => {
        const remValue = parseFloat(pxValue) * baseFontSize; // Assuming base font size is 16px
        return `${remValue}px`;
    });
}

function convertEmToPx(emValue: any): any {
    return emValue.replace(/(\d+(\.\d+)?)em/g, (match: any, pxValue: any) => {
        const remValue = parseFloat(pxValue) * baseFontSize; // Assuming base font size is 16px
        return `${remValue}px`;
    });
}

function activate(context: any) {
    let disposableRem = vscode.commands.registerCommand('extension.convertPxToRem', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        // Check if the file is a CSS or SCSS file
        if (document.languageId !== 'css' && document.languageId !== 'scss') {
            vscode.window.showErrorMessage('This command is only available for CSS and SCSS files.');
            return;
        } 
        const selection = editor.selection;
        const text = document.getText(selection);  
        let convertedText: any;
        if (text.indexOf('px') !== -1) {
            convertedText = convertPxToRem(text);
        } else if (text.indexOf('rem') !== -1) {
            convertedText = convertRemToPx(text);
        }
        editor.edit((editBuilder: any) => {
            editBuilder.replace(selection, convertedText);
        });
    });

    // px To em
    let disposableEm = vscode.commands.registerCommand('extension.convertPxToEm', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
         // Check if the file is a CSS or SCSS file
         if (document.languageId !== 'css' && document.languageId !== 'scss') {
            vscode.window.showErrorMessage('This command is only available for CSS and SCSS files.');
            return;
        }
        const selection = editor.selection;
        const text = document.getText(selection);
        let convertedText: any;
        if (text.indexOf('px') !== -1) {
            convertedText = convertPxToEm(text);
        } else if (text.indexOf('em') !== -1) {
            convertedText = convertEmToPx(text);
        }
        
        editor.edit((editBuilder: any) => {
            editBuilder.replace(selection, convertedText);
        });
    });
    let disposableChangeFontSize = vscode.commands.registerCommand('extension.changeBaseFontSize', changeBaseFontSize);
   
    context.subscriptions.push(disposableRem, disposableEm, disposableChangeFontSize,vscode.languages.registerCompletionItemProvider('scss', {
        
        provideCompletionItems(document: any, position: any) {
          const linePrefix = document.lineAt(position).text.substr(0, position.character + 1);
          if (linePrefix.endsWith('px')) {
            const suggestion = new vscode.CompletionItem('Convert px to REM', vscode.CompletionItemKind.Method);
            // Insert snippet for flexibility and user customization
            suggestion.insertText = new vscode.SnippetString('convertPxToRem($SELECTED_TEXT)'); // Placeholder for px value
            suggestion.sortText = vscode.CompletionItemKind.Method;
            return [suggestion];
          }
          return [];
        }
      }));
}
exports.activate = activate;
