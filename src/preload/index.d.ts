import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      ollama: {
        checkProcess: () => Promise<boolean>
        getVersion: () => Promise<string>
        startService: () => Promise<{ success: boolean; error?: string }>
        stopService: () => Promise<{ success: boolean; error?: string }>
      }
    }
  }
}
