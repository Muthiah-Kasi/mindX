import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminUserMessages, updateTicketStatus } from '../services/api';
import './UserDetail.css';

const STATUS_OPTIONS = ['OPEN', 'RESOLVED', 'NEEDS_HUMAN'];

function getStatusClass(status) {
  switch (status) {
    case 'OPEN': return 'ud-status--open';
    case 'RESOLVED': return 'ud-status--resolved';
    case 'NEEDS_HUMAN': return 'ud-status--needs-human';
    default: return '';
  }
}

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [latestTicketId, setLatestTicketId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAdminUserMessages(userId);
        setUser(data.user);
        setMessages(data.messages);
        setSelectedStatus(data.user.currentStatus);
        if (data.latestTicketId) {
          setLatestTicketId(data.latestTicketId);
        }
      } catch (error) {
        console.error('Failed to fetch user messages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUpdateStatus = async () => {
    if (!selectedStatus || updating || !latestTicketId) return;
    setUpdating(true);
    try {
      await updateTicketStatus(latestTicketId, selectedStatus);
      setUser((prev) => ({ ...prev, currentStatus: selectedStatus }));
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="ud-page">
        <div className="ud-loading">
          <div className="ud-loading-dots"><span></span><span></span><span></span></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ud-page">
        <div className="ud-loading">
          <p>User not found.</p>
          <button className="ud-back-btn" onClick={() => navigate('/admin')}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ud-page">
      {/* Top bar */}
      <header className="ud-topbar">
        <div className="ud-topbar__left">
          <button className="ud-back-link" onClick={() => navigate('/admin')} aria-label="Back to dashboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="ud-topbar__user-badge">User #{user.userId}</span>
          <span className="ud-topbar__title">{user.name}</span>
          <span className={`ud-topbar__status ${getStatusClass(user.currentStatus)}`}>{user.currentStatus}</span>
        </div>
      </header>

      {/* User info card */}
      <div className="ud-user-info">
        <div className="ud-user-info__avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
          </svg>
        </div>
        <div className="ud-user-info__details">
          <span className="ud-user-info__name">{user.name}</span>
          <span className="ud-user-info__email">{user.email}</span>
        </div>
        <span className="ud-user-info__mobile">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          {user.mobileNumber}
        </span>
      </div>

      {/* Messages */}
      <div className="ud-messages">
        {messages.length === 0 && (
          <div className="ud-loading">
            <p>No messages yet.</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.sender === 'USER';
          return (
            <div key={index} className={`ud-msg-row ${isUser ? 'ud-msg-row--user' : 'ud-msg-row--ai'}`}>
              {!isUser && (
                <div className="ud-msg-avatar ud-msg-avatar--ai" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              )}

              <div className={`ud-msg-bubble ${isUser ? 'ud-msg-bubble--user' : 'ud-msg-bubble--ai'}`}>
                {!isUser && <span className="ud-msg-label">MindX Intelligence</span>}
                {isUser && <span className="ud-msg-label ud-msg-label--user">{user.name}</span>}
                <p className="ud-msg-text">{msg.message}</p>
              </div>

              {isUser && (
                <div className="ud-msg-avatar ud-msg-avatar--user" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Control panel */}
      {latestTicketId && (
        <div className="ud-control-panel">
          <div className="ud-control-panel__header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Control Panel</span>
          </div>

          <label className="ud-control-label">Current Ticket Status</label>

          <div className="ud-control-actions">
            <select
              className="ud-control-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={updating}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              className="ud-control-update-btn"
              onClick={handleUpdateStatus}
              disabled={updating || selectedStatus === user.currentStatus}
            >
              {updating ? (
                <>Updating...</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Update Status
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
