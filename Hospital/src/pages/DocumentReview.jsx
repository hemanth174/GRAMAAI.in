import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import EmptyState from '../components/ui/EmptyState';

export default function DocumentReview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list("-created_date"),
    initialData: [],
  });

  // Filter appointments that have documents or need documents
  const appointmentsWithDocs = appointments.filter(apt => 
    (apt.document_urls && apt.document_urls.length > 0) || 
    apt.status === 'documents_requested'
  );

  const filteredAppointments = appointmentsWithDocs.filter(apt => {
    const matchesSearch = apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.requested_doctor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDocumentStatus = (appointment) => {
    if (appointment.status === 'documents_requested') {
      return { label: 'Documents Requested', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
    if (appointment.document_urls && appointment.document_urls.length > 0) {
      return { label: 'Documents Received', color: 'bg-green-100 text-green-800 border-green-200' };
    }
    return { label: 'No Documents', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const handleDownload = (documentUrl) => {
    // In a real app, this would trigger a download
    console.log('Downloading:', documentUrl);
  };

  const handleView = (documentUrl) => {
    // In a real app, this would open a document viewer
    console.log('Viewing:', documentUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Document Review</h1>
            <p className="text-gray-600">Review and manage patient documents</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {appointmentsWithDocs.reduce((total, apt) => 
                      total + (apt.document_urls?.length || 0), 0
                    )}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {appointmentsWithDocs.filter(apt => apt.status === 'documents_requested').length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reviewed</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {appointmentsWithDocs.filter(apt => 
                      apt.document_urls && apt.document_urls.length > 0 && 
                      apt.status !== 'documents_requested'
                    ).length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        {appointmentsWithDocs.length > 0 && (
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
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className="h-12"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'documents_requested' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('documents_requested')}
                  className="h-12"
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('confirmed')}
                  className="h-12"
                >
                  Reviewed
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading documents...</p>
            </div>
          ) : appointmentsWithDocs.length === 0 ? (
            <EmptyState
              imageUrl="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
              title="No Documents Yet"
              description="When patients upload documents or when documents are requested, they will appear here."
            />
          ) : (
            filteredAppointments.map((appointment) => {
              const docStatus = getDocumentStatus(appointment);
              return (
                <Card key={appointment.id} className="bg-white/80 backdrop-blur-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{appointment.patient_name}</h3>
                          <Badge className={`${docStatus.color} border`}>
                            {docStatus.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <User className="w-4 h-4" />
                          <span>{appointment.requested_doctor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(appointment.appointment_time), "MMM d, yyyy 'at' h:mm a")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    {appointment.document_urls && appointment.document_urls.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Attached Documents</h4>
                        <div className="grid gap-3">
                          {appointment.document_urls.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-900">{doc}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleView(doc)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownload(doc)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">
                            Documents requested from patient
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      {appointment.status === 'documents_requested' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Reviewed
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Request Additional Docs
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
