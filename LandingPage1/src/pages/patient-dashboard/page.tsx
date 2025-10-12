
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/base/Button';
import { Card } from '../../components/base/Card';

export default function PatientDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Patient Dashboard</h1>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Patient!</h2>
          <p className="text-gray-600">Manage your health records and appointments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-calendar-check-line text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
                <p className="text-gray-600">Book & manage appointments</p>
              </div>
            </div>
            <Button className="w-full">
              View Appointments
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-text-line text-2xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Medical Records</h3>
                <p className="text-gray-600">Access your health records</p>
              </div>
            </div>
            <Button className="w-full">
              View Records
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-medicine-bottle-line text-2xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
                <p className="text-gray-600">View your prescriptions</p>
              </div>
            </div>
            <Button className="w-full">
              View Prescriptions
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-search-line text-2xl text-orange-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Find Doctors</h3>
                <p className="text-gray-600">Search for specialists</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => navigate('/doctors')}>
              Find Doctors
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-phone-line text-2xl text-red-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Emergency</h3>
                <p className="text-gray-600">24/7 emergency support</p>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Emergency Help
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-settings-line text-2xl text-teal-600"></i>
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
