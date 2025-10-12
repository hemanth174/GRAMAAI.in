
import { useState, useEffect } from 'react';
import Button from '../../../components/base/Button';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoStep {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  highlight: string;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Welcome to Your Healthcare Platform",
      description: "Discover how easy it is to access quality healthcare from anywhere, anytime. Our platform connects you with doctors and hospitals in your local language.",
      image: "https://readdy.ai/api/search-image?query=Modern%20healthcare%20app%20interface%20on%20smartphone%20showing%20doctor%20consultation%20booking%2C%20clean%20UI%20design%2C%20Indian%20family%20using%20mobile%20app%2C%20warm%20lighting%2C%20professional%20medical%20technology%2C%20user-friendly%20interface%2C%20realistic%20photography%20style&width=600&height=400&seq=demo-welcome&orientation=landscape",
      icon: "ri-smartphone-line",
      highlight: "Healthcare made simple and accessible"
    },
    {
      id: 2,
      title: "Find Nearby Hospitals & Doctors",
      description: "Simply enter your location and instantly discover nearby hospitals, clinics, and specialist doctors. Our smart location-based system shows you the closest healthcare options with ratings and availability.",
      image: "https://readdy.ai/api/search-image?query=Mobile%20app%20map%20interface%20showing%20nearby%20hospitals%20and%20clinics%20with%20location%20pins%2C%20GPS%20navigation%2C%20Indian%20city%20map%20with%20medical%20facilities%20marked%2C%20clean%20modern%20app%20design%2C%20realistic%20smartphone%20screen&width=600&height=400&seq=demo-location&orientation=landscape",
      icon: "ri-map-pin-line",
      highlight: "Smart location-based healthcare finder"
    },
    {
      id: 3,
      title: "Book Appointments Instantly",
      description: "Choose your preferred doctor, select an available time slot, and book your appointment in just a few taps. No more long waiting lines or phone calls - everything is done online.",
      image: "https://readdy.ai/api/search-image?query=Healthcare%20appointment%20booking%20interface%20on%20mobile%20app%2C%20calendar%20view%20with%20available%20time%20slots%2C%20doctor%20profile%20with%20ratings%2C%20Indian%20patient%20booking%20appointment%2C%20modern%20UI%20design%2C%20professional%20medical%20app&width=600&height=400&seq=demo-booking&orientation=landscape",
      icon: "ri-calendar-check-line",
      highlight: "One-click appointment booking"
    },
    {
      id: 4,
      title: "AI Assistant in Your Language",
      description: "Our AI health assistant speaks your language! Get instant answers to health questions, symptom checking, and medical guidance in Telugu, Hindi, Tamil, and 12+ other Indian languages.",
      image: "https://readdy.ai/api/search-image?query=AI%20chatbot%20interface%20showing%20multilingual%20conversation%20in%20Indian%20languages%2C%20voice%20assistant%20with%20sound%20waves%2C%20Indian%20person%20talking%20to%20AI%20health%20assistant%20on%20phone%2C%20modern%20technology%2C%20friendly%20AI%20interaction&width=600&height=400&seq=demo-ai&orientation=landscape",
      icon: "ri-robot-line",
      highlight: "AI assistance in 15+ Indian languages"
    },
    {
      id: 5,
      title: "Emergency SOS - 108 Integration",
      description: "In medical emergencies, our SOS feature instantly connects you to 108 emergency services, shares your location, and alerts your emergency contacts. Help arrives faster when every second counts.",
      image: "https://readdy.ai/api/search-image?query=Emergency%20SOS%20interface%20on%20mobile%20phone%20showing%20ambulance%20dispatch%2C%20red%20emergency%20button%2C%20GPS%20location%20sharing%2C%20Indian%20ambulance%20arriving%20at%20rural%20location%2C%20urgent%20medical%20response%2C%20professional%20emergency%20services&width=600&height=400&seq=demo-emergency&orientation=landscape",
      icon: "ri-alarm-warning-line",
      highlight: "Instant emergency response with 108"
    },
    {
      id: 6,
      title: "Healthcare Made Simple!",
      description: "Join thousands of users who have transformed their healthcare experience. Fast, reliable, and accessible healthcare is now just one click away!",
      image: "https://readdy.ai/api/search-image?query=Happy%20Indian%20family%20using%20healthcare%20app%20successfully%2C%20smiling%20patients%20with%20doctors%2C%20successful%20medical%20consultation%2C%20modern%20healthcare%20technology%20improving%20lives%2C%20positive%20healthcare%20outcomes%2C%20community%20health&width=600&height=400&seq=demo-success&orientation=landscape",
      icon: "ri-heart-pulse-line",
      highlight: "Healthcare made simple, fast, and just one click away!"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep((prevStep) => prevStep + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 2; // 5 seconds per step (100/20 = 5)
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, demoSteps.length, isOpen]);

  const handlePlay = () => {
    setIsPlaying(true);
    setProgress(0);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setProgress(0);
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1fa27e] to-blue-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-play-circle-line text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Platform Demo</h2>
                <p className="text-green-100">Interactive Healthcare Tutorial</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 cursor-pointer"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Step {currentStep + 1} of {demoSteps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-100 ease-out"
                style={{ width: `${(currentStep * 100 + progress) / demoSteps.length}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src={currentStepData.image}
                  alt={currentStepData.title}
                  className="w-full h-64 lg:h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-[#1fa27e] rounded-full flex items-center justify-center shadow-lg">
                    <i className={`${currentStepData.icon} text-white text-xl`}></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2">
              <div className="mb-6">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {currentStepData.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {currentStepData.description}
                </p>
                <div className="bg-gradient-to-r from-[#1fa27e]/10 to-blue-500/10 rounded-lg p-4 border-l-4 border-[#1fa27e]">
                  <p className="text-[#1fa27e] font-semibold">
                    ✨ {currentStepData.highlight}
                  </p>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="flex space-x-2 mb-6">
                {demoSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
                      index === currentStep
                        ? 'bg-[#1fa27e] scale-125'
                        : index < currentStep
                        ? 'bg-[#1fa27e]/60'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={isPlaying ? handlePause : handlePlay}
                className="bg-[#1fa27e] hover:bg-[#178a69] whitespace-nowrap"
              >
                <i className={`${isPlaying ? 'ri-pause-line' : 'ri-play-line'} mr-2`}></i>
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleRestart}
                className="border-[#1fa27e] text-[#1fa27e] hover:bg-[#1fa27e] hover:text-white whitespace-nowrap"
              >
                <i className="ri-restart-line mr-2"></i>
                Restart
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentStep === demoSteps.length - 1}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Next
                <i className="ri-arrow-right-line ml-2"></i>
              </Button>
            </div>
          </div>

          {/* Final CTA */}
          {currentStep === demoSteps.length - 1 && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">Ready to experience the future of healthcare?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-[#1fa27e] to-blue-500 hover:from-[#178a69] hover:to-blue-600 whitespace-nowrap"
                >
                  <i className="ri-mic-line mr-2"></i>
                  Start Using Platform
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="border-[#1fa27e] text-[#1fa27e] hover:bg-[#1fa27e] hover:text-white whitespace-nowrap"
                >
                  <i className="ri-calendar-check-line mr-2"></i>
                  Book Appointment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
