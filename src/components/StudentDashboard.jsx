import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Bus, MapPin, Phone, User, Clock, Navigation, CheckCircle2, AlertTriangle, ArrowRight, LogOut, ShieldAlert } from 'lucide-react';

export default function StudentDashboard({ student, buses, routes, onLogout }) {
  const [activeTab, setActiveTab] = useState('mybus'); // 'mybus' | 'allroutes' | 'allbuses'
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Find student's assigned bus
  const myBus = buses.find(b => (b.busNumber || '').toLowerCase() === (student.assignedBusNumber || '').toLowerCase()) || buses[0] || {};
  const myRoute = routes.find(r => (r.routeName || '').toLowerCase() === (student.assignedRoute || '').toLowerCase()) || routes[0] || {};

  // Setup Leaflet map for student view
  useEffect(() => {
    if (activeTab !== 'mybus') return;
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Anurag University coordinates: 17.4200, 78.6560
    const lat = myBus.latitude || 17.4500;
    const lng = myBus.longitude || 78.6000;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    }).addTo(map);

    // Anurag University Campus Pin
    const campusIcon = L.divIcon({
      className: 'custom-campus-pin',
      html: '<div style="background:#1e40af;color:#fff;border-radius:4px;padding:4px 8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:1px solid #ffffff;">🏫 Anurag University (Campus)</div>',
      iconSize: [160, 30],
      iconAnchor: [80, 15]
    });
    L.marker([17.4200, 78.6560], { icon: campusIcon }).addTo(map);

    // My Bus Pin
    const busIcon = L.divIcon({
      className: `custom-bus-pin ${(myBus.status || 'running').toLowerCase()}`,
      html: `<span>${(myBus.busNumber || 'B').replace('BUS-', '#')}</span>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
    const busMarker = L.marker([lat, lng], { icon: busIcon }).addTo(map);
    busMarker.bindPopup(`<strong>${myBus.busNumber}</strong><br/>Route: ${myBus.routeName}<br/>Location: ${myBus.currentLocation}`);

    mapInstanceRef.current = map;
    markerRef.current = busMarker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeTab, myBus]);

  // Update marker when myBus updates
  useEffect(() => {
    if (markerRef.current && myBus.latitude && myBus.longitude) {
      markerRef.current.setLatLng([myBus.latitude, myBus.longitude]);
    }
  }, [myBus]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="navbar-inner">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <Bus size={20} />
            </div>
            <div className="brand-info">
              <h1>Anurag University Transit</h1>
              <p className="tagline">Student Bus Portal • Read-Only Tracking</p>
            </div>
          </div>

          <nav className="nav-links">
            <button 
              className={`nav-btn ${activeTab === 'mybus' ? 'active' : ''}`}
              onClick={() => setActiveTab('mybus')}
            >
              My Bus & Live GPS
            </button>
            <button 
              className={`nav-btn ${activeTab === 'allroutes' ? 'active' : ''}`}
              onClick={() => setActiveTab('allroutes')}
            >
              All Hyderabad Routes (20)
            </button>
            <button 
              className={`nav-btn ${activeTab === 'allbuses' ? 'active' : ''}`}
              onClick={() => setActiveTab('allbuses')}
            >
              All 20 Buses Status
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
              <strong>{student.name}</strong> ({student.studentId})
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.branch} Department</div>
            </div>

            <button 
              className="btn btn-secondary"
              onClick={onLogout}
              style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Sign Out"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="page-container">
        
        {/* Notice Banner */}
        <div style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#1e40af', color: '#fff', borderRadius: '999px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: '600' }}>STUDENT ROLE</span>
            <span>You have student view access. Fleet and route modifications are reserved for university administrators.</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>Destination: Anurag University (Ghatkesar)</span>
        </div>

        {/* VIEW 1: MY ASSIGNED BUS & LIVE GPS */}
        {activeTab === 'mybus' && (
          <div>
            {/* Student Pass Header Card */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '20px 24px', boxShadow: 'var(--shadow-sm)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Your Assigned Transportation
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)', margin: '4px 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {myBus.busNumber || student.assignedBusNumber}
                  <span className={`badge ${(myBus.status || 'running').toLowerCase()}`}>
                    {myBus.status || 'Running'}
                  </span>
                </h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <strong>Route:</strong> {student.assignedRoute}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your Boarding Stop</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{student.boardingStop}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Arrival (ETA)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#047857' }}>{myBus.estimatedArrival || '08:15 AM'}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available Seats</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1d4ed8' }}>
                    {(myBus.capacity || 50) - (myBus.occupiedSeats || 0)} vacant
                  </div>
                </div>
              </div>
            </div>

            {/* Live Map & Bus Details Grid */}
            <div className="map-view-layout">
              <div className="map-container-box">
                <div ref={mapContainerRef} style={{ width: '100%', height: '520px' }} />
              </div>

              <div className="map-sidebar-box">
                <div>
                  <div className="sidebar-header">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                      Live Vehicle Telemetry
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Reporting live GPS to Anurag University
                    </div>
                  </div>

                  <div>
                    <div className="sidebar-row">
                      <span className="lbl">Current Location</span>
                      <span className="val">{myBus.currentLocation}</span>
                    </div>
                    <div className="sidebar-row">
                      <span className="lbl">Next Stop</span>
                      <span className="val">{myBus.nextStop || 'Anurag University'}</span>
                    </div>
                    <div className="sidebar-row">
                      <span className="lbl">Live Speed</span>
                      <span className="val" style={{ color: '#047857' }}>{myBus.speed || '40 km/h'}</span>
                    </div>
                    <div className="sidebar-row">
                      <span className="lbl">Driver Name</span>
                      <span className="val">{myBus.driverName}</span>
                    </div>
                    {myBus.driverPhone && (
                      <div className="sidebar-row">
                        <span className="lbl">Driver Phone</span>
                        <a href={`tel:${myBus.driverPhone}`} style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={13} /> {myBus.driverPhone}
                        </a>
                      </div>
                    )}
                    <div className="sidebar-row">
                      <span className="lbl">Final Destination</span>
                      <span className="val">Anurag University Gate 1</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '12px', fontSize: '0.8rem', color: '#1e40af', lineHeight: '1.5' }}>
                  <strong>Student Transit Guideline:</strong> Please report to your pickup point (<strong>{student.boardingStop}</strong>) 5 minutes prior to scheduled arrival time.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ALL 20 HYDERABAD ROUTES */}
        {activeTab === 'allroutes' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                All 20 Hyderabad Transit Routes to Anurag University
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Covering ECIL, Secunderabad, Dilsukhnagar, Keesara, Mehdipatnam, Kukatpally, Miyapur, LB Nagar, Charminar, and suburbs.
              </p>
            </div>

            <div className="routes-grid">
              {routes.map(route => {
                const stopsList = (route.stops || '').split(',').map(s => s.trim()).filter(Boolean);
                const isMyRoute = (route.routeName || '').toLowerCase() === (student.assignedRoute || '').toLowerCase();

                return (
                  <div key={route.id} className="route-card" style={{ border: isMyRoute ? '2px solid #1e40af' : '1px solid var(--border-color)' }}>
                    <div>
                      <div className="route-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '600' }}>
                            {route.routeNumber}
                          </span>
                          {isMyRoute && (
                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '600' }}>
                              YOUR ROUTE
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {route.totalDistance}
                        </span>
                      </div>

                      <h3>{route.routeName}</h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        <span>{route.startPoint}</span>
                        <ArrowRight size={13} color="#64748b" />
                        <span>Anurag University</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #f1f5f9' }}>
                        <div><span style={{ color: 'var(--text-muted)' }}>Departure: </span><strong>{route.departureTime}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Return: </span><strong>{route.returnTime}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Duration: </span><strong>{route.estimatedDuration}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Bus Code: </span><strong>BUS-{(route.id < 10 ? '0' : '') + route.id}</strong></div>
                      </div>

                      {stopsList.length > 0 && (
                        <div className="stops-chain">
                          {stopsList.map((stop, sIdx) => (
                            <span key={sIdx} className="stop-tag" style={{ background: stop.toLowerCase().includes((student.boardingStop || '').toLowerCase()) ? '#eff6ff' : 'var(--bg-subtle)', borderColor: stop.toLowerCase().includes((student.boardingStop || '').toLowerCase()) ? '#93c5fd' : 'var(--border-color)' }}>
                              {stop}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: ALL 20 BUSES STATUS (READ-ONLY) */}
        {activeTab === 'allbuses' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Anurag University Fleet Overview (20 Buses)
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Real-time operational status of all university buses in transit across Hyderabad.
              </p>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bus Number</th>
                    <th>Route Name</th>
                    <th>Current Location</th>
                    <th>Next Stop</th>
                    <th>Status</th>
                    <th>Driver Contact</th>
                    <th>Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map(bus => {
                    const isMyBus = (bus.busNumber || '').toLowerCase() === (student.assignedBusNumber || '').toLowerCase();

                    return (
                      <tr key={bus.id} style={{ background: isMyBus ? '#eff6ff' : 'transparent' }}>
                        <td>
                          <strong>{bus.busNumber}</strong>
                          {isMyBus && <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#1d4ed8', fontWeight: '700' }}>(YOURS)</span>}
                        </td>
                        <td>{bus.routeName}</td>
                        <td>{bus.currentLocation}</td>
                        <td>{bus.nextStop || 'Anurag University'}</td>
                        <td>
                          <span className={`badge ${(bus.status || 'running').toLowerCase()}`}>
                            {bus.status}
                          </span>
                        </td>
                        <td>
                          <div>{bus.driverName}</div>
                          {bus.driverPhone && (
                            <a href={`tel:${bus.driverPhone}`} style={{ fontSize: '0.75rem', color: '#1e40af', textDecoration: 'none' }}>
                              {bus.driverPhone}
                            </a>
                          )}
                        </td>
                        <td>{bus.occupiedSeats} / {bus.capacity} seats</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
