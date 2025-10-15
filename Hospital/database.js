// database.js - SQLite Database Setup for Hospital Management System
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import mysql from 'mysql2/promise';

let db = null;
let mysqlPool = null;
let mysqlReady = false;

const MYSQL_DEFAULT_CONFIG = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'hospital_portal',
};

async function initMySql() {
    if (mysqlReady && mysqlPool) {
        return mysqlPool;
    }

    try {
        mysqlPool = mysql.createPool({
            ...MYSQL_DEFAULT_CONFIG,
            waitForConnections: true,
            connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
        });

        await mysqlPool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id VARCHAR(64) PRIMARY KEY,
                patient_name VARCHAR(255) NOT NULL,
                patient_email VARCHAR(255),
                patient_phone VARCHAR(64),
                symptoms TEXT,
                requested_doctor_id VARCHAR(64),
                requested_doctor_name VARCHAR(255),
                appointment_date DATE,
                appointment_time VARCHAR(64),
                appointment_time_slot VARCHAR(32),
                priority VARCHAR(32) DEFAULT 'medium',
                status VARCHAR(32) DEFAULT 'pending',
                document_urls JSON NULL,
                uploaded_documents JSON NULL,
                created_date DATETIME NOT NULL,
                updated_at DATETIME NOT NULL
            )
        `);

        mysqlReady = true;
        console.log('✅ MySQL appointments table ready');
    } catch (error) {
        mysqlPool = null;
        mysqlReady = false;
        console.info('📊 Using SQLite database (MySQL not configured)');
    }

    return mysqlPool;
}

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
                patient_phone TEXT,
                symptoms TEXT,
                requested_doctor_id TEXT,
                requested_doctor_name TEXT,
                appointment_date TEXT,
                appointment_time TEXT,
                appointment_time_slot TEXT,
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
    await ensureAppointmentColumn('patient_phone', 'TEXT');
    await ensureAppointmentColumn('appointment_date', 'TEXT');
    await ensureAppointmentColumn('appointment_time_slot', 'TEXT');

        console.log('✅ Database tables created successfully');
        await initMySql();
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
    'patient_phone',
    'symptoms',
    'requested_doctor_id',
    'requested_doctor_name',
    'appointment_date',
    'appointment_time',
    'appointment_time_slot',
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

    const toArray = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (Buffer.isBuffer(value)) {
            const asString = value.toString('utf8');
            try {
                const parsed = JSON.parse(asString);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                console.warn('⚠️ Failed to parse appointment array buffer, returning empty array:', error);
                return [];
            }
        }
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                console.warn('⚠️ Failed to parse appointment array column, returning empty array:', error);
                return [];
            }
        }
        return [];
    };

    const toDateOnly = (value) => {
        if (!value) return null;
        if (value instanceof Date) {
            return value.toISOString().slice(0, 10);
        }
        if (typeof value === 'string') {
            const date = new Date(value);
            if (!Number.isNaN(date.getTime())) {
                return date.toISOString().slice(0, 10);
            }
        }
        return `${value}`;
    };

    const toIsoDateTime = (value) => {
        if (!value) return null;
        if (value instanceof Date) {
            return value.toISOString();
        }
        if (typeof value === 'string') {
            const date = new Date(value);
            if (!Number.isNaN(date.getTime())) {
                return date.toISOString();
            }
        }
        return `${value}`;
    };

    const appointmentDate = row.appointment_date || row.date || null;
    const appointmentTimeSlot = row.appointment_time_slot || row.time || null;
    const appointmentIso = toIsoDateTime(row.appointment_time || (appointmentDate && appointmentTimeSlot ? `${appointmentDate} ${appointmentTimeSlot}` : null));

    const created = toIsoDateTime(row.created_date || row.created_at || new Date());
    const updated = toIsoDateTime(row.updated_at || created);

    return {
        id: row.id,
        patient_name: row.patient_name,
        patientName: row.patient_name,
        patient_email: row.patient_email || row.email || null,
        email: row.patient_email || row.email || null,
        patient_phone: row.patient_phone || row.phone || null,
        phone: row.patient_phone || row.phone || null,
        symptoms: row.symptoms,
        requested_doctor_id: row.requested_doctor_id,
        requested_doctor_name: row.requested_doctor_name || row.doctor_name,
        requested_doctor: row.requested_doctor_name || row.doctor_name,
        doctor_name: row.requested_doctor_name || row.doctor_name,
        appointment_date: appointmentDate ? toDateOnly(appointmentDate) : null,
        appointment_time: appointmentIso,
        appointment_time_slot: appointmentTimeSlot,
        date: appointmentDate ? toDateOnly(appointmentDate) : null,
        time: appointmentTimeSlot,
        priority: row.priority || 'medium',
        status: row.status || 'pending',
        document_urls: toArray(row.document_urls),
        uploaded_documents: toArray(row.uploaded_documents),
        created_date: created,
        updated_at: updated
    };
}

function resolveAppointmentInput(input, defaultTimestamp) {
    const toArray = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        }
        return [];
    };

    const patientName = input.patient_name || input.patientName;
    const email = input.patient_email || input.email;
    const phone = input.patient_phone || input.phone;
    const symptoms = input.symptoms || input.symptoms_text || '';
    const requestedDoctorId = input.requested_doctor_id || input.requestedDoctorId || null;
    const requestedDoctorName = input.requested_doctor_name || input.requested_doctor || input.doctorName || null;

    const explicitDate = input.appointment_date || input.date || null;
    const explicitTime = input.appointment_time_slot || input.time || null;

    const computeIso = () => {
        if (input.appointment_time) {
            const parsed = new Date(input.appointment_time);
            return Number.isNaN(parsed.getTime()) ? `${input.appointment_time}` : parsed.toISOString();
        }
        if (explicitDate && explicitTime) {
            const parsed = new Date(`${explicitDate} ${explicitTime}`);
            return Number.isNaN(parsed.getTime()) ? `${explicitDate} ${explicitTime}` : parsed.toISOString();
        }
        if (explicitDate) {
            const parsed = new Date(explicitDate);
            return Number.isNaN(parsed.getTime()) ? `${explicitDate}` : parsed.toISOString();
        }
        return null;
    };

    const appointmentIso = computeIso();
    const deriveDate = () => {
        if (explicitDate) return explicitDate;
        if (!appointmentIso) return null;
        const parsed = new Date(appointmentIso);
        return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
    };

    const deriveTimeSlot = () => {
        if (explicitTime) return explicitTime;
        if (!appointmentIso) return null;
        const parsed = new Date(appointmentIso);
        if (Number.isNaN(parsed.getTime())) return null;
        return parsed.toISOString().slice(11, 16);
    };

    const created = input.created_date || defaultTimestamp;
    const priority = input.priority || input.priority_level || 'medium';
    const status = input.status || input.status_text || 'pending';

    return {
        id: input.id,
        patient_name: patientName,
        patient_email: email,
        patient_phone: phone,
        symptoms,
        requested_doctor_id: requestedDoctorId,
        requested_doctor_name: requestedDoctorName,
        appointment_date: deriveDate(),
        appointment_time_slot: deriveTimeSlot(),
        appointment_time: appointmentIso,
        priority,
        status,
        document_urls: toArray(input.document_urls || input.documents || []),
        uploaded_documents: toArray(input.uploaded_documents || input.documents || []),
        created_date: created,
        updated_at: defaultTimestamp,
    };
}

function buildAppointmentUpdate(updates, timestamp) {
    const resolved = resolveAppointmentInput({ ...updates }, timestamp);
    const columns = {};

    const assignIfProvided = (keys, column, value) => {
        if (keys.some((key) => Object.prototype.hasOwnProperty.call(updates, key))) {
            columns[column] = value;
        }
    };

    assignIfProvided(['patient_name', 'patientName'], 'patient_name', resolved.patient_name);
    assignIfProvided(['patient_email', 'email'], 'patient_email', resolved.patient_email);
    assignIfProvided(['patient_phone', 'phone'], 'patient_phone', resolved.patient_phone);
    assignIfProvided(['symptoms', 'symptoms_text'], 'symptoms', resolved.symptoms);
    assignIfProvided(['requested_doctor_id', 'requestedDoctorId'], 'requested_doctor_id', resolved.requested_doctor_id);
    assignIfProvided(['requested_doctor_name', 'requested_doctor', 'doctorName'], 'requested_doctor_name', resolved.requested_doctor_name);
    assignIfProvided(['appointment_date', 'date'], 'appointment_date', resolved.appointment_date);
    assignIfProvided(['appointment_time_slot', 'time'], 'appointment_time_slot', resolved.appointment_time_slot);
    assignIfProvided(['appointment_time'], 'appointment_time', resolved.appointment_time);
    assignIfProvided(['priority', 'priority_level'], 'priority', resolved.priority);
    assignIfProvided(['status', 'status_text'], 'status', resolved.status);
    assignIfProvided(['document_urls', 'documents'], 'document_urls', resolved.document_urls);
    assignIfProvided(['uploaded_documents'], 'uploaded_documents', resolved.uploaded_documents);

    columns.updated_at = timestamp;
    return columns;
}

export async function listAppointments({ sort } = {}) {
    if (mysqlReady && mysqlPool) {
        const orderBy = sort === '-created_date' ? 'created_date DESC' : 'created_date ASC';
        const [rows] = await mysqlPool.query(`
            SELECT ${['id', ...APPOINTMENT_FIELDS].join(', ')}
            FROM appointments
            ORDER BY ${orderBy}
        `);
        return rows.map((row) => normalizeAppointmentRow(row));
    }

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
    if (mysqlReady && mysqlPool) {
        const [rows] = await mysqlPool.query(`
            SELECT ${['id', ...APPOINTMENT_FIELDS].join(', ')}
            FROM appointments
            WHERE id = ?
            LIMIT 1
        `, [id]);
        return normalizeAppointmentRow(rows[0]);
    }

    const database = await getDatabase();
    const row = await database.get(`
        SELECT ${['id', ...APPOINTMENT_FIELDS].join(', ')}
        FROM appointments
        WHERE id = ?
    `, [id]);

    return normalizeAppointmentRow(row);
}

export async function createAppointmentRecord(data) {
    const now = new Date();
    const nowIso = now.toISOString();
    const id = data.id || `apt-${randomUUID()}`;

    const resolved = resolveAppointmentInput({ ...data, id }, nowIso);

    if (mysqlReady && mysqlPool) {
        const documentsJson = JSON.stringify(resolved.document_urls || []);
        const uploadedJson = JSON.stringify(resolved.uploaded_documents || []);

        await mysqlPool.execute(`
            INSERT INTO appointments (
                id,
                patient_name,
                patient_email,
                patient_phone,
                symptoms,
                requested_doctor_id,
                requested_doctor_name,
                appointment_date,
                appointment_time,
                appointment_time_slot,
                priority,
                status,
                document_urls,
                uploaded_documents,
                created_date,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), ?, ?)
        `, [
            resolved.id,
            resolved.patient_name,
            resolved.patient_email,
            resolved.patient_phone,
            resolved.symptoms,
            resolved.requested_doctor_id,
            resolved.requested_doctor_name,
            resolved.appointment_date,
            resolved.appointment_time,
            resolved.appointment_time_slot,
            resolved.priority,
            resolved.status,
            documentsJson,
            uploadedJson,
            resolved.created_date,
            resolved.updated_at
        ]);

        return await getAppointmentById(resolved.id);
    }

    const database = await getDatabase();
    const toJSON = (value) => JSON.stringify(Array.isArray(value) ? value : []);

    await database.run(`
        INSERT INTO appointments (
            id,
            patient_name,
            patient_email,
            patient_phone,
            symptoms,
            requested_doctor_id,
            requested_doctor_name,
            appointment_date,
            appointment_time,
            appointment_time_slot,
            priority,
            status,
            document_urls,
            uploaded_documents,
            created_date,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        resolved.id,
        resolved.patient_name,
        resolved.patient_email,
        resolved.patient_phone,
        resolved.symptoms,
        resolved.requested_doctor_id,
        resolved.requested_doctor_name,
        resolved.appointment_date,
        resolved.appointment_time,
        resolved.appointment_time_slot,
        resolved.priority,
        resolved.status,
        toJSON(resolved.document_urls),
        toJSON(resolved.uploaded_documents),
        resolved.created_date,
        resolved.updated_at
    ]);

    return await getAppointmentById(resolved.id);
}

