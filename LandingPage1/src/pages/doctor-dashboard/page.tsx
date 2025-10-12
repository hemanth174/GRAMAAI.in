
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/base/Button';
import { Card } from '../../components/base/Card';

export default function DoctorDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Doctor Dashboard</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              <i className="ri-logout-circle-line mr-2"></i>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Doctor!</h2>
          <p className="text-gray-600">Manage your practice and patient appointments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-calendar-line text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                <p className="text-gray-600">View today's appointments</p>
              </div>
            </div>
            <Button className="w-full">
              View Schedule
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-group-line text-2xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Patients</h3>
                <p className="text-gray-600">Manage patient records</p>
              </div>
            </div>
            <Button className="w-full">
              View Patients
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-text-line text-2xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
                <p className="text-gray-600">Create & manage prescriptions</p>
              </div>
            </div>
            <Button className="w-full">
              Manage Prescriptions
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-2xl text-orange-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
                <p className="text-gray-600">Set your working hours</p>
              </div>
            </div>
            <Button className="w-full">
              Update Availability
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <i className="ri-bar-chart-line text-2xl text-teal-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-gray-600">View practice statistics</p>
              </div>
            </div>
            <Button className="w-full">
              View Analytics
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-settings-line text-2xl text-indigo-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                <p className="text-gray-600">Update your information</p>
              </div>
            </div>
            <Button className="w-full">
              Edit Profile
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
