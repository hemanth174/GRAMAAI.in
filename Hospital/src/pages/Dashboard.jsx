import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAppointments, updateAppointmentStatus } from "@/api/appointments";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, LayoutGrid, List, Sparkles, MessageSquare, Clock, ArrowRight, Bot, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateTime } from "@/utils";

import StatsOverview from "../components/appointments/StatsOverview";
import AppointmentFormDialog from "../components/appointments/AppointmentFormDialog";
import EmptyState from "../components/ui/EmptyState";
import { useAppointmentNotifications, requestNotificationPermission } from "../hooks/useAppointmentNotifications";
import AppointmentList from "@/components/appointments/AppointmentList";

const dateFormatter = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
const timeFormatter = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric' });

const toDateObject = (value) => {
  if (!value) return null;
  
  // Handle malformed time strings like "2025-10-18T11:00AM:00"
  let cleanValue = value;
  if (typeof value === 'string') {
    // Remove AM/PM from middle of ISO strings and fix common formatting issues
    cleanValue = value
      .replace(/T(\d{1,2}):(\d{2})(AM|PM):(\d{2})/, (match, hour, min, ampm, sec) => {
        let hour24 = parseInt(hour);
        if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;
        return `T${hour24.toString().padStart(2, '0')}:${min}:${sec}`;
      });
  }
  
  const date = new Date(cleanValue);
  return Number.isNaN(date.getTime()) ? null : date;
};

const deriveDisplayDate = (appointment) => {
  if (!appointment) return 'Date TBD';
  if (appointment.appointment_date) {
    const fromIso = toDateObject(appointment.appointment_date);
    return fromIso ? dateFormatter.format(fromIso) : appointment.appointment_date;
  }
  const parsed = toDateObject(appointment.appointment_time);
  return parsed ? dateFormatter.format(parsed) : 'Date TBD';
};

