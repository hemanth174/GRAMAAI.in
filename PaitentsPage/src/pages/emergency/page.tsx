
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import useLanguage from '../../hooks/useLanguage';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface UserProfile {
  name: string;
  age: number;
  medicalId?: string;
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
}

export default function Emergency() {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [emergencyStatus, setEmergencyStatus] = useState<string>('');
  const [ambulanceETA, setAmbulanceETA] = useState<number | null>(null);
  const [nearestHospital, setNearestHospital] = useState<string>('');
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Mock user profile - in real app, this would come from user settings
  const userProfile: UserProfile = {
    name: 'Rajesh Kumar',
    age: 45,
    medicalId: 'MED123456',
    bloodType: 'B+',
    allergies: ['Penicillin'],
    medications: ['Metformin', 'Lisinopril']
  };

  // Mock emergency contacts - in real app, this would come from user settings
  const emergencyContacts: EmergencyContact[] = [
    { id: '1', name: 'Priya Kumar (Wife)', phone: '+91 9876543210', relationship: 'Spouse' },
    { id: '2', name: 'Dr. Sharma', phone: '+91 9876543211', relationship: 'Family Doctor' },
    { id: '3', name: 'Amit Kumar (Son)', phone: '+91 9876543212', relationship: 'Son' }
  ];

  // Check location permission on component mount
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if ('geolocation' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setIsLocationEnabled(permission.state === 'granted');
        
        if (permission.state === 'granted') {
          getCurrentLocation();
        }
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };
          setLocation(locationData);
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Location access denied. Please enable location services.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting your location.';
              break;
          }
          
          setEmergencyStatus(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setEmergencyStatus('Geolocation is not supported by this browser.');
    }
  };

  const handleSlideStart = () => {
    setIsSliding(true);
    setSlideProgress(0);
  };

  const handleSlideMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isSliding) return;

    const slider = event.currentTarget as HTMLElement;
    const rect = slider.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const progress = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    
    setSlideProgress(progress);

    if (progress >= 0.9) {
      activateEmergencySOS();
    }
  };

  const handleSlideEnd = () => {
    if (slideProgress < 0.9) {
      setSlideProgress(0);
    }
    setIsSliding(false);
  };

  const activateEmergencySOS = async () => {
    setIsSOSActive(true);
    setIsSliding(false);
    setSlideProgress(1);
    setEmergencyStatus(t('emergencySOSActivated'));

    // Get current location
    getCurrentLocation();

    // Simulate emergency response process
    setTimeout(() => {
      setEmergencyStatus(t('locationDetectedContacting'));
    }, 2000);

    setTimeout(() => {
      setEmergencyStatus(t('ambulanceDispatched'));
      setAmbulanceETA(12);
      setNearestHospital('City General Hospital');
      sendEmergencyAlerts();
    }, 4000);

    setTimeout(() => {
      setEmergencyStatus(t('emergencyContactsNotified'));
    }, 6000);
  };

  const sendEmergencyAlerts = async () => {
    if (!location) return;

    const locationLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    const emergencyMessage = `Emergency detected for ${userProfile.name}. Help is on the way. Current location: ${locationLink}`;

    // In a real app, you would integrate with:
    // 1. Twilio API for SMS
    // 2. Hospital/Ambulance dispatch API
    // 3. Push notification service

    console.log('Sending emergency alerts:', {
      message: emergencyMessage,
      contacts: emergencyContacts,
      userProfile,
      location
    });

    // Simulate API calls
    try {
      // Mock ambulance dispatch API call
      const ambulanceResponse = await mockAmbulanceAPI(location, userProfile);
      console.log('Ambulance dispatched:', ambulanceResponse);

      // Mock SMS API call
      const smsResponse = await mockSMSAPI(emergencyContacts, emergencyMessage);
      console.log('SMS alerts sent:', smsResponse);

      // Mock hospital notification API call
      const hospitalResponse = await mockHospitalAPI(location, userProfile);
      console.log('Hospital notified:', hospitalResponse);

    } catch (error) {
      console.error('Error sending emergency alerts:', error);
      setEmergencyStatus('Emergency activated, but some notifications may have failed.');
    }
  };

  // Mock API functions (replace with real APIs in production)
  const mockAmbulanceAPI = async (location: LocationData, profile: UserProfile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ambulanceId: 'AMB-001',
          eta: 12,
          driverName: 'Ravi Singh',
          driverPhone: '+91 9876543220'
        });
      }, 1000);
    });
  };

  const mockSMSAPI = async (contacts: EmergencyContact[], message: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          sent: contacts.length,
          failed: 0,
          messageId: 'MSG-' + Date.now()
        });
      }, 1500);
    });
  };

  const mockHospitalAPI = async (location: LocationData, profile: UserProfile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hospitalId: 'HOSP-001',
          hospitalName: 'City General Hospital',
          distance: '2.3 km',
          notified: true
        });
      }, 800);
    });
  };

  const cancelEmergency = () => {
    setIsSOSActive(false);
    setSlideProgress(0);
    setEmergencyStatus('');
    setAmbulanceETA(null);
    setNearestHospital('');
  };

  const requestLocationPermission = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocationEnabled(true);
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };
          setLocation(locationData);
        },
        (error) => {
          console.error('Location permission denied:', error);
          let errorMessage = 'Location access is required for emergency services.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location in your browser settings and refresh the page.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'Unable to access location. Please check your browser settings.';
              break;
          }
          
          setEmergencyStatus(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    } else {
      setEmergencyStatus('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-700 hover:text-[#1fa27e] border-gray-300 hover:border-[#1fa27e] whitespace-nowrap"
          >
            <i className="ri-arrow-left-line"></i>
            <span>{t('backToHome')}</span>
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('emergencySOSPageTitle')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('emergencySOSPageSubtitle')}
          </p>
        </div>

        {/* Location Status */}
        {!isLocationEnabled && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="ri-map-pin-line text-2xl text-yellow-600"></i>
                <div>
                  <h3 className="font-semibold text-yellow-900">{t('locationAccessRequired')}</h3>
                  <p className="text-sm text-yellow-800">{t('enableLocationServices')}</p>
                </div>
              </div>
              <Button 
                onClick={requestLocationPermission}
                className="bg-yellow-600 hover:bg-yellow-700 text-white whitespace-nowrap"
              >
                {t('enableLocation')}
              </Button>
            </div>
          </Card>
        )}

        {/* Emergency Status */}
        {isSOSActive && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <i className="ri-alarm-warning-line text-white text-2xl"></i>
              </div>
              <h2 className="text-xl font-bold text-red-900 mb-2">{t('emergencyActive')}</h2>
              <p className="text-red-800 mb-4">{emergencyStatus}</p>
              
              {ambulanceETA && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600">{ambulanceETA} {t('min')}</div>
                    <div className="text-sm text-gray-600">{t('ambulanceETA')}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm font-semibold text-gray-900">{nearestHospital}</div>
                    <div className="text-sm text-gray-600">{t('nearestHospital')}</div>
                  </div>
                </div>
              )}

              <Button 
                variant="outline" 
                onClick={cancelEmergency}
                className="border-red-300 text-red-700 hover:bg-red-100 whitespace-nowrap"
              >
                {t('cancelEmergency')}
              </Button>
            </div>
          </Card>
        )}

        {/* SOS Slider */}
        {!isSOSActive && (
          <Card className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('emergencySOSPageTitle')}</h2>
              <p className="text-gray-600">{t('slideForEmergencySOS')}</p>
            </div>

            <div className="relative">
              <div 
                className="w-full h-20 bg-red-100 rounded-full border-4 border-red-200 relative overflow-hidden cursor-pointer"
                onMouseDown={handleSlideStart}
                onMouseMove={handleSlideMove}
                onMouseUp={handleSlideEnd}
                onMouseLeave={handleSlideEnd}
                onTouchStart={handleSlideStart}
                onTouchMove={handleSlideMove}
                onTouchEnd={handleSlideEnd}
              >
                {/* Progress Background */}
                <div 
                  className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-100 ease-out"
                  style={{ width: `${slideProgress * 100}%` }}
                ></div>

                {/* Slider Button */}
                <div 
                  className="absolute top-1 left-1 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-100 ease-out border-2 border-red-300"
                  style={{ 
                    transform: `translateX(${slideProgress * (100 - 16)}px)`,
                    backgroundColor: slideProgress > 0.5 ? '#ef4444' : '#ffffff',
                    color: slideProgress > 0.5 ? '#ffffff' : '#ef4444'
                  }}
                >
                  <i className="ri-alarm-warning-line text-2xl"></i>
                </div>

                {/* Slide Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-red-700 font-semibold text-lg">
                    {slideProgress < 0.1 ? t('slideForEmergencySOS') : 
                     slideProgress < 0.9 ? t('keepSliding') : t('activatingSOS')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                This will immediately contact emergency services and notify your emergency contacts
              </p>
            </div>
          </Card>
        )}

        {/* Current Location */}
        {location && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('currentLocation')}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('latitude')}:</span>
                <span className="font-mono text-sm">{location.latitude.toFixed(6)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('longitude')}:</span>
                <span className="font-mono text-sm">{location.longitude.toFixed(6)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('accuracy')}:</span>
                <span className="text-sm">{Math.round(location.accuracy)}m</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                fullWidth
                onClick={() => window.open(`https://maps.google.com/?q=${location.latitude},${location.longitude}`, '_blank')}
                className="mt-3 whitespace-nowrap"
              >
                <i className="ri-map-pin-line mr-2"></i>
                {t('viewOnGoogleMaps')}
              </Button>
            </div>
          </Card>
        )}

        {/* Emergency Contacts */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('emergencyContacts')}</h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{contact.name}</div>
                  <div className="text-sm text-gray-600">{contact.relationship}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-gray-900">{contact.phone}</div>
                  <button 
                    onClick={() => window.open(`tel:${contact.phone}`, '_self')}
                    className="text-sm text-[#1fa27e] hover:underline cursor-pointer"
                  >
                    {t('callNow')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Medical Profile */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('medicalProfile')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
              <div className="text-gray-900">{userProfile.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('age')}</label>
              <div className="text-gray-900">{userProfile.age} years</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('medicalID')}</label>
              <div className="text-gray-900 font-mono">{userProfile.medicalId}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('bloodType')}</label>
              <div className="text-gray-900">{userProfile.bloodType}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('allergies')}</label>
              <div className="text-gray-900">{userProfile.allergies?.join(', ') || t('none')}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('currentMedications')}</label>
              <div className="text-gray-900">{userProfile.medications?.join(', ') || t('none')}</div>
            </div>
          </div>
        </Card>

        {/* Emergency Numbers */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center border-red-200 bg-red-50">
            <i className="ri-hospital-line text-3xl text-red-500 mb-2"></i>
            <h4 className="font-semibold text-red-900 mb-1">{t('ambulance')}</h4>
            <p className="text-red-700 font-mono text-lg">108</p>
          </Card>
          <Card className="text-center border-blue-200 bg-blue-50">
            <i className="ri-shield-line text-3xl text-blue-500 mb-2"></i>
            <h4 className="font-semibold text-blue-900 mb-1">{t('police')}</h4>
            <p className="text-blue-700 font-mono text-lg">100</p>
          </Card>
          <Card className="text-center border-orange-200 bg-orange-50">
            <i className="ri-fire-line text-3xl text-orange-500 mb-2"></i>
            <h4 className="font-semibold text-orange-900 mb-1">{t('fire')}</h4>
            <p className="text-orange-700 font-mono text-lg">101</p>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
