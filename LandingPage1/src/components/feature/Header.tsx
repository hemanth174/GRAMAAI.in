
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center md:justify-start items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-heart-pulse-fill text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">Rural Health Connect</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
