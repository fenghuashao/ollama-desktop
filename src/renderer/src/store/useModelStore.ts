import { create } from 'zustand';
import { OllamaModel } from '../types';
import { ollamaAPI } from '../api/ollama';

interface ModelState {
  models: OllamaModel[];
  runningModels: string[]; // List of running model names
  isLoading: boolean;
  error: string | null;
  fetchModels: () => Promise<void>;
  fetchRunningModels: () => Promise<void>;
  deleteModel: (name: string) => Promise<void>;
  copyModel: (source: string, destination: string) => Promise<void>;
  startModel: (name: string) => Promise<void>;
  stopModel: (name: string) => Promise<void>;
}

export const useModelStore = create<ModelState>((set, get) => ({
  models: [],
  runningModels: [],
  isLoading: false,
  error: null,

  fetchModels: async () => {
    set({ isLoading: true, error: null });
    try {
      const models = await ollamaAPI.getModels();
      // Also fetch running models to update status
      const runningData = await ollamaAPI.listRunningModels();
      const runningModels = runningData.models ? runningData.models.map((m: any) => m.name || m.model) : [];
      set({ models, runningModels, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch models', isLoading: false });
    }
  },

  fetchRunningModels: async () => {
    try {
      const runningData = await ollamaAPI.listRunningModels();
      const runningModels = runningData.models ? runningData.models.map((m: any) => m.name || m.model) : [];
      set({ runningModels });
    } catch (error) {
      console.warn('Failed to fetch running models', error);
    }
  },

  deleteModel: async (name: string) => {
    set({ isLoading: true });
    try {
      await ollamaAPI.deleteModel(name);
      await get().fetchModels();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete model', isLoading: false });
    }
  },

  copyModel: async (source: string, destination: string) => {
    set({ isLoading: true });
    try {
      await ollamaAPI.copyModel(source, destination);
      await get().fetchModels();
    } catch (error: any) {
      set({ error: error.message || 'Failed to copy model', isLoading: false });
    }
  },

  startModel: async (name: string) => {
    try {
      await ollamaAPI.startModel(name);
      // Wait a bit and refresh status
      setTimeout(() => get().fetchRunningModels(), 1000);
    } catch (error: any) {
      console.error('Failed to start model', error);
    }
  },

  stopModel: async (name: string) => {
    try {
      await ollamaAPI.stopModel(name);
      // Wait a bit and refresh status
      setTimeout(() => get().fetchRunningModels(), 1000);
    } catch (error: any) {
      console.error('Failed to stop model', error);
    }
  }
}));
