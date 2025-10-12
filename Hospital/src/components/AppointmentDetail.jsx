import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  AlertCircle, 
  FileText, 
  CheckCircle,
  XCircle,
  Edit,
  Save,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending Review" },
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

export default function AppointmentDetail() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('id');
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [staffNotes, setStaffNotes] = useState('');
  const [status, setStatus] = useState('');

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => base44.entities.Appointment.list().then(appointments => 
      appointments.find(apt => apt.id === appointmentId)
    ),
    enabled: !!appointmentId,
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.update(appointmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    updateAppointmentMutation.mutate({
      ...appointment,
      staff_notes: staffNotes,
      status: status || appointment.status,
    });
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    updateAppointmentMutation.mutate({
      ...appointment,
      status: newStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading appointment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Appointment Not Found</h1>
            <p className="text-gray-600 mb-6">The appointment you're looking for doesn't exist.</p>
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const appointmentStatus = statusConfig[appointment.status] || statusConfig.pending;
  const priority = priorityConfig[appointment.priority] || priorityConfig.medium;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Details</h1>
            <p className="text-gray-600">Manage and update appointment information</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Patient Information */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className={`h-1.5 ${priority.color}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{appointment.patient_name}</h2>
                    <Badge className={`${appointmentStatus.color} border`}>
                      {appointmentStatus.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <User className="w-4 h-4" />
                    <span>{appointment.patient_phone || appointment.patient_email || "No contact info"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                  {isEditing && (
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={updateAppointmentMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {updateAppointmentMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick Status Actions */}
              <div className="flex gap-2 mb-6">
                <Button
                  size="sm"
                  variant={appointment.status === 'confirmed' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('confirmed')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant={appointment.status === 'rejected' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('rejected')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant={appointment.status === 'documents_requested' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('documents_requested')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Request Docs
                </Button>
              </div>

              {/* Appointment Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Stethoscope className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Requested Doctor</p>
                    <p className="text-sm font-semibold text-gray-900">{appointment.requested_doctor}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
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

              {/* Symptoms */}
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-red-600 font-semibold mb-1">SYMPTOMS</p>
                  <p className="text-sm text-gray-800">{appointment.symptoms}</p>
                </div>
              </div>

              {/* Staff Notes */}
              <div className="space-y-3">
                <Label htmlFor="staff_notes">Staff Notes</Label>
                {isEditing ? (
                  <Textarea
                    id="staff_notes"
                    value={staffNotes || appointment.staff_notes || ''}
                    onChange={(e) => setStaffNotes(e.target.value)}
                    placeholder="Add notes about this appointment..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-700">
                      {appointment.staff_notes || 'No notes added yet.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Documents */}
              {appointment.document_urls && appointment.document_urls.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Attached Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {appointment.document_urls.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
