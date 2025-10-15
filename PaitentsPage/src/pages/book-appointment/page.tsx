
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import useLanguage from '../../hooks/useLanguage';
import { appointmentClient, checkBackendConnection } from '../../api/appointmentClient';
import { toast } from '../../utils/toast';

interface Doctor {
  id: number;
  name: string;
  nameHi: string;
  nameTe: string;
  specialty: string;
  rating: number;
  experience: string;
  experienceHi: string;
  experienceTe: string;
  fee: number;
  image: string;
  availability: string[];
  isExternal?: boolean;
  hospital?: string;
  hospitalHi?: string;
  hospitalTe?: string;
}

export default function BookAppointment() {
  const navigate = useNavigate();
  const { t, currentLanguageCode } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    consultationType: '',
    specialty: '',
    doctor: '',
    date: '',
  time: '',
  patientName: '',
  age: '',
  gender: '',
  email: '',
  contact: '',
  symptoms: ''
  });

  const consultationTypes = [
    { 
      id: 'online', 
      name: t('onlineConsultation'), 
      icon: 'ri-video-line', 
      price: 300, 
      description: t('videoCallDoctor') 
    },
    { 
      id: 'inperson', 
      name: t('inPersonVisit'), 
      icon: 'ri-hospital-line', 
      price: 500, 
      description: t('visitClinicHospital') 
    },
    { 
      id: 'emergency', 
      name: t('emergencyConsultation'), 
      icon: 'ri-alarm-warning-line', 
      price: 1000, 
      description: t('immediateMedicalAttention'), 
      isEmergency: true 
    }
  ];

  const specialties = [
    t('generalMedicine'), 
    t('pediatrics'), 
    t('womenHealth'), 
    t('cardiology'),
    t('orthopedics'), 
    t('dermatology'), 
    'ENT', 
    t('ophthalmology')
  ];

  const specialtyMap: Record<string, string> = {
    [t('generalMedicine')]: 'General Medicine',
    [t('pediatrics')]: 'Pediatrics', 
    [t('womenHealth')]: 'Gynecology',
    [t('cardiology')]: 'Cardiology',
    [t('orthopedics')]: 'Orthopedics',
    [t('dermatology')]: 'Dermatology',
    'ENT': 'ENT',
    [t('ophthalmology')]: 'Ophthalmology'
  };

  // Base doctors database
  const baseDoctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      nameHi: 'डॉ. राजेश कुमार',
      nameTe: 'డాక్టర్ రాజేష్ కుమార్',
      specialty: 'General Medicine',
      rating: 4.8,
      experience: '15 years',
      experienceHi: '15 साल',
      experienceTe: '15 సంవత్సరాలు',
      fee: 300,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20doctor%20in%20white%20coat%20with%20stethoscope%2C%20friendly%20smile%2C%20middle-aged%2C%20hospital%20background%2C%20medical%20professional%20portrait%2C%20trustworthy%20appearance%2C%20clean%20medical%20environment&width=100&height=100&seq=dr-rajesh&orientation=squarish',
      availability: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM']
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      nameHi: 'डॉ. प्रिया शर्मा',
      nameTe: 'డాక్టర్ ప్రియా శర్మ',
      specialty: 'Pediatrics',
      rating: 4.9,
      experience: '12 years',
      experienceHi: '12 साल',
      experienceTe: '12 సంవత్సరాలు',
      fee: 400,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20doctor%20in%20white%20coat%2C%20warm%20smile%2C%20pediatrician%20with%20children%20toys%20in%20background%2C%20medical%20professional%20portrait%2C%20caring%20appearance%2C%20hospital%20setting&width=100&height=100&seq=dr-priya&orientation=squarish',
      availability: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM']
    },
    {
      id: 3,
      name: 'Dr. Suresh Reddy',
      nameHi: 'डॉ. सुरेश रेड्डी',
      nameTe: 'డాక్టర్ సురేష్ రెడ్డి',
      specialty: 'Cardiology',
      rating: 4.7,
      experience: '20 years',
      experienceHi: '20 साल',
      experienceTe: '20 సంవత్సరాలు',
      fee: 600,
      image: 'https://readdy.ai/api/search-image?query=Senior%20Indian%20male%20cardiologist%20in%20white%20coat%2C%20experienced%20doctor%2C%20stethoscope%20around%20neck%2C%20hospital%20background%2C%20professional%20medical%20portrait%2C%20confident%20appearance&width=100&height=100&seq=dr-suresh&orientation=squarish',
      availability: ['10:30 AM', '11:30 AM', '03:30 PM', '04:30 PM']
    }
  ];

  // External doctors database (simulating API data)
  const externalDoctors: Doctor[] = [
    // General Medicine
    {
      id: 101,
      name: 'Dr. Anita Verma',
      nameHi: 'डॉ. अनीता वर्मा',
      nameTe: 'డాక్టర్ అనిత వర్మ',
      specialty: 'General Medicine',
      rating: 4.6,
      experience: '18 years',
      experienceHi: '18 साल',
      experienceTe: '18 సంవత్సరాలు',
      fee: 350,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20doctor%20in%20white%20coat%2C%20confident%20smile%2C%20general%20medicine%20specialist%2C%20modern%20clinic%20background%2C%20medical%20professional%20portrait%2C%20experienced%20appearance&width=100&height=100&seq=dr-anita&orientation=squarish',
      availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      isExternal: true,
      hospital: 'City Medical Center',
      hospitalHi: 'सिटी मेडिकल सेंटर',
      hospitalTe: 'సిటీ మెడికల్ సెంటర్'
    },
    {
      id: 102,
      name: 'Dr. Vikram Singh',
      nameHi: 'डॉ. विक्रम सिंह',
      nameTe: 'డాక్టర్ విక్రమ్ సింగ్',
      specialty: 'General Medicine',
      rating: 4.5,
      experience: '14 years',
      experienceHi: '14 साल',
      experienceTe: '14 సంవత్సరాలు',
      fee: 320,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20doctor%20in%20white%20coat%2C%20friendly%20demeanor%2C%20general%20practitioner%2C%20hospital%20corridor%20background%2C%20medical%20professional%20portrait%2C%20approachable%20appearance&width=100&height=100&seq=dr-vikram&orientation=squarish',
      availability: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
      isExternal: true,
      hospital: 'Apollo Clinic',
      hospitalHi: 'अपोलो क्लिनिक',
      hospitalTe: 'అపోలో క్లినిక్'
    },
    // Pediatrics
    {
      id: 103,
      name: 'Dr. Meera Patel',
      nameHi: 'डॉ. मीरा पटेल',
      nameTe: 'డాక్టర్ మీరా పటేల్',
      specialty: 'Pediatrics',
      rating: 4.8,
      experience: '16 years',
      experienceHi: '16 साल',
      experienceTe: '16 సంవత్సరాలు',
      fee: 450,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20pediatrician%20in%20white%20coat%2C%20warm%20smile%20with%20children%2C%20colorful%20pediatric%20clinic%20background%2C%20medical%20professional%20portrait%2C%20child-friendly%20appearance&width=100&height=100&seq=dr-meera&orientation=squarish',
      availability: ['09:30 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
      isExternal: true,
      hospital: 'Rainbow Children Hospital',
      hospitalHi: 'रेनबो चिल्ड्रन हॉस्पिटल',
      hospitalTe: 'రెయిన్‌బో చిల్డ్రన్ హాస్పిటల్'
    },
    {
      id: 104,
      name: 'Dr. Ravi Gupta',
      nameHi: 'डॉ. रवि गुप्ता',
      nameTe: 'డాక్టర్ రవి గుప్తా',
      specialty: 'Pediatrics',
      rating: 4.7,
      experience: '13 years',
      experienceHi: '13 साल',
      experienceTe: '13 సంవత్సరాలు',
      fee: 380,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20pediatrician%20in%20white%20coat%2C%20gentle%20smile%2C%20children%20toys%20in%20background%2C%20medical%20professional%20portrait%2C%20caring%20appearance%2C%20pediatric%20clinic%20setting&width=100&height=100&seq=dr-ravi&orientation=squarish',
      availability: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
      isExternal: true,
      hospital: 'Kids Care Clinic',
      hospitalHi: 'किड्स केयर क्लिनिक',
      hospitalTe: 'కిడ్స్ కేర్ క్లినిక్'
    },
    // Gynecology
    {
      id: 105,
      name: 'Dr. Sunita Agarwal',
      nameHi: 'डॉ. सुनीता अग्रवाल',
      nameTe: 'డాక్టర్ సునీత అగర్వాల్',
      specialty: 'Gynecology',
      rating: 4.9,
      experience: '22 years',
      experienceHi: '22 साल',
      experienceTe: '22 సంవత్సరాలు',
      fee: 500,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20gynecologist%20in%20white%20coat%2C%20confident%20smile%2C%20women%20health%20clinic%20background%2C%20medical%20professional%20portrait%2C%20experienced%20appearance%2C%20modern%20medical%20facility&width=100&height=100&seq=dr-sunita&orientation=squarish',
      availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      isExternal: true,
      hospital: 'Women Care Hospital',
      hospitalHi: 'वुमन केयर हॉस्पिटल',
      hospitalTe: 'వుమన్ కేర్ హాస్పిటల్'
    },
    {
      id: 106,
      name: 'Dr. Kavita Joshi',
      nameHi: 'डॉ. कविता जोशी',
      nameTe: 'డాక్టర్ కవిత జోషి',
      specialty: 'Gynecology',
      rating: 4.6,
      experience: '17 years',
      experienceHi: '17 साल',
      experienceTe: '17 సంవత్సరాలు',
      fee: 450,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20gynecologist%20in%20white%20coat%2C%20warm%20smile%2C%20obstetrics%20clinic%20background%2C%20medical%20professional%20portrait%2C%20caring%20appearance%2C%20women%20health%20specialist&width=100&height=100&seq=dr-kavita&orientation=squarish',
      availability: ['10:30 AM', '12:30 PM', '03:30 PM', '05:30 PM'],
      isExternal: true,
      hospital: 'Motherhood Hospital',
      hospitalHi: 'मदरहुड हॉस्पिटल',
      hospitalTe: 'మదర్‌హుడ్ హాస్పిటల్'
    },
    {
      id: 107,
      name: 'Dr. Rekha Sharma',
      nameHi: 'डॉ. रेखा शर्मा',
      nameTe: 'డాక్టర్ రేఖా శర్మ',
      specialty: 'Gynecology',
      rating: 4.7,
      experience: '19 years',
      experienceHi: '19 साल',
      experienceTe: '19 సంవత్సరాలు',
      fee: 480,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20gynecologist%20in%20white%20coat%2C%20professional%20smile%2C%20modern%20women%20clinic%20background%2C%20medical%20professional%20portrait%2C%20trustworthy%20appearance&width=100&height=100&seq=dr-rekha&orientation=squarish',
      availability: ['09:30 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
      isExternal: true,
      hospital: 'Fortis Women Center',
      hospitalHi: 'फोर्टिस वुमन सेंटर',
      hospitalTe: 'ఫోర్టిస్ వుమన్ సెంటర్'
    },
    // Cardiology
    {
      id: 108,
      name: 'Dr. Ashok Mehta',
      nameHi: 'डॉ. अशोक मेहता',
      nameTe: 'డాక్టర్ అశోక్ మెహతా',
      specialty: 'Cardiology',
      rating: 4.8,
      experience: '25 years',
      experienceHi: '25 साल',
      experienceTe: '25 సంవత్సరాలు',
      fee: 700,
      image: 'https://readdy.ai/api/search-image?query=Senior%20Indian%20male%20cardiologist%20in%20white%20coat%2C%20experienced%20doctor%2C%20cardiac%20equipment%20background%2C%20medical%20professional%20portrait%2C%20expert%20appearance%2C%20heart%20specialist%20clinic&width=100&height=100&seq=dr-ashok&orientation=squarish',
      availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      isExternal: true,
      hospital: 'Heart Care Institute',
      hospitalHi: 'हार्ट केयर इंस्टिट्यूट',
      hospitalTe: 'హార్ట్ కేర్ ఇన్‌స్టిట్యూట్'
    },
    {
      id: 109,
      name: 'Dr. Neha Kapoor',
      nameHi: 'डॉ. नेहा कपूर',
      nameTe: 'డాక్టర్ నేహా కపూర్',
      specialty: 'Cardiology',
      rating: 4.6,
      experience: '15 years',
      experienceHi: '15 साल',
      experienceTe: '15 సంవత్సరాలు',
      fee: 650,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20cardiologist%20in%20white%20coat%2C%20confident%20smile%2C%20cardiac%20care%20unit%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance&width=100&height=100&seq=dr-neha&orientation=squarish',
      availability: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
      isExternal: true,
      hospital: 'Apollo Heart Center',
      hospitalHi: 'अपोलो हार्ट सेंटर',
      hospitalTe: 'అపోలో హార్ట్ సెంటర్'
    },
    // Orthopedics
    {
      id: 110,
      name: 'Dr. Ramesh Yadav',
      nameHi: 'डॉ. रमेश यादव',
      nameTe: 'డాక్టర్ రమేష్ యాదవ్',
      specialty: 'Orthopedics',
      rating: 4.7,
      experience: '18 years',
      experienceHi: '18 साल',
      experienceTe: '18 సంవత్సరాలు',
      fee: 550,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20orthopedic%20surgeon%20in%20white%20coat%2C%20confident%20smile%2C%20bone%20clinic%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance%2C%20orthopedic%20equipment%20visible&width=100&height=100&seq=dr-ramesh&orientation=squarish',
      availability: ['09:30 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
      isExternal: true,
      hospital: 'Bone & Joint Clinic',
      hospitalHi: 'बोन एंड जॉइंट क्लिनिक',
      hospitalTe: 'బోన్ & జాయింట్ క్లినిక్'
    },
    {
      id: 111,
      name: 'Dr. Pooja Malhotra',
      nameHi: 'डॉ. पूजा मल्होत्रा',
      nameTe: 'డాక్టర్ పూజా మల్హోత్రా',
      specialty: 'Orthopedics',
      rating: 4.5,
      experience: '14 years',
      experienceHi: '14 साल',
      experienceTe: '14 సంవత్సరాలు',
      fee: 500,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20orthopedic%20doctor%20in%20white%20coat%2C%20professional%20smile%2C%20sports%20medicine%20clinic%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance&width=100&height=100&seq=dr-pooja&orientation=squarish',
      availability: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
      isExternal: true,
      hospital: 'Sports Medicine Center',
      hospitalHi: 'स्पोर्ट्स मेडिसिन सेंटर',
      hospitalTe: 'స్పోర్ట్స్ మెడిసిన్ సెంటర్'
    },
    {
      id: 112,
      name: 'Dr. Sanjay Kumar',
      nameHi: 'डॉ. संजय कुमार',
      nameTe: 'డాక్టర్ సంజయ్ కుమార్',
      specialty: 'Orthopedics',
      rating: 4.8,
      experience: '21 years',
      experienceHi: '21 साल',
      experienceTe: '21 సంవత్సరాలు',
      fee: 600,
      image: 'https://readdy.ai/api/search-image?query=Senior%20Indian%20male%20orthopedic%20surgeon%20in%20white%20coat%2C%20experienced%20doctor%2C%20joint%20replacement%20clinic%20background%2C%20medical%20professional%20portrait%2C%20expert%20appearance&width=100&height=100&seq=dr-sanjay&orientation=squarish',
      availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      isExternal: true,
      hospital: 'Joint Replacement Center',
      hospitalHi: 'जॉइंट रिप्लेसमेंट सेंटर',
      hospitalTe: 'జాయింట్ రీప్లేస్‌మెంట్ సెంటర్'
    },
    // Dermatology
    {
      id: 113,
      name: 'Dr. Shweta Jain',
      nameHi: 'डॉ. श्वेता जैन',
      nameTe: 'డాక్టర్ శ్వేత జైన్',
      specialty: 'Dermatology',
      rating: 4.9,
      experience: '16 years',
      experienceHi: '16 साल',
      experienceTe: '16 సంవత్సరాలు',
      fee: 450,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20dermatologist%20in%20white%20coat%2C%20gentle%20smile%2C%20skin%20care%20clinic%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance%2C%20dermatology%20equipment&width=100&height=100&seq=dr-shweta&orientation=squarish',
      availability: ['09:30 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
      isExternal: true,
      hospital: 'Skin Care Clinic',
      hospitalHi: 'स्किन केयर क्लिनिक',
      hospitalTe: 'స్కిన్ కేర్ క్లినిక్'
    },
    {
      id: 114,
      name: 'Dr. Arjun Nair',
      nameHi: 'डॉ. अर्जुन नायर',
      nameTe: 'డాక్టర్ అర్జున్ నాయర్',
      specialty: 'Dermatology',
      rating: 4.6,
      experience: '12 years',
      experienceHi: '12 साल',
      experienceTe: '12 సంవత్సరాలు',
      fee: 400,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20dermatologist%20in%20white%20coat%2C%20friendly%20smile%2C%20cosmetic%20dermatology%20clinic%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance&width=100&height=100&seq=dr-arjun&orientation=squarish',
      availability: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
      isExternal: true,
      hospital: 'Derma Plus Clinic',
      hospitalHi: 'डर्मा प्लस क्लिनिक',
      hospitalTe: 'డెర్మా ప్లస్ క్లినిక్'
    },
    {
      id: 115,
      name: 'Dr. Priyanka Shah',
      nameHi: 'डॉ. प्रियंका शाह',
      nameTe: 'డాక్టర్ ప్రియాంక షా',
      specialty: 'Dermatology',
      rating: 4.7,
      experience: '14 years',
      experienceHi: '14 साल',
      experienceTe: '14 సంవత్సరాలు',
      fee: 420,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20dermatologist%20in%20white%20coat%2C%20confident%20smile%2C%20aesthetic%20clinic%20background%2C%20medical%20professional%20portrait%2C%20skin%20specialist%20appearance&width=100&height=100&seq=dr-priyanka&orientation=squarish',
      availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      isExternal: true,
      hospital: 'Aesthetic Skin Center',
      hospitalHi: 'एस्थेटिक स्किन सेंटर',
      hospitalTe: 'ఎస్తటిక్ స్కిన్ సెంటర్'
    },
    // ENT
    {
      id: 116,
      name: 'Dr. Manoj Tiwari',
      nameHi: 'डॉ. मनोज तिवारी',
      nameTe: 'డాక్టర్ మనోజ్ తివారి',
      specialty: 'ENT',
      rating: 4.8,
      experience: '19 years',
      experienceHi: '19 साल',
      experienceTe: '19 సంవత్సరాలు',
      fee: 500,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20ENT%20specialist%20in%20white%20coat%2C%20professional%20smile%2C%20ear%20nose%20throat%20clinic%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance%2C%20ENT%20equipment&width=100&height=100&seq=dr-manoj&orientation=squarish',
      availability: ['09:30 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
      isExternal: true,
      hospital: 'ENT Care Center',
      hospitalHi: 'ईएनटी केयर सेंटर',
      hospitalTe: 'ఈఎన్టీ కేర్ సెంటర్'
    },
    {
      id: 117,
      name: 'Dr. Deepika Rao',
      nameHi: 'डॉ. दीपिका राव',
      nameTe: 'డాక్టర్ దీపిక రావు',
      specialty: 'ENT',
      rating: 4.6,
      experience: '13 years',
      experienceHi: '13 साल',
      experienceTe: '13 సంవత్సరాలు',
      fee: 450,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20ENT%20doctor%20in%20white%20coat%2C%20warm%20smile%2C%20hearing%20clinic%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance&width=100&height=100&seq=dr-deepika&orientation=squarish',
      availability: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
      isExternal: true,
      hospital: 'Hearing & Speech Clinic',
      hospitalHi: 'हियरिंग एंड स्पीच क्लिनिक',
      hospitalTe: 'హియరింగ్ & స్పీచ్ క్లినిక్'
    },
    {
      id: 118,
      name: 'Dr. Rohit Saxena',
      nameHi: 'डॉ. रोहित सक्सेना',
      nameTe: 'డాక్టర్ రోహిత్ సక్సేనా',
      specialty: 'ENT',
      rating: 4.7,
      experience: '17 years',
      experienceHi: '17 साल',
      experienceTe: '17 సంవత్సరాలు',
      fee: 480,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20ENT%20surgeon%20in%20white%20coat%2C%20confident%20smile%2C%20throat%20surgery%20clinic%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance&width=100&height=100&seq=dr-rohit&orientation=squarish',
      availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      isExternal: true,
      hospital: 'Advanced ENT Hospital',
      hospitalHi: 'एडवांस्ड ईएनटी हॉस्पिटल',
      hospitalTe: 'అడ్వాన్స్డ్ ఈఎన్టీ హాస్పిటల్'
    },
    // Ophthalmology
    {
      id: 119,
      name: 'Dr. Seema Gupta',
      nameHi: 'डॉ. सीमा गुप्ता',
      nameTe: 'డాక్టర్ సీమా గుప్తా',
      specialty: 'Ophthalmology',
      rating: 4.9,
      experience: '20 years',
      experienceHi: '20 साल',
      experienceTe: '20 సంవత్సరాలు',
      fee: 550,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20ophthalmologist%20in%20white%20coat%2C%20gentle%20smile%2C%20eye%20care%20clinic%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance%2C%20eye%20examination%20equipment&width=100&height=100&seq=dr-seema&orientation=squarish',
      availability: ['09:30 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
      isExternal: true,
      hospital: 'Vision Care Center',
      hospitalHi: 'विजन केयर सेंटर',
      hospitalTe: 'విజన్ కేర్ సెంటర్'
    },
    {
      id: 120,
      name: 'Dr. Amit Khanna',
      nameHi: 'डॉ. अमित खन्ना',
      nameTe: 'డాక్టర్ అమిత్ ఖన్నా',
      specialty: 'Ophthalmology',
      rating: 4.7,
      experience: '16 years',
      experienceHi: '16 साल',
      experienceTe: '16 సంవత్సరాలు',
      fee: 500,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20eye%20surgeon%20in%20white%20coat%2C%20professional%20smile%2C%20retina%20clinic%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance&width=100&height=100&seq=dr-amit&orientation=squarish',
      availability: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
      isExternal: true,
      hospital: 'Retina Specialty Center',
      hospitalHi: 'रेटिना स्पेशलिटी सेंटर',
      hospitalTe: 'రెటినా స్పెషాలిటీ సెంటర్'
    },
    {
      id: 121,
      name: 'Dr. Nisha Agarwal',
      nameHi: 'डॉ. निशा अग्रवाल',
      nameTe: 'డాక్టర్ నిశా అగర్వాల్',
      specialty: 'Ophthalmology',
      rating: 4.8,
      experience: '18 years',
      experienceHi: '18 साल',
      experienceTe: '18 సంవత్సరాలు',
      fee: 520,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20eye%20doctor%20in%20white%20coat%2C%20caring%20smile%2C%20pediatric%20eye%20clinic%20background%2C%20medical%20professional%20portrait%2C%20specialist%20appearance&width=100&height=100&seq=dr-nisha&orientation=squarish',
      availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      isExternal: true,
      hospital: 'Children Eye Hospital',
      hospitalHi: 'चिल्ड्रन आई हॉस्पिटल',
      hospitalTe: 'చిల్డ్రన్ ఐ హాస్పిటల్'
    }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  // Load doctors based on specialty
  useEffect(() => {
    if (formData.specialty) {
      const englishSpecialty = specialtyMap[formData.specialty] || formData.specialty;
      loadDoctorsForSpecialty(englishSpecialty);
    }
  }, [formData.specialty]);

  const loadDoctorsForSpecialty = async (specialty: string) => {
    setIsLoadingDoctors(true);
    
    // Get base doctors for this specialty
    const baseDoctorsForSpecialty = baseDoctors.filter(doc => doc.specialty === specialty);
    
    // Get external doctors for this specialty
    const externalDoctorsForSpecialty = externalDoctors.filter(doc => doc.specialty === specialty);
    
    // Combine and ensure at least 3 doctors
    let allDoctors = [...baseDoctorsForSpecialty, ...externalDoctorsForSpecialty];
    
    // If less than 3, add more external doctors (simulating API call)
    if (allDoctors.length < 3) {
      // In real implementation, this would be an API call
      console.log(`Loading additional doctors for ${specialty} from external API...`);
    }
    
    // Sort by rating and take top doctors
    allDoctors = allDoctors.sort((a, b) => b.rating - a.rating);
    
    setAvailableDoctors(allDoctors);
    setIsLoadingDoctors(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencySelection = () => {
    // Show confirmation dialog for emergency
    const confirmed = window.confirm(
      currentLanguageCode === 'hi' 
        ? 'आपातकालीन परामर्श आपको तुरंत उपलब्ध आपातकालीन डॉक्टरों से जोड़ देगा और आपातकालीन प्रोटोकॉल को सक्रिय कर सकता है। क्या आप जारी रखना चाहते हैं?'
        : currentLanguageCode === 'te'
        ? 'అత్యవసర కన్సల్టేషన్ మిమ్మల్ని వెంటనే అందుబాటులో ఉన్న అత్యవసర వైద్యులతో కనెక్ట్ చేస్తుంది మరియు అత్యవసర ప్రోటోకాల్‌లను ట్రిగ్గర్ చేయవచ్చు. మీరు కొనసాగించాలనుకుంటున్నారా?'
        : 'Emergency consultation will immediately connect you with available emergency doctors and may trigger emergency protocols. Do you want to continue?'
    );
    
    if (confirmed) {
      handleInputChange('consultationType', 'emergency');
      // Auto-navigate to emergency page for immediate assistance
      setTimeout(() => {
        const shouldGoToEmergency = window.confirm(
          currentLanguageCode === 'hi'
            ? 'तत्काल आपातकालीन सहायता के लिए, क्या आप हमारे आपातकालीन SOS सिस्टम तक पहुंचना चाहेंगे?'
            : currentLanguageCode === 'te'
            ? 'తక్షణ అత్యవసర సహాయం కోసం, మీరు మా అత్యవసర SOS సిస్టమ్‌ను యాక్సెస్ చేయాలనుకుంటున్నారా?'
            : 'For immediate emergency assistance, would you like to access our Emergency SOS system?'
        );
        if (shouldGoToEmergency) {
          navigate('/emergency');
        }
      }, 1000);
    }
  };

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkBackendConnection();
      setIsConnected(connected);
      
      if (!connected) {
        toast.warning('Hospital system is currently offline. Your appointments will be synced when connection is restored.', {
          duration: 5000
        });
      } else {
        console.log('✅ Connected to Patient Portal Backend');
      }
    };

    checkConnection();

    // Optional: Connect to real-time updates
    appointmentClient.connectToUpdates();

    return () => {
      appointmentClient.disconnect();
    };
  }, []);

  // Handle final appointment submission
  const handleSubmitAppointment = async () => {
    if (!formData.patientName || !formData.age || !formData.gender || !formData.email || !formData.contact || !formData.symptoms || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    toast.info('Submitting your appointment request...', { duration: 2000 });

    try {
      // Get doctor info
      const doctor = availableDoctors.find(doc => doc.id.toString() === formData.doctor);
      const doctorName = doctor ? getDoctorName(doctor) : 'Any Available Doctor';

      // Create appointment
      const appointment = await appointmentClient.createAppointment({
        patientName: formData.patientName,
        email: formData.email,
        phone: formData.contact,
        symptoms: formData.symptoms,
        doctorName,
        date: formData.date,
        time: formData.time,
        status: 'pending',
        priority: formData.consultationType === 'emergency' ? 'high' : 'medium',
        requestedDoctorId: doctor ? doctor.id.toString() : undefined
      });

      console.log('✅ Appointment created:', appointment);

      // Show success toast
      toast.success('Appointment booked successfully! You will receive a confirmation shortly.', {
        duration: 5000
      });

      // Reset form and go back to step 1
      setFormData({
        consultationType: '',
        specialty: '',
        doctor: '',
        date: '',
        time: '',
        patientName: '',
        age: '',
        gender: '',
        email: '',
        contact: '',
        symptoms: ''
      });
      setCurrentStep(1);

      // Optional: Navigate to appointments page after a delay
      setTimeout(() => {
        const shouldNavigate = window.confirm(
          currentLanguageCode === 'hi'
            ? 'क्या आप अपॉइंटमेंट पेज पर जाना चाहेंगे?'
            : currentLanguageCode === 'te'
            ? 'మీరు అపాయింట్‌మెంట్ పేజీకి వెళ్లాలనుకుంటున్నారా?'
            : 'Would you like to view your appointments?'
        );
        if (shouldNavigate) {
          navigate('/');
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Failed to book appointment:', error);
      toast.error('Failed to book appointment. Please try again.', {
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDoctorName = (doctor: Doctor) => {
    if (currentLanguageCode === 'hi') return doctor.nameHi;
    if (currentLanguageCode === 'te') return doctor.nameTe;
    return doctor.name;
  };

  const getDoctorExperience = (doctor: Doctor) => {
    if (currentLanguageCode === 'hi') return doctor.experienceHi;
    if (currentLanguageCode === 'te') return doctor.experienceTe;
    return doctor.experience;
  };

  const getDoctorHospital = (doctor: Doctor) => {
    if (!doctor.hospital) return '';
    if (currentLanguageCode === 'hi') return doctor.hospitalHi || doctor.hospital;
    if (currentLanguageCode === 'te') return doctor.hospitalTe || doctor.hospital;
    return doctor.hospital;
  };

  const getSpecialtyDisplay = (specialty: string) => {
    const specialtyTranslations: Record<string, Record<string, string>> = {
      'General Medicine': {
        hi: 'सामान्य चिकित्सा',
        te: 'సాధారణ వైద్యం'
      },
      'Pediatrics': {
        hi: 'बाल चिकित्सा',
        te: 'పిల్లల వైద్యం'
      },
      'Gynecology': {
        hi: 'महिला स्वास्थ्य',
        te: 'మహిళల ఆరోగ్యం'
      },
      'Cardiology': {
        hi: 'हृदय रोग विज्ञान',
        te: 'గుండె వైద్యం'
      },
      'Orthopedics': {
        hi: 'हड्डी रोग',
        te: 'ఎముకల వైద్యం'
      },
      'Dermatology': {
        hi: 'त्वचा विज्ञान',
        te: 'చర్మ వైద్యం'
      },
      'ENT': {
        hi: 'ईएनटी',
        te: 'ఈఎన్టీ'
      },
      'Ophthalmology': {
        hi: 'नेत्र विज्ञान',
        te: 'కంటి వైద్యం'
      }
    };

    if (currentLanguageCode === 'hi' && specialtyTranslations[specialty]?.hi) {
      return specialtyTranslations[specialty].hi;
    }
    if (currentLanguageCode === 'te' && specialtyTranslations[specialty]?.te) {
      return specialtyTranslations[specialty].te;
    }
    return specialty;
  };

  const selectedDoctor = availableDoctors.find(doc => doc.id.toString() === formData.doctor);
  const selectedConsultationType = consultationTypes.find(type => type.id === formData.consultationType);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">{t('bookAppointmentTitle')}</h1>
                  {isConnected ? (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      {currentLanguageCode === 'hi' ? 'कनेक्टेड' : currentLanguageCode === 'te' ? 'కనెక్ట్ అయింది' : 'Connected'}
                    </span>
                  ) : (
                    <span className="text-sm text-yellow-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                      {currentLanguageCode === 'hi' ? 'ऑफ़लाइन' : currentLanguageCode === 'te' ? 'ఆఫ్‌లైన్' : 'Offline'}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 overflow-x-auto">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex items-center flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep ? 'bg-[#1fa27e] text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 5 && (
                        <div className={`w-8 h-0.5 ${
                          step < currentStep ? 'bg-[#1fa27e]' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Consultation Type */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('chooseConsultationType')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {consultationTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => type.isEmergency ? handleEmergencySelection() : handleInputChange('consultationType', type.id)}
                        className={`p-4 border-2 rounded-lg text-center transition-colors duration-200 cursor-pointer ${
                          formData.consultationType === type.id
                            ? 'border-[#1fa27e] bg-[#1fa27e]/5'
                            : type.isEmergency 
                            ? 'border-red-300 hover:border-red-400 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <i className={`${type.icon} text-2xl mb-2 ${
                          formData.consultationType === type.id 
                            ? 'text-[#1fa27e]' 
                            : type.isEmergency 
                            ? 'text-red-500' 
                            : 'text-gray-600'
                        }`}></i>
                        <h3 className={`font-medium mb-1 ${
                          type.isEmergency ? 'text-red-900' : 'text-gray-900'
                        }`}>{type.name}</h3>
                        <p className={`text-sm mb-1 ${
                          type.isEmergency ? 'text-red-700' : 'text-gray-600'
                        }`}>₹{type.price}</p>
                        <p className={`text-xs ${
                          type.isEmergency ? 'text-red-600' : 'text-gray-500'
                        }`}>{type.description}</p>
                        {type.isEmergency && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <i className="ri-alarm-warning-line mr-1"></i>
                              {currentLanguageCode === 'hi' ? 'उच्च प्राथमिकता' : currentLanguageCode === 'te' ? 'అధిక ప్రాధాన్యత' : 'High Priority'}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <Button 
                    onClick={() => setCurrentStep(2)} 
                    disabled={!formData.consultationType}
                    className="w-full"
                  >
                    {t('nextStep')}
                  </Button>
                </div>
              )}

              {/* Step 2: Select Specialty */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('selectSpecialty')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {specialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => handleInputChange('specialty', specialty)}
                        className={`p-3 border rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                          formData.specialty === specialty
                            ? 'border-[#1fa27e] bg-[#1fa27e] text-white'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      {t('previous')}
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(3)} 
                      disabled={!formData.specialty}
                      className="flex-1"
                    >
                      {t('nextStep')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Choose Doctor */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('chooseDoctor')}</h2>
                  
                  {isLoadingDoctors ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1fa27e] mx-auto mb-4"></div>
                      <p className="text-gray-600">{t('loading')}</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                          <i className="ri-information-line text-blue-500 mr-2"></i>
                          <span className="text-sm text-blue-800">
                            {currentLanguageCode === 'hi' 
                              ? `${formData.specialty} के लिए ${availableDoctors.length} उपलब्ध डॉक्टर दिखाए जा रहे हैं`
                              : currentLanguageCode === 'te'
                              ? `${formData.specialty} కోసం ${availableDoctors.length} అందుబాటులో ఉన్న వైద్యులను చూపిస్తోంది`
                              : `Showing ${availableDoctors.length} available doctors for ${formData.specialty}`
                            }
                            {availableDoctors.some(doc => doc.isExternal) && (
                              <span className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">
                                {currentLanguageCode === 'hi' 
                                  ? 'सत्यापित बाहरी डॉक्टर शामिल'
                                  : currentLanguageCode === 'te'
                                  ? 'ధృవీకరించబడిన బాహ్య వైద్యులు చేర్చబడ్డారు'
                                  : 'Including verified external doctors'
                                }
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        {availableDoctors.map((doctor) => (
                          <button
                            key={doctor.id}
                            onClick={() => handleInputChange('doctor', doctor.id.toString())}
                            className={`w-full p-4 border-2 rounded-lg text-left transition-colors duration-200 cursor-pointer ${
                              formData.doctor === doctor.id.toString()
                                ? 'border-[#1fa27e] bg-[#1fa27e]/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <img
                                src={doctor.image}
                                alt={getDoctorName(doctor)}
                                className="w-16 h-16 rounded-full object-cover object-top flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-gray-900 truncate">{getDoctorName(doctor)}</h3>
                                    <p className="text-sm text-gray-600 truncate">{getSpecialtyDisplay(doctor.specialty)}</p>
                                    {doctor.hospital && (
                                      <p className="text-xs text-gray-500 truncate">{getDoctorHospital(doctor)}</p>
                                    )}
                                  </div>
                                  {doctor.isExternal && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2 flex-shrink-0">
                                      <i className="ri-shield-check-line mr-1"></i>
                                      {currentLanguageCode === 'hi' ? 'सत्यापित' : currentLanguageCode === 'te' ? 'ధృవీకరించబడింది' : 'Verified'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center">
                                    <i className="ri-star-fill text-yellow-400 mr-1"></i>
                                    <span className="text-sm">{doctor.rating}</span>
                                  </div>
                                  <span className="text-sm text-gray-600">{getDoctorExperience(doctor)}</span>
                                  <span className="text-sm font-medium text-[#1fa27e]">₹{doctor.fee}</span>
                                </div>
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 mb-1">
                                    {currentLanguageCode === 'hi' 
                                      ? 'आज उपलब्ध स्लॉट:'
                                      : currentLanguageCode === 'te'
                                      ? 'ఈరోజు అందుబాటులో ఉన్న స్లాట్‌లు:'
                                      : 'Available slots today:'
                                    }
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {doctor.availability.slice(0, 3).map((slot, index) => (
                                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {slot}
                                      </span>
                                    ))}
                                    {doctor.availability.length > 3 && (
                                      <span className="text-xs text-gray-500">
                                        +{doctor.availability.length - 3} {currentLanguageCode === 'hi' ? 'और' : currentLanguageCode === 'te' ? 'మరిన్ని' : 'more'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                      {t('previous')}
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(4)} 
                      disabled={!formData.doctor}
                      className="flex-1"
                    >
                      {t('nextStep')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Date & Time */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('pickDateTime')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('selectDate')}</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('selectTime')}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(selectedDoctor?.availability || timeSlots).map((time) => (
                          <button
                            key={time}
                            onClick={() => handleInputChange('time', time)}
                            className={`p-2 text-sm border rounded-lg transition-colors duration-200 cursor-pointer ${
                              formData.time === time
                                ? 'border-[#1fa27e] bg-[#1fa27e] text-white'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1">
                      {t('previous')}
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(5)} 
                      disabled={!formData.date || !formData.time}
                      className="flex-1"
                    >
                      {t('nextStep')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Patient Information */}
              {currentStep === 5 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('patientInformation')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('fullName')}</label>
                      <input
                        type="text"
                        value={formData.patientName}
                        onChange={(e) => handleInputChange('patientName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent"
                        placeholder={currentLanguageCode === 'hi' ? 'रोगी का नाम दर्ज करें' : currentLanguageCode === 'te' ? 'రోగి పేరు నమోదు చేయండి' : 'Enter patient name'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('age')}</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent"
                        placeholder={currentLanguageCode === 'hi' ? 'उम्र दर्ज करें' : currentLanguageCode === 'te' ? 'వయస్సు నమోదు చేయండి' : 'Enter age'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('gender')}</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent pr-8"
                      >
                        <option value="">
                          {currentLanguageCode === 'hi' ? 'लिंग चुनें' : currentLanguageCode === 'te' ? 'లింగం ఎంచుకోండి' : 'Select Gender'}
                        </option>
                        <option value="male">
                          {currentLanguageCode === 'hi' ? 'पुरुष' : currentLanguageCode === 'te' ? 'పురుషుడు' : 'Male'}
                        </option>
                        <option value="female">
                          {currentLanguageCode === 'hi' ? 'महिला' : currentLanguageCode === 'te' ? 'మహిళ' : 'Female'}
                        </option>
                        <option value="other">
                          {currentLanguageCode === 'hi' ? 'अन्य' : currentLanguageCode === 'te' ? 'ఇతర' : 'Other'}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('emailAddress') || 'Email Address'}</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent"
                        placeholder={currentLanguageCode === 'hi' ? 'अपना ईमेल दर्ज करें' : currentLanguageCode === 'te' ? 'మీ ఇమెయిల్ నమోదు చేయండి' : 'Enter email address'}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactNumber')}</label>
                      <input
                        type="tel"
                        value={formData.contact}
                        onChange={(e) => handleInputChange('contact', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent"
                        placeholder={currentLanguageCode === 'hi' ? 'फोन नंबर दर्ज करें' : currentLanguageCode === 'te' ? 'ఫోన్ నంబర్ నమోదు చేయండి' : 'Enter phone number'}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('symptomsReason')}</label>
                    <textarea
                      value={formData.symptoms}
                      onChange={(e) => handleInputChange('symptoms', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent"
                      placeholder={currentLanguageCode === 'hi' ? 'अपने लक्षणों या परामर्श के कारण का वर्णन करें' : currentLanguageCode === 'te' ? 'మీ లక్షణాలు లేదా కన్సల్టేషన్ కారణాన్ని వివరించండి' : 'Describe your symptoms or reason for consultation'}
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(4)} className="flex-1">
                      {t('previous')}
                    </Button>
                    <Button 
                      onClick={handleSubmitAppointment}
                      disabled={!formData.patientName || !formData.age || !formData.gender || !formData.email || !formData.contact || !formData.date || !formData.time || isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (currentLanguageCode === 'hi' ? 'सबमिट हो रहा है...' : currentLanguageCode === 'te' ? 'సబ్మిట్ అవుతోంది...' : 'Submitting...') : t('bookAppointment')}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Appointment Summary */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('appointmentSummary')}</h3>
              
              {selectedConsultationType && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('consultationType')}</span>
                    <span className={`text-sm font-medium ${
                      selectedConsultationType.isEmergency ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {selectedConsultationType.name}
                      {selectedConsultationType.isEmergency && (
                        <i className="ri-alarm-warning-line ml-1 text-red-500"></i>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {selectedDoctor && (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={selectedDoctor.image}
                      alt={getDoctorName(selectedDoctor)}
                      className="w-10 h-10 rounded-full object-cover object-top"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{getDoctorName(selectedDoctor)}</p>
                      <p className="text-sm text-gray-600">{getSpecialtyDisplay(selectedDoctor.specialty)}</p>
                      {selectedDoctor.hospital && (
                        <p className="text-xs text-gray-500">{getDoctorHospital(selectedDoctor)}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {formData.date && formData.time && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      {currentLanguageCode === 'hi' ? 'दिनांक और समय' : currentLanguageCode === 'te' ? 'తేదీ & సమయం' : 'Date & Time'}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{formData.date} {currentLanguageCode === 'hi' ? 'को' : currentLanguageCode === 'te' ? 'న' : 'at'} {formData.time}</p>
                </div>
              )}

              {selectedDoctor && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{t('totalFee')}</span>
                    <span className="text-lg font-bold text-[#1fa27e]">₹{selectedDoctor.fee}</span>
                  </div>
                </div>
              )}
            </Card>

            {/* Emergency Alert */}
            {formData.consultationType === 'emergency' && (
              <Card className="border-red-200 bg-red-50">
                <div className="text-center">
                  <i className="ri-alarm-warning-line text-3xl text-red-500 mb-2"></i>
                  <h3 className="font-semibold text-red-900 mb-2">
                    {currentLanguageCode === 'hi' ? 'आपातकालीन मोड सक्रिय' : currentLanguageCode === 'te' ? 'అత్యవసర మోడ్ యాక్టివ్' : 'Emergency Mode Active'}
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    {currentLanguageCode === 'hi' ? 'तत्काल चिकित्सा सहायता के लिए प्राथमिकता बुकिंग' : currentLanguageCode === 'te' ? 'తక్షణ వైద్య సహాయం కోసం ప్రాధాన్యత బుకింగ్' : 'Priority booking for immediate medical attention'}
                  </p>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    fullWidth
                    onClick={() => navigate('/emergency')}
                  >
                    <i className="ri-phone-line"></i>
                    {currentLanguageCode === 'hi' ? 'आपातकालीन SOS एक्सेस करें' : currentLanguageCode === 'te' ? 'అత్యవసర SOS యాక్సెస్ చేయండి' : 'Access Emergency SOS'}
                  </Button>
                </div>
              </Card>
            )}

            {/* Need Help */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('needHelp')}</h3>
              <div className="space-y-3">
                <Button variant="outline" size="sm" fullWidth>
                  <i className="ri-phone-line"></i>
                  {t('callSupport')}
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <i className="ri-robot-line"></i>
                  {t('aiAssistant')}
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <i className="ri-chat-3-line"></i>
                  {currentLanguageCode === 'hi' ? 'लाइव चैट' : currentLanguageCode === 'te' ? 'లైవ్ చాట్' : 'Live Chat'}
                </Button>
              </div>
            </Card>

            {/* Emergency Help */}
            <Card className="border-red-200 bg-red-50">
              <div className="text-center">
                <i className="ri-alarm-warning-line text-3xl text-red-500 mb-2"></i>
                <h3 className="font-semibold text-red-900 mb-2">
                  {currentLanguageCode === 'hi' ? 'आपातकालीन सहायता' : currentLanguageCode === 'te' ? 'అత్యవసర సహాయం' : 'Emergency Help'}
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  {currentLanguageCode === 'hi' ? 'तत्काल चिकित्सा सहायता चाहिए?' : currentLanguageCode === 'te' ? 'తక్షణ వైద్య సహాయం కావాలా?' : 'Need immediate medical assistance?'}
                </p>
                <Button 
                  variant="danger" 
                  size="sm" 
                  fullWidth
                  onClick={() => navigate('/emergency')}
                >
                  <i className="ri-phone-line"></i>
                  {currentLanguageCode === 'hi' ? 'आपातकालीन कॉल करें' : currentLanguageCode === 'te' ? 'అత్యవసర కాల్ చేయండి' : 'Call Emergency'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
