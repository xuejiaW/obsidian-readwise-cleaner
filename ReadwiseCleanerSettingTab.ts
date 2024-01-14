import { App, PluginSettingTab, Setting } from 'obsidian';
import ReadwiseCleaner from './main';

export class ReadwiseCleanerSettingTab extends PluginSettingTab {
    plugin: ReadwiseCleaner;

    constructor(app: App, plugin: ReadwiseCleaner) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Readwise Cleaner Settings' });

        new Setting(containerEl)
            .setName('Readwise Sync Path')
            .setDesc('The path where Readwise syncs to')
            .addText(text => text
                .setValue(this.plugin.settings.readwiseSyncPath)
                .onChange(async (value) => {
                    this.plugin.settings.readwiseSyncPath = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Readwise Organized Path')
            .setDesc('The path where organized Readwise articles saved')
            .addText(text => text
                .setValue(this.plugin.settings.readwiseOrganizedPath)
                .onChange(async (value) => {
                    this.plugin.settings.readwiseOrganizedPath = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Deleted Image Destination')
            .setDesc('Select where you want images to be moved once they are deleted')
            .addDropdown((dropdown) => {
                dropdown.addOption('permanent', 'Delete Permanently');
                dropdown.addOption('.trash', 'Move to Obsidian Trash');
                dropdown.addOption('system-trash', 'Move to System Trash');
                dropdown.setValue(this.plugin.settings.cleanOption);
                dropdown.onChange((option) => {
                    this.plugin.settings.cleanOption = option;
                    this.plugin.saveSettings();
                });
            });

    }
}