
import { useState } from 'react';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';
import { useLanguage } from '../../../hooks/useLanguage';

interface Hospital {
  id: string;
  name: string;
  nameHi: string;
  nameTe: string;
  address: string;
  addressHi: string;
  addressTe: string;
  distance: string;
  type: string;
  phone: string;
  rating: number;
  specialties: string[];
  specialtiesHi: string[];
  specialtiesTe: string[];
  emergency: boolean;
}

export default function HospitalFinder() {
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const mockHospitals: Hospital[] = [
    {
      id: '1',
      name: 'Apollo Hospitals',
      nameHi: 'अपोलो अस्पताल',
      nameTe: 'అపోలో ఆసుపత్రులు',
      address: 'Jubilee Hills, Hyderabad, Telangana 500033',
      addressHi: 'जुबली हिल्स, हैदराबाद, तेलंगाना 500033',
      addressTe: 'జూబ్లీ హిల్స్, హైదరాబాద్, తెలంగాణ 500033',
      distance: '2.3 km',
      type: 'Multi-specialty',
      phone: '+91 40 2355 1066',
      rating: 4.5,
      specialties: ['Cardiology', 'Neurology', 'Oncology', 'Emergency'],
      specialtiesHi: ['हृदय रोग विज्ञान', 'न्यूरोलॉजी', 'कैंसर विज्ञान', 'आपातकाल'],
      specialtiesTe: ['గుండె వైద్యం', 'న్యూరాలజీ', 'కాన్సర్ వైద్యం', 'అత్యవసర'],
      emergency: true
    },
    {
      id: '2',
      name: 'KIMS Hospital',
      nameHi: 'किम्स अस्पताल',
      nameTe: 'కిమ్స్ ఆసుపత్రి',
      address: 'Kondapur, Hyderabad, Telangana 500084',
      addressHi: 'कोंडापुर, हैदराबाद, तेलंगाना 500084',
      addressTe: 'కొండాపూర్, హైదరాబాద్, తెలంగాణ 500084',
      distance: '3.7 km',
      type: 'Multi-specialty',
      phone: '+91 40 4020 3000',
      rating: 4.3,
      specialties: ['Orthopedics', 'Gastroenterology', 'Emergency'],
      specialtiesHi: ['हड्डी रोग', 'गैस्ट्रोएंटेरोलॉजी', 'आपातकाल'],
      specialtiesTe: ['ఎముకల వైద్యం', 'గ్యాస్ట్రోఎంటరాలజీ', 'అత్యవసర'],
      emergency: true
    },
    {
      id: '3',
      name: 'Yashoda Hospitals',
      nameHi: 'यशोदा अस्पताल',
      nameTe: 'యశోద ఆసుపత్రులు',
      address: 'Somajiguda, Hyderabad, Telangana 500082',
      addressHi: 'सोमाजीगुडा, हैदराबाद, तेलंगाना 500082',
      addressTe: 'సోమాజిగూడ, హైదరాబాద్, తెలంగాణ 500082',
      distance: '4.1 km',
      type: 'Multi-specialty',
      phone: '+91 40 2344 4444',
      rating: 4.4,
      specialties: ['Pediatrics', 'Gynecology', 'Emergency'],
      specialtiesHi: ['बाल चिकित्सा', 'स्त्री रोग', 'आपातकाल'],
      specialtiesTe: ['పిల్లల వైద్యం', 'స్త్రీ రోగాలు', 'అత్యవసర'],
      emergency: true
    },
    {
      id: '4',
      name: 'Continental Hospitals',
      nameHi: 'कॉन्टिनेंटल अस्पताल',
      nameTe: 'కాంటినెంటల్ ఆసుపత్రులు',
      address: 'Gachibowli, Hyderabad, Telangana 500032',
      addressHi: 'गाचीबोवली, हैदराबाद, तेलंगाना 500032',
      addressTe: 'గాచిబౌలి, హైదరాబాద్, తెలంగాణ 500032',
      distance: '5.2 km',
      type: 'Multi-specialty',
      phone: '+91 40 6777 6777',
      rating: 4.2,
      specialties: ['Cardiology', 'Neurosurgery', 'Emergency'],
      specialtiesHi: ['हृदय रोग विज्ञान', 'न्यूरो सर्जरी', 'आपातकाल'],
      specialtiesTe: ['గుండె వైద్యం', 'న్యూరో సర్జరీ', 'అత్యవసర'],
      emergency: true
    },
    {
      id: '5',
      name: 'District Government Hospital',
      nameHi: 'जिला सरकारी अस्पताल',
      nameTe: 'జిల్లా ప్రభుత్వ ఆసుపత్రి',
      address: 'Main Road, Rajamahendravaram',
      addressHi: 'मुख्य सड़क, राजमहेंद्रवरम',
      addressTe: 'మెయిన్ రోడ్, రాజమహేంద్రవరం',
      distance: '2.5 km',
      type: 'Government Hospital',
      phone: '+91 883 2420 123',
      rating: 4.2,
      specialties: ['Emergency', 'General Medicine', 'Surgery'],
      specialtiesHi: ['आपातकाल', 'सामान्य चिकित्सा', 'शल्य चिकित्सा'],
      specialtiesTe: ['అత్యవసర', 'సాధారణ వైద్యం', 'శస్త్రచికిత్స'],
      emergency: true
    },
    {
      id: '6',
      name: 'Care Hospitals',
      nameHi: 'केयर अस्पताल',
      nameTe: 'కేర్ ఆసుపత్రులు',
      address: 'Banjara Hills, Hyderabad, Telangana 500034',
      addressHi: 'बंजारा हिल्स, हैदराबाद, तेलंगाना 500034',
      addressTe: 'బంజారా హిల్స్, హైదరాబాద్, తెలంగాణ 500034',
      distance: '6.8 km',
      type: 'Multi-specialty',
      phone: '+91 40 6165 6565',
      rating: 4.1,
      specialties: ['Oncology', 'Nephrology', 'Emergency'],
      specialtiesHi: ['कैंसर विज्ञान', 'नेफ्रोलॉजी', 'आपातकाल'],
      specialtiesTe: ['కాన్సర్ వైద్యం', 'నెఫ్రాలజీ', 'అత్యవసర'],
      emergency: true
    }
  ];

  const handleSearch = async () => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setHospitals(mockHospitals);
    setIsLoading(false);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation('Hyderabad, Telangana');
        }
      );
    } else {
      setLocation('Hyderabad, Telangana');
    }
  };

  const getLocalizedHospitalName = (hospital: Hospital) => {
    const currentLang = localStorage.getItem('language') || 'en';
    if (currentLang === 'hi') return hospital.nameHi;
    if (currentLang === 'te') return hospital.nameTe;
    return hospital.name;
  };

  const getLocalizedAddress = (hospital: Hospital) => {
    const currentLang = localStorage.getItem('language') || 'en';
    if (currentLang === 'hi') return hospital.addressHi;
    if (currentLang === 'te') return hospital.addressTe;
    return hospital.address;
  };

  const getLocalizedSpecialties = (hospital: Hospital) => {
    const currentLang = localStorage.getItem('language') || 'en';
    if (currentLang === 'hi') return hospital.specialtiesHi;
    if (currentLang === 'te') return hospital.specialtiesTe;
    return hospital.specialties;
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Search Section */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{t('findNearbyHospitals')}</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('enterLocation')}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent text-sm"
              />
            </div>
            <Button
              onClick={handleGetCurrentLocation}
              variant="outline"
              className="whitespace-nowrap text-sm px-3 py-2"
            >
              <i className="ri-map-pin-line mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">{t('useCurrentLocation')}</span>
              <span className="sm:hidden">{t('location')}</span>
            </Button>
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={!location.trim() || isLoading}
            className="w-full sm:w-auto text-sm"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                {t('loading')}
              </>
            ) : (
              <>
                <i className="ri-search-line mr-2"></i>
                {t('searchHospitals')}
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <i className="ri-loader-4-line animate-spin text-3xl text-[#1fa27e] mb-3"></i>
                  <p className="text-gray-600 text-sm">{t('loading')}...</p>
                </div>
              </div>
            </Card>
          ) : hospitals.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {hospitals.length} {t('hospitalsFound')} "{location}"
                </h3>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <i className="ri-map-pin-line"></i>
                  <span>{t('distance')}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4">
                {hospitals.map((hospital) => (
                  <Card key={hospital.id} className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex gap-3 sm:gap-4">
                      <img
                        alt={getLocalizedHospitalName(hospital)}
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg object-cover object-top flex-shrink-0"
                        src={`https://readdy.ai/api/search-image?query=Modern%20Indian%20$%7Bhospital.type.toLowerCase%28%29%7D%20building%20with%20clean%20white%20exterior%2C%20Indian%20flag%2C%20patients%20and%20families%20walking%20outside%2C%20tropical%20trees%2C%20clear%20blue%20sky%2C%20professional%20healthcare%20facility%2C%20realistic%20photography%20style&width=300&height=200&seq=${hospital.id}-hospital&orientation=landscape`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="min-w-0 flex-1 pr-2">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 truncate">
                              {getLocalizedHospitalName(hospital)}
                            </h3>
                            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
                              <i className="ri-map-pin-line mr-1 flex-shrink-0"></i>
                              <span className="truncate">{getLocalizedAddress(hospital)}</span>
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
                          {getLocalizedSpecialties(hospital).slice(0, 2).map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-[#1fa27e]/10 text-[#1fa27e] text-xs rounded-full truncate max-w-20 sm:max-w-none"
                            >
                              {specialty}
                            </span>
                          ))}
                          {getLocalizedSpecialties(hospital).length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex-shrink-0">
                              +{getLocalizedSpecialties(hospital).length - 2}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button size="sm" className="flex-1 text-xs">
                            <i className="ri-eye-line mr-1"></i>
                            <span className="hidden sm:inline">{t('viewDetails')}</span>
                            <span className="sm:hidden">{t('view')}</span>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            <i className="ri-calendar-line mr-1"></i>
                            <span className="hidden sm:inline">{t('bookNow')}</span>
                            <span className="sm:hidden">{t('book')}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card className="p-6">
              <div className="text-center py-8">
                <i className="ri-map-pin-line text-4xl text-gray-400 mb-3"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noHospitalsFound')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('locationNotFound')}
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
