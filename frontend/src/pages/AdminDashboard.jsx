import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../services/api';
import './AdminDashboard.css';

const FILTER_TABS = [
  { label: 'All', value: 'ALL' },
  { label: 'Open', value: 'OPEN' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Needs Human', value: 'NEEDS_HUMAN' },
];

function getStatusClass(status) {
  switch (status) {
    case 'OPEN': return 'status--open';
    case 'RESOLVED': return 'status--resolved';
    case 'NEEDS_HUMAN': return 'status--needs-human';
    default: return '';
  }
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const filteredTickets = activeFilter === 'ALL'
    ? tickets
    : tickets.filter((t) => t.status === activeFilter);

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header__brand">
          <div className="admin-header__logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="admin-header__title">MindX Support AI</span>
        </div>
        <span className="admin-header__badge">Admin v2.6.0</span>
      </header>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-main__inner">
          {/* Title section */}
          <div className="admin-title-section">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Central queue for active support inquiries and AI escalations.</p>
          </div>

          {/* Filter tabs */}
          <div className="admin-filters">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`admin-filter-tab ${activeFilter === tab.value ? 'admin-filter-tab--active' : ''}`}
                onClick={() => setActiveFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Ticket cards */}
          <div className="admin-tickets">
            {loading && (
              <div className="admin-empty">
                <div className="admin-loading-dots">
                  <span></span><span></span><span></span>
                </div>
                <p>Loading tickets...</p>
              </div>
            )}

            {!loading && filteredTickets.length === 0 && (
              <div className="admin-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <p>No tickets found</p>
              </div>
            )}

            {!loading && filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="ticket-card"
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/tickets/${ticket.id}`)}
              >
                <div className="ticket-card__header">
                  <span className={`ticket-card__status ${getStatusClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className="ticket-card__id">ID: #{ticket.id}</span>
                  <span className="ticket-card__time">{formatTime(ticket.createdAt)}</span>
                </div>
                <p className="ticket-card__query">"{ticket.query}"</p>
                <div className="ticket-card__footer">
                  <div className="ticket-card__avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-footer">
        <div className="admin-footer__inner">
          <div className="admin-footer__left">
            <span className="admin-footer__dot"></span>
            <span>Live Connection: Established</span>
            <span className="admin-footer__sep">•</span>
            <span>Node: 10-east-1</span>
          </div>
          <span className="admin-footer__right">v2.6.0 • MindX Support Systems</span>
        </div>
      </footer>
    </div>
  );
}
