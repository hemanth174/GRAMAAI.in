// server.js - Patient Portal Backend Server
import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import {
    initDatabase,
    listAppointments,
    createAppointmentRecord,
    updateAppointmentRecord,
    deleteAppointmentRecord
} from './database.js';

const app = express();
const PORT = 5001; // Different port from Hospital backend (5000)

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Initialize database on server start
await initDatabase();
console.log('🚀 Patient Portal Database initialized');

// Store SSE clients for real-time updates
const appointmentStreamClients = new Set();

// ===== HELPER FUNCTIONS =====

/**
 * Broadcast appointment event to all connected SSE clients
 */
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

/**
 * Sync appointment to Hospital backend
 */
async function syncToHospitalBackend(appointment, method = 'POST') {
    try {
        const url = method === 'POST' 
            ? 'http://localhost:5000/api/appointments'
            : `http://localhost:5000/api/appointments/${appointment.id}`;
            
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: appointment.id,
                patient_name: appointment.patient_name,
                patient_email: appointment.patient_email,
                patient_phone: appointment.patient_phone,
                symptoms: appointment.symptoms,
                priority: appointment.priority,
                status: appointment.status || 'pending',
                requested_doctor: appointment.preferred_doctor || appointment.requested_doctor_name,
                appointment_time: appointment.appointment_time,
                created_date: appointment.created_at || appointment.created_date,
                documents: appointment.documents
            })
        });

        if (response.ok) {
            console.log(`✅ Appointment ${method === 'POST' ? 'synced' : 'updated'} to Hospital backend:`, appointment.id);
        } else {
            const error = await response.json();
            console.error('⚠️ Failed to sync to Hospital backend:', error.message);
        }
    } catch (error) {
        console.error('⚠️ Could not sync to Hospital backend (is it running?):', error.message);
    }
}

/**
 * Normalize incoming appointment data to match database schema
 */
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

/**
 * Validate required appointment fields
 */
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

// ===== API ENDPOINTS =====

/**
 * GET /api/appointments
 * Fetch all appointments with optional sorting
 */
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

/**
 * GET /api/appointments/stream
 * Server-Sent Events endpoint for real-time appointment updates
 */
app.get('/api/appointments/stream', async (req, res) => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send headers immediately
    if (res.flushHeaders) {
        res.flushHeaders();
    } else {
        res.write('\n');
    }

    // Tell client to retry every 10 seconds if disconnected
    res.write('retry: 10000\n\n');

    // Send periodic heartbeat to keep connection alive
    const heartbeat = setInterval(() => {
        res.write('event: ping\ndata:{}\n\n');
    }, 25000);

    // Register this client
    const client = { res, heartbeat };
    appointmentStreamClients.add(client);

    // Send initial snapshot of all appointments
    try {
        const snapshot = await listAppointments({ sort: '-created_date' });
        res.write(`event: init\ndata:${JSON.stringify(snapshot)}\n\n`);
    } catch (error) {
        console.error('❌ Failed to send initial appointment snapshot:', error);
        res.write('event: error\ndata:{"message":"Failed to load initial appointments"}\n\n');
    }

    // Clean up on disconnect
    req.on('close', () => {
        clearInterval(heartbeat);
        appointmentStreamClients.delete(client);
    });
});

/**
 * POST /api/appointments
 * Create a new appointment
 */
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
        
        // Broadcast to all connected clients
        broadcastAppointmentEvent('created', appointment);
        
        // Sync to Hospital backend
        await syncToHospitalBackend(appointment);
        
        console.log('✅ New appointment created:', appointment.id);
    } catch (error) {
        console.error('❌ Failed to create appointment:', error);
        res.status(500).json({ success: false, message: 'Failed to create appointment' });
    }
});

/**
 * PATCH /api/appointments/:id
 * Update an existing appointment
 */
app.patch('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const payload = normalizeAppointmentPayload(req.body);

    try {
        const updatedAppointment = await updateAppointmentRecord(id, payload);

        if (!updatedAppointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.status(200).json({ success: true, data: updatedAppointment });
        
        // Broadcast to all connected clients
        broadcastAppointmentEvent('updated', updatedAppointment);
        
        // Sync to Hospital backend
        await syncToHospitalBackend(updatedAppointment, 'PATCH');
        
        console.log('✅ Appointment updated:', id);
    } catch (error) {
        console.error('❌ Failed to update appointment:', error);
        res.status(500).json({ success: false, message: 'Failed to update appointment' });
    }
});

/**
 * DELETE /api/appointments/:id
 * Delete an appointment
 */
app.delete('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const removed = await deleteAppointmentRecord(id);

        if (!removed) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.status(200).json({ success: true });
        
        // Broadcast to all connected clients
        broadcastAppointmentEvent('deleted', { id });
        
        console.log('✅ Appointment deleted:', id);
    } catch (error) {
        console.error('❌ Failed to delete appointment:', error);
        res.status(500).json({ success: false, message: 'Failed to delete appointment' });
    }
});

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        service: 'Patient Portal Backend',
        timestamp: new Date().toISOString() 
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`🚀 Patient Portal Backend running on http://localhost:${PORT}`);
    console.log(`📡 Real-time updates available at http://localhost:${PORT}/api/appointments/stream`);
});
