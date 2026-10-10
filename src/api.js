// Centralized API client for Spring Boot Backend & MySQL
// Set VITE_API_BASE_URL in Netlify environment variables to point to your deployed backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  // Authentication
  async login(role, username, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ role, username, password })
    });
  },

  // Bus CRUD
  async getBuses(query = '', status = '') {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (status && status !== 'ALL') params.append('status', status);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/buses${queryString}`);
  },

  async getBusById(id) {
    return request(`/buses/${id}`);
  },

  async createBus(busData) {
    return request('/buses', {
      method: 'POST',
      body: JSON.stringify(busData)
    });
  },

  async updateBus(id, busData) {
    return request(`/buses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(busData)
    });
  },

  async updateTelemetry(id, telemetryData) {
    return request(`/buses/${id}/telemetry`, {
      method: 'PATCH',
      body: JSON.stringify(telemetryData)
    });
  },

  async deleteBus(id) {
    return request(`/buses/${id}`, {
      method: 'DELETE'
    });
  },

  async getStats() {
    return request('/buses/stats');
  },

  // Route CRUD
  async getRoutes() {
    return request('/routes');
  },

  async createRoute(routeData) {
    return request('/routes', {
      method: 'POST',
      body: JSON.stringify(routeData)
    });
  },

  async updateRoute(id, routeData) {
    return request(`/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(routeData)
    });
  },

  async deleteRoute(id) {
    return request(`/routes/${id}`, {
      method: 'DELETE'
    });
  },

  // Students CRUD (Admin only)
  async getStudents() {
    return request('/students');
  },

  async createStudent(studentData) {
    return request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  async updateStudent(id, studentData) {
    return request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  },

  async deleteStudent(id) {
    return request(`/students/${id}`, {
      method: 'DELETE'
    });
  }
};
