import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminUsers } from '../services/api';
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
  const [users, setUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchMobile, setSearchMobile] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers(mobile) {
    setLoading(true);
    try {
      const data = await getAdminUsers(mobile || undefined);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // digits only
    setSearchMobile(value);
    if (value.length === 10) {
      fetchUsers(value);
    } else if (value.length === 0) {
      fetchUsers();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mindx_user');
    navigate('/auth');
  };

  const filteredUsers = activeFilter === 'ALL'
    ? users
    : users.filter((u) => u.currentStatus === activeFilter);

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
        <div className="admin-header__right">
          <span className="admin-header__badge">Admin v2.6.0</span>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-main__inner">
          {/* Title section */}
          <div className="admin-title-section">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">User-based support queue with conversation history.</p>
          </div>

          {/* Analytics section */}
          {!loading && (
            <div className="admin-analytics">
              <div className="admin-analytics__card">
                <span className="admin-analytics__label">Total Users</span>
                <span className="admin-analytics__count">{users.length}</span>
              </div>
              <div className="admin-analytics__card admin-analytics__card--open">
                <span className="admin-analytics__label">Open</span>
                <span className="admin-analytics__count admin-analytics__count--open">
                  {users.filter(u => u.currentStatus === 'OPEN').length}
                </span>
              </div>
              <div className="admin-analytics__card admin-analytics__card--resolved">
                <span className="admin-analytics__label">Resolved</span>
                <span className="admin-analytics__count admin-analytics__count--resolved">
                  {users.filter(u => u.currentStatus === 'RESOLVED').length}
                </span>
              </div>
              <div className="admin-analytics__card admin-analytics__card--needs-human">
                <span className="admin-analytics__label">Needs Human</span>
                <span className="admin-analytics__count admin-analytics__count--needs-human">
                  {users.filter(u => u.currentStatus === 'NEEDS_HUMAN').length}
                </span>
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="admin-search">
            <div className="admin-search__wrapper">
              <svg className="admin-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="admin-search__input"
                placeholder="Search by mobile number..."
                value={searchMobile}
                onChange={handleSearch}
                maxLength={10}
              />
              {searchMobile && (
                <button className="admin-search__clear" onClick={() => { setSearchMobile(''); fetchUsers(); }}>
                  ×
                </button>
              )}
            </div>
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

          {/* User cards */}
          <div className="admin-tickets">
            {loading && (
              <div className="admin-empty">
                <div className="admin-loading-dots">
                  <span></span><span></span><span></span>
                </div>
                <p>Loading users...</p>
              </div>
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="admin-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <p>No users found</p>
              </div>
            )}

            {!loading && filteredUsers.map((user) => (
              <div
                key={user.userId}
                className="ticket-card"
                onClick={() => navigate(`/admin/users/${user.userId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/admin/users/${user.userId}`)}
              >
                <div className="ticket-card__header">
                  <span className={`ticket-card__status ${getStatusClass(user.currentStatus)}`}>
                    {user.currentStatus}
                  </span>
                  <span className="ticket-card__id">ID: #{user.userId}</span>
                  <span className="ticket-card__time">
                    {user.latestMessageTimestamp ? formatTime(user.latestMessageTimestamp) : 'No messages'}
                  </span>
                </div>
                <div className="ticket-card__user-info">
                  <div className="ticket-card__user-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                    </svg>
                  </div>
                  <div className="ticket-card__user-details">
                    <span className="ticket-card__user-name">{user.name}</span>
                    <span className="ticket-card__user-email">{user.email}</span>
                  </div>
                  <span className="ticket-card__user-mobile">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                    {user.mobileNumber}
                  </span>
                </div>
                {user.latestMessage && (
                  <p className="ticket-card__query">"{user.latestMessage}"</p>
                )}
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
