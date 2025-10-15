import { Header } from '../../components/feature/Header';
import { Footer } from '../../components/feature/Footer';
import { Button } from '../../components/base/Button';

export default function HomePage() {
  const problems = [
    {
      icon: 'ri-map-pin-line',
      title: 'Limited Access to Healthcare',
      description: 'Rural communities often lack nearby medical facilities and specialists, forcing patients to travel long distances for basic care.'
    },
    {
      icon: 'ri-time-line',
      title: 'Long Waiting Times',
      description: 'Patients face extended wait times for appointments and consultations, delaying critical medical interventions.'
    },
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'High Healthcare Costs',
      description: 'Medical expenses and travel costs create financial barriers, preventing many from seeking necessary treatment.'
    },
    {
      icon: 'ri-user-search-line',
      title: 'Difficulty Finding Specialists',
      description: 'Locating qualified specialists and understanding their availability remains a major challenge for patients.'
    }
  ];

  const patientFeatures = [
    {
      icon: 'ri-calendar-check-line',
      title: 'Easy Appointment Booking',
      description: 'Book appointments with doctors instantly, view availability, and get confirmation notifications.'
    },
    {
      icon: 'ri-video-chat-line',
      title: 'Telemedicine Consultations',
      description: 'Connect with doctors remotely through secure video calls, saving time and travel costs.'
    },
    {
      icon: 'ri-file-text-line',
      title: 'Digital Health Records',
      description: 'Access your complete medical history, prescriptions, and test results anytime, anywhere.'
    },
    {
      icon: 'ri-search-line',
      title: 'Find Nearby Doctors',
      description: 'Locate qualified healthcare providers in your area with detailed profiles and patient reviews.'
    },
    {
      icon: 'ri-medicine-bottle-line',
      title: 'Prescription Management',
      description: 'Track medications, set reminders, and order medicines online with home delivery options.'
    },
    {
      icon: 'ri-heart-pulse-line',
      title: 'Health Monitoring',
      description: 'Monitor vital signs, track symptoms, and receive personalized health insights and recommendations.'
    }
  ];

  const doctorFeatures = [
    {
      icon: 'ri-calendar-line',
      title: 'Schedule Management',
      description: 'Manage appointments efficiently with automated scheduling and patient notification systems.'
    },
    {
      icon: 'ri-user-line',
      title: 'Patient Management',
      description: 'Access comprehensive patient profiles, medical histories, and treatment progress tracking.'
    },
    {
      icon: 'ri-smartphone-line',
      title: 'Mobile Practice',
      description: 'Provide consultations on-the-go with mobile-optimized tools for remote patient care.'
    },
    {
      icon: 'ri-file-chart-line',
      title: 'Digital Prescriptions',
      description: 'Create and send digital prescriptions directly to patients and pharmacies securely.'
    },
    {
      icon: 'ri-bar-chart-line',
      title: 'Practice Analytics',
      description: 'Track patient outcomes, appointment statistics, and practice performance metrics.'
    },
    {
      icon: 'ri-team-line',
      title: 'Collaboration Tools',
      description: 'Consult with specialists, share cases, and collaborate on complex patient treatments.'
    }
  ];

  const benefits = [
    {
      number: '50%',
      label: 'Reduced Travel Time',
      description: 'Patients save significant time with telemedicine and local doctor discovery'
    },
    {
      number: '75%',
      label: 'Faster Appointments',
      description: 'Quick booking system reduces waiting time from weeks to days'
    },
    {
      number: '40%',
      label: 'Lower Healthcare Costs',
      description: 'Reduced travel expenses and competitive pricing for consultations'
    },
    {
      number: '90%',
      label: 'Patient Satisfaction',
      description: 'High satisfaction rates from improved access and quality of care'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(16, 185, 129, 0.8)), url('https://readdy.ai/api/search-image?query=Modern%20healthcare%20facility%20with%20doctors%20and%20patients%20in%20a%20bright%2C%20welcoming%20environment%2C%20medical%20technology%2C%20telemedicine%20setup%2C%20rural%20healthcare%20center%20with%20modern%20equipment%2C%20professional%20medical%20staff%20helping%20patients%2C%20clean%20white%20and%20blue%20medical%20interior%20design%2C%20natural%20lighting%2C%20hope%20and%20care%20atmosphere&width=1920&height=1080&seq=hero-healthcare&orientation=landscape')`
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Connecting Rural Communities
            <span className="block text-green-300">with Quality Healthcare</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Bridge the healthcare gap with our comprehensive platform that brings doctors and patients together, 
            making quality medical care accessible to everyone, everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => {
                window.open('https://gramaai-patient.netlify.app', '_blank');
              }}
              className="w-full sm:w-auto px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap cursor-pointer"
              size="lg"
            >
              <i className="ri-user-line mr-3 text-xl"></i>
              Patient Portal
            </Button>
            <Button
              onClick={() => {
                window.open('https://gramaai-hospital.netlify.app/login', '_blank');
              }}
              className="w-full sm:w-auto px-8 py-4 text-lg bg-green-600 hover:bg-green-700 text-white whitespace-nowrap cursor-pointer"
              size="lg"
            >
              <i className="ri-stethoscope-line mr-3 text-xl"></i>
              Hospital Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Problems We Solve Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Healthcare Challenges We Address
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rural communities face unique healthcare challenges. Our platform provides innovative solutions 
              to bridge these gaps and ensure everyone has access to quality medical care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problems.map((problem, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <i className={`${problem.icon} text-2xl text-red-600`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{problem.title}</h3>
                <p className="text-gray-600 leading-relaxed">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Empowering Patients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare tools designed to put patients in control of their health journey, 
              making medical care more accessible and convenient than ever before.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {patientFeatures.map((feature, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-8 hover:bg-blue-100 transition-colors">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                  <i className={`${feature.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Supporting Healthcare Providers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced practice management tools that help doctors deliver better care, 
              streamline operations, and reach more patients in rural communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctorFeatures.map((feature, index) => (
              <div key={index} className="bg-green-50 rounded-xl p-8 hover:bg-green-100 transition-colors">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                  <i className={`${feature.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real-World Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable improvements in healthcare accessibility and quality for rural communities 
              across Telangana and beyond.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">
                  {benefit.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.label}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of patients and healthcare providers who are already experiencing 
            the future of rural healthcare delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => {
                window.open('https://gramaai-patient.netlify.app', '_blank');
              }}
              className="w-full sm:w-auto px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 whitespace-nowrap cursor-pointer"
              size="lg"
            >
              <i className="ri-user-line mr-3 text-xl"></i>
              Patient Portal
            </Button>
            <Button
              onClick={() => {
                window.open('https://gramaai-hospital.netlify.app/login', '_blank');
              }}
              className="w-full sm:w-auto px-8 py-4 text-lg bg-white text-green-600 hover:bg-gray-100 whitespace-nowrap cursor-pointer"
              size="lg"
            >
              <i className="ri-stethoscope-line mr-3 text-xl"></i>
              Hospital Portal
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
