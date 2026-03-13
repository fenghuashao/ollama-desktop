import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      sidebar: {
        models: 'Models',
        chat: 'Chat',
        status: 'System Status',
        settings: 'Settings',
        disconnected: 'Disconnected'
      },
      models: {
        title: 'Models',
        subtitle: 'Manage your local LLM models',
        searchPlaceholder: 'Pull model (e.g. llama2)',
        pull: 'Pull',
        pulling: 'Pulling...',
        noModels: 'No models found',
        pullHint: 'Pull a model to get started (e.g., "llama3", "mistral")',
        deleteConfirm: 'Are you sure you want to delete {{name}}?',
        error: 'Error',
        retry: 'Retry',
        startPull: 'Starting pull...',
        pullComplete: 'Pull complete!',
        modified: 'Modified',
        details: 'Details',
        copy: 'Copy',
        copyTitle: 'Copy Model',
        sourceModel: 'Source Model',
        newModelName: 'New Model Name',
        copying: 'Copying...',
        detailsTitle: 'Model Details',
        license: 'License',
        modelfile: 'Modelfile',
        template: 'Template',
        parameters: 'Parameters',
        close: 'Close',
        cancel: 'Cancel',
        confirm: 'Confirm',
        running: 'Running',
        start: 'Start',
        stop: 'Stop',
        status: 'Status'
      },
      chat: {
        newChat: 'New Chat',
        noChats: 'No chat history',
        startChatHint: 'Select a model and start chatting!',
        inputPlaceholder: 'Type a message...',
        send: 'Send',
        modelSelector: 'Select a model',
        user: 'User',
        assistant: 'Assistant',
        copyCode: 'Copy code',
        copied: 'Copied!'
      },
      status: {
        title: 'System Status',
        subtitle: 'Monitor your Ollama instance',
        serviceStatus: 'Service Status',
        running: 'Running',
        stopped: 'Stopped',
        version: 'Version',
        compatibility: 'Compatibility',
        compatible: 'Compatible',
        outdated: 'Outdated',
        incompatible: 'Incompatible',
        features: 'Supported Features',
        lastChecked: 'Last checked',
        refresh: 'Refresh Status',
        refreshing: 'Refreshing...',
        startService: 'Start Service',
        stopService: 'Stop Service',
        starting: 'Starting...',
        stopping: 'Stopping...'
      },
      settings: {
        title: 'Settings',
        connection: 'Connection',
        hostLabel: 'Ollama API Host',
        hostHint:
          'Default is http://localhost:11434. Change this if your Ollama instance is running elsewhere.',
        proxyMode: 'Proxy Mode',
        proxyDirect: 'Direct Connection (Bypass System Proxy)',
        proxySystem: 'Use System Proxy',
        proxyHint:
          'Select "Direct Connection" if you have issues connecting to localhost while using a VPN or Proxy.',
        appearance: 'Appearance',
        theme: 'Theme',
        themeSystem: 'System',
        themeLight: 'Light',
        themeDark: 'Dark',
        fontSize: 'Font Size',
        fontSmall: 'Small',
        fontMedium: 'Medium',
        fontLarge: 'Large',
        system: 'System',
        autoCheckUpdates: 'Auto Check Updates',
        showTimestamp: 'Show Timestamps in Chat',
        checkInterval: 'Compatibility Check Interval (minutes)',
        language: 'Language',
        reset: 'Reset to Defaults'
      }
    }
  },
  zh: {
    translation: {
      sidebar: {
        models: '模型管理',
        chat: '智能对话',
        status: '系统状态',
        settings: '系统设置',
        disconnected: '未连接'
      },
      models: {
        title: '模型管理',
        subtitle: '管理您的本地 LLM 模型',
        searchPlaceholder: '拉取模型 (例如 llama2)',
        pull: '拉取',
        pulling: '拉取中...',
        noModels: '未找到模型',
        pullHint: '拉取一个模型开始使用 (例如 "llama3", "mistral")',
        deleteConfirm: '确定要删除 {{name}} 吗？',
        error: '错误',
        retry: '重试',
        startPull: '开始拉取...',
        pullComplete: '拉取完成！',
        modified: '修改时间',
        details: '详情',
        copy: '复制',
        copyTitle: '复制模型',
        sourceModel: '源模型',
        newModelName: '新模型名称',
        copying: '复制中...',
        detailsTitle: '模型详情',
        license: '许可证',
        modelfile: '模型文件 (Modelfile)',
        template: '模板 (Template)',
        parameters: '参数 (Parameters)',
        close: '关闭',
        cancel: '取消',
        confirm: '确定',
        running: '运行中',
        start: '启动',
        stop: '停止',
        status: '状态'
      },
      chat: {
        newChat: '新对话',
        noChats: '暂无对话历史',
        startChatHint: '选择一个模型开始对话！',
        inputPlaceholder: '输入消息...',
        send: '发送',
        modelSelector: '选择模型',
        user: '用户',
        assistant: '助手',
        copyCode: '复制代码',
        copied: '已复制！'
      },
      status: {
        title: '系统状态',
        subtitle: '监控 Ollama 服务状态',
        serviceStatus: '服务状态',
        running: '运行中',
        stopped: '已停止',
        version: '版本',
        compatibility: '兼容性',
        compatible: '兼容',
        outdated: '版本过旧',
        incompatible: '不兼容',
        features: '支持的功能',
        lastChecked: '上次检查',
        refresh: '刷新状态',
        refreshing: '刷新中...',
        startService: '启动服务',
        stopService: '停止服务',
        starting: '启动中...',
        stopping: '停止中...'
      },
      settings: {
        title: '系统设置',
        connection: '连接设置',
        hostLabel: 'Ollama API 地址',
        hostHint: '默认为 http://localhost:11434。如果您的 Ollama 运行在其他地址，请修改此处。',
        proxyMode: '代理模式',
        proxyDirect: '直连模式 (绕过系统代理)',
        proxySystem: '系统代理 (使用全局设置)',
        proxyHint: '如果您在使用 VPN 或代理时无法连接本地服务，请选择"直连模式"。',
        appearance: '外观设置',
        theme: '主题',
        themeSystem: '跟随系统',
        themeLight: '浅色',
        themeDark: '深色',
        fontSize: '字体大小',
        fontSmall: '小',
        fontMedium: '中',
        fontLarge: '大',
        system: '系统选项',
        autoCheckUpdates: '自动检查更新',
        showTimestamp: '显示对话时间戳',
        checkInterval: '兼容性检查间隔 (分钟)',
        language: '语言',
        reset: '恢复默认设置'
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from xss
    }
  })

export default i18n
