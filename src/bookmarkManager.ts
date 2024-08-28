import * as vscode from 'vscode';

export class BookmarkItem {
    constructor(
        public readonly uri: vscode.Uri,
        public readonly type: vscode.FileType
    ) {}
}

class BookmarkManager {
    private bookmarks: BookmarkItem[] = [];
    private context: vscode.ExtensionContext | undefined;

    setContext(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadBookmarks();
    }

    private saveBookmarks() {
        if (this.context) {
            const serializedBookmarks = this.bookmarks.map(bookmark => ({
                uri: bookmark.uri.toString(),
                type: bookmark.type
            }));
            this.context.globalState.update('bookmarks', serializedBookmarks);
        }
    }

    private loadBookmarks() {
        if (this.context) {
            const serializedBookmarks = this.context.globalState.get<Array<{uri: string, type: vscode.FileType}>>('bookmarks', []);
            this.bookmarks = serializedBookmarks.map(item => new BookmarkItem(vscode.Uri.parse(item.uri), item.type));
        }
    }

    addBookmark(uri: vscode.Uri, type: vscode.FileType) {
        const existingBookmark = this.bookmarks.find(b => b.uri.fsPath === uri.fsPath);
        if (!existingBookmark) {
            this.bookmarks.push(new BookmarkItem(uri, type));
            this.saveBookmarks();
        }
    }

    removeBookmark(uri: vscode.Uri) {
        this.bookmarks = this.bookmarks.filter(b => b.uri.fsPath !== uri.fsPath);
        this.saveBookmarks();
    }

    getBookmarks(): BookmarkItem[] {
        return this.bookmarks;
    }
}

export const bookmarkManager = new BookmarkManager();