import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSession, ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  createSession: (modelName: string) => string;
  selectSession: (id: string) => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => string; // Return message ID
  updateMessage: (sessionId: string, messageId: string, content: string) => void;
  deleteSession: (id: string) => void;
  clearSessions: () => void;
  getCurrentSession: () => ChatSession | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,

      getCurrentSession: () => {
        const { sessions, currentSessionId } = get();
        return sessions.find((s) => s.id === currentSessionId);
      },

      createSession: (modelName: string) => {
        const id = uuidv4();
        const newSession: ChatSession = {
          id,
          modelName,
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: id,
        }));
        return id;
      },

      selectSession: (id: string) => {
        set({ currentSessionId: id });
      },

      addMessage: (sessionId: string, message) => {
        const newMessageId = uuidv4();
        set((state) => {
          const sessions = state.sessions.map((session) => {
            if (session.id === sessionId) {
              const newMessage: ChatMessage = {
                id: newMessageId,
                timestamp: Date.now(),
                ...message,
              };
              
              // Auto-generate title from first user message
              let title = session.title;
              if (session.messages.length === 0 && message.role === 'user') {
                title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
              }

              return {
                ...session,
                title,
                messages: [...session.messages, newMessage],
                updatedAt: Date.now(),
              };
            }
            return session;
          });
          return { sessions };
        });
        return newMessageId;
      },

      updateMessage: (sessionId: string, messageId: string, content: string) => {
        set((state) => {
          const sessions = state.sessions.map((session) => {
            if (session.id === sessionId) {
              const messages = session.messages.map((msg) => {
                if (msg.id === messageId) {
                  return { ...msg, content };
                }
                return msg;
              });
              return { ...session, messages, updatedAt: Date.now() };
            }
            return session;
          });
          return { sessions };
        });
      },

      deleteSession: (id: string) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
        }));
      },

      clearSessions: () => {
        set({ sessions: [], currentSessionId: null });
      }
    }),
    {
      name: 'chat-storage',
    }
  )
);
