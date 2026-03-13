export interface OllamaModel {
  name: string
  model: string
  size: number
  digest: string
  modified_at: string
  details: {
    format: string
    family: string
    families: string[]
    parameter_size: string
    quantization_level: string
  }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  model?: string
}

export interface ChatSession {
  id: string
  modelName: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

export interface AppSettings {
  ollamaHost: string
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large'
  autoCheckUpdates: boolean
  showTimestamp: boolean
  compatibilityCheckInterval: number // minutes
  proxyMode: 'direct' | 'system'
}

export type CompatibilityLevel = 'compatible' | 'outdated' | 'incompatible'

export interface SystemStatus {
  isRunning: boolean
  version: string
  memoryUsage: number
  cpuUsage: number
  lastChecked: number
  compatibility: CompatibilityLevel
  supportedFeatures: string[]
}

export interface VersionInfo {
  version: string
}

export interface VersionCompatibility {
  minVersion: string
  maxVersion?: string
  supportedFeatures: {
    [featureName: string]: {
      minVersion: string
      deprecated?: boolean
    }
  }
}
