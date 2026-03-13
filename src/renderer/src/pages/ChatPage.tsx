import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useModelStore } from '../store/useModelStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Send, Plus, MessageSquare, Trash2, User, Bot, Copy, Check, Info } from 'lucide-react';
import { ollamaAPI } from '../api/ollama';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export default function ChatPage() {
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    deleteSession, 
    selectSession, 
    addMessage, 
    updateMessage,
    getCurrentSession 
  } = useChatStore();
  const { models, fetchModels } = useModelStore();
  const { showTimestamp } = useSettingsStore();
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const currentSession = getCurrentSession();

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isGenerating]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentSession || isGenerating) return;

    const userMessageContent = input.trim();
    setInput('');

    // Add user message
    addMessage(currentSession.id, {
      role: 'user',
      content: userMessageContent
    });

    setIsGenerating(true);

    // Create assistant message placeholder
    const assistantMsgId = addMessage(currentSession.id, {
      role: 'assistant',
      content: '',
      model: currentSession.modelName
    });

    try {
      let fullResponse = '';
      
      // Use streaming chat
      await ollamaAPI.streamChat(
        currentSession.modelName,
        currentSession.messages.concat([
          { role: 'user', content: userMessageContent, id: 'temp', timestamp: Date.now() } // temp user msg for context
        ]).map(m => ({ role: m.role, content: m.content })),
        (chunk) => {
          fullResponse += chunk;
          updateMessage(currentSession.id, assistantMsgId, fullResponse);
        }
      );
    } catch (error: any) {
      updateMessage(currentSession.id, assistantMsgId, `Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    if (models.length > 0) {
      createSession(models[0].name);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-full">
      {/* Chat Sidebar */}
      <div className="w-64 border-r bg-muted/20 flex flex-col">
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('chat.newChat')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {t('chat.noChats')}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors",
                    currentSessionId === session.id ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => selectSession(session.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{session.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {!currentSession ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-2">{t('chat.startChatHint')}</h3>
            {models.length > 0 ? (
              <button
                onClick={handleNewChat}
                className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                {t('chat.newChat')}
              </button>
            ) : (
              <p className="text-sm mt-2">{t('models.pullHint')}</p>
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b p-4 flex justify-between items-center bg-background/95 backdrop-blur z-10">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <span className="font-medium">{currentSession.modelName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  className="text-sm border rounded px-2 py-1 bg-background"
                  value={currentSession.modelName}
                  onChange={(e) => {
                    // Update model for current session logic would go here
                    // For now, we'd need to add updateSessionModel to store
                  }}
                >
                  {models.map(model => (
                    <option key={model.name} value={model.name}>{model.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {currentSession.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-4 max-w-4xl mx-auto",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                    msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  )}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>

                  <div className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "rounded-lg p-4 shadow-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card border text-card-foreground"
                    )}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                  <div className="relative group">
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                      <CopyButton text={String(children).replace(/\n$/, '')} />
                                    </div>
                                    <SyntaxHighlighter
                                      style={oneDark}
                                      language={match[1]}
                                      PreTag="div"
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  </div>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              }
                            }}
                          >
                            {msg.content || 'Thinking...'}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    
                    {showTimestamp && (
                      <span className="text-xs text-muted-foreground mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('chat.inputPlaceholder')}
                    className="w-full pl-4 pr-12 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    disabled={isGenerating}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isGenerating}
                    className="absolute right-2 top-2 p-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
                <div className="text-center mt-2 text-xs text-muted-foreground">
                  AI generates content. Please verify important information.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
      title={t('chat.copyCode')}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}
