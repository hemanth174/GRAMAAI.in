// server.js - Hospital Management System with OTP Verification & Email Notifications
import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import {
    initDatabase,
    registerHospital,
    verifyHospitalCredentials,
    getHospitalByEmail,
    storeOTP as dbStoreOTP,
    verifyOTP as dbVerifyOTP,
    listAppointments,
    createAppointmentRecord,
    updateAppointmentRecord,
    deleteAppointmentRecord
} from './database.js';
import { generateDecisionMessage } from './hospitalMessages.js';
import { randomUUID } from 'crypto';

const app = express();
const port = 5000;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize database on server start
try {
    await initDatabase();
    console.log('🚀 Database initialized');
} catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
}

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'healthcareai09@gmail.com', // ← Replace with your Gmail address
        pass: 'spir tpkc wgvr bqqs' // ← Replace with your Gmail App Password
    }
});

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();
const doctorAvailability = new Map();
const appointmentStreamClients = new Set();
const patientReports = [
    {
        id: 'rpt-101',
        patient_name: 'Ananya Rao',
        file_name: 'blood-test-results.pdf',
        file_type: 'pdf',
        uploaded_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        download_url: 'https://example.com/reports/blood-test-results.pdf',
        review_status: 'pending',
        reviewed_at: null,
        ai_summary: '',
    },
    {
        id: 'rpt-102',
        patient_name: 'Priya Verma',
        file_name: 'chest-xray.png',
        file_type: 'image',
        uploaded_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        download_url: 'https://example.com/reports/chest-xray.png',
        review_status: 'pending',
        reviewed_at: null,
        ai_summary: '',
    },
    {
        id: 'rpt-103',
        patient_name: 'Rahul Singh',
        file_name: 'mri-scan.zip',
        file_type: 'file',
        uploaded_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        download_url: 'https://example.com/reports/mri-scan.zip',
        review_status: 'reviewed',
        reviewed_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        ai_summary: 'Previous review notes indicate stable findings with follow-up in two weeks.',
    },
];

function broadcastAppointmentEvent(eventName, payload) {
    const serialized = `event: ${eventName}\ndata:${JSON.stringify(payload)}\n\n`;
    for (const client of appointmentStreamClients) {
        try {
            client.res.write(serialized);
        } catch (error) {
            console.error('⚠️ Failed to notify appointment stream client:', error);
        }
    }
}

function normalizeAppointmentPayload(body = {}) {
    return {
        patient_name: body.patient_name,
        patient_email: body.patient_email,
        symptoms: body.symptoms,
        requested_doctor_id: body.requested_doctor_id,
        requested_doctor_name: body.requested_doctor_name || body.requested_doctor || body.preferred_doctor,
        appointment_time: body.appointment_time,
        priority: body.priority,
        status: body.status,
        document_urls: body.document_urls || body.documents || body.uploaded_documents,
        uploaded_documents: body.uploaded_documents || body.document_urls || body.documents,
    };
}

