import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Clock, FileText, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppointmentDetailModal({ appointment, isOpen, onClose, onAccept, onReject }) {
  if (!appointment) return null;

  const handleAccept = async () => {
    await onAccept(appointment.id);
    onClose();
  };

  const handleReject = async () => {
    await onReject(appointment.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Appointment Details</h2>
                  <p className="text-blue-100 text-sm mt-1">Review patient information</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Patient Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{appointment.patient_name}</h3>
                      <p className="text-sm text-gray-600">Patient</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {appointment.patient_email && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>{appointment.patient_email}</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Appointment Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <InfoCard
                    icon={<Calendar className="w-5 h-5" />}
                    label="Date & Time"
                    value={new Date(appointment.appointment_time).toLocaleString()}
                  />
                  <InfoCard
                    icon={<User className="w-5 h-5" />}
                    label="Requested Doctor"
                    value={appointment.requested_doctor_name || appointment.requested_doctor || 'Any Available'}
                  />
                  <InfoCard
                    icon={<AlertCircle className="w-5 h-5" />}
                    label="Priority"
                    value={
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.priority === 'high' ? 'bg-red-100 text-red-700' :
                        appointment.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {appointment.priority || 'medium'}
                      </span>
                    }
                  />
                  <InfoCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Status"
                    value={
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        {appointment.status || 'pending'}
                      </span>
                    }
                  />
                </motion.div>

                {/* Symptoms */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gray-700" />
                    <h4 className="font-semibold text-gray-900">Symptoms / Reason for Visit</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{appointment.symptoms}</p>
                </motion.div>

                {/* Documents */}
                {appointment.uploaded_documents && appointment.uploaded_documents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-50 rounded-xl p-6"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-gray-700" />
                      <h4 className="font-semibold text-gray-900">Uploaded Documents</h4>
                    </div>
                    <div className="space-y-2">
                      {appointment.uploaded_documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                            Document {idx + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-3">
                    <TimelineItem
                      label="Created"
                      value={new Date(appointment.created_date).toLocaleString()}
                    />
                    <TimelineItem
                      label="Last Updated"
                      value={new Date(appointment.updated_at).toLocaleString()}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="sticky bottom-0 bg-white border-t p-6 rounded-b-2xl flex gap-4"
              >
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="flex-1 h-12 text-base font-medium border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:scale-105 transition-all duration-200"
                >
                  ❌ Reject
                </Button>
                <Button
                  onClick={handleAccept}
                  className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  ✅ Accept Appointment
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper Components
function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <div className="text-sm font-medium text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
      <div className="flex-1">
        <span className="text-sm text-gray-600">{label}:</span>
        <span className="text-sm text-gray-900 ml-2">{value}</span>
      </div>
    </div>
  );
}
