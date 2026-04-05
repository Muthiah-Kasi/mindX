import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import './ChatPage.css';

export default function ChatPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('mindx_user');
    navigate('/auth');
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header__brand">
          <div className="chat-header__logo" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <h1 className="chat-header__title">MindX Support AI</h1>
            <span className="chat-header__status">
              <span className="chat-header__status-dot"></span>
              System Status: Active
            </span>
          </div>
        </div>

        <div className="chat-header__actions">
          <button className="chat-logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
          <div className="chat-header__avatar" aria-label="User profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="chat-page__main">
        <ChatBox />
      </main>
    </div>
  );
}
