import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, Calendar, Clock, User, Stethoscope, AlertTriangle, FileText, 
  CheckCircle, XCircle, Edit, Save, Loader2, MessageSquare, Paperclip
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from "sonner";
import AppointmentFormDialog from '@/components/appointments/AppointmentFormDialog';
import AppointmentDetailSkeleton from '@/components/skeletons/AppointmentDetailSkeleton';

const statusConfig = {
  pending: { icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-500 text-white', label: 'Pending' },
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-500 text-white', label: 'Confirmed' },
  rejected: { icon: <XCircle className="w-4 h-4" />, color: 'bg-red-500 text-white', label: 'Rejected' },
  documents_requested: { icon: <FileText className="w-4 h-4" />, color: 'bg-blue-500 text-white', label: 'Docs Requested' },
};

const priorityConfig = {
  emergency: { color: "bg-red-600 animate-pulse", label: "Emergency" },
  high: { color: "bg-orange-500", label: "High" },
  medium: { color: "bg-yellow-500", label: "Medium" },
  low: { color: "bg-gray-500", label: "Low" },
};

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [staffNotes, setStaffNotes] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);

  console.log("AppointmentDetail: Rendering with ID:", id);

  const { data: appointment, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => base44.entities.Appointment.get(id),
    enabled: !!id,
    onSuccess: (data) => {
      console.log("AppointmentDetail: onSuccess, data:", data);
      setStaffNotes(data.staff_notes || '');
    },
    onError: (error) => {
      console.error("AppointmentDetail: onError, error:", error);
    }
  });

  console.log("AppointmentDetail: Query state:", { isLoading, isError, isSuccess, appointment });

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => base44.entities.Doctor.list(),
    initialData: [],
  });

  const updateNotesMutation = useMutation({
    mutationFn: (notes) => base44.entities.Appointment.update(id, { staff_notes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success("Staff notes updated successfully.");
      setIsEditingNotes(false);
    },
    onError: () => {
      toast.error("Failed to update notes. Please try again.");
    }
  });

  const handleStatusUpdate = useMutation({
    mutationFn: (newStatus) => base44.entities.Appointment.update(id, { status: newStatus }),
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(['appointment', id], updatedAppointment);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success(`Appointment status changed to "${statusConfig[updatedAppointment.status]?.label || 'Unknown'}"`);
    },
    onError: () => {
      toast.error("Failed to update status. Please try again.");
    }
  });

  const getDoctorName = (doctorId) => {
    const doctor = doctors?.find(d => d.id === doctorId);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  if (isLoading) return <AppointmentDetailSkeleton />;
  if (isError || !appointment) return <div className="text-center py-20 text-red-500">Error loading appointment details.</div>;

  const currentStatus = statusConfig[appointment.status] || { label: 'Unknown', color: 'bg-gray-400' };
  const currentPriority = priorityConfig[appointment.priority] || { label: 'Normal', color: 'bg-gray-400' };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">{appointment.patient_name}</h1>
                  <Badge className={`${currentPriority.color} text-white`}>{currentPriority.label}</Badge>
                </div>
                <p className="text-gray-500 mt-1">Appointment ID: {appointment.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Appointment
                </Button>
              </div>
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Main Details */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white/70 backdrop-blur-sm border-gray-200/80 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-700">Appointment Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-1 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-500">Patient</p>
                      <p className="text-gray-800 font-semibold">{appointment.patient_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Stethoscope className="w-5 h-5 mt-1 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-500">Doctor</p>
                      <p className="text-gray-800 font-semibold">Dr. {getDoctorName(appointment.requested_doctor_id)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-1 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-500">Date</p>
                      <p className="text-gray-800 font-semibold">
                        {appointment.appointment_time && !isNaN(new Date(appointment.appointment_time).getTime()) 
                          ? format(new Date(appointment.appointment_time), 'EEEE, MMMM d, yyyy')
                          : 'Date not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 mt-1 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-500">Time</p>
                      <p className="text-gray-800 font-semibold">
                        {appointment.appointment_time && !isNaN(new Date(appointment.appointment_time).getTime())
                          ? format(new Date(appointment.appointment_time), 'h:mm a')
                          : 'Time not set'}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 mt-1 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-500">Symptoms / Reason</p>
                      <p className="text-gray-800">{appointment.symptoms}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-gray-200/80 rounded-2xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Staff Notes
                  </CardTitle>
                  {!isEditingNotes && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(true)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditingNotes ? (
                    <div className="space-y-4">
                      <Textarea
                        value={staffNotes}
                        onChange={(e) => setStaffNotes(e.target.value)}
                        placeholder="Add internal notes for this appointment..."
                        className="min-h-[120px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditingNotes(false)}>Cancel</Button>
                        <Button onClick={() => updateNotesMutation.mutate(staffNotes)} disabled={updateNotesMutation.isPending}>
                          {updateNotesMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          <span className="ml-2">Save Notes</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap min-h-[50px]">
                      {staffNotes || <span className="text-gray-400">No notes added yet.</span>}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Status & Actions */}
            <aside className="space-y-8">
              <Card className="bg-white/70 backdrop-blur-sm border-gray-200/80 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-700">Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge className={`w-full justify-center text-base py-2 ${currentStatus.color}`}>
                    {currentStatus.icon}
                    <span className="ml-2">{currentStatus.label}</span>
                  </Badge>
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-600 mb-2">Change Status:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={appointment.status === 'confirmed' ? 'default' : 'outline'} 
                        onClick={() => handleStatusUpdate.mutate('confirmed')}
                        disabled={handleStatusUpdate.isPending}
                        className="bg-green-500 hover:bg-green-600 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-green-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Confirm
                      </Button>
                      <Button 
                        variant={appointment.status === 'rejected' ? 'destructive' : 'outline'} 
                        onClick={() => handleStatusUpdate.mutate('rejected')}
                        disabled={handleStatusUpdate.isPending}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                      <Button 
                        variant={appointment.status === 'documents_requested' ? 'default' : 'outline'} 
                        onClick={() => handleStatusUpdate.mutate('documents_requested')}
                        disabled={handleStatusUpdate.isPending}
                        className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-blue-600"
                      >
                        <FileText className="w-4 h-4 mr-2" /> Request Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-gray-200/80 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    <Paperclip className="w-5 h-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-500">
                  <p>Document management coming soon.</p>
                </CardContent>
              </Card>
            </aside>
          </main>
        </div>
      </div>
      <AppointmentFormDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        appointmentToEdit={appointment}
      />
    </>
  );
}
