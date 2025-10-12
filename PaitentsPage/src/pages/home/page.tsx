
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import { useLanguage } from '../../hooks/useLanguage';
import DemoModal from './components/DemoModal';

export default function Home() {
  const { t } = useLanguage();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const stats = [
    { number: '50,000+', label: t('villagesServed') },
    { number: '1,200+', label: t('certifiedDoctors') },
    { number: '15', label: t('languagesSupported') },
    { number: '24/7', label: t('aiSupportAvailable') }
  ];

  const features = [
    {
      icon: 'ri-hospital-line',
      title: t('findHealthcareTitle'),
      description: t('findHealthcareDesc'),
      path: '/find-healthcare'
    },
    {
      icon: 'ri-calendar-check-line',
      title: t('bookAppointmentTitle'),
      description: t('bookAppointmentDesc'),
      path: '/book-appointment'
    },
    {
      icon: 'ri-robot-line',
      title: t('aiHealthAssistantTitle'),
      description: t('aiHealthAssistantDesc'),
      path: '/ai-assistant'
    },
    {
      icon: 'ri-government-line',
      title: t('governmentSchemesTitle'),
      description: t('governmentSchemesDesc'),
      path: '/government-schemes'
    },
    {
      icon: 'ri-heart-pulse-line',
      title: t('healthInformationTitle'),
      description: t('healthInformationDesc'),
      path: '/health-nutrition'
    },
    {
      icon: 'ri-alarm-warning-line',
      title: t('emergencySOSTitle'),
      description: t('emergencySOSDesc'),
      path: '/emergency'
    }
  ];

  const languages = [t('english'), t('telugu'), t('hindi'), t('tamil')];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat min-h-[500px] md:min-h-[600px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Rural%20Indian%20village%20scene%20with%20villagers%20consulting%20a%20friendly%20doctor%20under%20a%20large%20tree%2C%20warm%20sunlight%20filtering%20through%20leaves%2C%20traditional%20Indian%20village%20setting%20with%20mud%20houses%20in%20background%2C%20people%20wearing%20colorful%20traditional%20Indian%20clothes%2C%20peaceful%20and%20trustworthy%20atmosphere%2C%20natural%20lighting%2C%20documentary%20photography%20style%2C%20high%20quality%2C%20realistic&width=1200&height=600&seq=hero-rural-healthcare&orientation=landscape')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-2">
              {t('heroTitle')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 px-4 max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12 justify-center px-4">
              <Link to="/ai-assistant">
                <Button size="lg" className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 md:py-4 whitespace-nowrap w-full sm:w-auto">
                  <i className="ri-mic-line text-lg md:text-xl"></i>
                  {t('startVoiceAssistant')}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 md:py-4 bg-white/10 border-white text-white hover:bg-white hover:text-gray-900 whitespace-nowrap w-full sm:w-auto"
                onClick={() => setIsDemoOpen(true)}
              >
                <i className="ri-play-circle-line text-lg md:text-xl"></i>
                {t('watchDemo')}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 px-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-200 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Complete Healthcare Solutions */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
              {t('completeHealthcareSolutions')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t('healthcareSolutionsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.path}>
                <Card hover className="h-full cursor-pointer">
                  <div className="text-center p-4 md:p-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1fa27e]/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <i className={`${feature.icon} text-xl md:text-2xl text-[#1fa27e]`}></i>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Health Assistant Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 px-2">
                {t('aiAssistantSectionTitle')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-2">
                {t('aiAssistantSectionDesc')}
              </p>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 px-2">
                <div className="flex items-center space-x-3">
                  <i className="ri-mic-line text-[#1fa27e] text-lg md:text-xl flex-shrink-0"></i>
                  <span className="text-sm md:text-base text-gray-700">{t('voiceSymptomChecking')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-medicine-bottle-line text-[#1fa27e] text-lg md:text-xl flex-shrink-0"></i>
                  <span className="text-sm md:text-base text-gray-700">{t('prescriptionExplanation')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-user-heart-line text-[#1fa27e] text-lg md:text-xl flex-shrink-0"></i>
                  <span className="text-sm md:text-base text-gray-700">{t('doctorSuggestions')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-first-aid-kit-line text-[#1fa27e] text-lg md:text-xl flex-shrink-0"></i>
                  <span className="text-sm md:text-base text-gray-700">{t('firstAidTips')}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6 px-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-[#1fa27e]/10 text-[#1fa27e] rounded-full text-xs md:text-sm font-medium hover:bg-[#1fa27e] hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap"
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="px-2">
                <Link to="/ai-assistant">
                  <Button size="lg" className="mb-4 md:mb-6 whitespace-nowrap w-full sm:w-auto">
                    <i className="ri-mic-line text-lg md:text-xl"></i>
                    {t('startSpeaking')}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:gap-4 order-1 lg:order-2">
              <Card className="text-center p-4 md:p-6">
                <i className="ri-stethoscope-line text-2xl md:text-3xl text-[#1fa27e] mb-2 md:mb-3"></i>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 md:mb-2">{t('symptomCheckerTitle')}</h3>
                <p className="text-xs md:text-sm text-gray-600">{t('symptomCheckerDesc')}</p>
              </Card>
              <Card className="text-center p-4 md:p-6">
                <i className="ri-first-aid-kit-line text-2xl md:text-3xl text-[#1fa27e] mb-2 md:mb-3"></i>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 md:mb-2">{t('firstAidTitle')}</h3>
                <p className="text-xs md:text-sm text-gray-600">{t('firstAidDesc')}</p>
              </Card>
              <Card className="text-center p-4 md:p-6">
                <i className="ri-alarm-warning-line text-2xl md:text-3xl text-red-500 mb-2 md:mb-3"></i>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 md:mb-2">{t('emergencyHelpTitle')}</h3>
                <p className="text-xs md:text-sm text-gray-600">{t('emergencyHelpDesc')}</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[#1fa27e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 px-2">
            {t('ctaTitle')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-green-100 mb-6 md:mb-8 px-4">
            {t('ctaDesc')}
          </p>
          <Link to="/ai-assistant">
            <Button variant="secondary" size="lg" className="text-sm sm:text-base md:text-lg px-6 md:px-8 py-3 md:py-4 whitespace-nowrap w-full sm:w-auto">
              <i className="ri-mic-line text-lg md:text-xl"></i>
              {t('startVoiceAssistantCTA')}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
