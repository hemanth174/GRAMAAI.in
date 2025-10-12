
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../base/Button';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Find Doctors', href: '/doctors' },
    { name: 'Hospitals', href: '/hospitals' },
    { name: 'Health Schemes', href: '/schemes' },
    { name: 'Health Assistant', href: '/assistant' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-heart-pulse-fill text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">Rural Health Connect</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  location.pathname === item.href
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <i className="ri-translate-2 mr-2"></i>
              తెలుగు
            </Button>
            <Button size="sm">
              <i className="ri-user-line mr-2"></i>
              Login
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 cursor-pointer"
            >
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" fullWidth>
                  <i className="ri-translate-2 mr-2"></i>
                  తెలుగు
                </Button>
                <Button size="sm" fullWidth>
                  <i className="ri-user-line mr-2"></i>
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
