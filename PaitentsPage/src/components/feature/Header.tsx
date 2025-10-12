
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../base/Button';
import useLanguage from '../../hooks/useLanguage';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileLanguageOpen, setIsMobileLanguageOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const { t, changeLanguage, getCurrentLanguage } = useLanguage();

  const languages = [
    'English', 'Telugu', 'Hindi'
  ];

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('findHealthcare'), href: '/find-healthcare' },
    { name: t('appointment'), href: '/book-appointment' },
    { name: t('aiAssistant'), href: '/ai-assistant' },
    { name: t('nutrition'), href: '/health-nutrition' },
    { name: t('schemes'), href: '/government-schemes' },
    { name: t('about'), href: '/about' }
  ];

  const handleLanguageChange = async (language: string) => {
    if (language === getCurrentLanguage() || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Add fade out effect
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    // Wait for fade out
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Change language
    changeLanguage(language);
    
    // Wait a bit for content to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Fade back in
    document.body.style.opacity = '1';
    
    // Clean up
    setTimeout(() => {
      document.body.style.transition = '';
      setIsTransitioning(false);
      setIsLanguageOpen(false);
      setIsMobileLanguageOpen(false);
    }, 300);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#1fa27e] rounded-lg flex items-center justify-center">
                <i className="ri-heart-pulse-line text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-gray-900" style={{ fontFamily: '"Pacifico", serif' }}>
                GramaAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  location.pathname === item.href
                    ? 'text-[#1fa27e]'
                    : 'text-gray-700 hover:text-[#1fa27e]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Language Selector & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                disabled={isTransitioning}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1fa27e] transition-colors duration-200 cursor-pointer ${
                  isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <i className="ri-global-line"></i>
                <span className="whitespace-nowrap">{getCurrentLanguage()}</span>
                <i className={`ri-arrow-down-s-line transition-transform duration-200 ${
                  isLanguageOpen ? 'rotate-180' : ''
                }`}></i>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {languages.map((language) => (
                    <button
                      key={language}
                      onClick={() => handleLanguageChange(language)}
                      disabled={isTransitioning}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 cursor-pointer ${
                        getCurrentLanguage() === language
                          ? 'bg-[#1fa27e] text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/book-appointment">
              <Button size="sm">
                {t('bookAppointment')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-[#1fa27e] hover:bg-gray-100 cursor-pointer"
            >
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-[#1fa27e] bg-[#1fa27e]/10'
                      : 'text-gray-700 hover:text-[#1fa27e] hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile Language Selector */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsMobileLanguageOpen(!isMobileLanguageOpen)}
                disabled={isTransitioning}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
                  isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-global-line"></i>
                  <span>{t('language')}: {getCurrentLanguage()}</span>
                </div>
                <i className={`ri-arrow-down-s-line transition-transform duration-200 ${
                  isMobileLanguageOpen ? 'rotate-180' : ''
                }`}></i>
              </button>

              {isMobileLanguageOpen && (
                <div className="mt-2 space-y-1">
                  {languages.map((language) => (
                    <button
                      key={language}
                      onClick={() => handleLanguageChange(language)}
                      disabled={isTransitioning}
                      className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors duration-200 cursor-pointer ${
                        getCurrentLanguage() === language
                          ? 'bg-[#1fa27e] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link to="/book-appointment">
                <Button size="sm" fullWidth>
                  {t('bookAppointment')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close language dropdown */}
      {isLanguageOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsLanguageOpen(false)}
        ></div>
      )}
    </header>
  );
}
