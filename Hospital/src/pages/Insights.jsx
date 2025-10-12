import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Insights() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list("-created_date"),
    initialData: [],
  });

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => base44.entities.Doctor.list(),
    initialData: [],
  });

  if (isLoading || isLoadingDoctors) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading insights...</p>
          </div>
        </div>
      </div>
    );
  }

  // Process data for charts
  const statusData = [
    { name: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: '#F59E0B' },
    { name: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: '#10B981' },
    { name: 'Documents Requested', value: appointments.filter(a => a.status === 'documents_requested').length, color: '#3B82F6' },
    { name: 'Rejected', value: appointments.filter(a => a.status === 'rejected').length, color: '#EF4444' },
  ];

  const priorityData = [
    { name: 'Emergency', value: appointments.filter(a => a.priority === 'emergency').length, color: '#EF4444' },
    { name: 'High', value: appointments.filter(a => a.priority === 'high').length, color: '#F59E0B' },
    { name: 'Medium', value: appointments.filter(a => a.priority === 'medium').length, color: '#3B82F6' },
    { name: 'Low', value: appointments.filter(a => a.priority === 'low').length, color: '#10B981' },
  ];

  // Doctor workload data
  const doctorWorkload = doctors.map(doctor => ({
    name: doctor.name.split(' ')[1] || doctor.name, // Last name only
    appointments: appointments.filter(a => a.requested_doctor === doctor.name).length,
    specialty: doctor.specialty
  }));

  // Monthly trends (mock data for demonstration)
  const monthlyTrends = [
    { month: 'Jan', appointments: 45, confirmed: 38 },
    { month: 'Feb', appointments: 52, confirmed: 44 },
    { month: 'Mar', appointments: 48, confirmed: 41 },
    { month: 'Apr', appointments: 61, confirmed: 52 },
    { month: 'May', appointments: 55, confirmed: 47 },
    { month: 'Jun', appointments: 58, confirmed: 49 },
  ];

  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const confirmationRate = totalAppointments > 0 ? (confirmedAppointments / totalAppointments * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Hospital Insights</h1>
            <p className="text-gray-600">Analytics and performance metrics for your hospital</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">{totalAppointments}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmation Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{confirmationRate}%</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingAppointments}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                  <p className="text-3xl font-bold text-gray-900">{doctors.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Appointment Status Distribution */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Status Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Priority Distribution */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Doctor Workload */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Workload</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={doctorWorkload}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Monthly Trends */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="appointments" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="confirmed" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Performance</h4>
              </div>
              <p className="text-sm text-gray-600">
                Your hospital is performing well with a {confirmationRate}% confirmation rate.
                {confirmationRate > 80 ? ' Keep up the excellent work!' : ' Consider reviewing your processes.'}
              </p>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Staff Utilization</h4>
              </div>
              <p className="text-sm text-gray-600">
                You have {doctors.length} active doctors managing {totalAppointments} appointments.
                Average workload: {(totalAppointments / doctors.length).toFixed(1)} appointments per doctor.
              </p>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Attention Needed</h4>
              </div>
              <p className="text-sm text-gray-600">
                {pendingAppointments > 0 
                  ? `You have ${pendingAppointments} appointments pending review. Consider prioritizing urgent cases.`
                  : 'All appointments are up to date! Great job managing your workload.'
                }
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
