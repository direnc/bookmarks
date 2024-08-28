import * as vscode from 'vscode';
import * as path from 'path';
import { BookmarkItem, bookmarkManager } from './bookmarkManager';

export class BookmarksTreeDataProvider implements vscode.TreeDataProvider<BookmarkItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<BookmarkItem | undefined | null | void> = new vscode.EventEmitter<BookmarkItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<BookmarkItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: BookmarkItem): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element.uri);
        treeItem.label = path.basename(element.uri.fsPath);
        treeItem.contextValue = element.type === vscode.FileType.Directory ? 'bookmarkFolder' : 'bookmarkFile';
        treeItem.command = {
            command: 'bookmarks.openBookmark',
            title: 'Open Bookmark',
            arguments: [element]
        };
        treeItem.iconPath = element.type === vscode.FileType.Directory 
            ? new vscode.ThemeIcon('folder') 
            : new vscode.ThemeIcon('file');
        return treeItem;
    }

    getChildren(element?: BookmarkItem): Thenable<BookmarkItem[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            return Promise.resolve(bookmarkManager.getBookmarks());
        }
    }
}