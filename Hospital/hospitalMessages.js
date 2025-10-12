const STATUS_MAP = {
  accept: "confirmed",
  reject: "rejected",
  "request documents": "documents_requested",
  documents: "documents_requested",
  "request_documents": "documents_requested",
  reschedule: "reschedule_requested",
};

/**
 * Generate bilingual patient-friendly messages for appointment decisions.
 * @param {Object} options
 * @param {string} options.decision - accept|reject|reschedule|request documents
 * @param {string} options.doctorName - Doctor's name
 * @param {string} options.appointmentTime - Appointment time string
 * @param {string} [options.notes] - Optional extra notes to append
 * @returns {{ status: string, message_en: string, message_te: string }}
 */
export function generateDecisionMessage({ decision, doctorName, appointmentTime, notes }) {
  if (!decision) {
    throw new Error("Decision is required to generate a message.");
  }

  const normalizedDecision = decision.toLowerCase();
  const status = STATUS_MAP[normalizedDecision] || "pending";
  const safeDoctor = doctorName || "our doctor";
  const safeDoctorTe = doctorName || "మా డాక్టర్";
  const safeTime = appointmentTime || "the scheduled time";

  let messageEn = "";
  let messageTe = "";

  switch (normalizedDecision) {
    case "accept":
      messageEn = `Your appointment with Dr. ${safeDoctor} at ${safeTime} is confirmed.`;
      messageTe = `డాక్టర్ ${safeDoctorTe} తో ${safeTime} మీ అపాయింట్మెంట్ నిర్ధారించబడింది.`;
      break;
    case "reject":
      messageEn = `Dr. ${safeDoctor} is not available. Please choose another doctor.`;
      messageTe = `డాక్టర్ ${safeDoctorTe} అందుబాటులో లేరు. దయచేసి మరో డాక్టర్‌ను ఎంపిక చేయండి.`;
      break;
    case "reschedule":
      messageEn = `Dr. ${safeDoctor} suggested rescheduling your appointment. We will contact you soon.`;
      messageTe = `డాక్టర్ ${safeDoctorTe} మీ అపాయింట్మెంట్‌ను మళ్లీ షెడ్యూల్ చేయాలని సూచించారు. మేము త్వరలో మీను సంప్రదిస్తాము.`;
      break;
    case "request documents":
    case "request_documents":
    case "documents":
      messageEn = `Doctor requested your test report before consultation.`;
      messageTe = `సంప్రదించడానికి ముందు డాక్టర్ మీ పరీక్ష రిపోర్టును పంపాలని అభ్యర్థించారు.`;
      break;
    default:
      messageEn = `We received your request. Our team will get back to you soon.`;
      messageTe = `మీ అభ్యర్థనను మేము స్వీకరించాము. మా బృందం త్వరలో మీను సంప్రదిస్తుంది.`;
  }

  if (notes) {
    messageEn += ` Notes: ${notes}`;
    messageTe += ` గమనికలు: ${notes}`;
  }

  return {
    status,
    message_en: messageEn,
    message_te: messageTe,
  };
}
