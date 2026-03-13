import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '../types';

interface SettingsState extends AppSettings {
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  ollamaHost: 'http://127.0.0.1:11434',
  theme: 'system',
  fontSize: 'medium',
  autoCheckUpdates: true,
  showTimestamp: true,
  compatibilityCheckInterval: 60,
  proxyMode: 'direct'
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      updateSettings: (newSettings) => {
        set((state) => {
          const updated = { ...state, ...newSettings };
          // If proxy mode changed, notify main process
          if (newSettings.proxyMode && newSettings.proxyMode !== state.proxyMode) {
            // @ts-ignore
            window.electron?.ipcRenderer.invoke('set-proxy-mode', newSettings.proxyMode);
          }
          return updated;
        });
      },
      resetSettings: () => {
        set(DEFAULT_SETTINGS);
        // @ts-ignore
        window.electron?.ipcRenderer.invoke('set-proxy-mode', DEFAULT_SETTINGS.proxyMode);
      },
    }),
    {
      name: 'app-settings',
      onRehydrateStorage: () => (state) => {
        // Sync proxy settings on app start
        if (state) {
          // @ts-ignore
          window.electron?.ipcRenderer.invoke('set-proxy-mode', state.proxyMode);
        }
      }
    }
  )
);