function validateAppointmentInput(body, res) {
    const missingFields = [];
    if (!body.patient_name) missingFields.push('patient_name');
    if (!body.symptoms) missingFields.push('symptoms');
    if (!body.appointment_time) missingFields.push('appointment_time');

    if (missingFields.length > 0) {
        res.status(400).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(', ')}`
        });
        return false;
    }

    return true;
}

function generateReportSummaryText(report) {
    const templates = [
        'Report indicates mild infection signs. Suggest re-test in 3 days.',
        'Findings point to stable vitals; continue current medication and monitor symptoms.',
        'Imaging suggests improvement compared to the previous scan. Recommend routine follow-up.',
        'Lab values slightly elevated; consider dietary adjustments and re-evaluate next week.',
        'Results within acceptable range. No immediate action required other than hydration and rest.',
    ];

    const index = Math.abs(report.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % templates.length;
    return templates[index];
}

const hospitalDirectory = [
    {
        id: 'h-01',
        hospital_name: 'City Care Hospital',
        address: 'Banjara Hills, Hyderabad',
        distanceKm: 4.2,
        doctors: [
            { name: 'Dr. Kavya Menon', specialization: 'Cardiologist', nextAvailable: 'Today 5:30 PM' },
            { name: 'Dr. Ramesh Varma', specialization: 'Orthopedic Surgeon', nextAvailable: 'Tomorrow 10:00 AM' },
        ],
    },
    {
        id: 'h-02',
        hospital_name: 'Sunrise Multispeciality',
        address: 'Madhapur, Hyderabad',
        distanceKm: 6.5,
        doctors: [
            { name: 'Dr. Aisha Kapoor', specialization: 'Dermatologist', nextAvailable: 'Today 6:15 PM' },
            { name: 'Dr. Suresh Iyer', specialization: 'Cardiologist', nextAvailable: 'Tomorrow 8:30 AM' },
        ],
    },
    {
        id: 'h-03',
        hospital_name: 'Green Valley Clinic',
        address: 'Gachibowli, Hyderabad',
        distanceKm: 9.1,
        doctors: [
            { name: 'Dr. Nidhi Sharma', specialization: 'Pediatrician', nextAvailable: 'Today 4:45 PM' },
            { name: 'Dr. Vikram Anand', specialization: 'Cardiologist', nextAvailable: 'Tomorrow 11:30 AM' },
        ],
    },
    {
        id: 'h-04',
        hospital_name: 'Lotus Heart Institute',
        address: 'Secunderabad, Hyderabad',
        distanceKm: 12.7,
        doctors: [
            { name: 'Dr. Neha Bhatt', specialization: 'Cardiologist', nextAvailable: 'Today 8:00 PM' },
            { name: 'Dr. Arun Pillai', specialization: 'Neurologist', nextAvailable: 'Tomorrow 9:15 AM' },
        ],
    },
    {
        id: 'h-05',
        hospital_name: 'Harmony Care Center',
        address: 'Kondapur, Hyderabad',
        distanceKm: 5.3,
        doctors: [
            { name: 'Dr. Isha Kulkarni', specialization: 'Endocrinologist', nextAvailable: 'Today 7:20 PM' },
            { name: 'Dr. Rohit Malhotra', specialization: 'Cardiologist', nextAvailable: 'Tomorrow 10:45 AM' },
        ],
    },
];

// --- Endpoint to register a new hospital ---
app.post('/register-hospital', async (req, res) => {
    const { hospitalName, email, password, fullName, phone, role, bio } = req.body;

    if (!hospitalName || !email || !password) {
        return res.status(400).json({
            message: 'Hospital name, email, and password are required',
            success: false
        });
    }

    try {
        const result = await registerHospital(hospitalName, email, password, {
            fullName,
            phone,
            role,
            bio
        });
        console.log(`✅ Hospital registered: ${hospitalName}`);
        
        res.status(201).json({
            message: 'Hospital registered successfully!',
            success: true,
            hospital: result
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        
        if (error.message.includes('already exists') || error.message.includes('already registered')) {
            return res.status(409).json({
                message: error.message,
                success: false
            });
        }
        
        res.status(500).json({
            message: 'Registration failed. Please try again.',
            success: false
        });
    }
});

// --- Endpoint to login hospital ---
app.post('/login-hospital', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required',
            success: false
        });
    }

    try {
        const result = await verifyHospitalCredentials(email, password);
        
        if (!result.success) {
            return res.status(401).json({
                message: result.message,
                success: false
            });
        }

        console.log(`✅ Hospital login successful: ${result.hospital.hospitalName}`);
        
        res.status(200).json({
            message: 'Login successful!',
            success: true,
            hospital: result.hospital
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            message: 'Login failed. Please try again.',
            success: false
        });
    }
});

// --- Endpoint to send OTP for login/registration ---
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email address is required' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Store OTP in memory with 10 minute expiry
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(email, {
        otp: otp,
        expiresAt: expiresAt
    });

    // Also store in database
    try {
        const expiryDate = new Date(expiresAt).toISOString();
        await dbStoreOTP(email, otp.toString(), expiryDate);
    } catch (dbError) {
        console.error('⚠️ Database OTP storage failed (non-critical):', dbError);
    }

    const mailOptions = {
        from: '"Hospital Management System" <todolist725@gmail.com>',
        to: email,
        subject: '🏥 Your Hospital Portal OTP Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <div style="background: white; padding: 30px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #667eea; margin: 0;">🏥</h1>
                        <h2 style="color: #333; margin: 10px 0;">Hospital Management System</h2>
                    </div>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">Hello,</p>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Thank you for using our Hospital Management System. Please use the following One-Time Password (OTP) to complete your login verification.
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px dashed #667eea;">
                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your OTP Code:</p>
                        <span style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</span>
                    </div>
                    
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <p style="margin: 0; color: #856404; font-size: 14px;">
                            ⏱️ <strong>Important:</strong> This OTP is valid for 10 minutes only.
                        </p>
                    </div>
                    
                    <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                        <p style="margin: 0; color: #721c24; font-size: 14px;">
                            🔒 <strong>Security Notice:</strong> Never share this OTP with anyone. Our staff will never ask for your OTP.
                        </p>
                    </div>
                    
                    <p style="font-size: 14px; color: #888; line-height: 1.6;">
                        If you did not request this OTP, please ignore this email or contact our support team immediately.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                    
                    <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
                        Stay healthy and safe!<br>
                        <strong>Hospital Management Team</strong>
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent successfully to: ${email} | OTP: ${otp}`);
        res.status(200).json({ 
            message: 'OTP has been sent to your email address!',
            success: true 
        });
    } catch (error) {
        console.error('❌ Error sending OTP email:', error);
        res.status(500).json({ 
            message: 'Failed to send OTP email. Please try again later.',
            success: false 
        });
    }
});

