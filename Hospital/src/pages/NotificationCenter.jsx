import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Megaphone, Send, Users, Clock, CheckCircle, AlertCircle, 
  Bell, MessageSquare, Activity, Trash2, Archive 
} from 'lucide-react';
import { toast } from "sonner";

const NOTIFICATION_SERVER_URL = 'http://localhost:5002';

export default function NotificationCenter() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [priority, setPriority] = useState('normal');
  const [sentBy] = useState('Dr. Admin'); // This would come from user context
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);

  // Sample hospitals - in real app, this would come from API
  const hospitals = [
    { id: 'HOSP001', name: 'City General Hospital', patients: 45 },
    { id: 'HOSP002', name: 'Metro Medical Center', patients: 32 },
    { id: 'HOSP003', name: 'Regional Health Complex', patients: 67 },
  ];

  const departments = [
    'General', 'Emergency', 'Cardiology', 'Pediatrics', 
    'Orthopedics', 'Neurology', 'Surgery', 'ICU'
  ];

  const priorityConfig = {
    low: { color: 'bg-gray-500', label: 'Low Priority' },
    normal: { color: 'bg-blue-500', label: 'Normal' },
    high: { color: 'bg-orange-500', label: 'High Priority' },
    urgent: { color: 'bg-red-500 animate-pulse', label: 'Urgent' }
  };

  // Load notifications and stats
  useEffect(() => {
    if (selectedHospital) {
      fetchNotifications();
      fetchStats();
    }
  }, [selectedHospital]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${NOTIFICATION_SERVER_URL}/api/notifications/${selectedHospital}`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${NOTIFICATION_SERVER_URL}/api/notifications/${selectedHospital}/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSendNotification = async () => {
    if (!message.trim() || !selectedHospital) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${NOTIFICATION_SERVER_URL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hospitalId: selectedHospital,
          message: message.trim(),
          sentBy,
          department: selectedDepartment || 'General',
          priority
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`✅ Notification sent to ${data.data.recipientCount} patients`);
        setMessage('');
        setSelectedDepartment('');
        setPriority('normal');
        fetchNotifications(); // Refresh the list
        fetchStats(); // Refresh stats
      } else {
        toast.error(data.error || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveNotification = async (notificationId) => {
    try {
      const response = await fetch(`${NOTIFICATION_SERVER_URL}/api/notifications/${notificationId}/archive`, {
        method: 'PATCH',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Notification archived');
        fetchNotifications();
        fetchStats();
      }
    } catch (error) {
      console.error('Error archiving notification:', error);
      toast.error('Failed to archive notification');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 text-white rounded-lg">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Notification Center</h1>
              <p className="text-gray-600">Send real-time updates to patients</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Send Notification Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/80 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Send New Notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hospital">Hospital *</Label>
                    <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hospital" />
                      </SelectTrigger>
                      <SelectContent>
                        {hospitals.map((hospital) => (
                          <SelectItem key={hospital.id} value={hospital.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{hospital.name}</span>
                              <Badge variant="secondary" className="ml-2">
                                {hospital.patients} patients
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Notification Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your notification message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] resize-none"
                    maxLength={500}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {message.length}/500 characters
                  </div>
                </div>

                <Button 
                  onClick={handleSendNotification} 
                  disabled={isLoading || !message.trim() || !selectedHospital}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {isLoading ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Notification
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Recent Notifications */}
          <div className="space-y-6">
            {/* Stats Card */}
            {stats && (
              <Card className="bg-white/70 backdrop-blur-sm border-gray-200/80 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-green-500" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.connectedPatients}</div>
                      <div className="text-sm text-gray-600">Online Now</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.todayCount}</div>
                      <div className="text-sm text-gray-600">Today</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
                      <div className="text-sm text-gray-600">Active</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Notifications */}
            {notifications.length > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border-gray-200/80 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="w-5 h-5 text-purple-500" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {notifications.slice(0, 10).map((notification) => (
                      <div key={notification._id} className="p-3 border border-gray-200 rounded-lg bg-white/50">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${priorityConfig[notification.priority]?.color || 'bg-gray-500'} text-white text-xs`}>
                                {priorityConfig[notification.priority]?.label || 'Normal'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {notification.department}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                by {notification.sentBy}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          {notification.status === 'active' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleArchiveNotification(notification._id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}