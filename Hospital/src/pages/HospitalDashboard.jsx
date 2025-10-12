import React, { useState, useEffect } from 'react';

export default function HospitalDashboard() {
  const [activeSection, setActiveSection] = useState('appointments');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', text: 'Hello! How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const menuItems = [
    { id: 'appointments', icon: '🗓', label: 'Appointments' },
    { id: 'doctors', icon: '👨‍⚕️', label: 'Doctors' },
    { id: 'reports', icon: '📄', label: 'Reports' },
    { id: 'patients', icon: '👥', label: 'Patients' },
    { id: 'ai-chat', icon: '🤖', label: 'AI Chat' }
  ];

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, 
        { type: 'user', text: chatInput },
        { type: 'ai', text: 'I received your message. How else can I help?' }
      ]);
      setChatInput('');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { patient: 'John Doe', time: '09:00 AM', doctor: 'Dr. Smith', status: 'Confirmed' },
              { patient: 'Jane Wilson', time: '10:30 AM', doctor: 'Dr. Johnson', status: 'Pending' },
              { patient: 'Mike Brown', time: '02:00 PM', doctor: 'Dr. Davis', status: 'Confirmed' },
              { patient: 'Sarah Miller', time: '03:30 PM', doctor: 'Dr. Garcia', status: 'Cancelled' },
              { patient: 'Tom Anderson', time: '04:00 PM', doctor: 'Dr. Martinez', status: 'Confirmed' },
              { patient: 'Emily Taylor', time: '05:15 PM', doctor: 'Dr. Rodriguez', status: 'Pending' }
            ].map((apt, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 text-lg">{apt.patient}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <span className="mr-2">🕐</span>
                    {apt.time}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">👨‍⚕️</span>
                    {apt.doctor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'doctors':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Dr. Emily Smith', specialty: 'Cardiology', patients: 142, rating: 4.9 },
              { name: 'Dr. Michael Johnson', specialty: 'Neurology', patients: 98, rating: 4.8 },
              { name: 'Dr. Sarah Davis', specialty: 'Pediatrics', patients: 215, rating: 4.9 },
              { name: 'Dr. James Garcia', specialty: 'Orthopedics', patients: 167, rating: 4.7 },
              { name: 'Dr. Lisa Martinez', specialty: 'Dermatology', patients: 189, rating: 4.8 },
              { name: 'Dr. Robert Rodriguez', specialty: 'Oncology', patients: 134, rating: 4.9 },
              { name: 'Dr. Maria Wilson', specialty: 'Psychiatry', patients: 156, rating: 4.6 },
              { name: 'Dr. David Anderson', specialty: 'Radiology', patients: 203, rating: 4.8 }
            ].map((doc, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-full flex items-center justify-center text-3xl mb-4">
                    👨‍⚕️
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{doc.name}</h3>
                  <p className="text-sm text-indigo-600 mb-3">{doc.specialty}</p>
                  <div className="flex justify-between w-full text-xs text-gray-600">
                    <span>👥 {doc.patients}</span>
                    <span>⭐ {doc.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'reports':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { title: 'Monthly Patient Statistics', date: 'October 2025', type: 'Statistics', status: 'Ready' },
              { title: 'Revenue Analysis Q3', date: 'September 2025', type: 'Financial', status: 'Ready' },
              { title: 'Staff Performance Review', date: 'October 2025', type: 'HR', status: 'In Progress' },
              { title: 'Equipment Maintenance Log', date: 'October 2025', type: 'Maintenance', status: 'Ready' },
              { title: 'Patient Satisfaction Survey', date: 'September 2025', type: 'Feedback', status: 'Ready' },
              { title: 'Inventory Stock Report', date: 'October 2025', type: 'Inventory', status: 'In Progress' }
            ].map((report, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">{report.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📅 {report.date}</p>
                      <p>📊 {report.type}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <button className="mt-4 w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition-opacity">
                  View Report
                </button>
              </div>
            ))}
          </div>
        );

      case 'patients':
        return (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Patient ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Age</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Last Visit</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { id: 'P001', name: 'John Doe', age: 45, visit: 'Oct 10, 2025', status: 'Active' },
                    { id: 'P002', name: 'Jane Wilson', age: 32, visit: 'Oct 09, 2025', status: 'Active' },
                    { id: 'P003', name: 'Mike Brown', age: 58, visit: 'Oct 08, 2025', status: 'Recovered' },
                    { id: 'P004', name: 'Sarah Miller', age: 28, visit: 'Oct 07, 2025', status: 'Active' },
                    { id: 'P005', name: 'Tom Anderson', age: 51, visit: 'Oct 06, 2025', status: 'Active' },
                    { id: 'P006', name: 'Emily Taylor', age: 39, visit: 'Oct 05, 2025', status: 'Recovered' },
                    { id: 'P007', name: 'David Lee', age: 43, visit: 'Oct 04, 2025', status: 'Active' },
                    { id: 'P008', name: 'Lisa Chen', age: 36, visit: 'Oct 03, 2025', status: 'Active' }
                  ].map((patient, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{patient.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{patient.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{patient.age}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{patient.visit}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          patient.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'ai-chat':
        return (
          <div className="bg-white rounded-xl shadow-md h-[600px] flex flex-col">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-4 rounded-t-xl">
              <h3 className="font-semibold flex items-center">
                <span className="mr-2">🤖</span>
                AI Medical Assistant
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-['Inter',sans-serif]">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Dashboard...</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-sky-500 to-indigo-600 shadow-lg z-40">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-2xl">
                  🏥
                </div>
                <span className="text-white font-bold text-xl hidden sm:block">MedCare</span>
              </div>
            </div>

            {/* Center Title */}
            <h1 className="text-white font-semibold text-lg lg:text-xl hidden md:block">
              Hospital Dashboard
            </h1>

            {/* User Info */}
            <div className="flex items-center gap-2 text-white">
              <span className="hidden sm:block text-sm lg:text-base">Welcome, Admin</span>
              <span className="text-xl">👋</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] bg-white/70 backdrop-blur-md shadow-xl transition-transform duration-300 ease-in-out z-30 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64`}>
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 capitalize">
                {activeSection.replace('-', ' ')}
              </h2>
              <p className="text-gray-600">
                {activeSection === 'appointments' && 'Manage and view all patient appointments'}
                {activeSection === 'doctors' && 'View and manage hospital doctors'}
                {activeSection === 'reports' && 'Access reports and analytics'}
                {activeSection === 'patients' && 'View patient records and information'}
                {activeSection === 'ai-chat' && 'Chat with AI medical assistant'}
              </p>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2025 Hospital Dashboard. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
