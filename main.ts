import { Notice, Plugin, TFile } from 'obsidian';
import { ResultModal as CleanResultModal } from './ResultModal';
import { ReadwiseCleanerSettingTab } from './ReadwiseCleanerSettingTab';

interface ReadwiseCleanerSetting {
    readwiseSyncPath: string;
    readwiseOrganizedPath: string;
    cleanOption: string;
}

const DEFAULT_SETTINGS: ReadwiseCleanerSetting = {
    readwiseSyncPath: '',
    readwiseOrganizedPath: '',
    cleanOption: '.trash'
}

export default class ReadwiseCleaner extends Plugin {
    settings: ReadwiseCleanerSetting;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new ReadwiseCleanerSettingTab(this.app, this));

        this.addCommand({
            id: 'remove-duplicate-files',
            name: 'Remove Duplicate Articles',
            callback: async () => {
                let toCleanFiles = await this.removeDuplicateFiles();
                if (!toCleanFiles || toCleanFiles.length === 0) new Notice("There is no duplicate articles found")
                else
                    new CleanResultModal(this.app, toCleanFiles).open();

            }
        });

    }

    onunload() { }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async removeDuplicateFiles() {
        if (!this.settings.readwiseSyncPath || !this.settings.readwiseOrganizedPath || !this.settings.cleanOption) {
            console.error('Paths are not properly configured.');
            return;
        }


        const readwiseSyncFiles = await this.app.vault.getFiles().filter(file => {
            const isInSyncPath = file.path.startsWith(this.settings.readwiseSyncPath);
            const isInOrganizedPath = file.path.startsWith(`${this.settings.readwiseOrganizedPath}`);

            return isInSyncPath && !isInOrganizedPath;
        });

        const readwiseOrganizedFiles = await this.app.vault.getFiles().filter(file =>
            file.path.startsWith(this.settings.readwiseOrganizedPath)
        );

        const organizedFileName2File = readwiseOrganizedFiles.reduce<{ [key: string]: TFile }>((acc, file) => {
            acc[file.basename] = file;
            return acc;
        }, {});

        const toCleanFiles = readwiseSyncFiles.filter(file => {
            return organizedFileName2File[file.basename] != null;
        });

        toCleanFiles.forEach(file => {
            if (this.settings.cleanOption === '.trash') {
                this.app.vault.trash(file, false);
            } else if (this.settings.cleanOption === 'system-trash') {
                this.app.vault.trash(file, true);
            } else if (this.settings.cleanOption === 'permanent') {
                this.app.vault.delete(file);
            }
        });

        return toCleanFiles;
    }

}