// --- Endpoint to verify OTP ---
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ 
            message: 'Email and OTP are required',
            success: false 
        });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
        return res.status(400).json({ 
            message: 'OTP not found or expired. Please request a new OTP.',
            success: false 
        });
    }

    if (Date.now() > storedData.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ 
            message: 'OTP has expired. Please request a new OTP.',
            success: false 
        });
    }

    if (parseInt(otp) !== storedData.otp) {
        return res.status(400).json({ 
            message: 'Invalid OTP. Please try again.',
            success: false 
        });
    }

    // OTP is valid - remove it from store
    otpStore.delete(email);

    console.log(`✅ OTP verified successfully for: ${email}`);

    try {
        const hospital = await getHospitalByEmail(email);

        if (!hospital) {
            return res.status(404).json({
                message: 'Hospital details not found after verification',
                success: false
            });
        }

        res.status(200).json({ 
            message: 'OTP verified successfully!',
            success: true,
            user: {
                id: hospital.id,
                hospitalName: hospital.hospital_name,
                hospital_name: hospital.hospital_name,
                email: hospital.email,
                fullName: hospital.full_name,
                full_name: hospital.full_name,
                phone: hospital.phone,
                role: hospital.role || 'admin',
                bio: hospital.bio
            }
        });
    } catch (fetchError) {
        console.error('❌ Error fetching hospital after OTP verification:', fetchError);
        res.status(500).json({
            message: 'Failed to fetch hospital details after verification',
            success: false
        });
    }
});

// --- Appointment Sync API ---
app.get('/api/appointments', async (req, res) => {
    try {
        const { sort } = req.query;
        const appointments = await listAppointments({ sort });
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error('❌ Failed to fetch appointments:', error);
        res.status(500).json({ success: false, message: 'Failed to load appointments' });
    }
});

app.get('/api/appointments/stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (res.flushHeaders) {
        res.flushHeaders();
    } else {
        res.write('\n');
    }

    res.write('retry: 10000\n\n');

    const heartbeat = setInterval(() => {
        res.write('event: ping\ndata:{}\n\n');
    }, 25000);

    const client = { res, heartbeat };
    appointmentStreamClients.add(client);

    try {
        const snapshot = await listAppointments({ sort: '-created_date' });
        res.write(`event: init\ndata:${JSON.stringify(snapshot)}\n\n`);
    } catch (error) {
        console.error('❌ Failed to send initial appointment snapshot:', error);
        res.write('event: error\ndata:{"message":"Failed to load initial appointments"}\n\n');
    }

    req.on('close', () => {
        clearInterval(heartbeat);
        appointmentStreamClients.delete(client);
    });
});