const deriveDisplayTime = (appointment) => {
  if (!appointment) return 'Time TBD';
  if (appointment.appointment_time_slot) {
    return appointment.appointment_time_slot;
  }
  const parsed = toDateObject(appointment.appointment_time);
  return parsed ? timeFormatter.format(parsed) : 'Time TBD';
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [layout, setLayout] = useState("grid");
  const [realtimeAlert, setRealtimeAlert] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const alertTimerRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current);
      }
    };
  }, []);

  const { data: appointments = [], isLoading, isFetching } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => fetchAppointments({ sort: '-created_date' }),
    initialData: [],
    refetchInterval: 15000,
  });

  // Real-time notifications
  const { isConnected } = useAppointmentNotifications((newAppointment) => {
    setHighlightId(newAppointment.id);
    setRealtimeAlert({
      id: newAppointment.id,
      patient: newAppointment.patient_name,
      doctor: newAppointment.requested_doctor_name,
      symptoms: newAppointment.symptoms,
      date: deriveDisplayDate(newAppointment),
      time: deriveDisplayTime(newAppointment),
    });

    toast.info(`${newAppointment.patient_name} requested ${newAppointment.requested_doctor_name || 'a doctor'}`);

    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
    }
    alertTimerRef.current = setTimeout(() => {
      setRealtimeAlert(null);
      setHighlightId(null);
    }, 6500);

    queryClient.invalidateQueries(['appointments']);
  });

  const handleAppointmentClick = (appointment) => {
    navigate(`/appointment/${appointment.id}`);
  };

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    return appointments.filter(apt => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = apt.patient_name?.toLowerCase().includes(searchLower) ||
                           apt.requested_doctor?.toLowerCase().includes(searchLower);
      const status = (apt.status || '').toLowerCase();
      const matchesStatus = statusFilter === "all" ||
        status === statusFilter ||
        (statusFilter === 'accepted' && status === 'confirmed');
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const normalizeStatus = (apt) => (apt.status || '').toLowerCase();
    const pending = appointments.filter((apt) => normalizeStatus(apt) === 'pending').length;
    const accepted = appointments.filter((apt) => ['accepted', 'confirmed'].includes(normalizeStatus(apt))).length;
    const rejected = appointments.filter((apt) => normalizeStatus(apt) === 'rejected').length;

    return {
      total,
      pending,
      confirmed: accepted,
      rejected,
    };
  }, [appointments]);

  const nextAppointmentRequest = useMemo(() => {
    if (!appointments?.length) return null;
    const candidate = appointments.find(a => a.status === "pending");
    if (!candidate) return null;
    return {
      ...candidate,
      doctor_name: candidate.requested_doctor,
      uploaded_documents: candidate.uploaded_documents || candidate.documents || [],
    };
  }, [appointments]);

  const aiMessages = useMemo(() => {
    const items = [];

    if (stats.pending > 0) {
      items.push({
        id: 'pending-alert',
        title: 'Pending confirmations',
        message: `${stats.pending} appointment${stats.pending === 1 ? '' : 's'} waiting for doctor approval.`,
        tone: 'warning',
        timestamp: 'Updated moments ago',
      });
    }

    if (isFetching && !appointments?.length) {
      items.push({
        id: 'ai-fetching',
        icon: <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />,
        content: "Reviewing incoming appointment data...",
        isAction: false,
      });
    } else if (nextAppointmentRequest) {
      items.push({
        id: 'ai-next-apt',
        icon: <Sparkles className="w-5 h-5 text-blue-500" />,
        content: `Next up: ${nextAppointmentRequest.patient_name} is waiting.`,
        action: () => handleAppointmentClick(nextAppointmentRequest),
        isAction: true,
      });
    }
    
    if (!isConnected) {
      items.push({
        id: 'connection-issue',
        title: 'Connection Issue',
        message: 'Waiting for stable connection to display real-time updates.',
        tone: 'error',
        timestamp: 'Last checked a moment ago',
      });
    }

    return items.slice(0, 3);
  }, [stats.pending, nextAppointmentRequest, isFetching, isConnected]);

  const patientHighlights = useMemo(() => {
    if (!appointments?.length) return [];
    const uniquePatients = new Map();

    appointments.forEach((apt) => {
      if (!apt.patient_name) {
        return;
      }
      if (!uniquePatients.has(apt.patient_name)) {
        uniquePatients.set(apt.patient_name, apt);
      }
    });

    return Array.from(uniquePatients.values()).slice(0, 4);
  }, [appointments]);

  // Handle appointment actions
  const handleAcceptAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'accepted');
      queryClient.invalidateQueries(['appointments']);
      toast.success('Appointment accepted successfully!');
    } catch (error) {
      console.error('Failed to accept appointment:', error);
      toast.error('Failed to accept appointment. Please try again.');
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'rejected');
      queryClient.invalidateQueries(['appointments']);
      toast.info('Appointment rejected.');
    } catch (error) {
      console.error('Failed to reject appointment:', error);
      toast.error('Failed to reject appointment. Please try again.');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          {/* Header - Hidden on Mobile, Visible on Desktop */}
          <header className="hidden md:block rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-6 text-white shadow-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">Today&apos;s Operations</p>
                <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Hospital Command Center</h1>
                <p className="mt-3 max-w-2xl text-sm text-white/80">
                  Monitor appointments, act on AI recommendations, and keep patient communication seamless across every department.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {isFetching && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-medium text-white">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> Updating data
                  </span>
                )}
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  <Plus className="h-4 w-4" />
                  Create Appointment
                </Button>
              </div>
            </div>
          </header>

          {/* Mobile Header - Compact Version */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                <p className="text-sm text-gray-600">Today&apos;s Overview</p>
              </div>
              <Button
                onClick={() => setShowAddDialog(true)}
                size="sm"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg"
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsOverview stats={stats} />

          {/* Filters & Controls */}
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-xl backdrop-blur-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
                <Input
                  placeholder="Search patient or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white/90 pl-11 text-base shadow-inner focus:border-sky-500 focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Beautiful Dropdown Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 w-full md:w-[200px] rounded-xl border-slate-200 bg-white/90 shadow-inner hover:border-sky-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        statusFilter === 'all' ? 'bg-blue-500' :
                        statusFilter === 'pending' ? 'bg-yellow-500' :
                        statusFilter === 'accepted' ? 'bg-green-500' :
                        statusFilter === 'rejected' ? 'bg-rose-500' :
                        'bg-blue-500'
                      }`} />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 bg-white shadow-2xl">
                    <SelectItem value="all" className="cursor-pointer rounded-lg hover:bg-blue-50">
                      <div className="flex items-center gap-3 py-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="font-medium">All Appointments</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pending" className="cursor-pointer rounded-lg hover:bg-yellow-50">
                      <div className="flex items-center gap-3 py-1">
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        <span className="font-medium">Pending Review</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="accepted" className="cursor-pointer rounded-lg hover:bg-green-50">
                      <div className="flex items-center gap-3 py-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="font-medium">Accepted</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected" className="cursor-pointer rounded-lg hover:bg-red-50">
                      <div className="flex items-center gap-3 py-1">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="font-medium">Rejected</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Layout Toggle */}
                <ToggleGroup type="single" value={layout} onValueChange={(value) => value && setLayout(value)} aria-label="Layout" className="hidden md:flex">
                  <ToggleGroupItem value="grid" aria-label="Grid layout" className="h-12 w-12 rounded-xl border border-transparent transition-all duration-200 data-[state=on]:border-sky-400 data-[state=on]:bg-sky-500 data-[state=on]:text-white data-[state=on]:shadow-lg hover:scale-105">
                    <LayoutGrid className="h-5 w-5" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List layout" className="h-12 w-12 rounded-xl border border-transparent transition-all duration-200 data-[state=on]:border-sky-400 data-[state=on]:bg-sky-500 data-[state=on]:text-white data-[state=on]:shadow-lg hover:scale-105">
                    <List className="h-5 w-5" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          {/* Appointments Grid/List */}
          <main>
            {isLoading ? (
              <div className="flex flex-col items-center gap-6 py-24 text-center">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 opacity-40 blur-sm"></div>
                  <div className="absolute inset-2 animate-spin rounded-full border-4 border-white/40 border-t-transparent"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                    <Sparkles className="h-5 w-5 text-sky-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Preparing your dashboard</p>
                  <p className="mt-1 text-xs text-slate-500">Pulling appointments, AI notes, and recent updates…</p>
                </div>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <AppointmentList
                appointments={filteredAppointments}
                layout={layout}
                onSelect={handleAppointmentClick}
                highlightId={highlightId}
              />
            ) : (
               <EmptyState
                  imageUrl="https://cdn-icons-png.flaticon.com/512/10041/10041470.png"
                  title="No Appointments Found"
                  description={statusFilter === 'all' && searchTerm === '' 
                    ? "When new appointments are created, they will appear here."
                    : "No appointments match your current filters. Try adjusting your search."
                  }
                >
                  {statusFilter === 'all' && searchTerm === '' && (
                    <Button onClick={() => setShowAddDialog(true)} className="mt-6">
                      <Plus className="w-5 h-5 mr-2" />
                      Add First Appointment
                    </Button>
                  )}
                </EmptyState>
            )}
          </main>

          {/* AI Chat & Patient Highlights */}
          <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-indigo-600 via-sky-600 to-cyan-500 text-white shadow-2xl">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    <Bot className="h-5 w-5" /> AI Staff Chat
                  </CardTitle>
                  <p className="mt-1 text-sm text-white/80">Smart recommendations and automated messages ready for your team.</p>
                </div>
                <Button variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                  Open Inbox
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl bg-white/15 p-4 shadow-inner backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <MessageSquare className="h-4 w-4 text-emerald-200" />
                        {message.title}
                      </div>
                      <span className="text-xs text-white/70">{message.timestamp}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/90">{message.message}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card id="patients" className="rounded-3xl border border-white/70 bg-white/80 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Sparkles className="h-5 w-5 text-sky-500" /> Patient Highlights
                </CardTitle>
                <p className="text-sm text-slate-500">Quick view of patients requiring attention today.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientHighlights.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-slate-500">
                    No patients flagged right now. New insights will appear here automatically.
                  </p>
                ) : (
                  patientHighlights.map((patient) => (
                    <div
                      key={`${patient.id}-${patient.patient_name}`}
                      className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{patient.patient_name}</p>
                          <p className="text-xs text-slate-500">Requested {patient.requested_doctor || 'General physician'}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-4 w-4 text-sky-500" />
                        {patient.appointment_time ? formatDateTime(patient.appointment_time) : 'Time not set'}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      {/* Modals and Notifications */}
      <AppointmentFormDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </>
  );
}
