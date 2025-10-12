
import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import useLanguage from '../../hooks/useLanguage';

const AboutPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    { number: '50,000+', label: t('villagesServed') },
    { number: '500+', label: t('partnerHospitals') },
    { number: '1,000+', label: t('certifiedDoctors') },
    { number: '24/7', label: t('aiSupportAvailable') }
  ];

  const features = [
    {
      icon: 'ri-map-pin-line',
      title: t('locationBasedHealthcare'),
      description: t('locationBasedDesc')
    },
    {
      icon: 'ri-translate-2',
      title: t('multiLanguageAI'),
      description: t('multiLanguageDesc')
    },
    {
      icon: 'ri-phone-line',
      title: t('emergencySOSIntegration'),
      description: t('emergencySOSDesc')
    },
    {
      icon: 'ri-calendar-check-line',
      title: t('smartAppointmentBooking'),
      description: t('smartBookingDesc')
    }
  ];

  const team = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Chief Medical Officer',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20doctor%20in%20white%20coat%20smiling%20confidently%20in%20modern%20hospital%20setting%20with%20stethoscope%20around%20neck%2C%20warm%20lighting%2C%20medical%20background%20with%20clean%20white%20walls%20and%20medical%20equipment&width=300&height=300&seq=team1&orientation=squarish',
      description: 'Leading healthcare innovation with 15+ years of experience in rural medicine.'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Technology Director',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20software%20engineer%20in%20business%20casual%20attire%20working%20on%20healthcare%20technology%2C%20modern%20office%20environment%20with%20computers%20and%20medical%20tech%20displays%2C%20confident%20expression&width=300&height=300&seq=team2&orientation=squarish',
      description: 'Building scalable healthcare solutions to bridge the digital divide in medical access.'
    },
    {
      name: 'Dr. Anita Patel',
      role: 'Rural Health Specialist',
      image: 'https://readdy.ai/api/search-image?query=Compassionate%20Indian%20female%20doctor%20in%20traditional%20white%20coat%20consulting%20with%20rural%20patients%2C%20village%20healthcare%20setting%2C%20warm%20and%20caring%20expression%2C%20medical%20equipment%20in%20background&width=300&height=300&seq=team3&orientation=squarish',
      description: 'Dedicated to improving healthcare accessibility in underserved communities across India.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-700 hover:text-[#1fa27e] border-gray-300 hover:border-[#1fa27e] whitespace-nowrap"
        >
          <i className="ri-arrow-left-line"></i>
          <span>{t('backToHome')}</span>
        </Button>
      </div>

      {/* Hero Section */}
      <section 
        className="relative py-16 md:py-20 bg-gradient-to-br from-[#1fa27e] to-[#16a085] text-white overflow-hidden"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20healthcare%20technology%20concept%20with%20diverse%20Indian%20patients%20using%20mobile%20phones%20and%20tablets%20for%20telemedicine%20consultations%2C%20rural%20and%20urban%20settings%20combined%2C%20doctors%20in%20background%2C%20warm%20lighting%2C%20professional%20medical%20environment%20with%20digital%20health%20icons%20and%20connectivity%20symbols&width=1200&height=600&seq=hero1&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-[#1fa27e]/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">
            {t('bridgingHealthcareGaps')}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('makingHealthcareAccessible')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold">{stat.number}</div>
                <div className="text-sm md:text-base lg:text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                {t('ourMission')}
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
                {t('missionDescription')}
              </p>
              <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
                Our platform was born from a simple yet powerful vision: to ensure that every person, regardless of their location or language, can easily access healthcare services. We leverage cutting-edge technology and AI to break down these barriers and create a seamless healthcare experience.
              </p>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border-l-4 border-[#1fa27e]">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Our Core Belief</h3>
                <p className="text-sm md:text-base text-gray-700">
                  "Healthcare is a fundamental right, not a privilege. Technology should serve humanity by making essential services accessible to everyone, everywhere."
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <img 
                src="https://readdy.ai/api/search-image?query=Indian%20rural%20healthcare%20scene%20showing%20diverse%20patients%20from%20villages%20using%20smartphones%20for%20telemedicine%2C%20doctor%20consultation%20via%20video%20call%2C%20traditional%20Indian%20village%20setting%20with%20modern%20technology%20integration%2C%20warm%20natural%20lighting%2C%20hopeful%20and%20empowering%20atmosphere&width=600&height=500&seq=mission1&orientation=landscape"
                alt="Healthcare accessibility in rural India"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-[#1fa27e] text-white p-3 md:p-4 rounded-lg shadow-lg">
                <div className="text-xl md:text-2xl font-bold">100%</div>
                <div className="text-xs md:text-sm">{t('digitalAccessibility')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              {t('theChallengeWereSolving')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('transformingHealthcare')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
            {/* Problem */}
            <div className="bg-red-50 p-6 md:p-8 rounded-lg">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <i className="ri-error-warning-line text-xl md:text-2xl text-red-600"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">{t('theProblem')}</h3>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
                <li className="flex items-start">
                  <i className="ri-close-circle-line text-red-500 mt-1 mr-2 md:mr-3 flex-shrink-0"></i>
                  <span>Rural communities travel hours to reach the nearest hospital</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-close-circle-line text-red-500 mt-1 mr-2 md:mr-3 flex-shrink-0"></i>
                  <span>Language barriers prevent effective communication with healthcare providers</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-close-circle-line text-red-500 mt-1 mr-2 md:mr-3 flex-shrink-0"></i>
                  <span>Lack of awareness about available healthcare services and schemes</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-close-circle-line text-red-500 mt-1 mr-2 md:mr-3 flex-shrink-0"></i>
                  <span>Emergency situations with no immediate access to medical help</span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-green-50 p-6 md:p-8 rounded-lg">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <i className="ri-lightbulb-line text-xl md:text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">{t('ourSolution')}</h3>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
                <li className="flex items-start">
                  <i className="ri-check-circle-line text-green-500 mt-1 mr-2 md:mr-3 flex-shrink-0"></i>
                  <span>AI-powered platform that finds nearest healthcare providers instantly</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-circle-line text-green-500 mt-1 mr-2 md:mr-3 flex-shrink-0"></i>
                  <span>Multi-language AI assistant supporting local Indian languages</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-circle-line text-green-500 mt-1 mr-2 md:mr-3 flex-shrink-0"></i>
                  <span>Comprehensive information about government health schemes</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-circle-line text-green-500 mt-1 mr-2 md:mr-3 flex-shrink-0"></i>
                  <span>Emergency SOS feature with 108 service integration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              {t('howWereMakingDifference')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('innovativeFeatures')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1fa27e]/10 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <i className={`${feature.icon} text-xl md:text-2xl text-[#1fa27e]`}></i>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-20 bg-[#1fa27e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              {t('ourImpactAcrossIndia')}
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              {t('realStoriesTransforming')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-lg text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">85%</div>
              <div className="text-base md:text-lg mb-2 md:mb-3">{t('fasterEmergencyResponse')}</div>
              <p className="text-xs md:text-sm opacity-90">
                {t('emergencyResponseDesc')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-lg text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">12+</div>
              <div className="text-base md:text-lg mb-2 md:mb-3">{t('indianLanguagesSupported')}</div>
              <p className="text-xs md:text-sm opacity-90">
                {t('languageBarriersDesc')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-lg text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
              <div className="text-base md:text-lg mb-2 md:mb-3">{t('userSatisfactionRate')}</div>
              <p className="text-xs md:text-sm opacity-90">
                {t('satisfactionDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              {t('meetOurTeam')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('passionateHealthcare')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4 md:mb-6">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto object-cover object-top shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-[#1fa27e]/0 group-hover:bg-[#1fa27e]/10 transition-colors duration-300"></div>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-[#1fa27e] font-medium mb-2 md:mb-3">{member.role}</p>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-[#1fa27e] to-[#16a085] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            {t('ourVision')}
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed">
            {t('visionDescription')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <i className="ri-global-line text-xl md:text-2xl"></i>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">{t('universalAccess')}</h3>
              <p className="text-sm md:text-base opacity-90">{t('universalAccessDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <i className="ri-heart-pulse-line text-xl md:text-2xl"></i>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">{t('preventiveCare')}</h3>
              <p className="text-sm md:text-base opacity-90">{t('preventiveCareDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <i className="ri-community-line text-xl md:text-2xl"></i>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">{t('communityHealth')}</h3>
              <p className="text-sm md:text-base opacity-90">{t('communityHealthDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
            {t('joinUsTransforming')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
            {t('joinUsDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/book-appointment')}
              className="bg-[#1fa27e] text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-[#16a085] transition-colors duration-200 whitespace-nowrap cursor-pointer"
            >
              {t('bookAppointment')}
            </button>
            <button 
              onClick={() => navigate('/emergency')}
              className="bg-red-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 whitespace-nowrap cursor-pointer"
            >
              {t('emergencySOSTitle')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
