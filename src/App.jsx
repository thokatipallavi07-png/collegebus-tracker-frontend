import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import StatsBanner from './components/StatsBanner';
import LiveTrackingMap from './components/LiveTrackingMap';
import BusManagement from './components/BusManagement';
import RouteManagement from './components/RouteManagement';
import StudentManagement from './components/StudentManagement';
import StudentDashboard from './components/StudentDashboard';
import Toast from './components/Toast';
import { api } from './api';
import './App.css';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('au_bus_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('tracking');
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalBuses: 20,
    runningBuses: 16,
    delayedBuses: 3,
    totalCapacity: 1040,
    totalOccupied: 935,
    occupancyPercentage: 90
  });

  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch data from Spring Boot REST API
  const loadData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      
      const [busesData, routesData, statsData, studentsData] = await Promise.all([
        api.getBuses().catch(() => []),
        api.getRoutes().catch(() => []),
        api.getStats().catch(() => null),
        api.getStudents().catch(() => [])
      ]);

      if (Array.isArray(busesData) && busesData.length > 0) {
        setBuses(busesData);
      }
      if (Array.isArray(routesData) && routesData.length > 0) {
        setRoutes(routesData);
      }
      if (statsData) {
        setStats(statsData);
      }
      if (Array.isArray(studentsData)) {
        setStudents(studentsData);
      }
      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend connection status:', err.message);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);
    const pollInterval = setInterval(() => {
      loadData(false);
    }, 8000);
    return () => clearInterval(pollInterval);
  }, [loadData]);

  // Auth Handlers
  const handleLogin = async (role, username, password) => {
    try {
      const response = await api.login(role, username, password);
      if (response.authenticated) {
        const userData = {
          role: response.role,
          name: response.name || response.student?.name,
          username: response.username,
          student: response.student
        };
        setCurrentUser(userData);
        localStorage.setItem('au_bus_user', JSON.stringify(userData));
        addToast(`Welcome, ${userData.name}! Logged in as ${response.role}.`, 'success');
        return { success: true };
      }
      return { success: false, message: response.message || 'Invalid credentials' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('au_bus_user');
    addToast('Signed out successfully.', 'info');
  };

  // Bus CRUD Handlers (Admin)
  const handleCreateBus = async (busData) => {
    try {
      const created = await api.createBus(busData);
      setBuses(prev => [...prev, created]);
      addToast(`Bus ${created.busNumber} added successfully to MySQL!`, 'success');
      loadData();
    } catch (err) {
      addToast(`Error adding bus: ${err.message}`, 'error');
    }
  };

  const handleUpdateBus = async (id, busData) => {
    try {
      const updated = await api.updateBus(id, busData);
      setBuses(prev => prev.map(b => b.id === id ? updated : b));
      addToast(`Bus ${busData.busNumber} updated successfully.`, 'success');
      loadData();
    } catch (err) {
      addToast(`Error updating bus: ${err.message}`, 'error');
    }
  };

  const handleUpdateTelemetry = async (id, telemetryData) => {
    try {
      const updated = await api.updateTelemetry(id, telemetryData);
      setBuses(prev => prev.map(b => b.id === id ? updated : b));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBus = async (id) => {
    const targetBus = buses.find(b => b.id === id);
    const busNum = targetBus?.busNumber || `ID #${id}`;
    try {
      await api.deleteBus(id);
      setBuses(prev => prev.filter(b => b.id !== id));
      addToast(`Bus ${busNum} deleted from MySQL.`, 'success');
      loadData();
    } catch (err) {
      addToast(`Error deleting bus: ${err.message}`, 'error');
    }
  };

  // Route CRUD Handlers (Admin)
  const handleCreateRoute = async (routeData) => {
    try {
      const created = await api.createRoute(routeData);
      setRoutes(prev => [...prev, created]);
      addToast(`Route ${created.routeNumber} created.`, 'success');
      loadData();
    } catch (err) {
      addToast(`Error creating route: ${err.message}`, 'error');
    }
  };

  const handleUpdateRoute = async (id, routeData) => {
    try {
      const updated = await api.updateRoute(id, routeData);
      setRoutes(prev => prev.map(r => r.id === id ? updated : r));
      addToast(`Route ${routeData.routeNumber} updated.`, 'success');
      loadData();
    } catch (err) {
      addToast(`Error updating route: ${err.message}`, 'error');
    }
  };

  const handleDeleteRoute = async (id) => {
    const target = routes.find(r => r.id === id);
    const routeNum = target?.routeNumber || `ID #${id}`;
    try {
      await api.deleteRoute(id);
      setRoutes(prev => prev.filter(r => r.id !== id));
      addToast(`Route ${routeNum} deleted.`, 'success');
      loadData();
    } catch (err) {
      addToast(`Error deleting route: ${err.message}`, 'error');
    }
  };

  // Student CRUD Handlers (Admin)
  const handleCreateStudent = async (studentData) => {
    try {
      const created = await api.createStudent(studentData);
      setStudents(prev => [...prev, created]);
      addToast(`Student ${created.studentId} (${created.name}) registered!`, 'success');
      loadData();
    } catch (err) {
      addToast(`Error registering student: ${err.message}`, 'error');
    }
  };

  const handleUpdateStudent = async (id, studentData) => {
    try {
      const updated = await api.updateStudent(id, studentData);
      setStudents(prev => prev.map(s => s.id === id ? updated : s));
      addToast(`Student ${studentData.studentId} updated.`, 'success');
      loadData();
    } catch (err) {
      addToast(`Error updating student: ${err.message}`, 'error');
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await api.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      addToast('Student pass removed from MySQL.', 'success');
      loadData();
    } catch (err) {
      addToast(`Error removing student: ${err.message}`, 'error');
    }
  };

  // 1. IF NOT LOGGED IN -> Show Clean Login Gateway
  if (!currentUser) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  // 2. IF STUDENT -> Show Student Dashboard (Read-only, Assigned Route & Bus, No edit actions)
  if (currentUser.role === 'STUDENT') {
    return (
      <>
        <StudentDashboard 
          student={currentUser.student || { name: currentUser.name, studentId: currentUser.username, assignedBusNumber: 'BUS-01', assignedRoute: 'ECIL to Anurag University', boardingStop: 'Radhika Junction' }}
          buses={buses}
          routes={routes}
          onLogout={handleLogout}
        />
        <Toast toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // 3. IF ADMIN -> Show Full Admin Portal with all CRUD editing operations
  return (
    <div className="app-layout">
      <Header 
        user={currentUser}
        isBackendConnected={isBackendConnected}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onRefresh={() => loadData(true)}
        onLogout={handleLogout}
        loading={loading}
      />

      <div className="page-container">
        <StatsBanner stats={stats} />

        <main style={{ marginTop: '10px' }}>
          {activeTab === 'tracking' && (
            <LiveTrackingMap 
              buses={buses} 
              onUpdateTelemetry={handleUpdateTelemetry}
            />
          )}

          {activeTab === 'buses' && (
            <BusManagement 
              buses={buses}
              onCreateBus={handleCreateBus}
              onUpdateBus={handleUpdateBus}
              onDeleteBus={handleDeleteBus}
            />
          )}

          {activeTab === 'routes' && (
            <RouteManagement 
              routes={routes}
              onCreateRoute={handleCreateRoute}
              onUpdateRoute={handleUpdateRoute}
              onDeleteRoute={handleDeleteRoute}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagement 
              students={students}
              routes={routes}
              buses={buses}
              onCreateStudent={handleCreateStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}
        </main>
      </div>

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
