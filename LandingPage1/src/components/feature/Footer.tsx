
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-heart-pulse-fill text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold">Rural Health Connect</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting rural communities with quality healthcare. Providing accessible medical services across Telangana.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-youtube-fill text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/doctors" className="text-gray-300 hover:text-white cursor-pointer">Find Doctors</Link></li>
              <li><Link to="/hospitals" className="text-gray-300 hover:text-white cursor-pointer">Hospitals</Link></li>
              <li><Link to="/schemes" className="text-gray-300 hover:text-white cursor-pointer">Health Schemes</Link></li>
              <li><Link to="/assistant" className="text-gray-300 hover:text-white cursor-pointer">Health Assistant</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <i className="ri-phone-fill mr-2"></i>
                +91 40 2345 6789
              </li>
              <li className="flex items-center">
                <i className="ri-mail-fill mr-2"></i>
                info@ruralhealthconnect.in
              </li>
              <li className="flex items-center">
                <i className="ri-map-pin-fill mr-2"></i>
                Hyderabad, Telangana
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 Rural Health Connect. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link 
              to="https://readdy.ai/?origin=logo" 
              className="text-gray-300 hover:text-white text-sm cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by Readdy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
