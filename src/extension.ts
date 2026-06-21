import * as vscode from "vscode";
import { decrypt, encrypt } from "./crypto";

function getWholeDocumentRange(document: vscode.TextDocument): vscode.Range {
  const lastLine = Math.max(document.lineCount - 1, 0);
  const lastCharacter = document.lineAt(lastLine).text.length;
  return new vscode.Range(0, 0, lastLine, lastCharacter);
}

async function promptForPassword(prompt: string): Promise<string | undefined> {
  return vscode.window.showInputBox({
    password: true,
    prompt,
  });
}

async function promptForConfirmedPassword(): Promise<string | undefined> {
  const firstPassword = await promptForPassword("Type your password");
  if (firstPassword === undefined) {
    return undefined;
  }

  const secondPassword = await promptForPassword("Confirm password");
  if (secondPassword === undefined || firstPassword !== secondPassword) {
    return undefined;
  }

  return firstPassword;
}

async function replaceText(
  editor: vscode.TextEditor,
  range: vscode.Range | vscode.Selection,
  nextText: string,
): Promise<void> {
  await editor.edit((editBuilder) => {
    editBuilder.replace(range, nextText);
  });
}

async function encryptFile(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const password = await promptForConfirmedPassword();
  if (password === undefined) {
    return;
  }

  const range = getWholeDocumentRange(editor.document);
  const text = editor.document.getText();
  await replaceText(editor, range, encrypt(text, password));
}

async function decryptFile(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const password = await promptForPassword("Type your password");
  if (password === undefined) {
    return;
  }

  try {
    const range = getWholeDocumentRange(editor.document);
    const encryptedText = editor.document.getText();
    await replaceText(editor, range, decrypt(encryptedText, password));
  } catch (error) {
    vscode.window.showErrorMessage(getDecryptErrorMessage(error));
  }
}

function getDecryptErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.startsWith("Invalid encrypted payload")) {
    return error.message;
  }

  return "Unable to decrypt. Check the password and encrypted text.";
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("cryptkit.encryptFile", encryptFile),
    vscode.commands.registerCommand("cryptkit.decryptFile", decryptFile),
  );
}

export function deactivate(): void {}
