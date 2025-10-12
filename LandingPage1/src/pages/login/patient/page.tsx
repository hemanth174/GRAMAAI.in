
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/base/Button';

export default function PatientLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      navigate('/patient-dashboard');
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Patient Login
          </h1>
          <p className="text-gray-600">
            Access your health records and appointments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line mr-2 animate-spin"></i>
                Signing In...
              </>
            ) : (
              <>
                <i className="ri-login-circle-line mr-2"></i>
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
