
import { Button } from '../../../components/base/Button';

export const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Modern%20rural%20healthcare%20facility%20in%20India%20with%20doctors%20and%20patients%2C%20clean%20medical%20environment%2C%20bright%20natural%20lighting%2C%20professional%20healthcare%20setting%2C%20telemedicine%20equipment%2C%20rural%20community%20health%20center%2C%20medical%20consultation%20room%2C%20healthcare%20technology%2C%20warm%20and%20welcoming%20atmosphere%2C%20high%20quality%20medical%20care&width=1920&height=1080&seq=hero-health&orientation=landscape')`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Connecting Rural Communities with 
            <span className="text-blue-400"> Quality Healthcare</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            Access qualified doctors, book appointments, find hospitals, and get health assistance - all from your mobile device. Healthcare made accessible for Telangana's rural communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8 py-4">
              <i className="ri-calendar-check-line mr-3 text-xl"></i>
              Book Appointment
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-white hover:text-gray-900">
              <i className="ri-phone-line mr-3 text-xl"></i>
              Emergency Help
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-gray-300">Qualified Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">150+</div>
              <div className="text-gray-300">Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-gray-300">Patients Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.8★</div>
              <div className="text-gray-300">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
