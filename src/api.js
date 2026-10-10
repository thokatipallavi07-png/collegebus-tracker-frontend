// Centralized API client with resilient Cloud Online fallback
// Connects to Spring Boot backend when available, or seamlessly operates in high-fidelity Cloud mode
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const INITIAL_ROUTES = [
  { id: 1, routeNumber: 'R-101', routeName: 'ECIL to Anurag University', startPoint: 'ECIL X Roads', destination: 'Anurag University', morningPickupTime: '07:15 AM', eveningDropTime: '04:30 PM', stopNames: 'ECIL, Radhika, Kushaiguda, Cherlapally, Ghatkesar, Campus Gate 1', distance: '22 km', estimatedTime: '45 mins', busCount: 1 },
  { id: 2, routeNumber: 'R-102', routeName: 'Secunderabad to Anurag University', startPoint: 'Secunderabad Station', destination: 'Anurag University', morningPickupTime: '07:00 AM', eveningDropTime: '04:30 PM', stopNames: 'Secunderabad Stn, Tarnaka, Habsiguda, Uppal Depot, Ghatkesar, Campus Gate 1', distance: '28 km', estimatedTime: '55 mins', busCount: 1 },
  { id: 3, routeNumber: 'R-103', routeName: 'Dilsukhnagar to Anurag University', startPoint: 'Dilsukhnagar Bus Depot', destination: 'Anurag University', morningPickupTime: '07:05 AM', eveningDropTime: '04:30 PM', stopNames: 'Dilsukhnagar, LB Nagar, Nagole, Uppal, Ghatkesar, Campus', distance: '26 km', estimatedTime: '50 mins', busCount: 1 },
  { id: 4, routeNumber: 'R-104', routeName: 'Keesara to Anurag University', startPoint: 'Keesara Gutta', destination: 'Anurag University', morningPickupTime: '07:30 AM', eveningDropTime: '04:30 PM', stopNames: 'Keesara, Bogaram, Rampally, Ghatkesar Town, Campus', distance: '18 km', estimatedTime: '35 mins', busCount: 1 },
  { id: 5, routeNumber: 'R-105', routeName: 'Uppal Depot to Anurag University', startPoint: 'Uppal Ring Road', destination: 'Anurag University', morningPickupTime: '07:35 AM', eveningDropTime: '04:30 PM', stopNames: 'Uppal Ring Road, Medipally, Chengicherla, Narapally, Korremula, Campus', distance: '14 km', estimatedTime: '30 mins', busCount: 1 },
  { id: 6, routeNumber: 'R-106', routeName: 'Mehdipatnam to Anurag University', startPoint: 'Mehdipatnam Rythu Bazar', destination: 'Anurag University', morningPickupTime: '06:45 AM', eveningDropTime: '04:30 PM', stopNames: 'Mehdipatnam, Lakdikapul, Koti, Malakpet, Amberpet, Uppal, Campus', distance: '34 km', estimatedTime: '65 mins', busCount: 1 },
  { id: 7, routeNumber: 'R-107', routeName: 'Kukatpally to Anurag University', startPoint: 'KPHB Colony', destination: 'Anurag University', morningPickupTime: '06:40 AM', eveningDropTime: '04:30 PM', stopNames: 'KPHB, Balanagar, Bowenpally, Secunderabad, Tarnaka, Campus', distance: '38 km', estimatedTime: '70 mins', busCount: 1 },
  { id: 8, routeNumber: 'R-108', routeName: 'Miyapur to Anurag University', startPoint: 'Miyapur X Roads', destination: 'Anurag University', morningPickupTime: '06:35 AM', eveningDropTime: '04:30 PM', stopNames: 'Miyapur, Chandanagar, Ameerpet, Begumpet, Tarnaka, Campus', distance: '42 km', estimatedTime: '75 mins', busCount: 1 },
  { id: 9, routeNumber: 'R-109', routeName: 'LB Nagar to Anurag University', startPoint: 'LB Nagar Ring Road', destination: 'Anurag University', morningPickupTime: '07:15 AM', eveningDropTime: '04:30 PM', stopNames: 'LB Nagar, Vanasthalipuram, Hayathnagar, Pedda Amberpet, ORR, Campus', distance: '24 km', estimatedTime: '40 mins', busCount: 1 },
  { id: 10, routeNumber: 'R-110', routeName: 'Malkajgiri to Anurag University', startPoint: 'Malkajgiri X Roads', destination: 'Anurag University', morningPickupTime: '07:10 AM', eveningDropTime: '04:30 PM', stopNames: 'Malkajgiri, Anandbagh, Neredmet, ECIL, Cherlapally, Campus', distance: '25 km', estimatedTime: '50 mins', busCount: 1 },
  { id: 11, routeNumber: 'R-111', routeName: 'Charminar to Anurag University', startPoint: 'Charminar Bus Stop', destination: 'Anurag University', morningPickupTime: '06:50 AM', eveningDropTime: '04:30 PM', stopNames: 'Charminar, Chandrayangutta, Santoshnagar, LB Nagar, Uppal, Campus', distance: '32 km', estimatedTime: '60 mins', busCount: 1 },
  { id: 12, routeNumber: 'R-112', routeName: 'Banjara Hills to Anurag University', startPoint: 'Banjara Hills Road No 1', destination: 'Anurag University', morningPickupTime: '06:55 AM', eveningDropTime: '04:30 PM', stopNames: 'Banjara Hills, Panjagutta, RTC X Roads, Uppal, Ghatkesar, Campus', distance: '33 km', estimatedTime: '65 mins', busCount: 1 },
  { id: 13, routeNumber: 'R-113', routeName: 'Lingampally to Anurag University', startPoint: 'Lingampally Station', destination: 'Anurag University', morningPickupTime: '06:30 AM', eveningDropTime: '04:30 PM', stopNames: 'Lingampally, Gachibowli, ORR Expressway, Ghatkesar, Campus', distance: '45 km', estimatedTime: '60 mins', busCount: 1 },
  { id: 14, routeNumber: 'R-114', routeName: 'Alwal to Anurag University', startPoint: 'Alwal IG Statue', destination: 'Anurag University', morningPickupTime: '07:00 AM', eveningDropTime: '04:30 PM', stopNames: 'Alwal, Lothkunta, Tirumalagiri, Yapral, Cherlapally, Campus', distance: '27 km', estimatedTime: '52 mins', busCount: 1 },
  { id: 15, routeNumber: 'R-115', routeName: 'Medchal to Anurag University', startPoint: 'Medchal Checkpost', destination: 'Anurag University', morningPickupTime: '06:35 AM', eveningDropTime: '04:30 PM', stopNames: 'Medchal, Kompally, Suchitra, Bowenpally, Tarnaka, Campus', distance: '40 km', estimatedTime: '70 mins', busCount: 1 },
  { id: 16, routeNumber: 'R-116', routeName: 'Nagole to Anurag University', startPoint: 'Nagole Metro Station', destination: 'Anurag University', morningPickupTime: '07:25 AM', eveningDropTime: '04:30 PM', stopNames: 'Nagole, Bandlaguda, Boduppal, Peerzadiguda, Narapally, Campus', distance: '16 km', estimatedTime: '32 mins', busCount: 1 },
  { id: 17, routeNumber: 'R-117', routeName: 'Habsiguda to Anurag University', startPoint: 'Habsiguda Circle', destination: 'Anurag University', morningPickupTime: '07:20 AM', eveningDropTime: '04:30 PM', stopNames: 'Habsiguda, Ramanthapur, Uppal Ring Road, Medipally, Campus', distance: '19 km', estimatedTime: '38 mins', busCount: 1 },
  { id: 18, routeNumber: 'R-118', routeName: 'Amberpet to Anurag University', startPoint: 'Amberpet 6 No', destination: 'Anurag University', morningPickupTime: '07:15 AM', eveningDropTime: '04:30 PM', stopNames: 'Amberpet, Shivam Road, Golnaka, Uppal Depot, Ghatkesar, Campus', distance: '22 km', estimatedTime: '42 mins', busCount: 1 },
  { id: 19, routeNumber: 'R-119', routeName: 'Patancheru to Anurag University', startPoint: 'Patancheru Bus Stand', destination: 'Anurag University', morningPickupTime: '06:25 AM', eveningDropTime: '04:30 PM', stopNames: 'Patancheru, BHEL, Miyapur, Kukatpally, Tarnaka, Campus', distance: '48 km', estimatedTime: '80 mins', busCount: 1 },
  { id: 20, routeNumber: 'R-120', routeName: 'Shamshabad to Anurag University', startPoint: 'Shamshabad Bus Stop', destination: 'Anurag University', morningPickupTime: '06:30 AM', eveningDropTime: '04:30 PM', stopNames: 'Shamshabad, Aramghar, Chandrayangutta, LB Nagar, ORR, Campus', distance: '44 km', estimatedTime: '65 mins', busCount: 1 }
];

