import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AppointmentCard from "../components/appointments/AppointmentCard";
import StatsOverview from "../components/appointments/StatsOverview";
import AppointmentFormDialog from "../components/appointments/AppointmentFormDialog";
import EmptyState from "../components/ui/EmptyState";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list("-created_date"),
    initialData: [],
  });

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.requested_doctor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    documents_requested: appointments.filter(a => a.status === "documents_requested").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Appointment Management</h1>
            <p className="text-gray-600">Review and manage patient appointment requests</p>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Filters */}
        {appointments.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by patient name or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-5 h-12 bg-gray-100">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                  <TabsTrigger value="documents_requested">Docs</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        )}

        {/* Appointments Grid */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
             <EmptyState
                imageUrl="https://cdn-icons-png.flaticon.com/512/10041/10041470.png"
                title="No Appointments Yet"
                description="When new patient appointments are requested, they will appear here. You can also add one manually."
              >
                <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Appointment
                </Button>
              </EmptyState>
          ) : (
            filteredAppointments.map((appointment) => (
              <Link 
                key={appointment.id} 
                to={createPageUrl(`AppointmentDetail?id=${appointment.id}`)}
                className="block transition-transform hover:scale-[1.01]"
              >
                <AppointmentCard appointment={appointment} />
              </Link>
            ))
          )}
        </div>
      </div>
       <AppointmentFormDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />
    </div>
  );
}