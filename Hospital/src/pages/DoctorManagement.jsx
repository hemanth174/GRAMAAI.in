import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Loader2,
  Plus,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import AlternateHospitalSuggestions from "@/components/doctor/AlternateHospitalSuggestions";
import PatientReportCard from "@/components/doctor/PatientReportCard";

// Doctor Card Component
const STATUS_META = {
  available: {
    label: "Available",
    icon: CheckCircle,
    badgeClass: "bg-green-100 text-green-700",
  },
  not_available: {
    label: "Not Available",
    icon: XCircle,
    badgeClass: "bg-amber-100 text-amber-700",
  },
};

const DoctorCard = ({ doctor, onEdit, onDelete, onAvailabilityChange, isUpdating }) => {
  const statusKey = doctor.availability_status || "available";
  const statusMeta = STATUS_META[statusKey] || STATUS_META.available;
  const StatusIcon = statusMeta.icon;

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-gray-200/80 dark:border-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center text-blue-700">
            <UserPlus size={32} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">{doctor.name}</h3>
              <Badge className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${statusMeta.badgeClass}`}>
                <StatusIcon className="w-4 h-4" />
                {statusMeta.label}
              </Badge>
            </div>
            <p className="text-blue-700 dark:text-blue-300 font-medium">{doctor.department}</p>
            <p className="text-sm text-gray-500 dark:text-slate-300">{doctor.contact_info}</p>
            {doctor.availability_reason && (
              <p className="text-xs text-amber-600 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-900/30 border border-amber-200/70 dark:border-amber-800 rounded-lg px-3 py-2">
                Reason: {doctor.availability_reason}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAvailabilityChange(doctor, "available")}
            disabled={isUpdating}
            className="bg-green-600 text-white hover:bg-green-700 shadow-sm"
          >
            Mark Available
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAvailabilityChange(doctor, "not_available")}
            disabled={isUpdating}
            className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Mark Unavailable
          </Button>
        </div>
      </div>
      <div className="bg-gray-50/50 dark:bg-slate-900/40 px-6 py-3 flex justify-end gap-2 border-t border-gray-200/60 dark:border-slate-800/60">
        <Button variant="ghost" size="sm" onClick={() => onEdit(doctor)} className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
          <Edit size={16} className="mr-2" /> Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(doctor.id)} className="text-gray-600 hover:text-red-600 hover:bg-red-50">
          <Trash2 size={16} className="mr-2" /> Delete
        </Button>
      </div>
    </div>
  );
};

// Doctor Form Dialog
const DoctorFormDialog = ({ open, onClose, doctor, onSave }) => {
  const [formData, setFormData] = useState({ name: '', department: '', contact_info: '' });

  React.useEffect(() => {
    if (doctor) {
      setFormData({ name: doctor.name, department: doctor.department, contact_info: doctor.contact_info });
    } else {
      setFormData({ name: '', department: '', contact_info: '' });
    }
  }, [doctor, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{doctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
          <DialogDescription>
            {doctor ? 'Update the details for this doctor.' : 'Enter the details for a new doctor.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Doctor Name</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_info">Contact Info</Label>
            <Input id="contact_info" value={formData.contact_info} onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Doctor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AvailabilityDialog = ({ open, onClose, doctor, onConfirm, isSubmitting }) => {
  const [reason, setReason] = useState("");

  React.useEffect(() => {
    if (doctor) {
      setReason(doctor.availability_reason || "");
    } else {
      setReason("");
    }
  }, [doctor, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark {doctor?.name} as Unavailable</DialogTitle>
          <DialogDescription>
            Briefly describe why the doctor is unavailable. Patients will see this when rescheduling.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Label htmlFor="availability_reason">Reason</Label>
          <Textarea
            id="availability_reason"
            placeholder="e.g., On leave, in surgery, emergency rounds"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(reason)} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PendingActionsPanel = ({ items, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="border-dashed border-2 border-blue-200 bg-white/60">
        <CardContent className="py-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-sm text-gray-500">Checking pending appointments…</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card className="border border-gray-200/80 bg-white/70 dark:bg-slate-900/60">
        <CardContent className="py-12 text-center">
          <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-slate-300">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <p className="text-sm">No pending patient actions. All clear!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-blue-200/70 bg-gradient-to-br from-white/90 via-blue-50/70 to-cyan-50/70 dark:from-slate-900/70 dark:via-slate-900/60 dark:to-slate-900/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Pending Patient Actions
          </CardTitle>
          <p className="text-sm text-blue-700/80 dark:text-blue-300/80">Notify patients to reschedule or choose a new slot.</p>
        </div>
        <Badge className="bg-blue-600 text-white px-3 py-1 text-xs">{items.length} affected</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-blue-200/70 bg-white/80 dark:bg-slate-900/60 p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.patientName}</p>
              <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Pending
              </Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Appointment: {item.formattedDate}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default function DoctorManagement() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [availabilityModal, setAvailabilityModal] = useState({ open: false, doctor: null, targetStatus: null });
  const [reportSummaries, setReportSummaries] = useState({});
  const [alternateSuggestions, setAlternateSuggestions] = useState([]);
  const [hasRequestedSuggestions, setHasRequestedSuggestions] = useState(false);
  const [distanceLimit, setDistanceLimit] = useState(10);

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => base44.entities.Doctor.list(),
    initialData: [],
  });

  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list({ sort: '-created_date' }),
    initialData: [],
  });

  const { data: patientReports = [], isLoading: isLoadingReports } = useQuery({
    queryKey: ['patientReports'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/doctor/patient-reports');
      if (!response.ok) {
        throw new Error('Failed to fetch patient reports');
      }
      const payload = await response.json();
      return payload.data || [];
    },
    initialData: [],
  });

  const createDoctorMutation = useMutation({
    mutationFn: (data) => base44.entities.Doctor.create({
      availability_status: 'available',
      availability_reason: '',
      ...data,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setShowDialog(false);
      toast.success('Doctor added successfully.');
    },
    onError: () => toast.error('Unable to add doctor.'),
  });

  const updateDoctorMutation = useMutation({
    mutationFn: ({ id, ...data }) => base44.entities.Doctor.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setShowDialog(false);
      setEditingDoctor(null);
      toast.success('Doctor updated.');
    },
    onError: () => toast.error('Failed to update doctor.'),
  });

  const deleteDoctorMutation = useMutation({
    mutationFn: (id) => base44.entities.Doctor.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor removed.');
    },
    onError: () => toast.error('Unable to delete doctor.'),
  });

  const availabilityMutation = useMutation({
    mutationFn: ({ id, ...payload }) => base44.entities.Doctor.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });

  const summarizeReportMutation = useMutation({
    mutationFn: async ({ id }) => {
      const response = await fetch(`http://localhost:5000/doctor/patient-reports/${id}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to summarize report');
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      setReportSummaries((prev) => ({ ...prev, [variables.id]: data.summary }));
      toast.success('Summary generated.');
    },
    onError: () => toast.error('Unable to summarize report.'),
  });

  const markReportReviewedMutation = useMutation({
    mutationFn: async ({ id }) => {
      const response = await fetch(`http://localhost:5000/doctor/patient-reports/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to update review status');
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast.success('Report marked as reviewed.');
      queryClient.invalidateQueries({ queryKey: ['patientReports'] });
    },
    onError: () => toast.error('Unable to update report status.'),
  });

  const fetchAlternateHospitalsMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch('http://localhost:5000/doctor/alternate-hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch alternate hospitals');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setAlternateSuggestions(data.suggestions || []);
      setHasRequestedSuggestions(true);
      if (!data.suggestions || data.suggestions.length === 0) {
        toast.message('No nearby hospitals found for the selected filters.');
      }
    },
    onError: () => {
      setAlternateSuggestions([]);
      setHasRequestedSuggestions(true);
      toast.error('Unable to fetch alternate hospitals.');
    },
  });

  useEffect(() => {
    setReportSummaries((prev) => {
      const next = { ...prev };
      patientReports.forEach((report) => {
        if (report.ai_summary && !next[report.id]) {
          next[report.id] = report.ai_summary;
        }
      });
      return next;
    });
  }, [patientReports]);

  const doctorsById = useMemo(() => {
    const map = {};
    doctors.forEach((doctor) => {
      map[String(doctor.id)] = doctor;
    });
    return map;
  }, [doctors]);

  const pendingActions = useMemo(() => {
    if (!appointments.length) return [];

    return appointments
      .filter((apt) => {
        const doctorMatch =
          doctorsById[String(apt.requested_doctor_id)] ||
          doctors.find((d) => d.name === apt.requested_doctor);
        if (!doctorMatch) return false;
        return apt.status === 'pending' && doctorMatch.availability_status === 'not_available';
      })
      .map((apt) => {
        const doctor =
          doctorsById[String(apt.requested_doctor_id)] ||
          doctors.find((d) => d.name === apt.requested_doctor);
        const appointmentDate = new Date(apt.appointment_time);
        const formattedDate = Number.isNaN(appointmentDate.getTime())
          ? apt.appointment_time
          : `${appointmentDate.toLocaleDateString()} • ${appointmentDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`;
        const reasonText = doctor?.availability_reason ? ` due to ${doctor.availability_reason}` : '';
        const doctorName = doctor?.name || apt.requested_doctor;
        const patientLocation = apt.patient_location || apt.location || apt.patient_address || '';
        const specialization = doctor?.department || apt.required_specialization || apt.department || '';
        return {
          id: apt.id,
          patientName: apt.patient_name,
          message: `Dr. ${doctorName} is not available${reasonText}. Please select another available slot.`,
          formattedDate,
          doctorName,
          patientLocation,
          specialization,
        };
      });
  }, [appointments, doctorsById, doctors]);

  const defaultSuggestionContext = useMemo(() => {
    if (!pendingActions.length) {
      return { doctorName: '', patientLocation: '', specialization: '' };
    }
    const first = pendingActions[0];
    return {
      doctorName: first.doctorName || '',
      patientLocation: first.patientLocation || '',
      specialization: first.specialization || '',
    };
  }, [pendingActions]);

  const handleAddClick = () => {
    setEditingDoctor(null);
    setShowDialog(true);
  };

  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor);
    setShowDialog(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      deleteDoctorMutation.mutate(id);
    }
  };

  const handleSave = (data) => {
    if (editingDoctor) {
      updateDoctorMutation.mutate({
        id: editingDoctor.id,
        availability_status: editingDoctor.availability_status || 'available',
        availability_reason: editingDoctor.availability_reason || '',
        ...data,
      });
    } else {
      createDoctorMutation.mutate(data);
    }
  };

  const handleAvailabilityChange = (doctor, nextStatus) => {
    if (nextStatus === 'not_available') {
      setAvailabilityModal({ open: true, doctor, targetStatus: nextStatus });
    } else {
      submitAvailabilityUpdate(doctor, nextStatus, '');
    }
  };

  const submitAvailabilityUpdate = async (doctor, nextStatus, reason) => {
    try {
      await availabilityMutation.mutateAsync({
        id: doctor.id,
        availability_status: nextStatus,
        availability_reason: reason,
      });

      const availabilityResponse = await fetch(`http://localhost:5000/doctors/${doctor.id}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_name: doctor.name,
          availability_status: nextStatus,
          reason,
        }),
      });

      if (!availabilityResponse.ok) {
        throw new Error('Failed to persist doctor availability');
      }

      if (nextStatus === 'not_available' && appointments.length) {
        const impactedAppointments = appointments.filter((apt) => {
          const doctorIdMatch = String(apt.requested_doctor_id) === String(doctor.id);
          const doctorNameMatch = apt.requested_doctor === doctor.name;
          return apt.status === 'pending' && (doctorIdMatch || doctorNameMatch);
        });

        await Promise.all(
          impactedAppointments.map((apt) =>
            fetch('http://localhost:5000/decisions/notify-patient', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                decision: 'reject',
                doctor_name: doctor.name,
                appointment_time: apt.appointment_time,
                notes: reason || 'Doctor unavailable',
              }),
            }).catch((error) => console.error('Failed to notify patient', error))
          )
        );
      }

      queryClient.invalidateQueries({ queryKey: ['appointments'] });

      toast.success(`${doctor.name} marked as ${nextStatus === 'available' ? 'available' : 'unavailable'}.`);
    } catch (error) {
      console.error('Availability update failed', error);
      toast.error('Failed to update availability.');
    } finally {
      setAvailabilityModal({ open: false, doctor: null, targetStatus: null });
    }
  };

  const isUpdatingAvailability = availabilityMutation.isPending;

  const handleSummarizeReport = async (report) => {
    try {
      await summarizeReportMutation.mutateAsync({ id: report.id });
      return true;
    } catch (error) {
      console.error('Summarize report failed', error);
      return false;
    }
  };

  const handleMarkReportReviewed = async (report) => {
    try {
      await markReportReviewedMutation.mutateAsync({ id: report.id });
      return true;
    } catch (error) {
      console.error('Mark report reviewed failed', error);
      return false;
    }
  };

  const handleFetchAlternateHospitals = async (filters) => {
    try {
      await fetchAlternateHospitalsMutation.mutateAsync(filters);
    } catch (error) {
      console.error('Alternate hospital fetch failed', error);
    }
  };

  const handleRebookHere = (suggestion) => {
    toast.success(`Rebooking request sent to ${suggestion.hospital_name}.`);
  };

  const handleDistanceLimitChange = (value) => {
    if (!Number.isFinite(value) || value <= 0) {
      setDistanceLimit(1);
      return;
    }
    setDistanceLimit(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 text-white px-6 py-4 rounded-3xl shadow-xl">
              <h1 className="text-3xl md:text-4xl font-bold">Doctor Availability Control</h1>
              <p className="text-sm md:text-base mt-1 opacity-90">Update doctor schedules and inform patients in real-time.</p>
            </div>
          </div>
          <Button
            onClick={handleAddClick}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Doctor
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
            <p className="text-gray-500 mt-4">Loading doctors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onAvailabilityChange={handleAvailabilityChange}
                isUpdating={isUpdatingAvailability}
              />
            ))}
          </div>
        )}

        {doctors.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-white/50 rounded-2xl shadow-sm border">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-6">
              <UserPlus size={40} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">No Doctors Found</h2>
            <p className="text-gray-500 mt-2">Get started by adding your first doctor.</p>
            <Button onClick={handleAddClick} className="mt-6">Add Doctor</Button>
          </div>
        )}

        <section className="space-y-4">
          <PendingActionsPanel items={pendingActions} isLoading={isLoadingAppointments} />
        </section>

        <section className="space-y-4">
          <AlternateHospitalSuggestions
            initialUnavailableDoctor={defaultSuggestionContext.doctorName}
            initialLocation={defaultSuggestionContext.patientLocation}
            initialSpecialization={defaultSuggestionContext.specialization}
            onFetch={handleFetchAlternateHospitals}
            suggestions={alternateSuggestions}
            isLoading={fetchAlternateHospitalsMutation.isPending}
            onRebook={handleRebookHere}
            distanceLimit={distanceLimit}
            onDistanceChange={handleDistanceLimitChange}
            hasRequested={hasRequestedSuggestions}
          />
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Patient Reports</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Review uploaded documents, generate quick summaries, and keep your team aligned.
              </p>
            </div>
          </div>

          {isLoadingReports ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200/70 bg-white/70 py-12 dark:border-slate-800/60 dark:bg-slate-900/60">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-slate-500">Loading patient reports...</p>
            </div>
          ) : patientReports.length === 0 ? (
            <Card className="border border-dashed border-slate-300/80 bg-white/60 dark:border-slate-700/60 dark:bg-slate-900/50">
              <CardContent className="py-12 text-center text-sm text-slate-500 dark:text-slate-300">
                No patient reports uploaded yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {patientReports.map((report) => (
                <PatientReportCard
                  key={report.id}
                  report={report}
                  summary={reportSummaries[report.id]}
                  onSummarize={handleSummarizeReport}
                  onMarkReviewed={handleMarkReportReviewed}
                  isSummarizing={
                    summarizeReportMutation.isPending &&
                    summarizeReportMutation.variables?.id === report.id
                  }
                  isReviewing={
                    markReportReviewedMutation.isPending &&
                    markReportReviewedMutation.variables?.id === report.id
                  }
                />
              ))}
            </div>
          )}
        </section>

        <DoctorFormDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          doctor={editingDoctor}
          onSave={handleSave}
        />

        <AvailabilityDialog
          open={availabilityModal.open}
          onClose={() => setAvailabilityModal({ open: false, doctor: null, targetStatus: null })}
          doctor={availabilityModal.doctor}
          onConfirm={(reason) =>
            availabilityModal.doctor &&
            submitAvailabilityUpdate(availabilityModal.doctor, availabilityModal.targetStatus, reason)
          }
          isSubmitting={isUpdatingAvailability}
        />
      </div>
    </div>
  );
}
