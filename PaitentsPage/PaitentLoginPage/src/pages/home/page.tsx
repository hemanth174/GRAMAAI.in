
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6">
            <i className="ri-hospital-line text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: '"Pacifico", serif' }}>
            MediCare Hospital
          </h1>
          <p className="text-xl text-gray-600 mb-8">Your Health, Our Priority</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Access Your Account</h2>
          
          <Link 
            to="/patient-login"
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 px-6 rounded-xl font-semibold text-center block hover:from-blue-600 hover:to-green-600 focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap cursor-pointer"
          >
            <div className="flex items-center justify-center">
              <i className="ri-user-line mr-2 text-lg"></i>
              Patient Login
            </div>
          </Link>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              New patient?{' '}
              <button className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200 cursor-pointer">
                Register Here
              </button>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 MediCare Hospital. All rights reserved.</p>
          <p className="mt-1">
            Emergency: <a href="tel:911" className="text-red-600 hover:text-red-800 font-semibold cursor-pointer">911</a> | 
            General: <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-800 cursor-pointer"> +1 (234) 567-8900</a>
          </p>
        </div>
      </div>
    </div>
  );
}
