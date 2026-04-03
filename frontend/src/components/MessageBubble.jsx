import './MessageBubble.css';

export default function MessageBubble({ sender, text }) {
  const isUser = sender === 'USER';

  return (
    <div className={`message-row ${isUser ? 'message-row--user' : 'message-row--ai'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="message-avatar message-avatar--ai" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      )}

      <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--ai'}`}>
        <span className="message-sender-label">{isUser ? 'You' : 'MindX AI'}</span>
        <p className="message-text">{text}</p>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="message-avatar message-avatar--user" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
          </svg>
        </div>
      )}
    </div>
  );
}
