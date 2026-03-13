import { useSettingsStore } from '../store/useSettingsStore';
import { RotateCcw } from 'lucide-react';
import { ollamaAPI } from '../api/ollama';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const settings = useSettingsStore();
  const { t, i18n } = useTranslation();
  
  const handleHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    settings.updateSettings({ ollamaHost: e.target.value });
    ollamaAPI.updateHost(e.target.value);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('settings.title')}</h1>

      <div className="space-y-8">
        {/* Connection Settings */}
        <div className="space-y-4 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">{t('settings.connection')}</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('settings.hostLabel')}</label>
            <input
              type="text"
              value={settings.ollamaHost}
              onChange={handleHostChange}
              className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="http://localhost:11434"
            />
            <p className="text-xs text-muted-foreground">
              {t('settings.hostHint')}
            </p>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <label className="text-sm font-medium">{t('settings.proxyMode')}</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="proxyMode"
                  value="direct"
                  checked={settings.proxyMode === 'direct'}
                  onChange={() => settings.updateSettings({ proxyMode: 'direct' })}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <span className="text-sm">{t('settings.proxyDirect')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="proxyMode"
                  value="system"
                  checked={settings.proxyMode === 'system'}
                  onChange={() => settings.updateSettings({ proxyMode: 'system' })}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <span className="text-sm">{t('settings.proxySystem')}</span>
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('settings.proxyHint')}
            </p>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="space-y-4 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">{t('settings.appearance')}</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('settings.theme')}</label>
            <select
              value={settings.theme}
              onChange={(e) => settings.updateSettings({ theme: e.target.value as any })}
              className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="system">{t('settings.themeSystem')}</option>
              <option value="light">{t('settings.themeLight')}</option>
              <option value="dark">{t('settings.themeDark')}</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('settings.fontSize')}</label>
            <select
              value={settings.fontSize}
              onChange={(e) => settings.updateSettings({ fontSize: e.target.value as any })}
              className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="small">{t('settings.fontSmall')}</option>
              <option value="medium">{t('settings.fontMedium')}</option>
              <option value="large">{t('settings.fontLarge')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('settings.language')}</label>
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="zh">中文 (Chinese)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* System Settings */}
        <div className="space-y-4 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">{t('settings.system')}</h2>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('settings.autoCheckUpdates')}</label>
            <input
              type="checkbox"
              checked={settings.autoCheckUpdates}
              onChange={(e) => settings.updateSettings({ autoCheckUpdates: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('settings.showTimestamp')}</label>
            <input
              type="checkbox"
              checked={settings.showTimestamp}
              onChange={(e) => settings.updateSettings({ showTimestamp: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('settings.checkInterval')}</label>
            <input
              type="number"
              value={settings.compatibilityCheckInterval}
              onChange={(e) => settings.updateSettings({ compatibilityCheckInterval: parseInt(e.target.value) || 60 })}
              className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => settings.resetSettings()}
            className="flex items-center gap-2 px-4 py-2 text-destructive border border-destructive rounded-md hover:bg-destructive/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('settings.reset')}
          </button>
        </div>
      </div>
    </div>
  );
}