app.post('/api/appointments', async (req, res) => {
    const payload = normalizeAppointmentPayload(req.body);

    if (!validateAppointmentInput(payload, res)) {
        return;
    }

    try {
        const appointment = await createAppointmentRecord({
            id: req.body.id || `apt-${randomUUID()}`,
            ...payload,
            created_date: req.body.created_date
        });

        res.status(201).json({ success: true, data: appointment });
        broadcastAppointmentEvent('created', appointment);
    } catch (error) {
        console.error('❌ Failed to create appointment:', error);
        res.status(500).json({ success: false, message: 'Failed to create appointment' });
    }
});

app.patch('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const payload = normalizeAppointmentPayload(req.body);

    try {
        const updatedAppointment = await updateAppointmentRecord(id, payload);

        if (!updatedAppointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.status(200).json({ success: true, data: updatedAppointment });
        broadcastAppointmentEvent('updated', updatedAppointment);
    } catch (error) {
        console.error('❌ Failed to update appointment:', error);
        res.status(500).json({ success: false, message: 'Failed to update appointment' });
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const removed = await deleteAppointmentRecord(id);

        if (!removed) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.status(200).json({ success: true });
        broadcastAppointmentEvent('deleted', { id });
    } catch (error) {
        console.error('❌ Failed to delete appointment:', error);
        res.status(500).json({ success: false, message: 'Failed to delete appointment' });
    }
});

