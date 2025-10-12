
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Stethoscope, AlertCircle, FileText } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending Review" }, // Changed to yellow
  confirmed: { color: "bg-green-100 text-green-800 border-green-200", label: "Confirmed" },
  rejected: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
  documents_requested: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Documents Requested" },
  rescheduled: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Rescheduled" },
};

const priorityConfig = {
  emergency: { color: "bg-red-500", label: "Emergency" },
  high: { color: "bg-orange-500", label: "High" },
  medium: { color: "bg-yellow-500", label: "Medium" },
  low: { color: "bg-blue-500", label: "Low" },
};

export default function AppointmentCard({ appointment }) {
  const status = statusConfig[appointment.status] || statusConfig.pending;
  const priority = priorityConfig[appointment.priority] || priorityConfig.medium;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className={`h-1.5 ${priority.color}`} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{appointment.patient_name}</h3>
              <Badge className={`${status.color} border`}>
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <User className="w-4 h-4" />
              <span>{appointment.patient_phone || appointment.patient_email || "No contact info"}</span>
            </div>
          </div>
          {appointment.document_urls && appointment.document_urls.length > 0 && (
            <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">{appointment.document_urls.length}</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <Stethoscope className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Requested Doctor</p>
              <p className="text-sm font-semibold text-gray-900">{appointment.requested_doctor}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Appointment Time</p>
              <p className="text-sm font-semibold text-gray-900">
                {format(new Date(appointment.appointment_time), "MMM d, yyyy")}
              </p>
              <p className="text-xs text-gray-600">
                {format(new Date(appointment.appointment_time), "h:mm a")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-red-600 font-semibold mb-1">SYMPTOMS</p>
            <p className="text-sm text-gray-800 line-clamp-2">{appointment.symptoms}</p>
          </div>
        </div>

        {appointment.staff_notes && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-600 font-semibold mb-1">STAFF NOTES</p>
            <p className="text-sm text-gray-700">{appointment.staff_notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
