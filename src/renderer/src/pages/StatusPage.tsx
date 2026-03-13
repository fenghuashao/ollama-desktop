import { useEffect, useState } from 'react';
import { useStatusStore } from '../store/useStatusStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Activity, Server, CheckCircle, AlertTriangle, AlertOctagon, RefreshCw, Play, Square, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function StatusPage() {
  const { status, isProcessRunning, isLoading, checkStatus, startService, stopService } = useStatusStore();
  const { ollamaHost } = useSettingsStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOperating, setIsOperating] = useState(false);
  const { t } = useTranslation();

  const isLocal = ollamaHost.includes('localhost') || ollamaHost.includes('127.0.0.1');

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleStart = async () => {
    setIsOperating(true);
    await startService();
    setIsOperating(false);
  };

  const handleStop = async () => {
    setIsOperating(true);
    await stopService();
    setIsOperating(false);
  };

  const getCompatibilityColor = (level: string) => {
    switch (level) {
      case 'compatible': return 'text-green-500';
      case 'outdated': return 'text-yellow-500';
      case 'incompatible': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getCompatibilityIcon = (level: string) => {
    switch (level) {
      case 'compatible': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'outdated': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'incompatible': return <AlertOctagon className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getCompatibilityText = (level: string) => {
    switch (level) {
      case 'compatible': return t('status.compatible');
      case 'outdated': return t('status.outdated');
      case 'incompatible': return t('status.incompatible');
      default: return level;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('status.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('status.subtitle')}</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
          {isRefreshing || isLoading ? t('status.refreshing') : t('status.refresh')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Service Status Card */}
        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${status.isRunning ? 'bg-green-100' : 'bg-red-100'}`}>
              <Server className={`w-6 h-6 ${status.isRunning ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <h2 className="text-xl font-semibold">{t('status.serviceStatus')}</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">{t('status.serviceStatus')}</span>
              <span className={`font-medium ${status.isRunning ? 'text-green-600' : 'text-red-600'}`}>
                {status.isRunning ? t('status.running') : t('status.stopped')}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">{t('status.version')}</span>
              <span className="font-mono bg-muted px-2 py-0.5 rounded text-sm">
                {status.version}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">{t('status.lastChecked')}</span>
              <span className="text-sm">
                {new Date(status.lastChecked).toLocaleTimeString()}
              </span>
            </div>

            {isLocal && (
              <div className="pt-4 mt-2 border-t flex gap-3">
                {(!status.isRunning && !isProcessRunning) ? (
                  <button
                    onClick={handleStart}
                    disabled={isOperating}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOperating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {isOperating ? t('status.starting') : t('status.startService')}
                  </button>
                ) : (
                  <button
                    onClick={handleStop}
                    disabled={isOperating}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOperating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                    {isOperating ? t('status.stopping') : t('status.stopService')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Compatibility Card */}
        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">{t('status.compatibility')}</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">{t('status.compatibility')}</span>
              <div className="flex items-center gap-2">
                {getCompatibilityIcon(status.compatibility)}
                <span className={`font-medium ${getCompatibilityColor(status.compatibility)}`}>
                  {getCompatibilityText(status.compatibility)}
                </span>
              </div>
            </div>
            
            <div className="pt-2">
              <span className="text-muted-foreground block mb-2">{t('status.features')}</span>
              <div className="flex flex-wrap gap-2">
                {status.supportedFeatures.map(feature => (
                  <span key={feature} className="text-xs bg-secondary px-2 py-1 rounded-full border">
                    {feature}
                  </span>
                ))}
                {status.supportedFeatures.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">None detected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
