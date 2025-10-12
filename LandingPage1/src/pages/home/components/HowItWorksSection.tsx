
export const HowItWorksSection = () => {
  const steps = [
    {
      icon: 'ri-calendar-check-line',
      title: 'Book',
      description: 'Schedule appointment with qualified doctors',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: 'ri-video-chat-line',
      title: 'Consult',
      description: 'Video or in-person consultation',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: 'ri-medicine-bottle-line',
      title: 'Get Medicine',
      description: 'Receive prescription and medicine',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: 'ri-notification-3-line',
      title: 'Receive Reminders',
      description: 'Get health reminders and follow-ups',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple steps to access quality healthcare from the comfort of your home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`${step.icon} text-3xl`}></i>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-300 transform translate-x-1/2"></div>
                )}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
