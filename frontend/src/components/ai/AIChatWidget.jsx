import { useState, useRef, useEffect, useCallback } from 'react';
import { useModules } from '../../contexts/ModuleContext';
import { aiAPI } from '../../services/api';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function AIChatWidget() {
  const { selectedModule } = useModules();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [selectedModule?.id]);

  const handleSend = useCallback(async (text) => {
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      const stream = await aiAPI.sendMessage(
        selectedModule?.id || null,
        text,
        history
      );

      let assistantContent = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: assistantContent,
                  };
                  return updated;
                });
              }
              if (parsed.error) {
                setError(parsed.error);
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [messages, selectedModule?.id]);

  return (
    <>
      <button
        className="ai-chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Study Assistant"
      >
        {isOpen ? '\u2715' : '\uD83D\uDCAC'}
      </button>

      {isOpen && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <h4>AI Study Assistant</h4>
            {selectedModule && (
              <span className="ai-chat-module">{selectedModule.name}</span>
            )}
          </div>

          <div className="ai-chat-messages">
            {messages.length === 0 && (
              <div className="ai-chat-welcome">
                <p>
                  {selectedModule
                    ? `Ask me anything about "${selectedModule.name}"! I can summarize your resources, explain concepts, or help with study planning.`
                    : 'Select a module to get context-aware help, or ask me a general study question.'}
                </p>
                {selectedModule && (
                  <div className="ai-chat-suggestions">
                    <button onClick={() => handleSend('Summarize my course content')}>
                      Summarize course content
                    </button>
                    <button onClick={() => handleSend('What should I study next?')}>
                      What should I study next?
                    </button>
                  </div>
                )}
              </div>
            )}

            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="ai-chat-typing">Thinking...</div>
            )}

            {error && <div className="error-message">{error}</div>}

            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      )}
    </>
  );
}
