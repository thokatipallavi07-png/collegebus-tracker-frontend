import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, GraduationCap } from 'lucide-react';

export default function StudentManagement({ students, routes, buses, onCreateStudent, onUpdateStudent, onDeleteStudent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const initialForm = {
    studentId: '',
    name: '',
    password: 'pass123',
    email: '',
    branch: 'CSE',
    assignedBusNumber: 'BUS-01',
    assignedRoute: 'ECIL to Anurag University',
    boardingStop: 'Radhika Junction',
    phone: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const openCreateModal = () => {
    setEditingStudent(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (std) => {
    setEditingStudent(std);
    setFormData({
      studentId: std.studentId || '',
      name: std.name || '',
      password: std.password || '',
      email: std.email || '',
      branch: std.branch || 'CSE',
      assignedBusNumber: std.assignedBusNumber || 'BUS-01',
      assignedRoute: std.assignedRoute || '',
      boardingStop: std.boardingStop || '',
      phone: std.phone || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.name || !formData.assignedRoute) {
      alert('Please fill all required fields');
      return;
    }

    if (editingStudent) {
      onUpdateStudent(editingStudent.id, formData);
    } else {
      onCreateStudent(formData);
    }
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter(s => 
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.assignedRoute || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.branch || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="controls-bar">
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            className="search-input"
            placeholder="Search students by Roll No, name, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          <span>Add New Student</span>
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll No. / ID</th>
              <th>Student Name</th>
              <th>Branch</th>
              <th>Assigned Bus</th>
              <th>Assigned Route</th>
              <th>Boarding Stop</th>
              <th>Contact</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map(std => (
                <tr key={std.id}>
                  <td>
                    <strong style={{ color: '#1e40af' }}>{std.studentId}</strong>
                  </td>
                  <td>{std.name}</td>
                  <td>
                    <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                      {std.branch}
                    </span>
                  </td>
                  <td>
                    <strong>{std.assignedBusNumber}</strong>
                  </td>
                  <td>{std.assignedRoute}</td>
                  <td>{std.boardingStop}</td>
                  <td>{std.phone || std.email || '--'}</td>
                  <td>
                    <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                      <button className="icon-btn" onClick={() => openEditModal(std)} title="Edit Student">
                        <Edit2 size={13} />
                      </button>
                      <button className="icon-btn delete" onClick={() => setDeleteConfirmId(std.id)} title="Delete Student">
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

      {/* CREATE / EDIT STUDENT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingStudent ? `Edit Student ${editingStudent.studentId}` : 'Register New Student'}</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Student Roll No / ID *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. AU21011"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Login Password *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. pass123"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>

                  <div className="form-field form-group-full">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Vikas Reddy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Department / Branch</label>
                    <select 
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="AI&ML">AI & ML</option>
                      <option value="DATA SCIENCE">Data Science</option>
                      <option value="IT">IT</option>
                      <option value="MECH">MECH</option>
                      <option value="CIVIL">CIVIL</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Assigned Bus</label>
                    <select 
                      value={formData.assignedBusNumber}
                      onChange={(e) => {
                        const selectedBus = buses.find(b => b.busNumber === e.target.value);
                        setFormData({ 
                          ...formData, 
                          assignedBusNumber: e.target.value,
                          assignedRoute: selectedBus ? selectedBus.routeName : formData.assignedRoute
                        });
                      }}
                    >
                      {buses.map(b => (
                        <option key={b.id} value={b.busNumber}>{b.busNumber} ({b.routeName})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field form-group-full">
                    <label>Assigned Route Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.assignedRoute}
                      onChange={(e) => setFormData({ ...formData, assignedRoute: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Boarding Stop</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Uppal Ring Road"
                      value={formData.boardingStop}
                      onChange={(e) => setFormData({ ...formData, boardingStop: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Student Phone</label>
                    <input 
                      type="text" 
                      placeholder="+91 98480 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Save Student' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-card" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Remove Student</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setDeleteConfirmId(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Are you sure you want to delete this student pass record from MySQL?
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => {
                  onDeleteStudent(deleteConfirmId);
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
