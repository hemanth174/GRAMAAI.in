import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Calendar, Clock, Phone, Mail, FileText, 
  Edit, Save, X, Stethoscope, AlertTriangle, CheckCircle,
  Pill, Activity, Heart, Thermometer
} from 'lucide-react';

interface AppointmentDetail {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent';
  symptoms: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
  };
}

export default function AppointmentDetailsPage() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<AppointmentDetail | null>(null);

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

    // Mock appointment data (in real app, fetch from API)
    const mockAppointment: AppointmentDetail = {
      id: appointmentId || '1',
      patientName: 'John Smith',
      patientAge: 34,
      patientGender: 'Male',
      patientPhone: '+91 98765 43210',
      patientEmail: 'john.smith@email.com',
      appointmentDate: '2025-10-12',
      appointmentTime: '09:00 AM',
      type: 'Consultation',
      status: 'scheduled',
      priority: 'normal',
      symptoms: 'Chest pain, shortness of breath, mild fever',
      diagnosis: 'Pending examination',
      prescription: 'To be determined after examination',
      notes: 'Patient reports symptoms started 2 days ago. No known allergies.',
      vitals: {
        bloodPressure: '120/80',
        heartRate: '72 bpm',
        temperature: '99.2°F',
        weight: '75 kg'
      }
    };

    setAppointment(mockAppointment);
    setEditData(mockAppointment);
  }, [appointmentId, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editData) {
      setAppointment(editData);
      setIsEditing(false);
      // In real app, save to API
      console.log('Saving appointment:', editData);
    }
  };

  const handleCancel = () => {
    if (appointment) {
      setEditData(appointment);
    }
    setIsEditing(false);
  };

  type EditableTextField = 'symptoms' | 'diagnosis' | 'prescription' | 'notes';

  const handleInputChange = (field: EditableTextField, value: string) => {
    setEditData(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleVitalChange = (vital: keyof AppointmentDetail['vitals'], value: string) => {
    setEditData(prev => (
      prev
        ? {
            ...prev,
            vitals: {
              ...prev.vitals,
              [vital]: value
            }
          }
        : prev
    ));
  };

  const handleStatusUpdate = (newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    setEditData(prev => (prev ? { ...prev, status: newStatus } : prev));
  };

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/doctor-dashboard"
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Appointment Details</h1>
                <p className="text-sm text-gray-600">ID: {appointment.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Patient Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-800 font-medium">{appointment.patientName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age & Gender</label>
                  <p className="text-gray-800">{appointment.patientAge} years, {appointment.patientGender}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a href={`tel:${appointment.patientPhone}`} className="text-blue-600 hover:underline">
                    {appointment.patientPhone}
                  </a>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a href={`mailto:${appointment.patientEmail}`} className="text-blue-600 hover:underline">
                    {appointment.patientEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Appointment Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Appointment Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{appointment.appointmentDate}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{appointment.appointmentTime}</span>
                </div>
                
                <div>
                  <span className="text-gray-800">{appointment.type}</span>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                {isEditing ? (
                  <select
                    value={editData?.status ?? appointment.status}
                    onChange={(e) => handleStatusUpdate(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
                    ${appointment.status === 'scheduled' 
                      ? 'bg-blue-100 text-blue-700' 
                      : appointment.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    }
                  `}>
                    {appointment.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                    {appointment.status === 'scheduled' && <Clock className="w-3 h-3" />}
                    {appointment.status === 'cancelled' && <X className="w-3 h-3" />}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                )}
                
                {appointment.priority === 'urgent' && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Urgent
                  </span>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-500" />
                Medical Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                  {isEditing ? (
                    <textarea
                      value={editData?.symptoms ?? appointment.symptoms}
                      onChange={(e) => handleInputChange('symptoms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{appointment.symptoms}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                  {isEditing ? (
                    <textarea
                      value={editData?.diagnosis ?? appointment.diagnosis}
                      onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{appointment.diagnosis}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Pill className="w-4 h-4" />
                    Prescription
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData?.prescription ?? appointment.prescription}
                      onChange={(e) => handleInputChange('prescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{appointment.prescription}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Doctor's Notes
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData?.notes ?? appointment.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{appointment.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Vitals Sidebar */}
          <div className="space-y-6">
            {/* Vital Signs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" />
                Vital Signs
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700">Blood Pressure</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData?.vitals?.bloodPressure ?? appointment.vitals.bloodPressure}
                      onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                    />
                  ) : (
                    <span className="font-semibold text-gray-800">{appointment.vitals.bloodPressure}</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Heart Rate</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData?.vitals?.heartRate ?? appointment.vitals.heartRate}
                      onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                    />
                  ) : (
                    <span className="font-semibold text-gray-800">{appointment.vitals.heartRate}</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Temperature</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData?.vitals?.temperature ?? appointment.vitals.temperature}
                      onChange={(e) => handleVitalChange('temperature', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                    />
                  ) : (
                    <span className="font-semibold text-gray-800">{appointment.vitals.temperature}</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Weight</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData?.vitals?.weight ?? appointment.vitals.weight}
                      onChange={(e) => handleVitalChange('weight', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                    />
                  ) : (
                    <span className="font-semibold text-gray-800">{appointment.vitals.weight}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Print Prescription
                </button>
                
                <button className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Schedule Follow-up
                </button>
                
                <button className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Send to Lab
                </button>
                
                <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}