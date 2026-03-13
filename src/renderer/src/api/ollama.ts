import axios, { AxiosInstance, AxiosResponse } from 'axios';
import semver from 'semver';
import { 
  OllamaModel, 
  SystemStatus, 
  VersionCompatibility, 
  CompatibilityLevel,
  VersionInfo 
} from '../types';

const DEFAULT_HOST = 'http://127.0.0.1:11434';

const COMPATIBILITY_CONFIG: VersionCompatibility = {
  minVersion: '0.1.0',
  supportedFeatures: {
    streaming: { minVersion: '0.1.5' },
    json_mode: { minVersion: '0.1.20' },
    function_calling: { minVersion: '0.2.0' },
    create_model: { minVersion: '0.0.0' }, // Base feature
    pull_model: { minVersion: '0.0.0' },
    delete_model: { minVersion: '0.0.0' },
  }
};

export class OllamaAPI {
  private client: AxiosInstance;
  private host: string;

  constructor(host: string = DEFAULT_HOST) {
    this.host = host;
    this.client = axios.create({
      baseURL: host,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptor for better error messages
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.message === 'Network Error') {
          error.message = '无法连接到 Ollama 服务。请前往“系统状态”页面启动服务，或确保 Ollama 已在后台运行。';
        }
        return Promise.reject(error);
      }
    );
  }

  updateHost(host: string) {
    this.host = host;
    this.client.defaults.baseURL = host;
  }

  async getVersion(): Promise<VersionInfo> {
    try {
      const response = await this.client.get('/api/version');
      return response.data;
    } catch (error) {
      console.error('Failed to get version:', error);
      throw error;
    }
  }

  async checkSystemStatus(): Promise<SystemStatus> {
    try {
      const versionInfo = await this.getVersion();
      const version = versionInfo.version;
      const compatibility = this.checkCompatibility(version);
      const supportedFeatures = this.getSupportedFeatures(version);

      // Note: Ollama doesn't provide CPU/Memory usage via API yet. 
      // This would require a separate system monitor or a different API if added.
      // For now we mock resource usage or leave it as placeholder.
      
      return {
        isRunning: true,
        version,
        memoryUsage: 0, // Placeholder
        cpuUsage: 0,    // Placeholder
        lastChecked: Date.now(),
        compatibility,
        supportedFeatures
      };
    } catch (error) {
      return {
        isRunning: false,
        version: 'unknown',
        memoryUsage: 0,
        cpuUsage: 0,
        lastChecked: Date.now(),
        compatibility: 'incompatible',
        supportedFeatures: []
      };
    }
  }

  checkCompatibility(version: string): CompatibilityLevel {
    if (!semver.valid(version)) {
      // Handle non-semver versions (e.g. dev builds) carefully, assume compatible or outdated
      return 'outdated';
    }

    if (semver.lt(version, COMPATIBILITY_CONFIG.minVersion)) {
      return 'incompatible';
    }

    // Check if version is significantly old (arbitrary logic, e.g., < 0.1.20)
    if (semver.lt(version, '0.1.20')) {
      return 'outdated';
    }

    return 'compatible';
  }

  getSupportedFeatures(version: string): string[] {
    if (!semver.valid(version)) return [];
    
    return Object.keys(COMPATIBILITY_CONFIG.supportedFeatures).filter(feature => {
      const config = COMPATIBILITY_CONFIG.supportedFeatures[feature];
      return semver.gte(version, config.minVersion);
    });
  }

  async getModels(): Promise<OllamaModel[]> {
    const response = await this.client.get('/api/tags');
    return response.data.models;
  }

  async pullModel(name: string, stream: boolean = false): Promise<AxiosResponse> {
    return this.client.post('/api/pull', { name, stream });
  }

  async deleteModel(name: string): Promise<AxiosResponse> {
    return this.client.delete('/api/delete', { data: { name } });
  }

  async showModel(name: string): Promise<any> {
    const response = await this.client.post('/api/show', { name });
    return response.data;
  }

  async copyModel(source: string, destination: string): Promise<AxiosResponse> {
    return this.client.post('/api/copy', { source, destination });
  }

  async listRunningModels(): Promise<any> {
    try {
      const response = await this.client.get('/api/ps');
      return response.data;
    } catch (error) {
      // Fallback for older Ollama versions that don't support /api/ps
      console.warn('Failed to list running models:', error);
      return { models: [] };
    }
  }

  // Ollama doesn't have explicit start/stop model endpoints in the API.
  // Models are loaded on demand when chat/generate is called.
  // To "stop" a model (unload it from memory), we can generate an empty request with keep_alive=0
  async stopModel(model: string): Promise<void> {
    try {
      await this.client.post('/api/chat', {
        model,
        messages: [],
        keep_alive: 0
      });
    } catch (error) {
      console.error('Failed to stop model:', error);
    }
  }

  // To "start" a model (preload it), we can send an empty request with keep_alive=-1 (indefinite) or default
  async startModel(model: string): Promise<void> {
    try {
      await this.client.post('/api/chat', {
        model,
        messages: [],
        // Just loading it
      });
    } catch (error) {
      console.error('Failed to start model:', error);
    }
  }

  async chat(model: string, messages: any[], stream: boolean = false): Promise<AxiosResponse> {
    return this.client.post('/api/chat', {
      model,
      messages,
      stream
    });
  }

  // Helper for streaming response
  async streamChat(
    model: string, 
    messages: any[], 
    onChunk: (content: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.host}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, stream: true })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        // Ollama sends multiple JSON objects in one chunk sometimes
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message && json.message.content) {
              onChunk(json.message.content);
            }
            if (json.done) {
              return;
            }
          } catch (e) {
            console.warn('Failed to parse chunk:', line);
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    }
  }
}

export const ollamaAPI = new OllamaAPI();