// --- Endpoint to send appointment confirmation email ---
app.post('/send-appointment-confirmation', async (req, res) => {
    const { email, patientName, doctorName, appointmentDate, appointmentTime, department } = req.body;

    if (!email || !patientName || !doctorName || !appointmentDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const mailOptions = {
        from: '"Hospital Management System" <todolist725@gmail.com>',
        to: email,
        subject: '✅ Appointment Confirmation - Hospital Management System',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 15px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
                <div style="background: white; padding: 30px; border-radius: 10px;">
                    <h2 style="text-align: center; color: #333; margin-bottom: 20px;">✅ Appointment Confirmed!</h2>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">Dear ${patientName},</p>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Your appointment has been successfully scheduled. Here are the details:
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; color: #666; font-weight: 600;">👨‍⚕️ Doctor:</td>
                                <td style="padding: 10px 0; color: #333;">${doctorName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #666; font-weight: 600;">🏥 Department:</td>
                                <td style="padding: 10px 0; color: #333;">${department || 'General'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #666; font-weight: 600;">📅 Date:</td>
                                <td style="padding: 10px 0; color: #333;">${appointmentDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #666; font-weight: 600;">⏰ Time:</td>
                                <td style="padding: 10px 0; color: #333;">${appointmentTime || 'To be confirmed'}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0c5460;">
                        <p style="margin: 0; color: #0c5460; font-size: 14px;">
                            📝 <strong>Please Note:</strong> Arrive 15 minutes before your appointment time. Bring your ID and insurance card.
                        </p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                    
                    <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
                        We look forward to seeing you!<br>
                        <strong>Hospital Management Team</strong>
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Appointment confirmation sent to: ${email}`);
        res.status(200).json({ message: 'Appointment confirmation sent successfully!' });
    } catch (error) {
        console.error('❌ Error sending appointment confirmation:', error);
        res.status(500).json({ message: 'Failed to send confirmation email.' });
    }
});

// --- Endpoint to send appointment reminder ---
app.post('/send-appointment-reminder', async (req, res) => {
    const { email, patientName, doctorName, appointmentDate, appointmentTime } = req.body;

    if (!email || !patientName || !doctorName || !appointmentDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const mailOptions = {
        from: '"Hospital Management System" <todolist725@gmail.com>',
        to: email,
        subject: '⏰ Appointment Reminder - Tomorrow',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <div style="background: white; padding: 30px; border-radius: 10px;">
                    <h2 style="text-align: center; color: #333; margin-bottom: 20px;">⏰ Appointment Reminder</h2>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">Dear ${patientName},</p>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        This is a friendly reminder about your upcoming appointment:
                    </p>
                    
                    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <h3 style="margin: 0 0 15px 0; color: #856404;">Tomorrow's Appointment</h3>
                        <p style="margin: 5px 0; font-size: 18px;"><strong>Dr. ${doctorName}</strong></p>
                        <p style="margin: 5px 0; font-size: 16px;">📅 ${appointmentDate}</p>
                        <p style="margin: 5px 0; font-size: 16px;">⏰ ${appointmentTime || 'Check your confirmation'}</p>
                    </div>
                    
                    <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #155724; font-size: 14px;">
                            ✅ Please arrive 15 minutes early<br>
                            ✅ Bring your ID and insurance card<br>
                            ✅ Bring any medical records or test results
                        </p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                    
                    <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
                        See you soon!<br>
                        <strong>Hospital Management Team</strong>
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Appointment reminder sent to: ${email}`);
        res.status(200).json({ message: 'Appointment reminder sent successfully!' });
    } catch (error) {
        console.error('❌ Error sending appointment reminder:', error);
        res.status(500).json({ message: 'Failed to send reminder email.' });
    }
});

// --- Endpoint to send welcome email ---
app.post('/send-welcome-email', async (req, res) => {
    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email address is required' });
    }

    const loginLink = `http://localhost:${port}`;

    const mailOptions = {
        from: '"Hospital Management System" <todolist725@gmail.com>',
        to: email,
        subject: '🎉 Welcome to Hospital Management System!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <div style="background: white; padding: 30px; border-radius: 10px;">
                    <h2 style="text-align: center; color: #333; margin-bottom: 20px;">🎉 Welcome to Our Hospital!</h2>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">Dear ${name || 'Valued Patient'},</p>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Welcome to our Hospital Management System! We're delighted to have you join our healthcare family.
                    </p>
                    
                    <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                        <h3 style="color: #667eea; margin-top: 0;">🚀 What You Can Do:</h3>
                        <ul style="color: #666; margin: 0; padding-left: 20px;">
                            <li>Schedule appointments with our expert doctors</li>
                            <li>View your medical history and records</li>
                            <li>Receive appointment reminders</li>
                            <li>Access lab results and prescriptions</li>
                            <li>Manage your profile and preferences</li>
                        </ul>
                    </div>
                    
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <p style="margin: 0; color: #856404; font-size: 14px;">
                            💡 <strong>Quick Tip:</strong> Complete your profile to get personalized healthcare recommendations.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${loginLink}" style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                            🏥 Access Your Portal
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                    
                    <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
                        Your health is our priority!<br>
                        <strong>Hospital Management Team</strong>
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent successfully to: ${email}`);
        res.status(200).json({ message: 'Welcome email sent successfully!' });
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        res.status(500).json({ message: 'Failed to send welcome email.' });
    }
});

// --- Placeholder endpoint for appointment status updates ---
app.get('/doctors/availability', (req, res) => {
    const payload = Array.from(doctorAvailability.entries()).map(([doctorId, info]) => ({
        doctorId,
        ...info,
    }));
    res.json({ success: true, data: payload });
});

app.post('/doctors/:id/availability', (req, res) => {
    const { id } = req.params;
    const { doctor_name: doctorName, availability_status: availabilityStatus, reason } = req.body;

    if (!availabilityStatus) {
        return res.status(400).json({ success: false, message: 'availability_status is required' });
    }

    doctorAvailability.set(id, {
        doctorName,
        availabilityStatus,
        reason: reason || '',
        updatedAt: new Date().toISOString(),
    });

    console.log(`📋 Doctor availability updated: ${doctorName || id} → ${availabilityStatus}${reason ? ` (${reason})` : ''}`);

    res.json({
        success: true,
        message: 'Doctor availability updated',
        data: {
            doctorId: id,
            doctorName,
            availabilityStatus,
            reason: reason || '',
        },
    });
});

app.get('/doctor/patient-reports', (req, res) => {
    res.json({ success: true, data: patientReports });
});

app.post('/doctor/patient-reports/:id/review', (req, res) => {
    const { id } = req.params;
    const report = patientReports.find((item) => item.id === id);

    if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.review_status = 'reviewed';
    report.reviewed_at = new Date().toISOString();

    console.log(`Report reviewed: ${report.file_name} for ${report.patient_name}`);

    res.json({
        success: true,
        message: 'Report marked as reviewed',
        data: report,
    });
});

app.post('/doctor/patient-reports/:id/summarize', (req, res) => {
    const { id } = req.params;
    const report = patientReports.find((item) => item.id === id);

    if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const summary = generateReportSummaryText(report);
    report.ai_summary = summary;

    console.log(`Summary generated for report ${id}`);

    res.json({ success: true, summary });
});

app.post('/doctor/alternate-hospitals', (req, res) => {
    const {
        unavailable_doctor_name: unavailableDoctor,
        patient_location: patientLocation,
        required_specialization: specialization,
        distance_limit: distanceLimit,
    } = req.body;

    if (!patientLocation || !specialization) {
        return res.status(400).json({ success: false, message: 'patient_location and required_specialization are required' });
    }

    const normalizedSpecialization = specialization.toLowerCase().trim();
    const maxDistance = Number(distanceLimit) > 0 ? Number(distanceLimit) : 10;

    const rankedSuggestions = hospitalDirectory
        .map((hospital) => {
            const matchingDoctor = hospital.doctors.find((doc) =>
                doc.specialization.toLowerCase().includes(normalizedSpecialization)
            ) || hospital.doctors[0];

            if (!matchingDoctor) {
                return null;
            }

            return {
                id: `${hospital.id}-${matchingDoctor.name.replace(/\s+/g, '-').toLowerCase()}`,
                hospital_name: hospital.hospital_name,
                address: hospital.address,
                available_doctor: matchingDoctor.name,
                specialization: matchingDoctor.specialization,
                distance_km: Number(hospital.distanceKm.toFixed(1)),
                next_available_time: matchingDoctor.nextAvailable,
            };
        })
        .filter(Boolean)
        .filter((item) => item.distance_km <= maxDistance)
        .sort((a, b) => a.distance_km - b.distance_km)
        .slice(0, 3);

    console.log(
        `Alternate hospital recommendations requested for ${unavailableDoctor || 'doctor'} (${specialization}) at ${patientLocation}. Returned ${rankedSuggestions.length} options.`
    );

    res.json({ success: true, suggestions: rankedSuggestions });
});

app.post('/appointments/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, patientMessage, appointment: appointmentPayload } = req.body;

    console.log('🗂️ Appointment status update received:', {
        appointmentId: id,
        status,
        patientMessage,
        appointmentPayload
    });

    // TODO: Persist the status change to the database or trigger downstream workflows.

    res.status(200).json({
        success: true,
        message: 'Appointment status update recorded (placeholder)',
        appointmentId: id,
        status,
    });
});

// --- Generate and forward patient-facing decision messages ---
app.post('/decisions/notify-patient', (req, res) => {
    try {
        const { decision, doctor_name: doctorName, appointment_time: appointmentTime, notes } = req.body;

        const payload = generateDecisionMessage({
            decision,
            doctorName,
            appointmentTime,
            notes,
        });

        console.log('📨 Simulated dispatch to patient dashboard:', {
            decision,
            doctorName,
            appointmentTime,
            notes,
            payload,
        });

        // TODO: Replace console log with actual push to notification service / dashboard message queue

        res.status(200).json({
            success: true,
            ...payload,
        });
    } catch (error) {
        console.error('❌ Failed to generate decision message:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Unable to generate decision message.',
        });
    }
});

// --- Root route ---
app.get('/', (req, res) => {
    res.send('Hospital Management System API is running!');
});

// --- Health check endpoint ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// --- Start the server ---
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Hospital Management System Server is running on http://localhost:${port}`);
    console.log(`📧 Email notifications are configured and ready!`);
    console.log(`🔒 OTP verification is enabled!`);
});

server.on('error', (err) => {
    console.error('❌ Server error:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`);
        process.exit(1);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

