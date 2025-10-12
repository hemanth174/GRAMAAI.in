
import { Link } from 'react-router-dom';
import useLanguage from '../../hooks/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { name: t('home'), href: '/' },
    { name: t('findHealthcare'), href: '/find-healthcare' },
    { name: t('appointment'), href: '/book-appointment' },
    { name: t('aiAssistant'), href: '/ai-assistant' }
  ];

  const healthcareServices = [
    { name: t('emergency'), href: '/emergency' },
    { name: t('nutrition'), href: '/health-nutrition' },
    { name: t('schemes'), href: '/government-schemes' },
    { name: t('about'), href: '/about' }
  ];

  const supportLinks = [
    { name: t('contactUs'), href: '#' },
    { name: t('privacyPolicy'), href: '#' },
    { name: t('termsOfService'), href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#1fa27e] rounded-lg flex items-center justify-center">
                <i className="ri-heart-pulse-line text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: '"Pacifico", serif' }}>
                GramaAI
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#1fa27e] transition-colors duration-200">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1fa27e] transition-colors duration-200">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1fa27e] transition-colors duration-200">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1fa27e] transition-colors duration-200">
                <i className="ri-youtube-fill text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Healthcare Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('healthcareServices')}</h3>
            <ul className="space-y-2">
              {healthcareServices.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('support')}</h3>
            <ul className="space-y-2 mb-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                <i className="ri-phone-line mr-2"></i>
                +91 1800-XXX-XXXX
              </p>
              <p className="text-sm text-gray-400">
                <i className="ri-mail-line mr-2"></i>
                support@gramaai.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 GramaAI. {t('allRightsReserved')}.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">{t('followUs')}:</span>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-[#1fa27e] transition-colors duration-200">
                  <i className="ri-facebook-fill"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#1fa27e] transition-colors duration-200">
                  <i className="ri-twitter-fill"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#1fa27e] transition-colors duration-200">
                  <i className="ri-linkedin-fill"></i>
                </a>
              </div>
              <a 
                href="https://readdy.ai/?origin=logo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1fa27e] transition-colors duration-200 text-sm ml-4"
              >
                Website Builder
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