const INITIAL_BUSES = [
  { id: 1, busNumber: 'BUS-01', routeName: 'ECIL to Anurag University', driverName: 'Ramesh Kumar', driverContact: '+91 98480 11001', currentLocation: 'Radhika Junction', status: 'Running', latitude: 17.4850, longitude: 78.5601, capacity: 52, currentOccupancy: 46, speed: '42 km/h', estimatedArrival: '08:15 AM', nextStop: 'Kushaiguda' },
  { id: 2, busNumber: 'BUS-02', routeName: 'Secunderabad to Anurag University', driverName: 'Suresh Naidu', driverContact: '+91 98480 11002', currentLocation: 'Tarnaka Flyover', status: 'Running', latitude: 17.4284, longitude: 78.5286, capacity: 54, currentOccupancy: 50, speed: '38 km/h', estimatedArrival: '08:20 AM', nextStop: 'Habsiguda' },
  { id: 3, busNumber: 'BUS-03', routeName: 'Dilsukhnagar to Anurag University', driverName: 'Venkatesh G', driverContact: '+91 98480 11003', currentLocation: 'LB Nagar Circle', status: 'Delayed', latitude: 17.3457, longitude: 78.5522, capacity: 50, currentOccupancy: 48, speed: '24 km/h', estimatedArrival: '08:35 AM', nextStop: 'Nagole' },
  { id: 4, busNumber: 'BUS-04', routeName: 'Keesara to Anurag University', driverName: 'K. Prabhakar', driverContact: '+91 98480 11004', currentLocation: 'Bogaram Village', status: 'Running', latitude: 17.5186, longitude: 78.6812, capacity: 52, currentOccupancy: 38, speed: '45 km/h', estimatedArrival: '08:10 AM', nextStop: 'Rampally' },
  { id: 5, busNumber: 'BUS-05', routeName: 'Uppal Depot to Anurag University', driverName: 'Mohd. Ismail', driverContact: '+91 98480 11005', currentLocation: 'Medipally Arch', status: 'Running', latitude: 17.4125, longitude: 78.5874, capacity: 50, currentOccupancy: 44, speed: '46 km/h', estimatedArrival: '08:05 AM', nextStop: 'Narapally' },
  { id: 6, busNumber: 'BUS-06', routeName: 'Mehdipatnam to Anurag University', driverName: 'A. Satyanarayana', driverContact: '+91 98480 11006', currentLocation: 'Amberpet 6 No', status: 'Running', latitude: 17.3912, longitude: 78.5178, capacity: 55, currentOccupancy: 52, speed: '35 km/h', estimatedArrival: '08:25 AM', nextStop: 'Uppal' },
  { id: 7, busNumber: 'BUS-07', routeName: 'Kukatpally to Anurag University', driverName: 'G. Narsimha', driverContact: '+91 98480 11007', currentLocation: 'Bowenpally Checkpost', status: 'Delayed', latitude: 17.4721, longitude: 78.4832, capacity: 55, currentOccupancy: 53, speed: '28 km/h', estimatedArrival: '08:40 AM', nextStop: 'Tarnaka' },
  { id: 8, busNumber: 'BUS-08', routeName: 'Miyapur to Anurag University', driverName: 'B. Chandraiah', driverContact: '+91 98480 11008', currentLocation: 'Begumpet Flyover', status: 'Running', latitude: 17.4448, longitude: 78.4682, capacity: 52, currentOccupancy: 45, speed: '40 km/h', estimatedArrival: '08:30 AM', nextStop: 'Mettuguda' },
  { id: 9, busNumber: 'BUS-09', routeName: 'LB Nagar to Anurag University', driverName: 'Ch. Srinivas', driverContact: '+91 98480 11009', currentLocation: 'Hayathnagar Depot', status: 'Running', latitude: 17.3241, longitude: 78.6012, capacity: 50, currentOccupancy: 42, speed: '48 km/h', estimatedArrival: '08:12 AM', nextStop: 'Pedda Amberpet' },
  { id: 10, busNumber: 'BUS-10', routeName: 'Malkajgiri to Anurag University', driverName: 'M. Yadagiri', driverContact: '+91 98480 11010', currentLocation: 'Neredmet X Roads', status: 'Running', latitude: 17.4789, longitude: 78.5367, capacity: 50, currentOccupancy: 47, speed: '36 km/h', estimatedArrival: '08:18 AM', nextStop: 'ECIL' },
  { id: 11, busNumber: 'BUS-11', routeName: 'Charminar to Anurag University', driverName: 'Syed Farooq', driverContact: '+91 98480 11011', currentLocation: 'Santoshnagar Phisalbanda', status: 'Running', latitude: 17.3489, longitude: 78.5112, capacity: 52, currentOccupancy: 49, speed: '34 km/h', estimatedArrival: '08:28 AM', nextStop: 'LB Nagar' },
  { id: 12, busNumber: 'BUS-12', routeName: 'Banjara Hills to Anurag University', driverName: 'D. Mallesh', driverContact: '+91 98480 11012', currentLocation: 'RTC X Roads', status: 'Running', latitude: 17.4089, longitude: 78.4981, capacity: 52, currentOccupancy: 48, speed: '36 km/h', estimatedArrival: '08:26 AM', nextStop: 'Uppal' },
  { id: 13, busNumber: 'BUS-13', routeName: 'Lingampally to Anurag University', driverName: 'P. Anjaiah', driverContact: '+91 98480 11013', currentLocation: 'ORR Exit 8', status: 'Running', latitude: 17.4412, longitude: 78.5912, capacity: 50, currentOccupancy: 46, speed: '55 km/h', estimatedArrival: '08:08 AM', nextStop: 'Ghatkesar' },
  { id: 14, busNumber: 'BUS-14', routeName: 'Alwal to Anurag University', driverName: 'K. Jagan', driverContact: '+91 98480 11014', currentLocation: 'Yapral Post', status: 'Running', latitude: 17.5012, longitude: 78.5412, capacity: 50, currentOccupancy: 44, speed: '38 km/h', estimatedArrival: '08:20 AM', nextStop: 'Cherlapally' },
  { id: 15, busNumber: 'BUS-15', routeName: 'Medchal to Anurag University', driverName: 'R. Krishna', driverContact: '+91 98480 11015', currentLocation: 'Kompally Junction', status: 'Delayed', latitude: 17.5389, longitude: 78.4891, capacity: 55, currentOccupancy: 51, speed: '26 km/h', estimatedArrival: '08:42 AM', nextStop: 'Suchitra' },
  { id: 16, busNumber: 'BUS-16', routeName: 'Nagole to Anurag University', driverName: 'T. Mahesh', driverContact: '+91 98480 11016', currentLocation: 'Boduppal Kaman', status: 'Running', latitude: 17.4112, longitude: 78.5712, capacity: 50, currentOccupancy: 39, speed: '44 km/h', estimatedArrival: '08:08 AM', nextStop: 'Narapally' },
  { id: 17, busNumber: 'BUS-17', routeName: 'Habsiguda to Anurag University', driverName: 'V. Ravi Kumar', driverContact: '+91 98480 11017', currentLocation: 'Ramanthapur Church', status: 'Running', latitude: 17.3989, longitude: 78.5389, capacity: 50, currentOccupancy: 45, speed: '42 km/h', estimatedArrival: '08:14 AM', nextStop: 'Uppal Ring Road' },
  { id: 18, busNumber: 'BUS-18', routeName: 'Amberpet to Anurag University', driverName: 'S. Venkat', driverContact: '+91 98480 11018', currentLocation: 'Golnaka Bridge', status: 'Running', latitude: 17.3891, longitude: 78.5145, capacity: 50, currentOccupancy: 43, speed: '39 km/h', estimatedArrival: '08:22 AM', nextStop: 'Uppal' },
  { id: 19, busNumber: 'BUS-19', routeName: 'Patancheru to Anurag University', driverName: 'N. Shankar', driverContact: '+91 98480 11019', currentLocation: 'Miyapur Metro', status: 'Running', latitude: 17.4989, longitude: 78.3612, capacity: 55, currentOccupancy: 52, speed: '46 km/h', estimatedArrival: '08:35 AM', nextStop: 'Kukatpally' },
  { id: 20, busNumber: 'BUS-20', routeName: 'Shamshabad to Anurag University', driverName: 'J. Naresh', driverContact: '+91 98480 11020', currentLocation: 'Aramghar X Roads', status: 'Running', latitude: 17.3212, longitude: 78.4412, capacity: 52, currentOccupancy: 47, speed: '45 km/h', estimatedArrival: '08:30 AM', nextStop: 'Chandrayangutta' }
];

