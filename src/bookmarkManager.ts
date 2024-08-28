import * as vscode from 'vscode';

export class BookmarkItem {
    constructor(
        public readonly uri: vscode.Uri,
        public readonly type: vscode.FileType
    ) {}
}

class BookmarkManager {
    private bookmarks: BookmarkItem[] = [];

    addBookmark(uri: vscode.Uri, type: vscode.FileType) {
        const existingBookmark = this.bookmarks.find(b => b.uri.fsPath === uri.fsPath);
        if (!existingBookmark) {
            this.bookmarks.push(new BookmarkItem(uri, type));
        }
    }

    removeBookmark(uri: vscode.Uri) {
        this.bookmarks = this.bookmarks.filter(b => b.uri.fsPath !== uri.fsPath);
    }

    getBookmarks(): BookmarkItem[] {
        return this.bookmarks;
    }
}

export const bookmarkManager = new BookmarkManager();