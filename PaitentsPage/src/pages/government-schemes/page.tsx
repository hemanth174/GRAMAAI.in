
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import useLanguage from '../../hooks/useLanguage';

export default function GovernmentSchemes() {
  const [expandedScheme, setExpandedScheme] = useState<number | null>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const schemes = [
    {
      id: 1,
      name: t('aarogyasri'),
      description: t('aarogyasriDesc'),
      eligibility: [
        'Below Poverty Line (BPL) families',
        'Annual family income less than ₹5 lakhs',
        'Resident of Andhra Pradesh or Telangana'
      ],
      benefits: [
        'Coverage up to ₹5 lakhs per family per year',
        'Covers 1,059 medical procedures',
        'Pre-existing conditions covered',
        'No age limit for coverage'
      ],
      documents: ['Ration Card', 'Income Certificate', 'Residence Proof', 'Aadhaar Card'],
      applicationProcess: 'Apply online through official Aarogyasri portal or visit nearest Aarogyasri office',
      icon: 'ri-shield-heart-line',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: t('jananiSurakshaYojana'),
      description: t('jananiDesc'),
      eligibility: [
        'Pregnant women belonging to BPL families',
        'All pregnant women in low performing states',
        'Age 19 years and above'
      ],
      benefits: [
        'Cash assistance for institutional delivery',
        'Free delivery in government hospitals',
        'Post-delivery care support',
        'Antenatal care benefits'
      ],
      documents: ['Pregnancy Certificate', 'BPL Card', 'Bank Account Details', 'Aadhaar Card'],
      applicationProcess: 'Register at nearest ANM/ASHA worker or government health facility',
      icon: 'ri-parent-line',
      color: 'bg-pink-500'
    },
    {
      id: 3,
      name: t('ayushmanBharat'),
      description: t('ayushmanDesc'),
      eligibility: [
        'Families identified in SECC 2011 database',
        'Rural families with specific deprivation criteria',
        'Urban occupational category families'
      ],
      benefits: [
        'Coverage up to ₹5 lakhs per family per year',
        'Covers 1,393+ medical packages',
        'Cashless treatment at empaneled hospitals',
        'Pre and post-hospitalization expenses covered'
      ],
      documents: ['Ration Card', 'Aadhaar Card', 'SECC verification', 'Family ID'],
      applicationProcess: 'Check eligibility online and get Ayushman Card from nearest CSC or hospital',
      icon: 'ri-heart-pulse-line',
      color: 'bg-green-500'
    },
    {
      id: 4,
      name: t('rashtriyaBalSwasthya'),
      description: t('rashtriyaDesc'),
      eligibility: [
        'All children from birth to 18 years',
        'Students in government and aided schools',
        'Children in anganwadi centers'
      ],
      benefits: [
        'Free health screening for 4 D\'s (Defects, Diseases, Deficiencies, Disabilities)',
        'Treatment and management of identified conditions',
        'Referral services for specialized care',
        'Follow-up care and support'
      ],
      documents: ['Birth Certificate', 'School ID', 'Aadhaar Card', 'Vaccination Records'],
      applicationProcess: 'Automatic screening in schools and anganwadis, or visit nearest health facility',
      icon: 'ri-child-line',
      color: 'bg-orange-500'
    },
    {
      id: 5,
      name: t('pradhanMantriMatru'),
      description: t('pradhanDesc'),
      eligibility: [
        'Pregnant and lactating mothers',
        'Age 19 years and above',
        'First living child of the family'
      ],
      benefits: [
        'Cash incentive of ₹5,000 in three installments',
        'Compensation for wage loss',
        'Better nutrition and healthcare',
        'Institutional delivery promotion'
      ],
      documents: ['Pregnancy Certificate', 'Bank Account Details', 'Aadhaar Card', 'MCP Card'],
      applicationProcess: 'Apply through anganwadi worker or online portal within specified time limits',
      icon: 'ri-baby-line',
      color: 'bg-purple-500'
    }
  ];

  const toggleScheme = (schemeId: number) => {
    setExpandedScheme(expandedScheme === schemeId ? null : schemeId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
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
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            {t('schemesTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('schemesSubtitle')}
          </p>
        </div>

        {/* Schemes List */}
        <div className="space-y-4 md:space-y-6">
          {schemes.map((scheme) => (
            <Card key={scheme.id} className="overflow-hidden">
              <div 
                className="cursor-pointer"
                onClick={() => toggleScheme(scheme.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${scheme.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className={`${scheme.icon} text-white text-lg md:text-xl`}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">{scheme.name}</h2>
                      <p className="text-sm md:text-base text-gray-600 line-clamp-2">{scheme.description}</p>
                    </div>
                  </div>
                  <i className={`ri-arrow-${expandedScheme === scheme.id ? 'up' : 'down'}-s-line text-xl md:text-2xl text-gray-400 flex-shrink-0 ml-2`}></i>
                </div>
              </div>

              {expandedScheme === scheme.id && (
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Left Column */}
                    <div className="space-y-4 md:space-y-6">
                      {/* Eligibility */}
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 flex items-center">
                          <i className="ri-user-check-line text-[#1fa27e] mr-2"></i>
                          {t('eligibilityCriteria')}
                        </h3>
                        <ul className="space-y-1 md:space-y-2">
                          {scheme.eligibility.map((criteria, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <i className="ri-check-line text-[#1fa27e] mt-0.5 flex-shrink-0"></i>
                              <span className="text-sm md:text-base text-gray-700">{criteria}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 flex items-center">
                          <i className="ri-gift-line text-[#1fa27e] mr-2"></i>
                          {t('benefits')}
                        </h3>
                        <ul className="space-y-1 md:space-y-2">
                          {scheme.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <i className="ri-star-line text-[#1fa27e] mt-0.5 flex-shrink-0"></i>
                              <span className="text-sm md:text-base text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 md:space-y-6">
                      {/* Required Documents */}
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 flex items-center">
                          <i className="ri-file-list-line text-[#1fa27e] mr-2"></i>
                          {t('requiredDocuments')}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {scheme.documents.map((doc, index) => (
                            <span
                              key={index}
                              className="px-2 md:px-3 py-1 bg-[#1fa27e]/10 text-[#1fa27e] text-xs md:text-sm rounded-full"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Application Process */}
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 flex items-center">
                          <i className="ri-roadmap-line text-[#1fa27e] mr-2"></i>
                          {t('howToApply')}
                        </h3>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                          {scheme.applicationProcess}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                        <Button className="flex-1 text-sm md:text-base">
                          <i className="ri-check-double-line"></i>
                          {t('checkEligibility')}
                        </Button>
                        <Button variant="outline" className="flex-1 text-sm md:text-base">
                          <i className="ri-external-link-line"></i>
                          {t('applyNow')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-8 md:mt-12 bg-[#1fa27e]/5 border-[#1fa27e]/20">
          <div className="text-center">
            <i className="ri-customer-service-line text-3xl md:text-4xl text-[#1fa27e] mb-3 md:mb-4"></i>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">{t('needHelp')}</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 max-w-2xl mx-auto">
              {t('helpDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button size="lg" className="text-sm md:text-base">
                <i className="ri-phone-line"></i>
                {t('callSupport')}: 1800-XXX-XXXX
              </Button>
              <Button variant="outline" size="lg" className="text-sm md:text-base">
                <i className="ri-chat-3-line"></i>
                {t('liveChatSupport')}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
