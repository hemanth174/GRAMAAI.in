
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import HospitalFinder from './components/HospitalFinder';
import useLanguage from '../../hooks/useLanguage';

export default function FindHealthcare() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showMobileLanguage, setShowMobileLanguage] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  const filters = ['All', 'Hospital', 'Clinic', 'Pharmacy', 'Doctor', 'Specialist'];
  
  const categories = [
    { id: 'all', name: 'allCategories', icon: 'ri-grid-line' },
    { id: 'hospital', name: 'hospitals', icon: 'ri-hospital-line' },
    { id: 'clinic', name: 'clinics', icon: 'ri-stethoscope-line' },
    { id: 'diagnostic', name: 'diagnosticCenters', icon: 'ri-microscope-line' },
    { id: 'pharmacy', name: 'pharmacies', icon: 'ri-capsule-line' }
  ];
  
  const healthcareProviders = [
    {
      id: '1',
      name: 'apolloHospitals',
      type: 'governmentHospital',
      address: 'apolloAddress',
      distance: '2.5 km',
      rating: 4.8,
      image: 'https://readdy.ai/api/search-image?query=Modern%20Indian%20government%20hospital%20building%20with%20clean%20white%20exterior%2C%20Indian%20flag%2C%20patients%20and%20families%20walking%20outside%2C%20tropical%20trees%2C%20clear%20blue%20sky%2C%20professional%20healthcare%20facility%2C%20realistic%20photography%20style&width=300&height=200&seq=govt-hospital&orientation=landscape',
      services: ['cardiology', 'neurology', 'orthopedics', 'pediatrics'],
      phone: '+91 883 2420123'
    },
    {
      id: '2',
      name: 'maxHealthcare',
      type: 'pharmacy',
      address: 'maxAddress',
      distance: '1.8 km',
      rating: 4.5,
      image: 'https://readdy.ai/api/search-image?query=Clean%20modern%20Indian%20pharmacy%20store%20front%20with%20green%20cross%20sign%2C%20medicine%20shelves%20visible%20through%20glass%20windows%2C%20customers%20entering%2C%20urban%20Indian%20street%20setting%2C%20bright%20daylight%2C%20professional%20medical%20retail&width=300&height=200&seq=apollo-pharmacy&orientation=landscape',
      services: ['cardiology', 'neurology', 'orthopedics'],
      phone: '+91 883 2445678'
    },
    {
      id: '3',
      name: 'fortisHospital',
      type: 'privateClinic',
      address: 'fortisAddress',
      distance: '3.2 km',
      rating: 4.7,
      image: 'https://readdy.ai/api/search-image?query=Small%20private%20medical%20clinic%20in%20Indian%20town%2C%20clean%20white%20building%20with%20medical%20cross%20sign%2C%20doctor%20in%20white%20coat%20greeting%20patients%2C%20family-friendly%20atmosphere%2C%20traditional%20Indian%20architecture%20elements&width=300&height=200&seq=priya-clinic&orientation=landscape',
      services: ['cardiology', 'neurology', 'pediatrics'],
      phone: '+91 883 2467890'
    },
    {
      id: '4',
      name: 'manipalHospital',
      type: 'medicalStore',
      address: 'manipalAddress',
      distance: '1.2 km',
      rating: 4.1,
      image: 'https://readdy.ai/api/search-image?query=Traditional%20Indian%20medical%20store%20with%20colorful%20medicine%20boxes%20displayed%2C%20friendly%20pharmacist%20helping%20customer%2C%20busy%20Indian%20street%20scene%2C%20local%20neighborhood%20pharmacy%2C%20authentic%20Indian%20retail%20setting&width=300&height=200&seq=ramesh-medical&orientation=landscape',
      services: ['cardiology', 'orthopedics', 'pediatrics'],
      phone: '+91 883 2434567'
    }
  ];

  const filteredHospitals = healthcareProviders.filter(provider => {
    const matchesSearch = t(provider.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t(provider.type).toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t(provider.address).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || 
                         (selectedFilter === 'Hospital' && (provider.type.includes('Hospital') || provider.type.includes('hospital'))) ||
                         (selectedFilter === 'Clinic' && provider.type.includes('Clinic')) ||
                         (selectedFilter === 'Pharmacy' && (provider.type.includes('pharmacy') || provider.type.includes('Store'))) ||
                         (selectedFilter === 'Doctor' && provider.type.includes('Clinic')) ||
                         (selectedFilter === 'Specialist' && provider.type.includes('specialty'));
    const matchesCategory = selectedCategory === 'all' ||
                           (selectedCategory === 'hospital' && (provider.type.includes('Hospital') || provider.type.includes('hospital'))) ||
                           (selectedCategory === 'clinic' && provider.type.includes('Clinic')) ||
                           (selectedCategory === 'pharmacy' && (provider.type.includes('pharmacy') || provider.type.includes('Store'))) ||
                           (selectedCategory === 'diagnostic' && provider.type.includes('diagnostic'));
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const handleBookAppointment = (hospitalId: string) => {
    navigate('/book-appointment', { state: { hospitalId } });
  };

  const handleViewDetails = (hospitalId: string) => {
    // Navigate to hospital details or show modal
    console.log('View details for hospital:', hospitalId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Mobile Language Selector */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
        <button
          onClick={() => setShowMobileLanguage(!showMobileLanguage)}
          className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:text-[#1fa27e] transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <i className="ri-global-line"></i>
            <span>{t('language')}</span>
          </div>
          <i className={`ri-arrow-down-s-line transition-transform duration-200 ${showMobileLanguage ? 'rotate-180' : ''}`}></i>
        </button>
        
        {showMobileLanguage && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {['English', 'Telugu', 'Hindi'].map((language) => (
              <button
                key={language}
                onClick={() => {
                  // Handle language change
                  setShowMobileLanguage(false);
                }}
                className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-[#1fa27e] hover:text-white transition-colors duration-200"
              >
                {language}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('findHealthcare')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('findHealthcareDescription')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <input
                type="text"
                placeholder={t('searchHospitals')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent pr-8"
              >
                <option value="">{t('selectLocation')}</option>
                <option value="hyderabad">{t('hyderabad')}</option>
                <option value="bangalore">{t('bangalore')}</option>
                <option value="chennai">{t('chennai')}</option>
                <option value="mumbai">{t('mumbai')}</option>
                <option value="delhi">{t('delhi')}</option>
              </select>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent pr-8"
              >
                <option value="all">{t('allCategories')}</option>
                <option value="hospital">{t('hospitals')}</option>
                <option value="clinic">{t('clinics')}</option>
                <option value="diagnostic">{t('diagnosticCenters')}</option>
                <option value="pharmacy">{t('pharmacies')}</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-[#1fa27e] text-white'
                    : 'bg-white text-gray-700 hover:bg-[#1fa27e]/10 border border-gray-300'
                }`}
              >
                <i className={`${category.icon} mr-2`}></i>
                {t(category.name)}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex gap-3 sm:gap-4">
                <img
                  src={hospital.image}
                  alt={t(hospital.name)}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg object-cover object-top flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1 pr-2">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 truncate">
                        {t(hospital.name)}
                      </h3>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
                        <i className="ri-map-pin-line mr-1 flex-shrink-0"></i>
                        <span className="truncate">{t(hospital.address)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center mb-1">
                        <i className="ri-star-fill text-yellow-400 mr-1"></i>
                        <span className="text-xs sm:text-sm font-medium">{hospital.rating}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">{hospital.distance}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hospital.services.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#1fa27e]/10 text-[#1fa27e] text-xs rounded-full truncate max-w-20 sm:max-w-none"
                      >
                        {t(service)}
                      </span>
                    ))}
                    {hospital.services.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex-shrink-0">
                        +{hospital.services.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(hospital.id)}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap cursor-pointer bg-[#1fa27e] text-white hover:bg-[#178a69] min-w-0 flex-shrink-0"
                    >
                      <i className="ri-eye-line mr-1"></i>
                      <span className="hidden sm:inline">{t('viewDetails')}</span>
                      <span className="sm:hidden">{t('view')}</span>
                    </button>
                    <button
                      onClick={() => handleBookAppointment(hospital.id)}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap cursor-pointer border-2 border-[#1fa27e] text-[#1fa27e] hover:bg-[#1fa27e] hover:text-white min-w-0 flex-shrink-0"
                    >
                      <i className="ri-calendar-line mr-1"></i>
                      <span className="hidden sm:inline">{t('bookNow')}</span>
                      <span className="sm:hidden">{t('book')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Hospital Finder Component */}
        <div className="mt-12">
          <HospitalFinder />
        </div>
      </div>

      <Footer />
    </div>
  );
}
