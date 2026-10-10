import React, { useState } from 'react';
import { Search, MapPin, Phone, User, Clock, CheckCircle } from 'lucide-react';

export default function StudentFinder({ buses, routes }) {
  const [selectedStop, setSelectedStop] = useState('ECIL');

  const popularStops = [
    'ECIL', 'Tarnaka', 'Habsiguda', 'Uppal', 'Radhika', 
    'Ghatkesar', 'Keesara', 'Cherlapally', 'Medipally'
  ];

  const matchingBuses = buses.filter(bus => {
    const q = selectedStop.toLowerCase();
    const matchesBus = 
      (bus.routeName || '').toLowerCase().includes(q) ||
      (bus.currentLocation || '').toLowerCase().includes(q) ||
      (bus.nextStop || '').toLowerCase().includes(q);

    const relatedRoute = routes.find(r => 
      (r.routeName || '').toLowerCase() === (bus.routeName || '').toLowerCase() ||
      (r.stops || '').toLowerCase().includes(q)
    );

    return matchesBus || !!relatedRoute;
  });

  return (
    <div>
      <div className="student-search-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Find Your College Bus
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Search your residential boarding stop to check which buses serve your location, current progress, and contact details.
        </p>

        <div style={{ marginTop: '16px', maxWidth: '480px' }}>
          <div className="search-box" style={{ maxWidth: '100%' }}>
            <Search size={16} />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search boarding stop (e.g. Tarnaka, ECIL, Uppal)..."
              value={selectedStop}
              onChange={(e) => setSelectedStop(e.target.value)}
            />
          </div>
        </div>

        <div className="popular-chips">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Popular stops:</span>
          {popularStops.map(stop => (
            <button 
              key={stop}
              className={`chip ${selectedStop.toLowerCase() === stop.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedStop(stop)}
            >
              {stop}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Buses passing through "{selectedStop}" ({matchingBuses.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Live status from MySQL database
          </span>
        </div>

        {matchingBuses.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No buses currently found for stop "{selectedStop}". Please select another stop above.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {matchingBuses.map(bus => (
              <div key={bus.id} className="route-card">
                <div>
                  <div className="route-card-header">
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{bus.busNumber}</strong>
                    <span className={`badge ${(bus.status || 'running').toLowerCase()}`}>
                      {bus.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {bus.routeName}
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', lineHeight: '1.6', marginBottom: '12px' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Current Stop:</span> <strong>{bus.currentLocation}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Next Stop:</span> <strong>{bus.nextStop || 'Campus Bay'}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Boarding ETA:</span> <strong style={{ color: '#047857' }}>{bus.estimatedArrival || 'On Schedule'}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Seats Available:</span> <strong>{(bus.capacity || 50) - (bus.occupiedSeats || 0)} vacant</strong></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Driver: {bus.driverName}</span>
                    {bus.driverPhone && (
                      <a href={`tel:${bus.driverPhone}`} style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} /> Call
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle size={13} color="#059669" />
                  <span>College transportation pass required.</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
