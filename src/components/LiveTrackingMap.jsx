import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Phone, User, Clock, Gauge, Users, FastForward } from 'lucide-react';

export default function LiveTrackingMap({ buses, onUpdateTelemetry }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || 1);

  const selectedBus = buses.find(b => b.id === selectedBusId) || buses[0] || {};

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Hyderabad Eastern transit corridor (ECIL, Ghatkesar, Keesara, Campus)
    const map = L.map(mapContainerRef.current, {
      center: [17.4700, 78.6000],
      zoom: 12,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    }).addTo(map);

    // College Campus Marker
    const campusIcon = L.divIcon({
      className: 'custom-campus-pin',
      html: '<div style="background:#0f172a;color:#fff;border-radius:4px;padding:4px 8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:1px solid #ffffff;">🏫 Engineering Campus</div>',
      iconSize: [120, 30],
      iconAnchor: [60, 15]
    });
    L.marker([17.4560, 78.6720], { icon: campusIcon }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when buses change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    buses.forEach(bus => {
      const lat = bus.latitude || 17.4500;
      const lng = bus.longitude || 78.6000;
      const statusClass = (bus.status || 'running').toLowerCase();
      const numLabel = (bus.busNumber || 'B').replace('BUS-', '#');

      const customIcon = L.divIcon({
        className: `custom-bus-pin ${statusClass}`,
        html: `<span>${numLabel}</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
          <strong>${bus.busNumber}</strong> - ${bus.routeName}<br/>
          <span style="color:#64748b;">Driver:</span> ${bus.driverName}<br/>
          <span style="color:#64748b;">Location:</span> ${bus.currentLocation}<br/>
          <span style="color:#64748b;">Status:</span> ${bus.status}
        </div>
      `);

      marker.on('click', () => {
        setSelectedBusId(bus.id);
      });

      markersRef.current[bus.id] = marker;
    });
  }, [buses]);

  // Pan to selected bus
  const handleSelectBus = (bus) => {
    setSelectedBusId(bus.id);
    if (mapInstanceRef.current && bus.latitude && bus.longitude) {
      mapInstanceRef.current.panTo([bus.latitude, bus.longitude]);
    }
  };

  // Simulate GPS telemetry step
  const handleAdvanceStep = () => {
    if (!selectedBus.id) return;
    const nextStops = ['Ghatkesar Jn', 'Cherlapally Overpass', 'Narapally Arch', 'Campus Main Bay'];
    const randomStop = nextStops[Math.floor(Math.random() * nextStops.length)];
    const speed = `${Math.floor(30 + Math.random() * 25)} km/h`;
    
    // Nudge latitude/longitude slightly towards campus (17.456, 78.672)
    const currentLat = selectedBus.latitude || 17.48;
    const currentLng = selectedBus.longitude || 78.58;
    const targetLat = 17.4560;
    const targetLng = 78.6720;
    
    const newLat = currentLat + (targetLat - currentLat) * 0.15;
    const newLng = currentLng + (targetLng - currentLng) * 0.15;

    onUpdateTelemetry(selectedBus.id, {
      latitude: parseFloat(newLat.toFixed(4)),
      longitude: parseFloat(newLng.toFixed(4)),
      currentLocation: selectedBus.nextStop || 'In Transit',
      nextStop: randomStop,
      speed,
      status: 'Running'
    });
  };

  return (
    <div>
      <div className="controls-bar">
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>Live Transit Map</h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Real OpenStreetMap view with active fleet GPS locations and vehicle telemetry.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleAdvanceStep}>
          <FastForward size={15} />
          <span>Simulate Move for {selectedBus.busNumber || 'Bus'}</span>
        </button>
      </div>

      <div className="map-view-layout">
        {/* OpenStreetMap Real Canvas */}
        <div className="map-container-box">
          <div ref={mapContainerRef} style={{ width: '100%', height: '540px' }} />
        </div>

        {/* Selected Bus Telemetry Sidebar */}
        <div className="map-sidebar-box">
          <div>
            <div className="sidebar-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={18} color="#1e40af" />
                  {selectedBus.busNumber}
                </h3>
                <span className={`badge ${(selectedBus.status || 'running').toLowerCase()}`}>
                  {selectedBus.status}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {selectedBus.routeName}
              </div>
            </div>

            <div>
              <div className="sidebar-row">
                <span className="lbl">Current Stop</span>
                <span className="val">{selectedBus.currentLocation}</span>
              </div>
              <div className="sidebar-row">
                <span className="lbl">Next Stop</span>
                <span className="val">{selectedBus.nextStop || 'Campus Bay'}</span>
              </div>
              <div className="sidebar-row">
                <span className="lbl">Speed</span>
                <span className="val" style={{ color: '#059669' }}>{selectedBus.speed || '0 km/h'}</span>
              </div>
              <div className="sidebar-row">
                <span className="lbl">Est. Arrival</span>
                <span className="val">{selectedBus.estimatedArrival || '--'}</span>
              </div>
              <div className="sidebar-row">
                <span className="lbl">Driver</span>
                <span className="val">{selectedBus.driverName}</span>
              </div>
              {selectedBus.driverPhone && (
                <div className="sidebar-row">
                  <span className="lbl">Contact</span>
                  <a href={`tel:${selectedBus.driverPhone}`} style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '500' }}>
                    {selectedBus.driverPhone}
                  </a>
                </div>
              )}
              <div className="sidebar-row">
                <span className="lbl">Seats Occupied</span>
                <span className="val">{selectedBus.occupiedSeats || 0} / {selectedBus.capacity || 50}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Quick Select Bus:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {buses.map(b => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBus(b)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    background: b.id === selectedBus.id ? '#1e40af' : '#ffffff',
                    color: b.id === selectedBus.id ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {b.busNumber}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
