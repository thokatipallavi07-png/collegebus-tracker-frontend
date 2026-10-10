import React, { useState } from 'react';
import { Bus, Lock, User, GraduationCap, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [username, setUsername] = useState('AU21001');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await onLoginSuccess(role, username.trim(), password.trim());
      if (!result.success) {
        setError(result.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const setDemoLogin = (demoRole, user, pass) => {
    setRole(demoRole);
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '28px 24px 20px', textAlign: 'center', borderBottom: '1px solid var(--border-color)', background: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', background: '#1e40af', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#fff' }}>
            <Bus size={26} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px' }}>
            Anurag University
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
            College Bus Transit & Fleet Tracking Portal
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
          <button
            type="button"
            onClick={() => { setRole('student'); setUsername('AU21001'); setPassword('pass123'); setError(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: role === 'student' ? '#ffffff' : 'transparent',
              color: role === 'student' ? '#1e40af' : 'var(--text-secondary)',
              fontWeight: role === 'student' ? '600' : '500',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              borderBottom: role === 'student' ? '2px solid #1e40af' : 'none'
            }}
          >
            <GraduationCap size={16} />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('admin'); setUsername('admin'); setPassword('admin123'); setError(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: role === 'admin' ? '#ffffff' : 'transparent',
              color: role === 'admin' ? '#1e40af' : 'var(--text-secondary)',
              fontWeight: role === 'admin' ? '600' : '500',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              borderBottom: role === 'admin' ? '2px solid #1e40af' : 'none'
            }}
          >
            <ShieldCheck size={16} />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '6px', fontSize: '0.825rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {role === 'student' ? 'Student ID / Roll No' : 'Admin Username'}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  placeholder={role === 'student' ? 'e.g. AU21001' : 'admin'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                background: '#1e40af',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{loading ? 'Authenticating...' : role === 'student' ? 'Access Student Bus Pass' : 'Sign in as Administrator'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Quick Demo Accounts:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setDemoLogin('student', 'AU21001', 'pass123')}
                style={{ textAlign: 'left', background: '#f8fafc', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                🎓 <strong>AU21001</strong> - Rahul (ECIL / BUS-01) - Pass: <code>pass123</code>
              </button>
              <button
                type="button"
                onClick={() => setDemoLogin('student', 'AU21002', 'pass123')}
                style={{ textAlign: 'left', background: '#f8fafc', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                🎓 <strong>AU21002</strong> - Priya (Secunderabad / BUS-02) - Pass: <code>pass123</code>
              </button>
              <button
                type="button"
                onClick={() => setDemoLogin('student', 'AU21003', 'pass123')}
                style={{ textAlign: 'left', background: '#f8fafc', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                🎓 <strong>AU21003</strong> - Sai Teja (Dilsukhnagar / BUS-03) - Pass: <code>pass123</code>
              </button>
              <button
                type="button"
                onClick={() => setDemoLogin('admin', 'admin', 'admin123')}
                style={{ textAlign: 'left', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', color: '#1e40af' }}
              >
                🔑 <strong>admin</strong> - Transport Manager (Full CRUD) - Pass: <code>admin123</code>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
