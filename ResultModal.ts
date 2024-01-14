import { App, Modal, TFile } from 'obsidian';

export class ResultModal extends Modal {
    constructor(app: App, filesToDelete: TFile[]) {
        super(app);
        this.filesToDelete = filesToDelete; // This should be an array of files you want to delete
    }
    filesToDelete: TFile[];
    onOpen() {
        const { contentEl } = this;
        contentEl.setText('Start cleaning...\n');

        this.filesToDelete.forEach(file => {
            contentEl.createEl('div', { text: `To Clean：${file.path}` });
        });


        contentEl.createEl('div', { text: `Done, ${this.filesToDelete.length} files cleaned` });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}