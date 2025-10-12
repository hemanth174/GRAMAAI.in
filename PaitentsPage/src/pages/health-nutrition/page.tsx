
import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import useLanguage from '../../hooks/useLanguage';

export default function HealthNutrition() {
  const [activeTab, setActiveTab] = useState('fever');
  const { t } = useLanguage();

  const tabs = [
    { id: 'fever', name: 'Fever', icon: 'ri-temp-hot-line' },
    { id: 'diabetes', name: 'Diabetes', icon: 'ri-heart-pulse-line' },
    { id: 'pregnancy', name: 'Pregnancy', icon: 'ri-parent-line' },
    { id: 'child-growth', name: 'Child Growth', icon: 'ri-child-line' },
    { id: 'general', name: 'General Health', icon: 'ri-health-book-line' }
  ];

  const articles = {
    fever: [
      {
        title: 'Managing Fever at Home',
        summary: 'Simple home remedies and when to seek medical help for fever management.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20family%20caring%20for%20sick%20child%20with%20fever%2C%20mother%20checking%20temperature%20with%20thermometer%2C%20home%20setting%20with%20traditional%20remedies%20like%20tulsi%20tea%2C%20caring%20family%20atmosphere%2C%20warm%20lighting&width=300&height=200&seq=fever-care&orientation=landscape',
        readTime: '5 min read'
      },
      {
        title: 'Common Seasonal Diseases Prevention',
        summary: 'How to protect yourself and family from seasonal illnesses and fever.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20village%20scene%20showing%20preventive%20healthcare%20measures%2C%20people%20wearing%20masks%2C%20hand%20washing%20station%2C%20clean%20environment%2C%20monsoon%20season%20preparation%2C%20community%20health%20awareness&width=300&height=200&seq=seasonal-prevention&orientation=landscape',
        readTime: '7 min read'
      },
      {
        title: 'When to Visit Doctor for Fever',
        summary: 'Warning signs that indicate you need immediate medical attention.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20doctor%20examining%20patient%20with%20fever%20in%20clinic%2C%20medical%20consultation%2C%20stethoscope%20examination%2C%20professional%20healthcare%20setting%2C%20patient%20care%2C%20medical%20diagnosis&width=300&height=200&seq=doctor-fever&orientation=landscape',
        readTime: '4 min read'
      }
    ],
    diabetes: [
      {
        title: 'Diabetes-Friendly Indian Diet',
        summary: 'Traditional Indian foods that help manage blood sugar levels effectively.',
        image: 'https://readdy.ai/api/search-image?query=Healthy%20Indian%20diabetic%20meal%20with%20vegetables%2C%20whole%20grains%2C%20dal%2C%20low%20glycemic%20foods%2C%20traditional%20Indian%20thali%2C%20colorful%20nutritious%20food%2C%20diabetes-friendly%20Indian%20cuisine&width=300&height=200&seq=diabetic-diet&orientation=landscape',
        readTime: '8 min read'
      },
      {
        title: 'Daily Exercise for Diabetics',
        summary: 'Simple exercises and yoga poses suitable for diabetes management.',
        image: 'https://readdy.ai/api/search-image?query=Middle-aged%20Indian%20person%20doing%20yoga%20and%20light%20exercise%20outdoors%2C%20morning%20routine%2C%20diabetes%20management%20through%20physical%20activity%2C%20peaceful%20garden%20setting%2C%20healthy%20lifestyle&width=300&height=200&seq=diabetes-exercise&orientation=landscape',
        readTime: '6 min read'
      },
      {
        title: 'Blood Sugar Monitoring Guide',
        summary: 'How to check and track your blood glucose levels at home.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20person%20using%20blood%20glucose%20meter%20at%20home%2C%20diabetes%20monitoring%20device%2C%20checking%20blood%20sugar%20levels%2C%20home%20healthcare%2C%20medical%20device%20usage%2C%20self-care%20routine&width=300&height=200&seq=blood-sugar&orientation=landscape',
        readTime: '5 min read'
      }
    ],
    pregnancy: [
      {
        title: 'Nutrition During Pregnancy',
        summary: 'Essential nutrients and Indian foods for healthy pregnancy.',
        image: 'https://readdy.ai/api/search-image?query=Pregnant%20Indian%20woman%20eating%20healthy%20meal%2C%20nutritious%20Indian%20food%20for%20pregnancy%2C%20fresh%20fruits%20and%20vegetables%2C%20maternal%20nutrition%2C%20traditional%20Indian%20pregnancy%20diet%2C%20caring%20family%20support&width=300&height=200&seq=pregnancy-nutrition&orientation=landscape',
        readTime: '10 min read'
      },
      {
        title: 'Prenatal Care Checklist',
        summary: 'Important medical checkups and tests during pregnancy.',
        image: 'https://readdy.ai/api/search-image?query=Pregnant%20Indian%20woman%20at%20doctor%20consultation%2C%20prenatal%20checkup%2C%20medical%20examination%2C%20ultrasound%20scan%2C%20maternal%20healthcare%2C%20doctor%20patient%20interaction%2C%20clinic%20setting&width=300&height=200&seq=prenatal-care&orientation=landscape',
        readTime: '7 min read'
      },
      {
        title: 'Preparing for Delivery',
        summary: 'What to expect and how to prepare for childbirth.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20family%20preparing%20for%20childbirth%2C%20hospital%20bag%20packing%2C%20pregnancy%20preparation%2C%20expectant%20parents%2C%20traditional%20Indian%20family%20support%2C%20maternal%20care%20preparation&width=300&height=200&seq=delivery-prep&orientation=landscape',
        readTime: '9 min read'
      }
    ],
    'child-growth': [
      {
        title: 'Child Nutrition by Age',
        summary: 'Age-appropriate nutrition guide for growing children.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20children%20eating%20healthy%20meal%20together%2C%20colorful%20nutritious%20food%20for%20kids%2C%20family%20mealtime%2C%20traditional%20Indian%20child%20nutrition%2C%20growing%20children%2C%20healthy%20eating%20habits&width=300&height=200&seq=child-nutrition&orientation=landscape',
        readTime: '8 min read'
      },
      {
        title: 'Vaccination Schedule',
        summary: 'Complete immunization timeline for children in India.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20child%20receiving%20vaccination%20at%20health%20center%2C%20pediatric%20immunization%2C%20healthcare%20worker%20giving%20injection%2C%20child%20healthcare%2C%20vaccination%20program%2C%20medical%20care%20for%20children&width=300&height=200&seq=child-vaccination&orientation=landscape',
        readTime: '6 min read'
      },
      {
        title: 'Developmental Milestones',
        summary: 'Key growth and development markers for children.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20toddler%20playing%20and%20learning%2C%20child%20development%20activities%2C%20mother%20teaching%20child%2C%20developmental%20milestones%2C%20early%20childhood%20education%2C%20family%20bonding%20time&width=300&height=200&seq=child-development&orientation=landscape',
        readTime: '7 min read'
      }
    ],
    general: [
      {
        title: 'Daily Health Routine',
        summary: 'Simple daily habits for maintaining good health.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20family%20following%20healthy%20daily%20routine%2C%20morning%20exercise%2C%20healthy%20breakfast%2C%20family%20wellness%20activities%2C%20traditional%20Indian%20healthy%20lifestyle%2C%20active%20living&width=300&height=200&seq=daily-routine&orientation=landscape',
        readTime: '6 min read'
      },
      {
        title: 'Mental Health Awareness',
        summary: 'Understanding and managing stress and mental wellness.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20person%20practicing%20meditation%20and%20mindfulness%2C%20mental%20health%20awareness%2C%20peaceful%20environment%2C%20stress%20management%2C%20yoga%20and%20relaxation%2C%20mental%20wellness%20practices&width=300&height=200&seq=mental-health&orientation=landscape',
        readTime: '9 min read'
      },
      {
        title: 'Preventive Healthcare',
        summary: 'Regular health checkups and preventive measures.',
        image: 'https://readdy.ai/api/search-image?query=Indian%20family%20at%20health%20checkup%2C%20preventive%20healthcare%2C%20medical%20screening%2C%20family%20health%20assessment%2C%20regular%20health%20monitoring%2C%20healthcare%20awareness&width=300&height=200&seq=preventive-care&orientation=landscape',
        readTime: '8 min read'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Page Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('healthNutritionTitle')}</h1>
              <p className="text-sm md:text-base text-gray-600">{t('healthNutritionSubtitle')}</p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#1fa27e] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {articles[activeTab as keyof typeof articles].map((article, index) => (
                <Card key={index} hover className="cursor-pointer">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-32 md:h-48 object-cover object-top rounded-lg mb-3 md:mb-4"
                  />
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                      <Button size="sm" className="text-xs md:text-sm">
                        {t('readMore')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Daily Health Tips */}
            <Card>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">{t('dailyHealthTips')}</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="p-2 md:p-3 bg-[#1fa27e]/10 rounded-lg">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <i className="ri-drop-line text-[#1fa27e] mt-1 flex-shrink-0"></i>
                    <div>
                      <h4 className="font-medium text-gray-900 text-xs md:text-sm">{t('stayHydrated')}</h4>
                      <p className="text-xs text-gray-600">{t('drinkWater')}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <i className="ri-walk-line text-blue-500 mt-1 flex-shrink-0"></i>
                    <div>
                      <h4 className="font-medium text-gray-900 text-xs md:text-sm">{t('dailyExercise')}</h4>
                      <p className="text-xs text-gray-600">{t('physicalActivity')}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <i className="ri-apple-line text-green-500 mt-1 flex-shrink-0"></i>
                    <div>
                      <h4 className="font-medium text-gray-900 text-xs md:text-sm">{t('eatFruits')}</h4>
                      <p className="text-xs text-gray-600">{t('fruitsVegetables')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">{t('emergencyContacts')}</h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-700">{t('emergencyServices')}</span>
                  <Button size="sm" variant="danger" className="text-xs">
                    <i className="ri-phone-line"></i>
                    108
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-700">{t('poisonControl')}</span>
                  <Button size="sm" variant="outline" className="text-xs">
                    <i className="ri-phone-line"></i>
                    1066
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-700">{t('womenHelpline')}</span>
                  <Button size="sm" variant="outline" className="text-xs">
                    <i className="ri-phone-line"></i>
                    1091
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
