import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import ModelsPage from './pages/ModelsPage';
import ChatPage from './pages/ChatPage';
import StatusPage from './pages/StatusPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ModelsPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:modelName" element={<ChatPage />} />
          <Route path="status" element={<StatusPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
