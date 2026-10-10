import React from 'react';
import { Bus, RefreshCw, LogOut, ShieldCheck, GraduationCap } from 'lucide-react';

export default function Header({ user, isBackendConnected, activeTab, onSelectTab, onRefresh, onLogout, loading }) {
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="top-navbar">
      <div className="navbar-inner">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <Bus size={20} />
          </div>
          <div className="brand-info">
            <h1>Anurag University Transit</h1>
            <p className="tagline">
              {isAdmin ? 'Administrator Portal • Full Fleet Edit Control' : 'Student Portal • Live Route Tracking'}
            </p>
          </div>
        </div>

        {isAdmin && (
          <nav className="nav-links">
            <button 
              className={`nav-btn ${activeTab === 'tracking' ? 'active' : ''}`}
              onClick={() => onSelectTab('tracking')}
            >
              Live Map
            </button>
            <button 
              className={`nav-btn ${activeTab === 'buses' ? 'active' : ''}`}
              onClick={() => onSelectTab('buses')}
            >
              Bus Fleet (20)
            </button>
            <button 
              className={`nav-btn ${activeTab === 'routes' ? 'active' : ''}`}
              onClick={() => onSelectTab('routes')}
            >
              Routes & Stops (20)
            </button>
            <button 
              className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => onSelectTab('students')}
            >
              Student Roster
            </button>
          </nav>
        )}

        <div className="nav-right-actions">
          <div className="status-badge connected">
            <span className="status-dot"></span>
            <span>{isBackendConnected ? 'Server Live' : 'Cloud Online'}</span>
          </div>

          <button 
            className="btn btn-secondary"
            onClick={onRefresh}
            disabled={loading}
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            title="Sync MySQL Data"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1e40af', background: '#eff6ff', padding: '3px 8px', borderRadius: '4px' }}>
              {isAdmin ? 'ADMIN' : (user?.student?.studentId || 'STUDENT')}
            </span>

            <button 
              className="btn btn-secondary"
              onClick={onLogout}
              style={{ padding: '6px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Logout"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
