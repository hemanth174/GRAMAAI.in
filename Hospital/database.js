// database.js - SQLite Database Setup for Hospital Management System
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

let db = null;

// Initialize database connection
export async function initDatabase() {
    if (db) return db;

    try {
        db = await open({
            filename: './hospital.db',
            driver: sqlite3.Database
        });

        console.log('📊 Database connected successfully');

        // Create hospitals table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS hospitals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hospital_name TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                full_name TEXT DEFAULT '',
                phone TEXT DEFAULT '',
                role TEXT DEFAULT 'admin',
                bio TEXT DEFAULT '',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Ensure newly added columns exist for legacy databases
        const columns = await db.all('PRAGMA table_info(hospitals)');
        const columnNames = columns.map((column) => column.name);

        const ensureColumn = async (name, definition) => {
            if (!columnNames.includes(name)) {
                await db.exec(`ALTER TABLE hospitals ADD COLUMN ${name} ${definition}`);
            }
        };

        await ensureColumn('full_name', "TEXT DEFAULT ''");
        await ensureColumn('phone', "TEXT DEFAULT ''");
        await ensureColumn('role', "TEXT DEFAULT 'admin'");
        await ensureColumn('bio', "TEXT DEFAULT ''");

        // Create OTP verification table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS otp_verifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                otp TEXT NOT NULL,
                expires_at DATETIME NOT NULL,
                verified BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create appointments table for patient-doctor scheduling
        await db.exec(`
            CREATE TABLE IF NOT EXISTS appointments (
                id TEXT PRIMARY KEY,
                patient_name TEXT NOT NULL,
                patient_email TEXT,
                symptoms TEXT,
                requested_doctor_id TEXT,
                requested_doctor_name TEXT,
                appointment_time TEXT,
                priority TEXT DEFAULT 'medium',
                status TEXT DEFAULT 'pending',
                document_urls TEXT DEFAULT '[]',
                uploaded_documents TEXT DEFAULT '[]',
                created_date TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        `);

        const appointmentColumns = await db.all('PRAGMA table_info(appointments)');
        const appointmentColumnNames = appointmentColumns.map((column) => column.name);

        const ensureAppointmentColumn = async (name, definition) => {
            if (!appointmentColumnNames.includes(name)) {
                await db.exec(`ALTER TABLE appointments ADD COLUMN ${name} ${definition}`);
            }
        };

        await ensureAppointmentColumn('priority', "TEXT DEFAULT 'medium'");
        await ensureAppointmentColumn('status', "TEXT DEFAULT 'pending'");
        await ensureAppointmentColumn('document_urls', "TEXT DEFAULT '[]'");
        await ensureAppointmentColumn('uploaded_documents', "TEXT DEFAULT '[]'");
        await ensureAppointmentColumn('created_date', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP');
        await ensureAppointmentColumn('updated_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP');

        console.log('✅ Database tables created successfully');
        return db;
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        throw error;
    }
}

// Get database instance
export async function getDatabase() {
    if (!db) {
        return await initDatabase();
    }
    return db;
}

// Register a new hospital
export async function registerHospital(hospitalName, email, password, {
    fullName = '',
    phone = '',
    role = 'admin',
    bio = ''
} = {}) {
    const database = await getDatabase();
    
    try {
        // Check if hospital name or email already exists
        const existingHospital = await database.get(
            'SELECT * FROM hospitals WHERE hospital_name = ? OR email = ?',
            [hospitalName, email]
        );

        if (existingHospital) {
            if (existingHospital.hospital_name === hospitalName) {
                throw new Error('Hospital name already exists');
            }
            if (existingHospital.email === email) {
                throw new Error('Email already registered');
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new hospital
        const result = await database.run(
            `INSERT INTO hospitals (hospital_name, email, password, full_name, phone, role, bio)
             VALUES (?, ?, ?, ?, ?, ?, ?)` ,
            [hospitalName, email, hashedPassword, fullName, phone, role, bio]
        );

        console.log(`✅ Hospital registered: ${hospitalName} (${email})`);
        
        return {
            id: result.lastID,
            hospitalName,
            email,
            fullName,
            phone,
            role,
            bio
        };
    } catch (error) {
        console.error('❌ Registration error:', error);
        throw error;
    }
}

// Verify hospital login credentials
export async function verifyHospitalCredentials(email, password) {
    const database = await getDatabase();
    
    try {
        const hospital = await database.get(
            'SELECT * FROM hospitals WHERE email = ?',
            [email]
        );

        if (!hospital) {
            return { success: false, message: 'Hospital not found' };
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, hospital.password);

        if (!isPasswordValid) {
            return { success: false, message: 'Invalid password' };
        }

        console.log(`✅ Login successful: ${hospital.hospital_name}`);
        
        return {
            success: true,
            hospital: {
                id: hospital.id,
                hospitalName: hospital.hospital_name,
                email: hospital.email,
                fullName: hospital.full_name,
                phone: hospital.phone,
                role: hospital.role || 'admin',
                bio: hospital.bio
            }
        };
    } catch (error) {
        console.error('❌ Login verification error:', error);
        throw error;
    }
}

// Get hospital by email
export async function getHospitalByEmail(email) {
    const database = await getDatabase();
    
    try {
        const hospital = await database.get(
            `SELECT id, hospital_name, email, full_name, phone, role, bio, created_at
             FROM hospitals WHERE email = ?`,
            [email]
        );

        return hospital;
    } catch (error) {
        console.error('❌ Error fetching hospital:', error);
        throw error;
    }
}

// Store OTP for verification
export async function storeOTP(email, otp, expiresAt) {
    const database = await getDatabase();
    
    try {
        // Delete old OTPs for this email
        await database.run('DELETE FROM otp_verifications WHERE email = ?', [email]);

        // Insert new OTP
        await database.run(
            'INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)',
            [email, otp, expiresAt]
        );

        console.log(`✅ OTP stored for: ${email}`);
    } catch (error) {
        console.error('❌ Error storing OTP:', error);
        throw error;
    }
}

// Verify OTP
export async function verifyOTP(email, otp) {
    const database = await getDatabase();
    
    try {
        const record = await database.get(
            'SELECT * FROM otp_verifications WHERE email = ? AND otp = ? AND verified = 0',
            [email, otp]
        );

        if (!record) {
            return { success: false, message: 'Invalid OTP' };
        }

        // Check if OTP is expired
        const now = new Date().toISOString();
        if (now > record.expires_at) {
            return { success: false, message: 'OTP expired' };
        }

        // Mark OTP as verified
        await database.run(
            'UPDATE otp_verifications SET verified = 1 WHERE id = ?',
            [record.id]
        );

        console.log(`✅ OTP verified for: ${email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ OTP verification error:', error);
        throw error;
    }
}

const APPOINTMENT_FIELDS = [
    'patient_name',
    'patient_email',
    'symptoms',
    'requested_doctor_id',
    'requested_doctor_name',
    'appointment_time',
    'priority',
    'status',
    'document_urls',
    'uploaded_documents',
    'created_date',
    'updated_at'
];

function normalizeAppointmentRow(row) {
    if (!row) {
        return null;
    }

    const safeParseArray = (value) => {
        if (!value) return [];
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('⚠️ Failed to parse appointment array column, returning empty array:', error);
            return [];
        }
    };

    return {
        id: row.id,
        patient_name: row.patient_name,
        patient_email: row.patient_email,
        symptoms: row.symptoms,
        requested_doctor_id: row.requested_doctor_id,
        requested_doctor_name: row.requested_doctor_name,
        requested_doctor: row.requested_doctor_name,
        appointment_time: row.appointment_time,
        priority: row.priority,
        status: row.status,
        document_urls: safeParseArray(row.document_urls),
        uploaded_documents: safeParseArray(row.uploaded_documents),
        created_date: row.created_date,
        updated_at: row.updated_at
    };
}

export async function listAppointments({ sort } = {}) {
    const database = await getDatabase();
    const orderBy = sort === '-created_date' ? 'created_date DESC' : 'created_date ASC';

    const rows = await database.all(`
        SELECT ${['id', ...APPOINTMENT_FIELDS].join(', ')}
        FROM appointments
        ORDER BY ${orderBy}
    `);

    return rows.map(normalizeAppointmentRow);
}

export async function getAppointmentById(id) {
    const database = await getDatabase();
    const row = await database.get(`
        SELECT ${['id', ...APPOINTMENT_FIELDS].join(', ')}
        FROM appointments
        WHERE id = ?
    `, [id]);

    return normalizeAppointmentRow(row);
}

export async function createAppointmentRecord(data) {
    const database = await getDatabase();
    const now = new Date().toISOString();
    const id = data.id || `apt-${randomUUID()}`;

    const toJSON = (value) => JSON.stringify(Array.isArray(value) ? value : []);

    await database.run(`
        INSERT INTO appointments (
            id,
            patient_name,
            patient_email,
            symptoms,
            requested_doctor_id,
            requested_doctor_name,
            appointment_time,
            priority,
            status,
            document_urls,
            uploaded_documents,
            created_date,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        id,
        data.patient_name,
        data.patient_email,
        data.symptoms,
        data.requested_doctor_id,
        data.requested_doctor_name || data.requested_doctor,
        data.appointment_time,
        data.priority || 'medium',
        data.status || 'pending',
        toJSON(data.document_urls || data.documents),
        toJSON(data.uploaded_documents || data.documents),
        data.created_date || now,
        now
    ]);

    return await getAppointmentById(id);
}

export async function updateAppointmentRecord(id, updates) {
    const database = await getDatabase();
    const now = new Date().toISOString();

    const fieldMap = {
        patient_name: 'patient_name',
        patient_email: 'patient_email',
        symptoms: 'symptoms',
        requested_doctor_id: 'requested_doctor_id',
        requested_doctor_name: 'requested_doctor_name',
        requested_doctor: 'requested_doctor_name',
        appointment_time: 'appointment_time',
        priority: 'priority',
        status: 'status',
        document_urls: 'document_urls',
        uploaded_documents: 'uploaded_documents',
        created_date: 'created_date'
    };

    const setClauses = [];
    const values = [];

    const toJSON = (value) => JSON.stringify(Array.isArray(value) ? value : []);

    Object.entries(updates || {}).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        const column = fieldMap[key];
        if (!column) {
            return;
        }

        if (column === 'document_urls' || column === 'uploaded_documents') {
            setClauses.push(`${column} = ?`);
            values.push(toJSON(value));
            return;
        }

        setClauses.push(`${column} = ?`);
        values.push(value);
    });

    if (setClauses.length === 0) {
        return await getAppointmentById(id);
    }

    setClauses.push('updated_at = ?');
    values.push(now);
    values.push(id);

    await database.run(`
        UPDATE appointments
        SET ${setClauses.join(', ')}
        WHERE id = ?
    `, values);

    return await getAppointmentById(id);
}

export async function deleteAppointmentRecord(id) {
    const database = await getDatabase();
    const result = await database.run('DELETE FROM appointments WHERE id = ?', [id]);
    return result.changes > 0;
}

export default {
    initDatabase,
    getDatabase,
    registerHospital,
    verifyHospitalCredentials,
    getHospitalByEmail,
    storeOTP,
    verifyOTP,
    listAppointments,
    getAppointmentById,
    createAppointmentRecord,
    updateAppointmentRecord,
    deleteAppointmentRecord
};
