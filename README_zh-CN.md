# Ollama 桌面管理工具

一款功能强大、用户友好的 Ollama 桌面管理应用程序，基于现代 Web 技术构建（Electron、React、TypeScript 和 Tailwind CSS）。

[English](./README.md) | [中文](./README_zh-CN.md)

## ✨ 功能特性

### 🤖 模型管理

- **轻松拉取**：直接从 Ollama 库中搜索并拉取模型，带有进度跟踪。
- **详细查看**：查看模型详情，包括 Modelfile、模板、参数和许可证。
- **生命周期控制**：轻松启动、停止、删除和复制模型。
- **实时状态**：监控正在运行的模型和系统资源使用情况。

### 💬 智能对话

- **Markdown 支持**：完全支持 GFM 的 Markdown 渲染。
- **代码高亮**：代码块语法高亮，支持一键复制。
- **会话管理**：创建多个聊天会话，在它们之间切换并管理历史记录。
- **流式响应**：来自 Ollama 模型的实时流式响应。
- **多语言界面**：原生支持英文和中文（默认：中文）。

### ⚙️ 全面设置

- **连接控制**：配置自定义 Ollama API 端点。
- **代理管理**：在直连（绕过代理）和系统代理模式之间切换，以解决 VPN/localhost 问题。
- **外观定制**：
  - 支持浅色/深色/跟随系统主题。
  - 可调节字体大小。
- **系统监控**：可配置的兼容性检查和状态更新。

## 🚀 快速开始

### 前置要求

- **Node.js**：建议 v18 或更高版本。
- **Ollama**：必须安装并运行（默认：`http://localhost:11434`）。
  - [下载 Ollama](https://ollama.com/download)

### 安装

1. 克隆仓库

   ```bash
   git clone <repository-url>
   cd ollama-desktop
   ```

2. 安装依赖
   ```bash
   npm install
   ```

### 开发

在开发模式下启动应用程序（支持热重载）：

```bash
npm run dev
```

### 构建

构建生产环境应用程序：

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

## 🛠️ 技术栈

- **核心**: [Electron](https://www.electronjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (图标)
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand)
- **国际化**: [i18next](https://www.i18next.com/)
- **构建工具**: [Electron Vite](https://electron-vite.org/)
- **Markdown 渲染**: [React Markdown](https://github.com/remarkjs/react-markdown), [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)

## 📂 项目结构

- `src/main`: Electron 主进程（窗口创建、IPC 处理）
- `src/preload`: Electron 预加载脚本（主进程和渲染进程之间的安全桥梁）
- `src/renderer`: React 前端应用程序
  - `src/api`: API 客户端（Ollama API 集成）
  - `src/components`: 可复用的 UI 组件
  - `src/pages`: 主要应用视图（聊天、模型、设置）
  - `src/store`: 全局状态管理
  - `src/i18n`: 本地化配置

## 📄 许可证

MIT