export async function updateAppointmentRecord(id, updates) {
    const now = new Date().toISOString();
    const columnUpdates = buildAppointmentUpdate(updates, now);

    if (Object.keys(columnUpdates).length <= 1) {
        return await getAppointmentById(id);
    }

    if (mysqlReady && mysqlPool) {
        const setFragments = [];
        const values = [];

        for (const [column, value] of Object.entries(columnUpdates)) {
            if (column === 'document_urls' || column === 'uploaded_documents') {
                setFragments.push(`${column} = CAST(? AS JSON)`);
                values.push(JSON.stringify(value));
            } else {
                setFragments.push(`${column} = ?`);
                values.push(value);
            }
        }

        values.push(id);

        await mysqlPool.execute(`
            UPDATE appointments
            SET ${setFragments.join(', ')}
            WHERE id = ?
        `, values);

        return await getAppointmentById(id);
    }

    const database = await getDatabase();
    const setClauses = [];
    const values = [];

    Object.entries(columnUpdates).forEach(([column, value]) => {
        if (column === 'document_urls' || column === 'uploaded_documents') {
            setClauses.push(`${column} = ?`);
            values.push(JSON.stringify(value));
        } else {
            setClauses.push(`${column} = ?`);
            values.push(value);
        }
    });

    values.push(id);

    await database.run(`
        UPDATE appointments
        SET ${setClauses.join(', ')}
        WHERE id = ?
    `, values);

    return await getAppointmentById(id);
}

export async function deleteAppointmentRecord(id) {
    if (mysqlReady && mysqlPool) {
        const [result] = await mysqlPool.execute('DELETE FROM appointments WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

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
