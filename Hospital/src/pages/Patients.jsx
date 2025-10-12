import React, { useState, useMemo, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  Calendar, 
  FileText,
  ChevronRight,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity,
  Heart,
  Thermometer,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Legacy mock data has been removed to ensure the list starts empty until real patients are added.

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "Female",
    condition: "",
    doctor: "",
    status: "Active",
    symptoms: "",
    nextAppointment: ""
  });

  useEffect(() => {
    let cancelled = false;
    const loadPatients = async () => {
      const storedPatients = await base44.entities.Patient.list();
      if (!cancelled) {
        setPatients(storedPatients);
      }
    };
    loadPatients();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || 
        patient.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [patients, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total: patients.length,
    active: patients.filter(p => p.status === "Active").length,
    recovered: patients.filter(p => p.status === "Recovered").length,
    critical: patients.filter(p => p.status === "Critical").length,
  }), [patients]);

  const resetNewPatient = () => {
    setNewPatient({
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "Female",
      condition: "",
      doctor: "",
      status: "Active",
      symptoms: "",
      nextAppointment: ""
    });
  };

  const handleCreatePatient = async (event) => {
    event.preventDefault();
    if (!newPatient.name.trim() || !newPatient.email.trim() || !newPatient.phone.trim()) {
      return;
    }

    const timestamp = new Date();
    const formattedLastVisit = timestamp.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const patientRecord = {
      name: newPatient.name.trim(),
      email: newPatient.email.trim(),
      phone: newPatient.phone.trim(),
      age: newPatient.age ? Number(newPatient.age) : null,
      gender: newPatient.gender,
      condition: newPatient.condition.trim() || 'General Checkup',
      doctor: newPatient.doctor.trim() || 'Unassigned',
      status: newPatient.status,
      symptoms: newPatient.symptoms.trim() || 'No additional notes provided.',
      nextAppointment: newPatient.nextAppointment ? new Date(newPatient.nextAppointment).toLocaleString() : null,
      lastVisit: formattedLastVisit,
      vitals: {
        bloodPressure: '--',
        heartRate: '--',
        temperature: '--',
        weight: '--'
      },
      appointments: 1,
      documents: 0
    };

    const savedPatient = await base44.entities.Patient.create(patientRecord);
    setPatients(prev => [savedPatient, ...prev]);
    setSelectedPatient(savedPatient);
    setIsAddPatientOpen(false);
    resetNewPatient();
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-6 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">Patient Management</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Patient Records</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/80">
                View and manage all patient information, medical history, and appointment schedules.
              </p>
            </div>
            <Button
              onClick={() => setIsAddPatientOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <Plus className="h-4 w-4" />
              Add New Patient
            </Button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none bg-white/90 backdrop-blur-lg shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none bg-white/90 backdrop-blur-lg shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Cases</p>
                    <p className="mt-2 text-3xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none bg-white/90 backdrop-blur-lg shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recovered</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.recovered}</p>
                  </div>
                  <div className="rounded-full bg-emerald-100 p-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-none bg-white/90 backdrop-blur-lg shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical</p>
                    <p className="mt-2 text-3xl font-bold text-red-600">{stats.critical}</p>
                  </div>
                  <div className="rounded-full bg-red-100 p-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card className="border-none bg-white/80 backdrop-blur-lg shadow-xl">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search patients by name, email, or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 bg-white/90 pl-11 text-base shadow-inner focus:border-sky-500 focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setStatusFilter("all")}
                  variant={statusFilter === "all" ? "default" : "outline"}
                  className={`rounded-xl ${statusFilter === "all" ? "bg-indigo-600 text-white" : ""}`}
                >
                  All
                </Button>
                <Button
                  onClick={() => setStatusFilter("active")}
                  variant={statusFilter === "active" ? "default" : "outline"}
                  className={`rounded-xl ${statusFilter === "active" ? "bg-green-600 text-white" : ""}`}
                >
                  Active
                </Button>
                <Button
                  onClick={() => setStatusFilter("recovered")}
                  variant={statusFilter === "recovered" ? "default" : "outline"}
                  className={`rounded-xl ${statusFilter === "recovered" ? "bg-emerald-600 text-white" : ""}`}
                >
                  Recovered
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnimatePresence>
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="group cursor-pointer border-none bg-white/90 backdrop-blur-lg shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg">
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            {patient.email}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            {patient.phone}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={`${
                          patient.status === "Active" 
                            ? "bg-green-100 text-green-700" 
                            : patient.status === "Recovered"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {patient.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Patient Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Age / Gender</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{patient.age} years • {patient.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Condition</p>
                          <p className="mt-1 text-sm font-medium text-indigo-600">{patient.condition}</p>
                        </div>
                      </div>

                      {/* Doctor */}
                      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Assigned Doctor</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">{patient.doctor}</p>
                      </div>

                      {/* Symptoms */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Recent Symptoms</p>
                        <p className="mt-1 text-sm text-gray-700">{patient.symptoms}</p>
                      </div>

                      {/* Appointments */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          Last Visit: {patient.lastVisit}
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                      </div>

                      {patient.nextAppointment && (
                        <div className="rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 p-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-sky-700">
                            <Calendar className="h-4 w-4" />
                            Next: {patient.nextAppointment}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex gap-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {patient.appointments} visits
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          {patient.documents} documents
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPatients.length === 0 && (
          <Card className="border-none bg-white/90 backdrop-blur-lg shadow-xl">
            <CardContent className="py-16 text-center">
              <User className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">No Patients Found</h3>
              <p className="mt-2 text-sm text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent className="bg-white/90 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-900">Add New Patient</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePatient} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Full Name *</Label>
                <Input
                  id="patient-name"
                  placeholder="e.g., Priya Sharma"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-email">Email *</Label>
                <Input
                  id="patient-email"
                  type="email"
                  placeholder="example@email.com"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-phone">Phone *</Label>
                <Input
                  id="patient-phone"
                  placeholder="+91 98765 43210"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-age">Age</Label>
                <Input
                  id="patient-age"
                  type="number"
                  min="0"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-gender">Gender</Label>
                <select
                  id="patient-gender"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-status">Status</Label>
                <select
                  id="patient-status"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={newPatient.status}
                  onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Recovered">Recovered</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-condition">Condition</Label>
                <Input
                  id="patient-condition"
                  placeholder="Primary diagnosis"
                  value={newPatient.condition}
                  onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-doctor">Assigned Doctor</Label>
                <Input
                  id="patient-doctor"
                  placeholder="Doctor name"
                  value={newPatient.doctor}
                  onChange={(e) => setNewPatient({ ...newPatient, doctor: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-symptoms">Symptoms / Notes</Label>
              <Textarea
                id="patient-symptoms"
                rows={3}
                placeholder="Brief overview of the patient's symptoms or notes"
                value={newPatient.symptoms}
                onChange={(e) => setNewPatient({ ...newPatient, symptoms: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-next-appointment">Next Appointment</Label>
              <Input
                id="patient-next-appointment"
                type="datetime-local"
                value={newPatient.nextAppointment}
                onChange={(e) => setNewPatient({ ...newPatient, nextAppointment: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsAddPatientOpen(false); resetNewPatient(); }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-2xl">
                Save Patient
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
