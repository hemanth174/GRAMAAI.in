
import { Link } from 'react-router-dom';
import { Card } from '../../../components/base/Card';

export const SpecialtiesSection = () => {
  const specialties = [
    {
      icon: 'ri-stethoscope-line',
      name: 'General Physician',
      description: 'Primary healthcare and general medical consultation',
      doctors: 120,
      color: 'text-blue-600'
    },
    {
      icon: 'ri-heart-pulse-line',
      name: 'Cardiologist',
      description: 'Heart and cardiovascular system specialists',
      doctors: 45,
      color: 'text-red-600'
    },
    {
      icon: 'ri-parent-line',
      name: 'Pediatrician',
      description: 'Child healthcare and development specialists',
      doctors: 65,
      color: 'text-green-600'
    },
    {
      icon: 'ri-women-line',
      name: 'Gynecologist',
      description: 'Women\'s health and reproductive care',
      doctors: 38,
      color: 'text-pink-600'
    },
    {
      icon: 'ri-brain-line',
      name: 'Neurologist',
      description: 'Brain and nervous system specialists',
      doctors: 25,
      color: 'text-purple-600'
    },
    {
      icon: 'ri-microscope-line',
      name: 'Oncologist',
      description: 'Cancer treatment and care specialists',
      doctors: 18,
      color: 'text-orange-600'
    },
    {
      icon: 'ri-eye-line',
      name: 'Ophthalmologist',
      description: 'Eye care and vision specialists',
      doctors: 32,
      color: 'text-indigo-600'
    },
    {
      icon: 'ri-tooth-line',
      name: 'Dentist',
      description: 'Dental care and oral health specialists',
      doctors: 55,
      color: 'text-teal-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Medical Specialties
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with qualified specialists across various medical fields in Telangana
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialties.map((specialty, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className={`w-16 h-16 ${specialty.color} bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors`}>
                  <i className={`${specialty.icon} text-2xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{specialty.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{specialty.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  {specialty.doctors} doctors available
                </div>
                <Link 
                  to="/doctors" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                >
                  View Doctors
                  <i className="ri-arrow-right-line ml-1"></i>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
