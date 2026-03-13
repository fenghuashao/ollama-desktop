import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  ollama: {
    checkProcess: (): Promise<boolean> => electronAPI.ipcRenderer.invoke('ollama:check-process'),
    getVersion: (): Promise<string> => electronAPI.ipcRenderer.invoke('ollama:get-version'),
    startService: (): Promise<{ success: boolean; error?: string }> =>
      electronAPI.ipcRenderer.invoke('ollama:start-service'),
    stopService: (): Promise<{ success: boolean; error?: string }> =>
      electronAPI.ipcRenderer.invoke('ollama:stop-service')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
