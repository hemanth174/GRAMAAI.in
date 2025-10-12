
import { useState } from 'react';
import { Header } from '../../components/feature/Header';
import { Footer } from '../../components/feature/Footer';
import { Button } from '../../components/base/Button';
import { Card } from '../../components/base/Card';

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const quickSearchTags = ['Fever', 'Diabetes', 'Heart Disease', 'Blood Pressure', 'Pregnancy', 'Child Care'];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      experience: 15,
      rating: 4.8,
      hospital: 'Apollo Hospital, Hyderabad',
      visitingHours: 'Mon-Fri: 9:00 AM - 5:00 PM',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20cardiologist%20doctor%20in%20white%20coat%2C%20middle-aged%2C%20confident%20smile%2C%20stethoscope%20around%20neck%2C%20medical%20office%20background%2C%20clean%20professional%20lighting%2C%20high%20quality%20portrait&width=300&height=300&seq=doctor-rajesh&orientation=squarish',
      consultationFee: '₹500',
      languages: ['English', 'Telugu', 'Hindi']
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialty: 'Pediatrician',
      experience: 12,
      rating: 4.9,
      hospital: 'Rainbow Children\'s Hospital',
      visitingHours: 'Mon-Sat: 10:00 AM - 6:00 PM',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20pediatrician%20doctor%20in%20white%20coat%2C%20warm%20smile%2C%20stethoscope%2C%20child-friendly%20medical%20office%20background%2C%20bright%20lighting%2C%20caring%20expression%2C%20high%20quality%20portrait&width=300&height=300&seq=doctor-priya&orientation=squarish',
      consultationFee: '₹400',
      languages: ['English', 'Telugu']
    },
    {
      id: 3,
      name: 'Dr. Venkatesh Naidu',
      specialty: 'General Physician',
      experience: 20,
      rating: 4.7,
      hospital: 'KIMS Hospital, Secunderabad',
      visitingHours: 'Mon-Sun: 8:00 AM - 8:00 PM',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20general%20physician%20doctor%20in%20white%20coat%2C%20experienced%2C%20friendly%20demeanor%2C%20stethoscope%2C%20modern%20medical%20clinic%20background%2C%20professional%20lighting%2C%20trustworthy%20appearance&width=300&height=300&seq=doctor-venkatesh&orientation=squarish',
      consultationFee: '₹300',
      languages: ['English', 'Telugu', 'Hindi']
    },
    {
      id: 4,
      name: 'Dr. Lakshmi Reddy',
      specialty: 'Gynecologist',
      experience: 18,
      rating: 4.8,
      hospital: 'Fernandez Hospital',
      visitingHours: 'Mon-Fri: 9:00 AM - 4:00 PM',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20gynecologist%20doctor%20in%20white%20coat%2C%20confident%20and%20caring%20expression%2C%20stethoscope%2C%20modern%20women%20health%20clinic%20background%2C%20soft%20lighting%2C%20professional%20portrait&width=300&height=300&seq=doctor-lakshmi&orientation=squarish',
      consultationFee: '₹600',
      languages: ['English', 'Telugu']
    },
    {
      id: 5,
      name: 'Dr. Suresh Babu',
      specialty: 'Neurologist',
      experience: 22,
      rating: 4.9,
      hospital: 'Yashoda Hospital',
      visitingHours: 'Tue-Sat: 10:00 AM - 3:00 PM',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20neurologist%20doctor%20in%20white%20coat%2C%20senior%20experienced%2C%20intelligent%20expression%2C%20stethoscope%2C%20neurology%20clinic%20background%2C%20professional%20lighting%2C%20expert%20appearance&width=300&height=300&seq=doctor-suresh&orientation=squarish',
      consultationFee: '₹800',
      languages: ['English', 'Telugu', 'Hindi']
    },
    {
      id: 6,
      name: 'Dr. Anitha Rao',
      specialty: 'Ophthalmologist',
      experience: 14,
      rating: 4.7,
      hospital: 'L V Prasad Eye Institute',
      visitingHours: 'Mon-Fri: 9:00 AM - 5:00 PM',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20ophthalmologist%20doctor%20in%20white%20coat%2C%20precise%20and%20caring%2C%20eye%20examination%20equipment%20in%20background%2C%20modern%20eye%20clinic%2C%20professional%20lighting%2C%20expert%20portrait&width=300&height=300&seq=doctor-anitha&orientation=squarish',
      consultationFee: '₹450',
      languages: ['English', 'Telugu']
    }
  ];

  const specialties = ['all', 'General Physician', 'Cardiologist', 'Pediatrician', 'Gynecologist', 'Neurologist', 'Ophthalmologist'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Find Healthcare Near You
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search for disease, specialist, or symptom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {quickSearchTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    selectedSpecialty === specialty
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Expert Doctors ({filteredDoctors.length} found)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`ri-star-${i < Math.floor(doctor.rating) ? 'fill' : 'line'} text-sm`}></i>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{doctor.rating}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                    <p className="text-gray-600 text-sm mb-2">{doctor.experience} years experience</p>
                    <p className="text-gray-600 text-sm mb-3">{doctor.hospital}</p>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
                        <i className="ri-time-line mr-1"></i>
                        {doctor.visitingHours}
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
                        <i className="ri-money-rupee-circle-line mr-1"></i>
                        Consultation: {doctor.consultationFee}
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <i className="ri-translate-2 mr-1"></i>
                        {doctor.languages.join(', ')}
                      </div>
                    </div>
                    
                    <Button fullWidth>
                      <i className="ri-calendar-check-line mr-2"></i>
                      Book Appointment
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}