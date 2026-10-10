import React from 'react';
import { Bus, Navigation, AlertTriangle, Users } from 'lucide-react';

export default function StatsBanner({ stats }) {
  const {
    totalBuses = 0,
    runningBuses = 0,
    delayedBuses = 0,
    totalCapacity = 0,
    totalOccupied = 0,
    occupancyPercentage = 0
  } = stats || {};

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div>
          <div className="title">Total Buses</div>
          <div className="count">{totalBuses}</div>
        </div>
        <div className="metric-icon-box blue">
          <Bus size={20} />
        </div>
      </div>

      <div className="metric-card">
        <div>
          <div className="title">Active On Route</div>
          <div className="count">{runningBuses}</div>
        </div>
        <div className="metric-icon-box green">
          <Navigation size={20} />
        </div>
      </div>

      <div className="metric-card">
        <div>
          <div className="title">Delayed / Traffic</div>
          <div className="count">{delayedBuses}</div>
        </div>
        <div className="metric-icon-box amber">
          <AlertTriangle size={20} />
        </div>
      </div>

      <div className="metric-card">
        <div>
          <div className="title">Fleet Occupancy</div>
          <div className="count">{occupancyPercentage}%</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
            {totalOccupied} / {totalCapacity} seats
          </div>
        </div>
        <div className="metric-icon-box gray">
          <Users size={20} />
        </div>
      </div>
    </div>
  );
}
