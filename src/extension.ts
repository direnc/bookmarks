import * as vscode from 'vscode';
import { BookmarkItem, bookmarkManager } from './bookmarkManager';
import { BookmarksTreeDataProvider } from './bookmarksTreeDataProvider';

export function activate(context: vscode.ExtensionContext) {
    
    bookmarkManager.setContext(context);
    
    const treeDataProvider = new BookmarksTreeDataProvider();
    vscode.window.registerTreeDataProvider('bookmarksExplorer', treeDataProvider);

    let disposable = vscode.commands.registerCommand('bookmarks.addToBookmarks', async (uri?: vscode.Uri) => {
        if (!uri) {
            const result = await vscode.window.showOpenDialog({ canSelectFiles: true, canSelectFolders: true });
            if (!result || result.length === 0) {
                return;
            }
            uri = result[0];
        }

        const stat = await vscode.workspace.fs.stat(uri);
        bookmarkManager.addBookmark(uri, stat.type);
        vscode.window.showInformationMessage(`Added ${uri.fsPath} to bookmarks`);
        treeDataProvider.refresh();
    });

    context.subscriptions.push(disposable);

    context.subscriptions.push(vscode.commands.registerCommand('bookmarks.openBookmark', (item: BookmarkItem) => {
        if (item.type === vscode.FileType.Directory) {
            vscode.commands.executeCommand('revealInExplorer', item.uri);
        } else {
            vscode.workspace.openTextDocument(item.uri).then(doc => {
                vscode.window.showTextDocument(doc);
            });
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('bookmarks.removeBookmark', (item: BookmarkItem) => {
        bookmarkManager.removeBookmark(item.uri);
        treeDataProvider.refresh();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('bookmarks.refresh', () => {
        treeDataProvider.refresh();
    }));
}

export function deactivate() {}