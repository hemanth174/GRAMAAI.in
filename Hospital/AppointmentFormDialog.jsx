import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';

export default function AppointmentFormDialog({ open, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    patient_name: '',
    symptoms: '',
    requested_doctor: '',
    appointment_time: '',
    priority: 'medium',
    status: 'pending'
  });

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => base44.entities.Doctor.list(),
    initialData: [],
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      onClose();
      // Reset form
      setFormData({
        patient_name: '',
        symptoms: '',
        requested_doctor: '',
        appointment_time: '',
        priority: 'medium',
        status: 'pending'
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAppointmentMutation.mutate(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
          <DialogDescription>Manually enter the details for a new appointment.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="patient_name">Patient Name *</Label>
            <Input id="patient_name" required value={formData.patient_name} onChange={(e) => handleInputChange('patient_name', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment_time">Appointment Time *</Label>
              <Input id="appointment_time" type="datetime-local" required value={formData.appointment_time} onChange={(e) => handleInputChange('appointment_time', e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="requested_doctor">Requested Doctor *</Label>
               <Select onValueChange={(value) => handleInputChange('requested_doctor', value)} value={formData.requested_doctor}>
                 <SelectTrigger disabled={isLoadingDoctors}>
                   <SelectValue placeholder={isLoadingDoctors ? "Loading doctors..." : "Select a doctor"} />
                 </SelectTrigger>
                 <SelectContent>
                   {doctors?.map(doc => (
                     <SelectItem key={doc.id} value={doc.name}>{doc.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms *</Label>
            <Textarea id="symptoms" required value={formData.symptoms} onChange={(e) => handleInputChange('symptoms', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={(value) => handleInputChange('priority', value)} defaultValue="medium">
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
                <Select onValueChange={(value) => handleInputChange('status', value)} defaultValue="pending">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createAppointmentMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
              {createAppointmentMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Add Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}