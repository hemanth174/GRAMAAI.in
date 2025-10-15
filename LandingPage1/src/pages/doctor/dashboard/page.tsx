import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, Clock, Activity, Bell, LogOut, 
  User, Stethoscope, ClipboardList, Plus, ArrowRight 
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent';
}

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats] = useState({
    todayAppointments: 8,
    pendingReviews: 3,
    totalPatients: 156,
    notifications: 2
  });

  useEffect(() => {
    // Check if user is logged in as doctor
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'doctor') {
      navigate('/login');
      return;
    }

    setUser(parsedUser);

    // Mock appointments data
    setAppointments([
      {
        id: '1',
        patientName: 'John Smith',
        time: '09:00 AM',
        type: 'Consultation',
        status: 'scheduled',
        priority: 'normal'
      },
      {
        id: '2',
        patientName: 'Maria Garcia',
        time: '09:30 AM',
        type: 'Follow-up',
        status: 'scheduled',
        priority: 'urgent'
      },
      {
        id: '3',
        patientName: 'David Johnson',
        time: '10:00 AM',
        type: 'Check-up',
        status: 'completed',
        priority: 'normal'
      },
      {
        id: '4',
        patientName: 'Sarah Wilson',
        time: '11:00 AM',
        type: 'Consultation',
        status: 'scheduled',
        priority: 'normal'
      }
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleOpenHospitalPortal = () => {
    // Open the full hospital portal
    window.open('http://localhost:3000/login', '_blank');
  };

  const handleViewAppointmentDetails = (appointmentId: string) => {
    // Navigate to appointment details
    navigate(`/appointment-details/${appointmentId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Dr. {user?.name || 'Doctor'}
                </h1>
                <p className="text-sm text-gray-600">{user?.specialization || 'General Medicine'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleOpenHospitalPortal}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                Open Full Portal
              </button>

              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-800 relative">
                  <Bell className="w-5 h-5" />
                  {stats.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {stats.notifications}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Good morning, Dr. {user?.name || 'Doctor'} 👋
          </h2>
          <p className="text-gray-600">Here's what's happening with your patients today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{stats.todayAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-purple-600">Online</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Today's Appointments</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleViewAppointmentDetails(appointment.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800">{appointment.patientName}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time}
                        </span>
                        <span>{appointment.type}</span>
                        {appointment.priority === 'urgent' && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${appointment.status === 'scheduled' 
                        ? 'bg-blue-100 text-blue-700' 
                        : appointment.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                      }
                    `}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleOpenHospitalPortal}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-5 h-5" />
              View All Appointments in Hospital Portal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}