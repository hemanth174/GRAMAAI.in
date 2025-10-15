import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCircle,
  CalendarDays,
  Clock4,
  Phone,
  Mail,
  Stethoscope,
  ClipboardList,
} from 'lucide-react';

const detailVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const buttonVariants = {
  hoverAccept: { scale: 1.02, boxShadow: '0 10px 22px rgba(34,197,94,0.25)' },
  hoverReject: { scale: 1.02, rotate: [-0.4, 0.4, 0], transition: { duration: 0.35, repeat: Infinity, repeatType: 'reverse' } },
  tap: { scale: 0.98 },
};

const DetailItem = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm">
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
      <Icon className="h-5 w-5" />
    </span>
    <div className="text-sm">
      <p className="font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-800">{value || '—'}</p>
    </div>
  </div>
);

export default function AppointmentDetails({
  appointment,
  onAccept,
  onReject,
  isAccepting = false,
  isRejecting = false,
}) {
  if (!appointment) {
    return null;
  }

  const dateDisplay = appointment.appointment_date || appointment.date;
  const timeDisplay = appointment.appointment_time_slot || appointment.time;
  const email = appointment.patient_email || appointment.email;
  const phone = appointment.patient_phone || appointment.phone;
  const doctorName = appointment.requested_doctor_name || appointment.doctor_name;

  return (
    <motion.div
      variants={detailVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-800 p-6 text-white shadow-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Patient Overview</p>
        <h1 className="mt-3 text-3xl font-semibold">
          {appointment.patient_name || appointment.patientName}
        </h1>
        <p className="mt-2 text-sm text-white/80">
          Appointment ID: {appointment.id}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <DetailItem
          icon={Stethoscope}
          label="Preferred Doctor"
          value={doctorName || 'Any Available Doctor'}
          accent="bg-sky-100 text-sky-600"
        />
        <DetailItem
          icon={CalendarDays}
          label="Requested Date"
          value={dateDisplay || 'Date TBD'}
          accent="bg-emerald-100 text-emerald-600"
        />
        <DetailItem
          icon={Clock4}
          label="Requested Time"
          value={timeDisplay || 'Time TBD'}
          accent="bg-indigo-100 text-indigo-600"
        />
        <DetailItem
          icon={ClipboardList}
          label="Status"
          value={(appointment.status || '').toUpperCase()}
          accent="bg-amber-100 text-amber-600"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <DetailItem
          icon={Mail}
          label="Email"
          value={email || 'Not Provided'}
          accent="bg-violet-100 text-violet-600"
        />
        <DetailItem
          icon={Phone}
          label="Phone"
          value={phone || 'Not Provided'}
          accent="bg-rose-100 text-rose-600"
        />
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <UserCircle className="h-5 w-5 text-sky-500" />
          Symptoms & Notes
        </h2>
        <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap">
          {appointment.symptoms || 'No additional notes provided.'}
        </p>
      </section>

      <div className="flex flex-col gap-3 md:flex-row">
        <motion.button
          type="button"
          variants={buttonVariants}
          whileHover="hoverAccept"
          whileTap="tap"
          onClick={onAccept}
          disabled={isAccepting}
          className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isAccepting ? 'Accepting…' : '✅ Accept'}
        </motion.button>
        <motion.button
          type="button"
          variants={buttonVariants}
          whileHover="hoverReject"
          whileTap="tap"
          onClick={onReject}
          disabled={isRejecting}
          className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-400 to-rose-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isRejecting ? 'Rejecting…' : '❌ Reject'}
        </motion.button>
      </div>
    </motion.div>
  );
}
