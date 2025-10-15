import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock4, UserCircle2, Stethoscope } from 'lucide-react';

const statusStyles = {
  pending: {
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    label: 'Pending',
  },
  accepted: {
    badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    label: 'Accepted',
  },
  confirmed: {
    badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    label: 'Accepted',
  },
  rejected: {
    badge: 'bg-rose-100 text-rose-600 border border-rose-200',
    label: 'Rejected',
  },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

const formatterCache = {};
const getFormatter = (options) => {
  const key = JSON.stringify(options);
  if (!formatterCache[key]) {
    formatterCache[key] = new Intl.DateTimeFormat('en-IN', options);
  }
  return formatterCache[key];
};

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const extractDisplayDate = (appointment) => {
  if (appointment?.appointment_date) {
    return appointment.appointment_date;
  }
  const parsed = toDate(appointment?.appointment_time);
  if (!parsed) return 'Date TBD';
  return getFormatter({ year: 'numeric', month: 'short', day: 'numeric' }).format(parsed);
};

const extractDisplayTime = (appointment) => {
  if (appointment?.appointment_time_slot) {
    return appointment.appointment_time_slot;
  }
  const parsed = toDate(appointment?.appointment_time);
  if (!parsed) return 'Time TBD';
  return getFormatter({ hour: 'numeric', minute: 'numeric' }).format(parsed);
};

export default function AppointmentList({
  appointments = [],
  layout = 'grid',
  onSelect,
  highlightId,
}) {
  const containerClass =
    layout === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
      : 'space-y-4';

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={layout}
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className={containerClass}
      >
        {appointments.map((appointment) => {
          const statusKey = (appointment?.status || 'pending').toLowerCase();
          const status = statusStyles[statusKey] || statusStyles.pending;
          const isHighlighted = highlightId && highlightId === appointment.id;

          return (
            <motion.button
              key={appointment.id}
              type="button"
              variants={itemVariants}
              onClick={() => onSelect?.(appointment)}
              className={`group relative flex w-full flex-col items-start rounded-3xl border border-slate-200/70 bg-white/90 p-5 text-left shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                isHighlighted ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-white' : ''
              }`}
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-sky-300 via-indigo-300 to-sky-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                  isHighlighted ? 'opacity-100' : ''
                }`}
              />

              <div className="flex w-full items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <UserCircle2 className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-slate-800">
                      {appointment.patient_name || appointment.patientName || 'Unnamed Patient'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {appointment.patient_email || appointment.email || '—'}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.badge}`}>
                  {status.label}
                </span>
              </div>

              <div className="mt-6 grid w-full grid-cols-1 gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-sky-500" />
                  <span className="font-medium text-slate-700">
                    {appointment.requested_doctor_name || appointment.doctor_name || 'General Physician'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-emerald-500" />
                  <span>{extractDisplayDate(appointment)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock4 className="h-4 w-4 text-indigo-500" />
                  <span>{extractDisplayTime(appointment)}</span>
                </div>
              </div>

              <div className="mt-6 w-full rounded-2xl bg-slate-50/80 p-3 text-xs text-slate-500">
                <p className="line-clamp-2">
                  {appointment.symptoms || 'No symptoms provided'}
                </p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
