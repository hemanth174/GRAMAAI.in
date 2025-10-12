// Example: BookingForm.tsx
// Complete example showing how to integrate appointment booking in your patient portal

import { useState, useEffect } from 'react';
import { appointmentClient, checkBackendConnection } from '@/api/appointmentClient';
import { toast } from '@/utils/toast';

export default function BookingForm() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    symptoms: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    priority: 'medium'
  });

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkBackendConnection();
      setIsConnected(connected);
      
      if (!connected) {
        toast.warning('Hospital system is currently offline. Please try again later.', {
          duration: 5000
        });
      }
    };

    checkConnection();

    // Optional: Connect to real-time updates
    appointmentClient.connectToUpdates();

    // Listen for appointment updates
    const handleAppointmentUpdate = (appointment) => {
      console.log('Appointment update received:', appointment);
      toast.info(`Appointment ${appointment.status}: ${appointment.patient_name}`);
    };

    appointmentClient.addEventListener('updated', handleAppointmentUpdate);

    return () => {
      appointmentClient.removeEventListener('updated', handleAppointmentUpdate);
      appointmentClient.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.patientName || !formData.symptoms || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check backend connection
    if (!isConnected) {
      toast.error('Cannot connect to hospital system. Please try again later.');
      return;
    }

    setIsSubmitting(true);

    // Show loading toast
    toast.info('Submitting your appointment request...', { duration: 5000 });

    try {
      // Combine date and time into ISO format
      const dateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

      // Create appointment
      const appointment = await appointmentClient.createAppointment({
        patient_name: formData.patientName,
        patient_email: formData.email,
        symptoms: formData.symptoms,
        requested_doctor_name: formData.doctorName || 'Any Available Doctor',
        appointment_time: dateTime,
        priority: formData.priority as 'low' | 'medium' | 'high',
        status: 'pending'
      });

      console.log('Appointment created:', appointment);

      // Show success toast
      toast.success('Appointment booked successfully! You will receive a confirmation email shortly.', {
        duration: 5000
      });

      // Reset form
      setFormData({
        patientName: '',
        email: '',
        symptoms: '',
        doctorName: '',
        appointmentDate: '',
        appointmentTime: '',
        priority: 'medium'
      });

      // Optional: Redirect to appointments page
      // router.push('/appointments');

    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast.error('Failed to book appointment. Please try again.', {
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
        <div className="mt-2 flex items-center gap-2">
          {isConnected ? (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Connected to hospital system
            </span>
          ) : (
            <span className="text-sm text-yellow-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
              Offline mode
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        {/* Patient Name */}
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
            Patient Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        {/* Symptoms */}
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
            Symptoms / Reason for Visit <span className="text-red-500">*</span>
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your symptoms or reason for visit"
          />
        </div>

        {/* Preferred Doctor */}
        <div>
          <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Doctor (Optional)
          </label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Dr. Smith or leave blank for any available doctor"
          />
        </div>

        {/* Appointment Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-2">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isConnected}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            isSubmitting || !isConnected
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Book Appointment'}
        </button>

        {!isConnected && (
          <p className="text-sm text-yellow-600 text-center">
            Hospital system is currently offline. Please try again later.
          </p>
        )}
      </form>
    </div>
  );
}
