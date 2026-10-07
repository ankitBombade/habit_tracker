const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),
  getAppDataPath: () => ipcRenderer.invoke('get-app-data-path'),
  saveFileDialog: (options) => ipcRenderer.invoke('save-file-dialog', options),
  readFileDialog: (options) => ipcRenderer.invoke('read-file-dialog', options),
  isElectron: true,
});
