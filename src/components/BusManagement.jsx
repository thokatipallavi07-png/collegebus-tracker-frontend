import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Phone, X, LayoutList, LayoutGrid } from 'lucide-react';

export default function BusManagement({ buses, onCreateBus, onUpdateBus, onDeleteBus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form state
  const initialForm = {
    busNumber: '',
    routeName: '',
    driverName: '',
    driverPhone: '',
    currentLocation: '',
    status: 'Running',
    capacity: 50,
    occupiedSeats: 0,
    speed: '40 km/h',
    estimatedArrival: '08:30 AM',
    nextStop: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const openCreateModal = () => {
    setEditingBus(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (bus) => {
    setEditingBus(bus);
    setFormData({
      busNumber: bus.busNumber || '',
      routeName: bus.routeName || '',
      driverName: bus.driverName || '',
      driverPhone: bus.driverPhone || '',
      currentLocation: bus.currentLocation || '',
      status: bus.status || 'Running',
      capacity: bus.capacity || 50,
      occupiedSeats: bus.occupiedSeats || 0,
      speed: bus.speed || '0 km/h',
      estimatedArrival: bus.estimatedArrival || '',
      nextStop: bus.nextStop || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.busNumber || !formData.routeName || !formData.driverName) {
      alert('Please fill all required fields');
      return;
    }

    if (editingBus) {
      onUpdateBus(editingBus.id, formData);
    } else {
      onCreateBus(formData);
    }
    setIsModalOpen(false);
  };

  const filteredBuses = buses.filter(bus => {
    const matchesSearch = 
      (bus.busNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bus.routeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bus.driverName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bus.currentLocation || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || (bus.status || '').toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Controls Bar */}
      <div className="controls-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search by bus number, route, or driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            {['ALL', 'RUNNING', 'DELAYED', 'COMPLETED', 'MAINTENANCE'].map(st => (
              <button 
                key={st}
                className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <button 
              className="icon-btn" 
              onClick={() => setViewMode('table')} 
              style={{ background: viewMode === 'table' ? '#f1f5f9' : '#fff', border: 'none', borderRadius: 0 }}
              title="Table View"
            >
              <LayoutList size={15} />
            </button>
            <button 
              className="icon-btn" 
              onClick={() => setViewMode('cards')} 
              style={{ background: viewMode === 'cards' ? '#f1f5f9' : '#fff', border: 'none', borderRadius: 0 }}
              title="Card View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={16} />
            <span>Add Bus</span>
          </button>
        </div>
      </div>

      {/* View Mode: Data Table */}
      {viewMode === 'table' ? (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bus No.</th>
                <th>Route Name</th>
                <th>Driver Details</th>
                <th>Current Stop</th>
                <th>Next Stop</th>
                <th>Status</th>
                <th>Occupancy</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No bus records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredBuses.map(bus => (
                  <tr key={bus.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{bus.busNumber}</strong>
                    </td>
                    <td>{bus.routeName}</td>
                    <td>
                      <div>{bus.driverName}</div>
                      {bus.driverPhone && (
                        <a href={`tel:${bus.driverPhone}`} style={{ fontSize: '0.78rem', color: '#1e40af', textDecoration: 'none' }}>
                          {bus.driverPhone}
                        </a>
                      )}
                    </td>
                    <td>{bus.currentLocation}</td>
                    <td>{bus.nextStop || 'Campus Bay'}</td>
                    <td>
                      <span className={`badge ${(bus.status || 'running').toLowerCase()}`}>
                        {bus.status}
                      </span>
                    </td>
                    <td>
                      <span>{bus.occupiedSeats || 0} / {bus.capacity || 50}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                        ({Math.round(((bus.occupiedSeats || 0) / (bus.capacity || 50)) * 100)}%)
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button className="icon-btn" onClick={() => openEditModal(bus)} title="Edit Bus">
                          <Edit2 size={13} />
                        </button>
                        <button className="icon-btn delete" onClick={() => setDeleteConfirmId(bus.id)} title="Delete Bus">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* View Mode: Cards */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredBuses.map(bus => (
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
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  <div><strong>Location:</strong> {bus.currentLocation}</div>
                  <div><strong>Next Stop:</strong> {bus.nextStop || 'Campus Bay'}</div>
                  <div><strong>Driver:</strong> {bus.driverName} ({bus.driverPhone || 'No phone'})</div>
                  <div><strong>Occupancy:</strong> {bus.occupiedSeats} / {bus.capacity} seats</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => openEditModal(bus)}>
                  Edit
                </button>
                <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setDeleteConfirmId(bus.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingBus ? `Edit Bus ${editingBus.busNumber}` : 'Add New Bus'}</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Bus Number *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. BUS-07"
                      value={formData.busNumber}
                      onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Running">Running</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Completed">Completed</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div className="form-field form-group-full">
                    <label>Route Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Keesara to Main Campus"
                      value={formData.routeName}
                      onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Driver Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Driver full name"
                      value={formData.driverName}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Driver Phone</label>
                    <input 
                      type="text" 
                      placeholder="+91 98765 43210"
                      value={formData.driverPhone}
                      onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Current Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ECIL X Roads"
                      value={formData.currentLocation}
                      onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Next Stop</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cherlapally"
                      value={formData.nextStop}
                      onChange={(e) => setFormData({ ...formData, nextStop: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Total Capacity</label>
                    <input 
                      type="number" 
                      min="10" 
                      max="100"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 50 })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Occupied Seats</label>
                    <input 
                      type="number" 
                      min="0" 
                      max={formData.capacity}
                      value={formData.occupiedSeats}
                      onChange={(e) => setFormData({ ...formData, occupiedSeats: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBus ? 'Save Changes' : 'Create Bus'}
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
              <h3>Confirm Deletion</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setDeleteConfirmId(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Are you sure you want to delete this bus from the MySQL database? This action cannot be undone.
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => {
                  onDeleteBus(deleteConfirmId);
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
