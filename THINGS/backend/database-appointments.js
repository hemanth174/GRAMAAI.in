// Backend Database Integration for Appointments
// Copy this code to your Node.js/Express backend database.js file

// Import required modules:
// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';
// import { randomUUID } from 'crypto';

// ===== APPOINTMENTS TABLE SETUP =====

async function createAppointmentsTable(db) {
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

  // Ensure all columns exist (for legacy databases)
  const columns = await db.all('PRAGMA table_info(appointments)');
  const columnNames = columns.map((column) => column.name);

  const ensureColumn = async (name, definition) => {
    if (!columnNames.includes(name)) {
      await db.exec(`ALTER TABLE appointments ADD COLUMN ${name} ${definition}`);
    }
  };

  await ensureColumn('priority', "TEXT DEFAULT 'medium'");
  await ensureColumn('status', "TEXT DEFAULT 'pending'");
  await ensureColumn('document_urls', "TEXT DEFAULT '[]'");
  await ensureColumn('uploaded_documents', "TEXT DEFAULT '[]'");
  await ensureColumn('created_date', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP');
  await ensureColumn('updated_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP');
}

// ===== HELPER FUNCTIONS =====

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

// ===== CRUD OPERATIONS =====

export async function listAppointments({ sort } = {}) {
  const database = await getDatabase(); // Your DB connection
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
