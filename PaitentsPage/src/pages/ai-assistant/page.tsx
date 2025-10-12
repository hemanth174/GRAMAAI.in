
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';

export default function AIAssistant() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [continuousConversation, setContinuousConversation] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [showAppointmentFlow, setShowAppointmentFlow] = useState(false);
  const [appointmentStep, setAppointmentStep] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'Hello! I\'m your AI Health Assistant. I can help you with health questions, symptoms, first aid guidance, appointment booking, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' }
  ];

  const appointmentFlowMessages = [
    "I'd be happy to help you book an appointment! Let me guide you through the process.",
    "First, what type of consultation would you prefer? Online consultation, in-person visit, or is this an emergency?",
    "Great choice! Now, which medical specialty do you need? For example: General Medicine, Pediatrics, Cardiology, etc.",
    "Perfect! I'm finding available doctors for you. Would you like me to show you the top-rated doctors in your area?",
    "Excellent! I've found some great doctors. Would you like me to redirect you to complete your appointment booking with full details?"
  ];

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
      // Start typing animation for welcome message
      setTimeout(() => {
        setIsTyping(true);
        typeMessage();
      }, 500);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const typeMessage = () => {
    const fullMessage = "Hello! I'm your AI Health Assistant. I can help you with health questions, symptoms, first aid guidance, appointment booking, and more. How can I assist you today?";
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex < fullMessage.length) {
        setTypedMessage(fullMessage.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30);
  };

  const getAIResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('appointment') || message.includes('book') || message.includes('doctor') || message.includes('hospital')) {
      setShowAppointmentFlow(true);
      setAppointmentStep(0);
      return appointmentFlowMessages[0];
    } else if (showAppointmentFlow && appointmentStep < appointmentFlowMessages.length - 1) {
      const nextStep = appointmentStep + 1;
      setAppointmentStep(nextStep);
      return appointmentFlowMessages[nextStep];
    } else if (showAppointmentFlow && appointmentStep === appointmentFlowMessages.length - 1) {
      // End of appointment flow - redirect to booking page
      setTimeout(() => {
        navigate('/book-appointment');
      }, 2000);
      return "Perfect! I'm redirecting you to our appointment booking page where you can complete your booking with all the details. You'll be there in just a moment!";
    } else if (message.includes('emergency') || message.includes('urgent') || message.includes('help')) {
      return 'For medical emergencies, please call 108 immediately. If this is not an emergency, I can help you with general health guidance. What specific symptoms or concerns do you have?';
    } else if (message.includes('symptom') || message.includes('pain') || message.includes('fever')) {
      return 'I understand you\'re experiencing symptoms. Can you describe them in more detail? For example: location, severity (1-10), duration, and any other accompanying symptoms? Remember, this is for guidance only - please consult a healthcare professional for proper diagnosis.';
    } else if (message.includes('medicine') || message.includes('medication') || message.includes('drug')) {
      return 'I can provide general information about medications, but please consult your doctor or pharmacist for specific medical advice. What medication would you like to know about? Always follow your healthcare provider\'s instructions.';
    } else if (message.includes('first aid')) {
      return 'I can help with basic first aid guidance. What type of first aid assistance do you need? For serious injuries or emergencies, please call 108 immediately.';
    } else {
      return 'Thank you for your question. I\'m here to help with health-related queries, symptoms, first aid, medication information, appointment booking, and finding healthcare providers. Could you please provide more specific details about your health concern?';
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');

    // Generate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'assistant',
        content: getAIResponse(currentMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setIsConnected(true);
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  const handleStartConversation = () => {
    setIsConnected(true);
    setIsListening(true);
    
    // Trigger AI agent widget
    setTimeout(() => {
      const aiWidget = document.querySelector('#vapi-widget-floating-button') as HTMLElement;
      if (aiWidget) {
        aiWidget.click();
      }
    }, 500);
    
    // Add greeting message
    setTimeout(() => {
      const greetingMessage = {
        type: 'assistant',
        content: 'Hi! I\'m your virtual health assistant. I can help you book appointments, answer health questions, and provide medical guidance. How can I help you today?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, greetingMessage]);
      setIsListening(false);
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    const message = {
      type: 'user',
      content: `I need help with ${action.toLowerCase()}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    
    // Generate AI response for quick action
    setTimeout(() => {
      const aiResponse = {
        type: 'assistant',
        content: getAIResponse(`I need help with ${action.toLowerCase()}`),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        type: 'assistant',
        content: 'Hello! I\'m your AI Health Assistant. I can help you with health questions, symptoms, first aid guidance, appointment booking, and more. How can I assist you today?',
        timestamp: new Date()
      }
    ]);
    setIsConnected(false);
    setShowAppointmentFlow(false);
    setAppointmentStep(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Brand Logo */}
        <div className={`text-center mb-4 sm:mb-6 transition-all duration-1000 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1fa27e] to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <i className="ri-heart-pulse-line text-white text-xl sm:text-2xl"></i>
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: '"Pacifico", serif' }}>
              GramaAI
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className={`text-center mb-6 sm:mb-8 transition-all duration-1000 delay-200 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">Try Our AI Health Assistant</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Experience the power of voice-first healthcare. Speak in your local language, upload 
            prescriptions, and get instant AI guidance with text-to-speech responses.
          </p>
        </div>

        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <i className="ri-settings-3-line"></i>
            <span>AI Assistant Controls</span>
            <i className={`ri-arrow-${isSidebarOpen ? 'up' : 'down'}-s-line`}></i>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Card className={`h-[500px] sm:h-[600px] flex flex-col transition-all duration-1000 delay-400 ${
              isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} ${
                      index === 0 ? 'animate-fade-in-up' : ''
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 hover:shadow-md ${
                        message.type === 'user'
                          ? 'bg-[#1fa27e] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">
                        {index === 0 && isTyping ? typedMessage : message.content}
                        {index === 0 && isTyping && (
                          <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                        )}
                      </p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isListening && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-sm">Listening...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your health question here..."
                      className="w-full p-2 sm:p-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent text-sm transition-all duration-200 hover:border-[#1fa27e]/50"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 text-[#1fa27e] hover:bg-[#1fa27e]/10 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110 touch-manipulation"
                    >
                      <i className="ri-send-plane-line text-lg sm:text-xl"></i>
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions - Below chat on all screens */}
            <div className={`mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 transition-all duration-1000 delay-600 ${
              isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <Card>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleQuickAction('Emergency')}
                    className="p-3 sm:p-4 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-lg text-center transition-all duration-200 cursor-pointer border border-red-200 hover:shadow-md hover:scale-105 touch-manipulation"
                  >
                    <i className="ri-alarm-warning-line text-xl sm:text-2xl text-red-500 mb-1 sm:mb-2"></i>
                    <p className="text-xs sm:text-sm font-medium text-red-700">Emergency</p>
                  </button>
                  
                  <button
                    onClick={() => handleQuickAction('Symptoms')}
                    className="p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-lg text-center transition-all duration-200 cursor-pointer border border-blue-200 hover:shadow-md hover:scale-105 touch-manipulation"
                  >
                    <i className="ri-stethoscope-line text-xl sm:text-2xl text-blue-500 mb-1 sm:mb-2"></i>
                    <p className="text-xs sm:text-sm font-medium text-blue-700">Symptoms</p>
                  </button>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-red-200 bg-red-50">
                <div className="text-center">
                  <i className="ri-alarm-warning-line text-2xl sm:text-3xl text-red-500 mb-1 sm:mb-2"></i>
                  <h3 className="font-semibold text-red-900 mb-1 sm:mb-2 text-sm sm:text-base">Medical Emergency?</h3>
                  <p className="text-xs sm:text-sm text-red-700 mb-3 sm:mb-4">For immediate medical help, call emergency services</p>
                  <Button variant="danger" size="sm" fullWidth className="hover:shadow-md transition-all duration-200 hover:scale-105 touch-manipulation text-xs sm:text-sm">
                    <i className="ri-phone-line"></i>
                    Call 108
                  </Button>
                </div>
              </Card>

              {/* Disclaimer */}
              <Card className="bg-yellow-50 border-yellow-200 sm:col-span-2 lg:col-span-1">
                <div className="text-center">
                  <i className="ri-information-line text-xl sm:text-2xl text-yellow-600 mb-1 sm:mb-2"></i>
                  <h4 className="font-medium text-yellow-900 mb-1 sm:mb-2 text-sm sm:text-base">Important Notice</h4>
                  <p className="text-xs text-yellow-800">
                    This AI assistant provides general health information only. Always consult qualified healthcare professionals for medical advice.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* AI Assistant Control Panel */}
          <div className={`order-1 lg:order-2 ${isSidebarOpen ? 'block' : 'hidden lg:block'} transition-all duration-1000 delay-800 ${
            isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="space-y-4 sm:space-y-6">
              {/* AI Assistant Status */}
              <Card>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1fa27e] to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                    <i className="ri-robot-line text-white text-xl sm:text-2xl"></i>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">AI Health Assistant</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Continuous conversation with AI</p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {isConnected ? 'connected' : 'disconnected'}
                    </span>
                  </div>

                  {/* Language Selector */}
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1fa27e] focus:border-transparent text-xs sm:text-sm pr-8 transition-all duration-200 hover:border-[#1fa27e]/50"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.name}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Continuous Conversation Toggle */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={continuousConversation}
                          onChange={(e) => setContinuousConversation(e.target.checked)}
                          className="w-3 h-3 sm:w-4 sm:h-4 text-[#1fa27e] border-gray-300 rounded focus:ring-[#1fa27e] transition-all duration-200"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Continuous Conversation</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Keep listening after each response</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={handleStartConversation}
                      className="w-full bg-gradient-to-r from-[#1fa27e] to-blue-500 hover:from-[#178a69] hover:to-blue-600 transition-all duration-200 hover:shadow-lg hover:scale-105 touch-manipulation text-xs sm:text-sm py-2 sm:py-3"
                    >
                      <i className="ri-mic-line mr-1 sm:mr-2"></i>
                      Start Conversation
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full border-[#1fa27e] text-[#1fa27e] hover:bg-[#1fa27e] hover:text-white active:bg-[#178a69] transition-all duration-200 hover:shadow-md hover:scale-105 touch-manipulation text-xs sm:text-sm py-2 sm:py-3"
                    >
                      <i className="ri-share-line mr-1 sm:mr-2"></i>
                      Share Screen + Mic
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full border-[#1fa27e] text-[#1fa27e] hover:bg-[#1fa27e] hover:text-white active:bg-[#178a69] transition-all duration-200 hover:shadow-md hover:scale-105 touch-manipulation text-xs sm:text-sm py-2 sm:py-3"
                    >
                      <i className="ri-upload-line mr-1 sm:mr-2"></i>
                      Upload Document
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleClearChat}
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 hover:shadow-md hover:scale-105 touch-manipulation text-xs sm:text-sm py-2 sm:py-3"
                    >
                      <i className="ri-delete-bin-line mr-1 sm:mr-2"></i>
                      Clear Chat
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
