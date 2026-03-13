import { create } from 'zustand';
import { SystemStatus } from '../types';
import { ollamaAPI } from '../api/ollama';

interface StatusState {
  status: SystemStatus;
  isProcessRunning: boolean;
  checkStatus: () => Promise<void>;
  startService: () => Promise<{ success: boolean; error?: string }>;
  stopService: () => Promise<{ success: boolean; error?: string }>;
}

const INITIAL_STATUS: SystemStatus = {
  isRunning: false,
  version: 'unknown',
  memoryUsage: 0,
  cpuUsage: 0,
  lastChecked: 0,
  compatibility: 'incompatible',
  supportedFeatures: []
};

export const useStatusStore = create<StatusState>((set, get) => ({
  status: INITIAL_STATUS,
  isProcessRunning: false,
  checkStatus: async () => {
    let status = await ollamaAPI.checkSystemStatus();
    // @ts-ignore
    const isProcessRunning = await window.api.ollama.checkProcess();
    
    // If API is down but we want to show version info if available
    if (!status.isRunning && status.version === 'unknown') {
      try {
        // @ts-ignore
        const cliVersion = await window.api.ollama.getVersion();
        if (cliVersion && cliVersion !== 'unknown') {
          status = {
            ...status,
            version: cliVersion,
            compatibility: ollamaAPI.checkCompatibility(cliVersion),
            supportedFeatures: ollamaAPI.getSupportedFeatures(cliVersion)
          };
        }
      } catch (e) {
        // Ignore error
      }
    }

    set({ status, isProcessRunning });
  },
  startService: async () => {
    // @ts-ignore
    const result = await window.api.ollama.startService();
    if (result.success) {
      set({ isProcessRunning: true });
      // Poll for API availability
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        const status = await ollamaAPI.checkSystemStatus();
        if (status.isRunning || attempts > 10) {
          clearInterval(poll);
          set({ status });
        }
      }, 1000);
    }
    return result;
  },
  stopService: async () => {
    // @ts-ignore
    const result = await window.api.ollama.stopService();
    if (result.success) {
      set((state) => ({ 
        isProcessRunning: false, 
        status: { ...state.status, isRunning: false } 
      }));
    }
    return result;
  }
}));
