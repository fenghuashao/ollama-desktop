import React, { useEffect, useState } from 'react'
import { useModelStore } from '../store/useModelStore'
import {
  Trash2,
  Download,
  Search,
  HardDrive,
  FileText,
  Cpu,
  Copy,
  Info,
  X,
  Play,
  Square
} from 'lucide-react'
import { ollamaAPI } from '../api/ollama'
import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'

export default function ModelsPage(): React.ReactElement {
  const {
    models,
    runningModels,
    isLoading,
    error,
    fetchModels,
    fetchRunningModels,
    deleteModel,
    copyModel,
    startModel,
    stopModel
  } = useModelStore()

  const [pullModelName, setPullModelName] = useState('')
  const [isPulling, setIsPulling] = useState(false)
  const [pullStatus, setPullStatus] = useState('')
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modelDetails, setModelDetails] = useState<any>(null)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [copySource, setCopySource] = useState('')
  const [copyDestination, setCopyDestination] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    fetchModels()
    // Periodically refresh running status
    const interval = setInterval(fetchRunningModels, 5000)
    return () => clearInterval(interval)
  }, [fetchModels, fetchRunningModels])

  const handlePullModel = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!pullModelName) return

    setIsPulling(true)
    setPullStatus(t('models.startPull'))
    try {
      await ollamaAPI.pullModel(pullModelName, false)
      setPullStatus(t('models.pullComplete'))
      setPullModelName('')
      fetchModels()
    } catch (err) {
      setPullStatus(`${t('models.error')}: ${(err as Error).message}`)
    } finally {
      setIsPulling(false)
      setTimeout(() => setPullStatus(''), 3000)
    }
  }

  const handleShowDetails = async (name: string): Promise<void> => {
    try {
      const details = await ollamaAPI.showModel(name)
      setModelDetails(details)
      setSelectedModel(name)
    } catch (error) {
      console.error('Failed to fetch model details:', error)
    }
  }

  const handleCopyModel = (name: string): void => {
    setCopySource(name)
    setCopyDestination(`${name}-copy`)
    setShowCopyModal(true)
  }

  const confirmCopy = async (): Promise<void> => {
    if (!copySource || !copyDestination) return
    await copyModel(copySource, copyDestination)
    setShowCopyModal(false)
  }

  const isModelRunning = (name: string): boolean => {
    return runningModels.some((m) => m === name || m.startsWith(name + ':'))
  }

  const toggleModelStatus = async (name: string): Promise<void> => {
    if (isModelRunning(name)) {
      await stopModel(name)
    } else {
      await startModel(name)
    }
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('models.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('models.subtitle')}</p>
        </div>

        <form onSubmit={handlePullModel} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('models.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={pullModelName}
              onChange={(e) => setPullModelName(e.target.value)}
              disabled={isPulling}
            />
          </div>
          <button
            type="submit"
            disabled={isPulling || !pullModelName}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPulling ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isPulling ? t('models.pulling') : t('models.pull')}
          </button>
        </form>
      </div>

      {pullStatus && (
        <div className="mb-4 p-3 bg-muted rounded-md text-sm font-medium">{pullStatus}</div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-200 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => fetchModels()}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors"
          >
            {t('models.retry')}
          </button>
        </div>
      )}

      {isLoading && models.length === 0 ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8">
          {models.map((model) => {
            const isRunning = isModelRunning(model.name)
            return (
              <div
                key={model.name}
                className={cn(
                  'group relative bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow',
                  isRunning && 'border-green-500/50 ring-1 ring-green-500/20'
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        isRunning ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                      )}
                    >
                      <Cpu className="w-6 h-6" />
                    </div>
                    {isRunning && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        {t('models.running')}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleModelStatus(model.name)}
                      className={cn(
                        'p-1.5 rounded-md transition-colors',
                        isRunning
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-green-500 hover:bg-green-50'
                      )}
                      title={isRunning ? t('models.stop') : t('models.start')}
                    >
                      {isRunning ? (
                        <Square className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>
                    <button
                      onClick={() => handleShowDetails(model.name)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                      title={t('models.details')}
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyModel(model.name)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                      title={t('models.copy')}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(t('models.deleteConfirm', { name: model.name }))) {
                          deleteModel(model.name)
                        }
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      title="Delete model"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2 truncate" title={model.name}>
                  {model.name}
                </h3>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    <span>{formatSize(model.size)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>
                      {model.details.parameter_size} • {model.details.quantization_level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                      {model.details.family}
                    </span>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                      {model.details.format}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground pt-4 border-t">
                  {t('models.modified')}: {new Date(model.modified_at).toLocaleDateString()}
                </div>
              </div>
            )
          })}

          {models.length === 0 && !isLoading && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
              <Download className="w-12 h-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium mb-2">{t('models.noModels')}</h3>
              <p>{t('models.pullHint')}</p>
            </div>
          )}
        </div>
      )}

      {/* Modals remain the same... */}
      {/* Model Details Modal */}
      {selectedModel && modelDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {t('models.detailsTitle')}: {selectedModel}
              </h2>
              <button
                onClick={() => setSelectedModel(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              {modelDetails.license && (
                <div>
                  <h3 className="font-semibold mb-2">{t('models.license')}</h3>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                    {modelDetails.license}
                  </pre>
                </div>
              )}
              {modelDetails.modelfile && (
                <div>
                  <h3 className="font-semibold mb-2">{t('models.modelfile')}</h3>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-60 whitespace-pre-wrap">
                    {modelDetails.modelfile}
                  </pre>
                </div>
              )}
              {modelDetails.template && (
                <div>
                  <h3 className="font-semibold mb-2">{t('models.template')}</h3>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                    {modelDetails.template}
                  </pre>
                </div>
              )}
              {modelDetails.parameters && (
                <div>
                  <h3 className="font-semibold mb-2">{t('models.parameters')}</h3>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                    {modelDetails.parameters}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedModel(null)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                {t('models.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Model Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{t('models.copyTitle')}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">{t('models.sourceModel')}</label>
                <input
                  type="text"
                  value={copySource}
                  disabled
                  className="w-full px-3 py-2 bg-muted border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('models.newModelName')}</label>
                <input
                  type="text"
                  value={copyDestination}
                  onChange={(e) => setCopyDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCopyModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-muted"
              >
                {t('models.cancel')}
              </button>
              <button
                onClick={confirmCopy}
                disabled={!copyDestination || isLoading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? t('models.copying') : t('models.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
