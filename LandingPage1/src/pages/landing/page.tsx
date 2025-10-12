
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/base/Button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Pacifico, serif" }}>
            Rural Health Connect
          </h1>
          <p className="text-gray-600">
            Connecting rural communities with quality healthcare
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/login/patient')}
            className="w-full py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <i className="ri-user-line mr-3 text-xl"></i>
            Patient Login
          </Button>

          <Button
            onClick={() => navigate('/login/doctor')}
            className="w-full py-4 text-lg bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <i className="ri-stethoscope-line mr-3 text-xl"></i>
            Doctor Login
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            New to our platform?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
