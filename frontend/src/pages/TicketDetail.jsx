import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, updateTicketStatus } from '../services/api';
import './TicketDetail.css';

const STATUS_OPTIONS = ['OPEN', 'RESOLVED', 'NEEDS_HUMAN'];

function getStatusClass(status) {
  switch (status) {
    case 'OPEN': return 'td-status--open';
    case 'RESOLVED': return 'td-status--resolved';
    case 'NEEDS_HUMAN': return 'td-status--needs-human';
    default: return '';
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const data = await getTicketById(id);
        setTicket(data.ticket);
        setMessages(data.messages);
        setSelectedStatus(data.ticket.status);
      } catch (error) {
        console.error('Failed to fetch ticket:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUpdateStatus = async () => {
    if (!selectedStatus || updating) return;
    setUpdating(true);
    try {
      const updated = await updateTicketStatus(id, selectedStatus);
      setTicket((prev) => ({ ...prev, status: updated.status }));
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="td-page">
        <div className="td-loading">
          <div className="td-loading-dots"><span></span><span></span><span></span></div>
          <p>Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="td-page">
        <div className="td-loading">
          <p>Ticket not found.</p>
          <button className="td-back-btn" onClick={() => navigate('/admin')}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="td-page">
      {/* Top bar */}
      <header className="td-topbar">
        <div className="td-topbar__left">
          <button className="td-back-link" onClick={() => navigate('/admin')} aria-label="Back to dashboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="td-topbar__ticket-id">Ticket #{ticket.id}</span>
          <span className="td-topbar__title">MindX AI</span>
          <span className={`td-topbar__status ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
        </div>
      </header>

      {/* Opened date */}
      <div className="td-meta">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>Opened: {formatDate(ticket.createdAt)}</span>
      </div>

      {/* Messages */}
      <div className="td-messages">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'USER';
          return (
            <div key={index} className={`td-msg-row ${isUser ? 'td-msg-row--user' : 'td-msg-row--ai'}`}>
              {!isUser && (
                <div className="td-msg-avatar td-msg-avatar--ai" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              )}

              <div className={`td-msg-bubble ${isUser ? 'td-msg-bubble--user' : 'td-msg-bubble--ai'}`}>
                {!isUser && <span className="td-msg-label">MindX Intelligence</span>}
                {isUser && <span className="td-msg-label td-msg-label--user">You</span>}
                <p className="td-msg-text">{msg.message}</p>
              </div>

              {isUser && (
                <div className="td-msg-avatar td-msg-avatar--user" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
      <div className="td-control-panel">
        <div className="td-control-panel__header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Control Panel</span>
        </div>

        <label className="td-control-label">Current Ticket Status</label>

        <div className="td-control-actions">
          <select
            className="td-control-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={updating}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            className="td-control-update-btn"
            onClick={handleUpdateStatus}
            disabled={updating || selectedStatus === ticket.status}
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
    </div>
  );
}