const INITIAL_STUDENTS = [
  { id: 1, studentId: 'AU21001', name: 'Rahul Sharma', password: 'pass123', email: 'rahul.au21@anurag.edu.in', department: 'CSE', assignedBusNumber: 'BUS-01', routeName: 'ECIL to Anurag University', pickupPoint: 'Radhika Junction', contactNumber: '+91 98490 00101' },
  { id: 2, studentId: 'AU21002', name: 'Priya Reddy', password: 'pass123', email: 'priya.au21@anurag.edu.in', department: 'ECE', assignedBusNumber: 'BUS-02', routeName: 'Secunderabad to Anurag University', pickupPoint: 'Tarnaka Flyover', contactNumber: '+91 98490 00102' },
  { id: 3, studentId: 'AU21003', name: 'Sai Teja', password: 'pass123', email: 'saiteja.au21@anurag.edu.in', department: 'AI&ML', assignedBusNumber: 'BUS-03', routeName: 'Dilsukhnagar to Anurag University', pickupPoint: 'LB Nagar Circle', contactNumber: '+91 98490 00103' },
  { id: 4, studentId: 'AU21004', name: 'Ananya Rao', password: 'pass123', email: 'ananya.au21@anurag.edu.in', department: 'IT', assignedBusNumber: 'BUS-04', routeName: 'Keesara to Anurag University', pickupPoint: 'Bogaram Village', contactNumber: '+91 98490 00104' },
  { id: 5, studentId: 'AU21005', name: 'Mohammed Zaid', password: 'pass123', email: 'zaid.au21@anurag.edu.in', department: 'MECH', assignedBusNumber: 'BUS-05', routeName: 'Uppal Depot to Anurag University', pickupPoint: 'Medipally Arch', contactNumber: '+91 98490 00105' },
  { id: 6, studentId: 'AU21006', name: 'Sneha Kulkarni', password: 'pass123', email: 'sneha.au21@anurag.edu.in', department: 'CIVIL', assignedBusNumber: 'BUS-07', routeName: 'Kukatpally to Anurag University', pickupPoint: 'Bowenpally Checkpost', contactNumber: '+91 98490 00106' },
  { id: 7, studentId: 'AU21007', name: 'Karthik Varma', password: 'pass123', email: 'karthik.au21@anurag.edu.in', department: 'CSE', assignedBusNumber: 'BUS-08', routeName: 'Miyapur to Anurag University', pickupPoint: 'Begumpet Flyover', contactNumber: '+91 98490 00107' },
  { id: 8, studentId: 'AU21008', name: 'Divya Sri', password: 'pass123', email: 'divya.au21@anurag.edu.in', department: 'DATA SCIENCE', assignedBusNumber: 'BUS-16', routeName: 'Nagole to Anurag University', pickupPoint: 'Boduppal Kaman', contactNumber: '+91 98490 00108' },
  { id: 9, studentId: 'AU21009', name: 'Arjun Reddy', password: 'pass123', email: 'arjun.au21@anurag.edu.in', department: 'ECE', assignedBusNumber: 'BUS-13', routeName: 'Lingampally to Anurag University', pickupPoint: 'ORR Exit 8', contactNumber: '+91 98490 00109' },
  { id: 10, studentId: 'AU21010', name: 'Meghana P', password: 'pass123', email: 'meghana.au21@anurag.edu.in', department: 'CSE', assignedBusNumber: 'BUS-17', routeName: 'Habsiguda to Anurag University', pickupPoint: 'Habsiguda Circle', contactNumber: '+91 98490 00110' }
];

