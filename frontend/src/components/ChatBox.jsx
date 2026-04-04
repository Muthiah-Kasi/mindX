import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { sendMessage } from '../services/api';
import './ChatBox.css';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Immediately append user message
    const userMessage = { sender: 'USER', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get userId from localStorage if logged in
      let userId = null;
      try {
        const stored = localStorage.getItem('mindx_user');
        if (stored) {
          const user = JSON.parse(stored);
          userId = user.userId;
        }
      } catch (e) { /* ignore */ }

      const res = await sendMessage(trimmed, userId);
      const aiMessage = { sender: 'AI', text: res.aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage = {
        sender: 'AI',
        text: 'Sorry, I encountered an error processing your request. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="chatbox">
      {/* Messages area */}
      <div className="chatbox__messages" id="messages-container">
        {!hasMessages && (
          <div className="chatbox__welcome">
            <div className="chatbox__welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="chatbox__welcome-badge">v2.6.0 Artisan Stable</span>
            <h1 className="chatbox__welcome-title">How can I assist your craft today?</h1>
            <p className="chatbox__welcome-subtitle">
              The AI-powered support assistant for high-performance teams.<br />
              Built for precision, engineered for speed.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <MessageBubble key={index} sender={msg.sender} text={msg.text} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="chatbox__typing">
            <div className="chatbox__typing-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="chatbox__typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="chatbox__input-area">
        <div className="chatbox__input-wrapper">
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            className="chatbox__input"
            placeholder="Send message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            id="send-button"
            className="chatbox__send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
