import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BellRing, 
  Send, 
  Users, 
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Loader2
} from 'lucide-react';

export default function Broadcast() {
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState('all');
  const [messageType, setMessageType] = useState('appointment_reminder');
  const [isSending, setIsSending] = useState(false);

  const { data: appointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list("-created_date"),
    initialData: [],
  });

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => base44.entities.Doctor.list(),
    initialData: [],
  });

  const messageTemplates = {
    appointment_reminder: {
      subject: 'Appointment Reminder',
      template: 'Dear {patient_name}, this is a reminder about your upcoming appointment with {doctor_name} on {appointment_date} at {appointment_time}. Please arrive 15 minutes early.'
    },
    general_announcement: {
      subject: 'Hospital Announcement',
      template: 'Dear patients, we would like to inform you about important updates regarding our services. Please contact us if you have any questions.'
    },
    emergency_notice: {
      subject: 'Emergency Notice',
      template: 'URGENT: Due to unforeseen circumstances, some appointments may need to be rescheduled. We will contact affected patients directly.'
    },
    holiday_hours: {
      subject: 'Holiday Hours Update',
      template: 'Please note our updated hours during the holiday season. Emergency services remain available 24/7.'
    }
  };

  const handleTemplateChange = (template) => {
    setMessageType(template);
    setMessage(messageTemplates[template].template);
  };

  const handleSend = async () => {
    setIsSending(true);
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would send the actual messages
    console.log('Sending message:', {
      message,
      recipients,
      messageType,
      template: messageTemplates[messageType]
    });
    
    setIsSending(false);
    setMessage('');
    alert('Messages sent successfully!');
  };

  const getRecipientCount = () => {
    switch (recipients) {
      case 'all':
        return appointments.length;
      case 'pending':
        return appointments.filter(a => a.status === 'pending').length;
      case 'confirmed':
        return appointments.filter(a => a.status === 'confirmed').length;
      case 'doctors':
        return doctors.length;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Broadcast Messages</h1>
            <p className="text-gray-600">Send messages to patients and staff</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-xl font-bold text-gray-900">{appointments.length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-gray-900">
                    {appointments.filter(a => a.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-xl font-bold text-gray-900">
                    {appointments.filter(a => a.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <BellRing className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Staff</p>
                  <p className="text-xl font-bold text-gray-900">{doctors.length}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Message Composer */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Compose Message</h3>
            
            <div className="space-y-6">
              {/* Message Type */}
              <div className="space-y-2">
                <Label htmlFor="messageType">Message Type</Label>
                <Select value={messageType} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment_reminder">Appointment Reminder</SelectItem>
                    <SelectItem value="general_announcement">General Announcement</SelectItem>
                    <SelectItem value="emergency_notice">Emergency Notice</SelectItem>
                    <SelectItem value="holiday_hours">Holiday Hours Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recipients */}
              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Select value={recipients} onValueChange={setRecipients}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Patients ({appointments.length})</SelectItem>
                    <SelectItem value="pending">Pending Appointments ({appointments.filter(a => a.status === 'pending').length})</SelectItem>
                    <SelectItem value="confirmed">Confirmed Appointments ({appointments.filter(a => a.status === 'confirmed').length})</SelectItem>
                    <SelectItem value="doctors">Staff Only ({doctors.length})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message here..."
                  className="min-h-[150px]"
                />
                <p className="text-sm text-gray-500">
                  Use placeholders like {'{patient_name}'}, {'{doctor_name}'}, {'{appointment_date}'}, {'{appointment_time}'} for personalized messages.
                </p>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {messageTemplates[messageType].subject}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {message || 'Your message will appear here...'}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Will be sent to {getRecipientCount()} recipient{getRecipientCount() !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || isSending}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isSending ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Messages (Mock) */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Appointment Reminder</p>
                    <p className="text-xs text-gray-500">Sent to 5 patients • 2 hours ago</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 font-medium">Delivered</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BellRing className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Emergency Notice</p>
                    <p className="text-xs text-gray-500">Sent to all patients • 1 day ago</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 font-medium">Delivered</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
