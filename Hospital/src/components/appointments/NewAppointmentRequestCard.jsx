import React, { useMemo, useState } from "react";
import { CalendarClock, FileText, FolderDown, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ACTION_CONFIG = {
  accept: {
    label: "✅ Accept",
    status: "confirmed",
    tone: "success",
  },
  reject: {
    label: "❌ Reject",
    status: "rejected",
    tone: "warning",
  },
  reschedule: {
    label: "🕓 Reschedule",
    status: "reschedule_requested",
    tone: "info",
  },
  requestDocuments: {
    label: "📄 Request Documents",
    status: "documents_requested",
    tone: "info",
  },
};

function formatDateTime(isoString) {
  if (!isoString) return "To be decided";
  try {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart} • ${timePart}`;
  } catch (error) {
    return isoString;
  }
}

function buildPatientMessage(action, appointment, formattedDateTime) {
  const doctorName = appointment?.doctor_name || "our doctor";
  const teluguDoctorName = appointment?.doctor_name || "మా డాక్టర్";
  switch (action) {
    case "accept":
      return (
        `Your appointment with Dr. ${doctorName} at ${formattedDateTime} is confirmed.\n` +
        `మీ డాక్టర్ ${teluguDoctorName} తో ${formattedDateTime} మీ అపాయింట్మెంట్ నిర్ధారించబడింది.`
      );
    case "reject":
      return (
        `Dr. ${doctorName} is currently unavailable. Please choose another doctor.\n` +
        `డాక్టర్ ${teluguDoctorName} ప్రస్తుతం అందుబాటులో లేరు. దయచేసి మరో డాక్టర్‌ను ఎంపిక చేయండి.`
      );
    case "reschedule":
      return (
        `Dr. ${doctorName} suggested rescheduling your appointment. We will call you shortly.\n` +
        `డాక్టర్ ${teluguDoctorName} మీ అపాయింట్మెంట్‌ను మళ్లీ షెడ్యూల్ చేయాలని సూచించారు. మేము త్వరలో మీకు కాల్ చేస్తాము.`
      );
    case "requestDocuments":
      return (
        `Dr. ${doctorName} requested your medical reports before consultation.\n` +
        `సంప్రదింపుకు ముందు డాక్టర్ ${teluguDoctorName} మీ మెడికల్ రిపోర్టులు పంపాలని అభ్యర్థించారు.`
      );
    default:
      return "";
  }
}

export default function NewAppointmentRequestCard({ appointment, className }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [patientMessage, setPatientMessage] = useState("");
  const formattedDateTime = useMemo(
    () => formatDateTime(appointment?.appointment_time),
    [appointment?.appointment_time]
  );

  const uploadedDocuments = Array.isArray(appointment?.uploaded_documents)
    ? appointment?.uploaded_documents
    : [];

  const handleAction = async (actionKey) => {
    const action = ACTION_CONFIG[actionKey];
    if (!action) return;

    const message = buildPatientMessage(actionKey, appointment, formattedDateTime);
    setSelectedAction(actionKey);
    setPatientMessage(message);

    try {
      await fetch(`http://localhost:5000/appointments/${appointment?.id || "new"}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action.status,
          patientMessage: message,
          appointment,
        }),
      });
      toast.success(`${action.label} noted for ${appointment?.patient_name || "patient"}.`);
    } catch (error) {
      console.error("Failed to update appointment status", error);
      toast.error("Could not reach the server. Please try again.");
    }
  };

  return (
    <Card
      className={cn(
        "w-full max-w-4xl mx-auto border border-slate-200/70 dark:border-slate-800",
        "bg-white/80 dark:bg-slate-900/70 backdrop-blur shadow-xl rounded-3xl",
        className
      )}
    >
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            New Appointment Request
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review the details and choose an action for this patient.
          </p>
        </div>
        <Badge className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
          {formattedDateTime}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <h3 className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Patient
            </h3>
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
              {appointment?.patient_name || "Not provided"}
            </p>
            {appointment?.patient_contact && (
              <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Phone className="w-4 h-4" />
                {appointment.patient_contact}
              </p>
            )}
            {appointment?.patient_email && (
              <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="w-4 h-4" />
                {appointment.patient_email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Preferred Doctor
            </h3>
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
              {appointment?.doctor_name || "Any available doctor"}
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CalendarClock className="w-4 h-4" />
              {formattedDateTime}
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Reported Symptoms
          </h3>
          <p className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
            {appointment?.symptoms || "No symptoms provided."}
          </p>
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Uploaded Documents
            </h3>
            <FolderDown className="w-4 h-4 text-slate-400" />
          </div>
          {uploadedDocuments.length ? (
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {uploadedDocuments.map((doc, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-white/70 px-4 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-800/70"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    {doc.name || doc}
                  </span>
                  {doc.url && (
                    <a
                      className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-300"
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No documents uploaded for this request.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Actions
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(ACTION_CONFIG).map(([key, value]) => (
              <Button
                key={key}
                variant={selectedAction === key ? "default" : "outline"}
                onClick={() => handleAction(key)}
                className={cn(
                  "justify-center rounded-xl border border-slate-200/60 bg-white/80 px-4 py-6 text-sm font-semibold",
                  "shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/70",
                  selectedAction === key && "bg-blue-600 text-white shadow-blue-300/40 hover:bg-blue-600"
                )}
              >
                {value.label}
              </Button>
            ))}
          </div>

          {patientMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200">
              <p className="font-semibold mb-2">Patient Message Preview</p>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {patientMessage}
              </pre>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
