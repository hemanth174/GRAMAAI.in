import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Plus, Loader2, User, Calendar, Stethoscope, AlertTriangle, Mail } from 'lucide-react';
import { toast } from "sonner";

export default function AppointmentFormDialog({ open, onOpenChange, appointmentToEdit }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    symptoms: '',
    requested_doctor_id: '',
    requested_doctor_name: '',
    appointment_time: '',
    priority: 'medium',
    status: 'pending'
  });

  const isEditMode = !!appointmentToEdit;

  useEffect(() => {
    if (isEditMode && appointmentToEdit) {
      setFormData({
        patient_name: appointmentToEdit.patient_name || '',
        patient_email: appointmentToEdit.patient_email || '',
        symptoms: appointmentToEdit.symptoms || '',
  requested_doctor_id: appointmentToEdit.requested_doctor_id ? appointmentToEdit.requested_doctor_id.toString() : '',
        requested_doctor_name: appointmentToEdit.requested_doctor || appointmentToEdit.requested_doctor_name || '',
        appointment_time: appointmentToEdit.appointment_time ? new Date(appointmentToEdit.appointment_time).toISOString().slice(0, 16) : '',
        priority: appointmentToEdit.priority || 'medium',
        status: appointmentToEdit.status || 'pending'
      });
    } else {
      // Reset for new appointment
      setFormData({
        patient_name: '',
        patient_email: '',
        symptoms: '',
  requested_doctor_id: '',
        requested_doctor_name: '',
        appointment_time: '',
        priority: 'medium',
        status: 'pending'
      });
    }
  }, [appointmentToEdit, isEditMode, open]);


  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => base44.entities.Doctor.list(),
    initialData: [],
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      const { id, ...rest } = data;
      return isEditMode 
        ? base44.entities.Appointment.update(id, rest)
        : base44.entities.Appointment.create(rest);
    },
    onSuccess: (newOrUpdatedAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success(`Appointment successfully ${isEditMode ? 'updated' : 'created'}!`);
      onOpenChange(false);
      
      if (!isEditMode) {
        sendConfirmationEmail(newOrUpdatedAppointment);
      }
    },
    onError: (error) => {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} appointment:`, error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} appointment. Please try again.`);
    }
  });

  const sendConfirmationEmail = async (appointment) => {
    if (!appointment.patient_email) {
      toast.warning("Cannot send confirmation: Patient email is missing.");
      return;
    }
    try {
      const doctor = doctors.find(d => d.id === appointment.requested_doctor_id);
      await fetch('http://localhost:5000/send-appointment-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: appointment.patient_email,
          patientName: appointment.patient_name,
          doctorName: doctor?.name || 'N/A',
          appointmentDate: new Date(appointment.appointment_time).toLocaleDateString(),
          appointmentTime: new Date(appointment.appointment_time).toLocaleTimeString(),
          department: doctor?.department || 'General',
        }),
      });
      toast.info("Appointment confirmation email sent to patient.");
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      toast.error("Could not send confirmation email.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = isEditMode ? { ...formData, id: appointmentToEdit.id } : formData;
    if (formData.requested_doctor_name && !dataToSubmit.requested_doctor) {
      dataToSubmit.requested_doctor = formData.requested_doctor_name;
    }
    mutation.mutate(dataToSubmit);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white/80 backdrop-blur-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Appointment' : 'New Appointment Request'}</DialogTitle>
          <DialogDescription>Fill in the details below. Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="patient_name" className="flex items-center gap-2"><User className="w-4 h-4" />Patient Name *</Label>
              <Input id="patient_name" required value={formData.patient_name} onChange={(e) => handleInputChange('patient_name', e.target.value)} placeholder="e.g., John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_email" className="flex items-center gap-2"><Mail className="w-4 h-4" />Patient Email *</Label>
              <Input id="patient_email" type="email" required value={formData.patient_email} onChange={(e) => handleInputChange('patient_email', e.target.value)} placeholder="e.g., john.doe@example.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms / Reason for Visit *</Label>
            <Textarea id="symptoms" required value={formData.symptoms} onChange={(e) => handleInputChange('symptoms', e.target.value)} placeholder="Describe the patient's symptoms or reason for the appointment..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="appointment_time" className="flex items-center gap-2"><Calendar className="w-4 h-4" />Appointment Time *</Label>
              <Input id="appointment_time" type="datetime-local" required value={formData.appointment_time} onChange={(e) => handleInputChange('appointment_time', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requested_doctor_id" className="flex items-center gap-2"><Stethoscope className="w-4 h-4" />Requested Doctor *</Label>
              {doctors?.length ? (
                <Select
                  onValueChange={(value) => {
                    const doctor = doctors.find((doc) => doc.id.toString() === value);
                    handleInputChange('requested_doctor_id', value);
                    handleInputChange('requested_doctor_name', doctor?.name || '');
                  }}
                  value={formData.requested_doctor_id}
                >
                  <SelectTrigger disabled={isLoadingDoctors}>
                    <SelectValue placeholder={isLoadingDoctors ? "Loading doctors..." : "Select a doctor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors?.map(doc => (
                      <SelectItem key={doc.id} value={doc.id.toString()}>{doc.name} - {doc.department}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="requested_doctor_name"
                  required
                  placeholder="Enter doctor name"
                  value={formData.requested_doctor_name}
                  onChange={(e) => handleInputChange('requested_doctor_name', e.target.value)}
                />
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Priority</Label>
                <Select onValueChange={(value) => handleInputChange('priority', value)} value={formData.priority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => handleInputChange('status', value)} value={formData.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="documents_requested">Documents Requested</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl">
              {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              {isEditMode ? 'Save Changes' : 'Create Appointment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
