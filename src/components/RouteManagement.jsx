import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowRight, X } from 'lucide-react';

export default function RouteManagement({ routes, onCreateRoute, onUpdateRoute, onDeleteRoute }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const initialForm = {
    routeNumber: '',
    routeName: '',
    startPoint: '',
    endPoint: 'Engineering Campus',
    departureTime: '07:30 AM',
    returnTime: '04:30 PM',
    stops: '',
    totalDistance: '20 km',
    estimatedDuration: '40 mins',
    activeBusesCount: 1
  };
  const [formData, setFormData] = useState(initialForm);

  const openCreateModal = () => {
    setEditingRoute(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (route) => {
    setEditingRoute(route);
    setFormData({
      routeNumber: route.routeNumber || '',
      routeName: route.routeName || '',
      startPoint: route.startPoint || '',
      endPoint: route.endPoint || '',
      departureTime: route.departureTime || '',
      returnTime: route.returnTime || '',
      stops: route.stops || '',
      totalDistance: route.totalDistance || '',
      estimatedDuration: route.estimatedDuration || '',
      activeBusesCount: route.activeBusesCount || 1
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.routeNumber || !formData.routeName || !formData.startPoint) {
      alert('Please fill all required fields');
      return;
    }

    if (editingRoute) {
      onUpdateRoute(editingRoute.id, formData);
    } else {
      onCreateRoute(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="controls-bar">
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>Bus Routes Directory</h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Official transit corridors, morning departure schedules, and stop points.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          <span>Add Route</span>
        </button>
      </div>

      <div className="routes-grid">
        {routes.map(route => {
          const stopsList = (route.stops || '').split(',').map(s => s.trim()).filter(Boolean);

          return (
            <div key={route.id} className="route-card">
              <div>
                <div className="route-card-header">
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '600' }}>
                    {route.routeNumber}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {route.activeBusesCount} Bus Assigned
                  </span>
                </div>

                <h3>{route.routeName}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <span>{route.startPoint}</span>
                  <ArrowRight size={13} color="#64748b" />
                  <span>{route.endPoint}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #f1f5f9' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Departure: </span>
                    <span style={{ fontWeight: '500' }}>{route.departureTime}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Return: </span>
                    <span style={{ fontWeight: '500' }}>{route.returnTime}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Distance: </span>
                    <span style={{ fontWeight: '500' }}>{route.totalDistance}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Duration: </span>
                    <span style={{ fontWeight: '500' }}>{route.estimatedDuration}</span>
                  </div>
                </div>

                {stopsList.length > 0 && (
                  <div className="stops-chain">
                    {stopsList.map((stop, sIdx) => (
                      <span key={sIdx} className="stop-tag">
                        {stop}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <button className="icon-btn" onClick={() => openEditModal(route)} title="Edit Route">
                  <Edit2 size={13} />
                </button>
                <button className="icon-btn delete" onClick={() => setDeleteConfirmId(route.id)} title="Delete Route">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingRoute ? `Edit Route ${editingRoute.routeNumber}` : 'Add New Route'}</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Route Code *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. R-106"
                      value={formData.routeNumber}
                      onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Active Buses</label>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.activeBusesCount}
                      onChange={(e) => setFormData({ ...formData, activeBusesCount: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  <div className="form-field form-group-full">
                    <label>Route Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Tarnaka - Habsiguda Express"
                      value={formData.routeName}
                      onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Start Hub *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Tarnaka Station"
                      value={formData.startPoint}
                      onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Destination *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Engineering Campus"
                      value={formData.endPoint}
                      onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Departure Time</label>
                    <input 
                      type="text" 
                      placeholder="07:15 AM"
                      value={formData.departureTime}
                      onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Return Time</label>
                    <input 
                      type="text" 
                      placeholder="04:30 PM"
                      value={formData.returnTime}
                      onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                    />
                  </div>

                  <div className="form-field form-group-full">
                    <label>Stops (Comma-separated)</label>
                    <input 
                      type="text" 
                      placeholder="Stop 1, Stop 2, Stop 3, Campus"
                      value={formData.stops}
                      onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Total Distance</label>
                    <input 
                      type="text" 
                      placeholder="25 km"
                      value={formData.totalDistance}
                      onChange={(e) => setFormData({ ...formData, totalDistance: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Est. Duration</label>
                    <input 
                      type="text" 
                      placeholder="45 mins"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoute ? 'Save Changes' : 'Create Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-card" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Delete Route</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setDeleteConfirmId(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Are you sure you want to delete this route from MySQL?
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => {
                  onDeleteRoute(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