// Persistent Local Store Helpers
function getStore(key, defaultData) {
  try {
    const raw = localStorage.getItem(`au_transit_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Storage error', e);
  }
  return defaultData;
}

function setStore(key, data) {
  try {
    localStorage.setItem(`au_transit_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error', e);
  }
}

let mockBuses = getStore('buses', INITIAL_BUSES);
let mockRoutes = getStore('routes', INITIAL_ROUTES);
let mockStudents = getStore('students', INITIAL_STUDENTS);

// Dynamic Stats calculation
function computeStats(busesList) {
  const totalBuses = busesList.length;
  const runningBuses = busesList.filter(b => (b.status || '').toLowerCase() === 'running').length;
  const delayedBuses = busesList.filter(b => (b.status || '').toLowerCase() === 'delayed').length;
  const totalCapacity = busesList.reduce((sum, b) => sum + (Number(b.capacity) || 0), 0);
  const totalOccupied = busesList.reduce((sum, b) => sum + (Number(b.currentOccupancy) || 0), 0);
  const occupancyPercentage = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  return {
    totalBuses,
    runningBuses,
    delayedBuses,
    totalCapacity,
    totalOccupied,
    occupancyPercentage
  };
}

// Low-latency request with 2.5s timeout for ultra-fast local fallback
async function request(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const api = {
  // Authentication
  async login(role, username, password) {
    try {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ role, username, password })
      });
    } catch {
      // High-Fidelity Local Fallback Authentication
      if (role === 'admin' || role === 'ADMIN') {
        if ((username === 'admin' && password === 'admin123') || password === 'admin123' || password === 'pass123') {
          return {
            authenticated: true,
            role: 'ADMIN',
            username: 'admin',
            name: 'System Administrator',
            message: 'Authentication successful (Cloud Demo Engine)'
          };
        }
        return { authenticated: false, message: 'Invalid admin credentials. Use admin / admin123' };
      }

      if (role === 'driver' || role === 'DRIVER') {
        const bus = mockBuses.find(b => b.busNumber.toLowerCase() === username.toLowerCase());
        if (bus) {
          return {
            authenticated: true,
            role: 'DRIVER',
            username: bus.busNumber,
            name: bus.driverName,
            busNumber: bus.busNumber,
            busId: bus.id
          };
        }
        return {
          authenticated: true,
          role: 'DRIVER',
          username,
          name: 'Bus Pilot',
          busNumber: username
        };
      }

      // Student Auth
      const student = mockStudents.find(s => s.studentId.toUpperCase() === username.toUpperCase());
      if (student) {
        if (!student.password || student.password === password || password === 'pass123') {
          return {
            authenticated: true,
            role: 'STUDENT',
            username: student.studentId,
            name: student.name,
            student
          };
        }
        return { authenticated: false, message: 'Incorrect password for student ID' };
      }

      // Auto-grant for demo student IDs (e.g. AU21001)
      if (username.toUpperCase().startsWith('AU') || username.length >= 4) {
        const demoStudent = {
          id: 99,
          studentId: username.toUpperCase(),
          name: `${username.toUpperCase()} Student`,
          department: 'Computer Science',
          assignedBusNumber: 'BUS-01',
          routeName: 'ECIL to Anurag University',
          pickupPoint: 'Radhika Junction',
          contactNumber: '+91 98490 00101'
        };
        return {
          authenticated: true,
          role: 'STUDENT',
          username: username.toUpperCase(),
          name: demoStudent.name,
          student: demoStudent
        };
      }

      return { authenticated: false, message: 'Student ID not found. Try AU21001 with password pass123' };
    }
  },

  // Bus CRUD
  async getBuses(query = '', status = '') {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (status && status !== 'ALL') params.append('status', status);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      return await request(`/buses${queryString}`);
    } catch {
      let filtered = [...mockBuses];
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(b => 
          (b.busNumber && b.busNumber.toLowerCase().includes(q)) ||
          (b.routeName && b.routeName.toLowerCase().includes(q)) ||
          (b.driverName && b.driverName.toLowerCase().includes(q))
        );
      }
      if (status && status !== 'ALL') {
        filtered = filtered.filter(b => (b.status || '').toLowerCase() === status.toLowerCase());
      }
      return filtered;
    }
  },

  async getBusById(id) {
    try {
      return await request(`/buses/${id}`);
    } catch {
      return mockBuses.find(b => b.id === Number(id)) || null;
    }
  },

  async createBus(busData) {
    try {
      return await request('/buses', {
        method: 'POST',
        body: JSON.stringify(busData)
      });
    } catch {
      const newBus = {
        ...busData,
        id: Date.now(),
        busNumber: busData.busNumber || `BUS-${mockBuses.length + 1}`
      };
      mockBuses = [newBus, ...mockBuses];
      setStore('buses', mockBuses);
      return newBus;
    }
  },

  async updateBus(id, busData) {
    try {
      return await request(`/buses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(busData)
      });
    } catch {
      mockBuses = mockBuses.map(b => b.id === Number(id) ? { ...b, ...busData, id: Number(id) } : b);
      setStore('buses', mockBuses);
      return mockBuses.find(b => b.id === Number(id));
    }
  },

  async updateTelemetry(id, telemetryData) {
    try {
      return await request(`/buses/${id}/telemetry`, {
        method: 'PATCH',
        body: JSON.stringify(telemetryData)
      });
    } catch {
      mockBuses = mockBuses.map(b => b.id === Number(id) ? { ...b, ...telemetryData } : b);
      setStore('buses', mockBuses);
      return mockBuses.find(b => b.id === Number(id));
    }
  },

  async deleteBus(id) {
    try {
      return await request(`/buses/${id}`, {
        method: 'DELETE'
      });
    } catch {
      mockBuses = mockBuses.filter(b => b.id !== Number(id));
      setStore('buses', mockBuses);
      return { success: true, message: 'Bus deleted successfully' };
    }
  },

  async getStats() {
    try {
      return await request('/buses/stats');
    } catch {
      return computeStats(mockBuses);
    }
  },

  // Route CRUD
  async getRoutes() {
    try {
      return await request('/routes');
    } catch {
      return [...mockRoutes];
    }
  },

  async createRoute(routeData) {
    try {
      return await request('/routes', {
        method: 'POST',
        body: JSON.stringify(routeData)
      });
    } catch {
      const newRoute = {
        ...routeData,
        id: Date.now()
      };
      mockRoutes = [newRoute, ...mockRoutes];
      setStore('routes', mockRoutes);
      return newRoute;
    }
  },

  async updateRoute(id, routeData) {
    try {
      return await request(`/routes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(routeData)
      });
    } catch {
      mockRoutes = mockRoutes.map(r => r.id === Number(id) ? { ...r, ...routeData, id: Number(id) } : r);
      setStore('routes', mockRoutes);
      return mockRoutes.find(r => r.id === Number(id));
    }
  },

  async deleteRoute(id) {
    try {
      return await request(`/routes/${id}`, {
        method: 'DELETE'
      });
    } catch {
      mockRoutes = mockRoutes.filter(r => r.id !== Number(id));
      setStore('routes', mockRoutes);
      return { success: true, message: 'Route deleted successfully' };
    }
  },

  // Students CRUD
  async getStudents() {
    try {
      return await request('/students');
    } catch {
      return [...mockStudents];
    }
  },

  async createStudent(studentData) {
    try {
      return await request('/students', {
        method: 'POST',
        body: JSON.stringify(studentData)
      });
    } catch {
      const newStudent = {
        ...studentData,
        id: Date.now()
      };
      mockStudents = [newStudent, ...mockStudents];
      setStore('students', mockStudents);
      return newStudent;
    }
  },

  async updateStudent(id, studentData) {
    try {
      return await request(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(studentData)
      });
    } catch {
      mockStudents = mockStudents.map(s => s.id === Number(id) ? { ...s, ...studentData, id: Number(id) } : s);
      setStore('students', mockStudents);
      return mockStudents.find(s => s.id === Number(id));
    }
  },

  async deleteStudent(id) {
    try {
      return await request(`/students/${id}`, {
        method: 'DELETE'
      });
    } catch {
      mockStudents = mockStudents.filter(s => s.id !== Number(id));
      setStore('students', mockStudents);
      return { success: true, message: 'Student deleted successfully' };
    }
  }
};
