# Ollama Desktop Manager

[English](./README.md) | [中文](./README_zh-CN.md)

A powerful, user-friendly desktop management application for Ollama, built with modern web technologies (Electron, React, TypeScript, and Tailwind CSS).

## ✨ Features

### 🤖 Model Management

- **Easy Pulling**: Search and pull models directly from the Ollama library with progress tracking.
- **Detailed Inspection**: View model details including Modelfile, Template, Parameters, and License.
- **Life Cycle Control**: Start, stop, delete, and copy models with ease.
- **Real-time Status**: Monitor running models and system resource usage.

### 💬 Intelligent Chat

- **Markdown Support**: Full Markdown rendering with GFM support.
- **Code Highlighting**: Syntax highlighting for code blocks with one-click copy.
- **Session Management**: Create multiple chat sessions, switch between them, and manage history.
- **Streaming Response**: Real-time streaming responses from Ollama models.
- **Multilingual UI**: Native support for English and Chinese (Default: Chinese).

### ⚙️ Comprehensive Settings

- **Connection Control**: Configure custom Ollama API endpoints.
- **Proxy Management**: Switch between Direct Connection (bypass proxy) and System Proxy modes to resolve VPN/localhost issues.
- **Appearance Customization**:
  - Light/Dark/System theme support.
  - Adjustable font sizes.
- **System Monitoring**: Configurable compatibility checks and status updates.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or later recommended.
- **Ollama**: Must be installed and running (Default: `http://localhost:11434`).
  - [Download Ollama](https://ollama.com/download)

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd ollama-desktop
   ```

2. Install dependencies
   ```bash
   npm install
   ```

### Development

Start the app in development mode with hot reload:

```bash
npm run dev
```

### Build

Build the application for production:

```bash
# For macOS
npm run build:mac

# For Windows
npm run build:win

# For Linux
npm run build:linux
```

## 🛠️ Tech Stack

- **Core**: [Electron](https://www.electronjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Build Tool**: [Electron Vite](https://electron-vite.org/)
- **Markdown Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown), [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)

## 📂 Project Structure

- `src/main`: Electron main process (Window creation, IPC handling)
- `src/preload`: Electron preload scripts (Secure bridge between Main and Renderer)
- `src/renderer`: React frontend application
  - `src/api`: API clients (Ollama API integration)
  - `src/components`: Reusable UI components
  - `src/pages`: Main application views (Chat, Models, Settings)
  - `src/store`: Global state management
  - `src/i18n`: Localization configuration

## 📄 License

MIT
