import React from "react";
import { Calendar, User, Clock, MoreHorizontal, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusConfig = {
  pending: { icon: <Clock className="w-4 h-4" />, color: "bg-yellow-500", label: "Pending" },
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: "bg-green-500", label: "Confirmed" },
  rejected: { icon: <AlertCircle className="w-4 h-4" />, color: "bg-red-500", label: "Rejected" },
  documents_requested: { icon: <Loader className="w-4 h-4 animate-spin" />, color: "bg-blue-500", label: "Docs Requested" },
};

const priorityConfig = {
  low: "bg-gray-400",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  emergency: "bg-red-700 animate-pulse",
};

export default function AppointmentCard({ appointment, onClick }) {
  const { id, patient_name, appointment_time, requested_doctor, status, priority } = appointment;
  const statusInfo = statusConfig[status] || statusConfig.pending;
  const priorityColor = priorityConfig[priority] || priorityConfig.medium;

  // Safely format date and time with fallbacks
  let formattedDate = "Date not set";
  let formattedTime = "Time not set";

  if (appointment_time) {
    try {
      const appointmentDate = new Date(appointment_time);
      if (!isNaN(appointmentDate.getTime())) {
        formattedDate = appointmentDate.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        formattedTime = appointmentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (error) {
      console.error('Error formatting appointment date:', appointment_time, error);
    }
  }

  return (
    <div onClick={onClick} className="block group cursor-pointer">
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden">
        <CardHeader className="p-4 border-b border-gray-200/60">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${priorityColor}`}></div>
              <CardTitle className="text-lg font-bold text-gray-800">{patient_name}</CardTitle>
            </div>
            <Badge variant="outline" className={`flex items-center gap-1.5 text-xs font-medium border-0 text-white ${statusInfo.color}`}>
              {statusInfo.icon}
              <span>{statusInfo.label}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span>Dr. {requested_doctor}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{formattedTime}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
