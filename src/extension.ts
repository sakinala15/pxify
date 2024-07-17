import { parse } from 'path';
import * as vscode from 'vscode';

// Default base font size
let baseFontSize: number = 16; let viewportheight = 1080; let viewportwidth = 1920;


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

function changeviewportheight_width() {
    vscode.window.showInputBox({
        prompt: 'Enter the new viewport height (in pixels)',
        value: viewportheight.toString(),
        validateInput: (value: string) => {
            const parsedValue = parseInt(value);
            if (isNaN(parsedValue) || parsedValue <= 0) {
                return 'Please enter a valid positive number.';
            }
            return null;
        }
    }).then((value: any) => {
        if (value) {
            viewportheight = (value);
            vscode.window.showInputBox({
                prompt: 'Enter the new viewport width (in pixels)',
                value: viewportwidth.toString(),
                validateInput: (value: string) => {
                    const parsedValue = parseInt(value);
                    if (isNaN(parsedValue) || parsedValue <= 0) {
                        return 'Please enter a valid positive number.';
                    }
                    return null;
                }
            }).then((value: any) => {
                viewportwidth = (value);
                vscode.window.showInformationMessage(`Viewport dimensions updated to ${viewportwidth}x${viewportheight} pixels.`);
            });
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

function convertPxToVh(text: any) {
    return text.replace(/(\d*\.?\d+)px/g, (match: any, pxValue: any) => {
        const vhValue = (parseFloat(pxValue) / viewportheight) * 100;
        return `${vhValue}vh`;
    });
   
}

function convertVhToPx(value: any): any {
    return value.replace(/(\d*\.?\d+)vh/g, (match: any, pxValue: any) => {
        const vhValue = (parseFloat(pxValue) * viewportheight)/100;
        return `${vhValue}px`;
    });
}

function convertPxToVw(value: any): any {
    return value.replace(/(\d*\.?\d+)px/g, (match: any, pxValue: any) => {
        const vhValue = (parseFloat(pxValue) / viewportwidth) * 100;
        return `${vhValue}vw`;
    });
}

function convertVwToPx(value: any): any {
    return value.replace(/(\d*\.?\d+)vw/g, (match: any, pxValue: any) => {
        const vhValue = (parseFloat(pxValue)) * viewportwidth/100;
        return `${vhValue}px`;
    });
}



function activate(context: vscode.ExtensionContext) {
    
    // let disposable = vscode.languages.registerCompletionItemProvider(
    //     { scheme: 'file', language: 'scss' }, // Adjust for SCSS/SASS if needed
    //     new MyCompletionProvider(),
    //     'px' // Trigger completion on typing 'px'
    // );
    // px to vw - vice versa
     let disposableVw = vscode.commands.registerCommand('extension.convertPxToVw', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
         // Check if the file is a CSS or SCSS file
         if (document.languageId !== 'css' && document.languageId !== 'scss' && document.languageId !== 'sass') {
            vscode.window.showErrorMessage('This command is only available for CSS and SCSS files.');
            return;
        }
        const selection = editor.selection;
        const text = document.getText(selection);
        let convertedText: any;
        if (text.indexOf('px') !== -1) {
            convertedText = convertPxToVw(text);
        } else if (text.indexOf('vw') !== -1) {
            convertedText = convertVwToPx(text);
        }
        
        editor.edit((editBuilder: any) => {
            editBuilder.replace(selection, convertedText);
        });
    });
// px to vh - vice versa
    let disposableVh = vscode.commands.registerCommand('extension.convertPxToVh', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
         // Check if the file is a CSS or SCSS file
         if (document.languageId !== 'css' && document.languageId !== 'scss' && document.languageId !== 'sass') {
            vscode.window.showErrorMessage('This command is only available for CSS and SCSS files.');
            return;
        }
        const selection = editor.selection;
        const text = document.getText(selection);
        let convertedText: any;
        if (text.indexOf('px') !== -1) {
            convertedText = convertPxToVh(text);
        } else if (text.indexOf('vh') !== -1) {
            convertedText = convertVhToPx(text);
        }
        
        editor.edit((editBuilder: any) => {
            editBuilder.replace(selection, convertedText);
        });
    });
    // px to rem - vice versa
    let disposableRem = vscode.commands.registerCommand('extension.convertPxToRem', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        // Check if the file is a CSS or SCSS file
        if (document.languageId !== 'css' && document.languageId !== 'scss' && document.languageId !== 'sass') {
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
    // px to em - vice versa
    let disposableEm = vscode.commands.registerCommand('extension.convertPxToEm', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
         // Check if the file is a CSS or SCSS file
         if (document.languageId !== 'css' && document.languageId !== 'scss' && document.languageId !== 'sass') {
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
    // px to vh - vice versa
   
    
    let disposableChangeFontSize = vscode.commands.registerCommand('extension.changeBaseFontSize', changeBaseFontSize);
    let disposableChangeviewportheight_width = vscode.commands.registerCommand('extension.changeviewportvh_vw', changeviewportheight_width);
   
    context.subscriptions.push(disposableVw,disposableVh,disposableRem, disposableEm,disposableChangeFontSize,disposableChangeviewportheight_width);
}
exports.activate = activate;
