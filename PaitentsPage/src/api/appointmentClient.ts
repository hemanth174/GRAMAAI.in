// API client for appointment management
// Connects patient portal to the main hospital backend (MySQL persistence layer)

import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env?.VITE_HOSPITAL_API_URL ?? 'http://localhost:5000';

export interface AppointmentData {
  patientName: string;
  email: string;
  phone: string;
  symptoms: string;
  doctorName: string;
  date: string;
  time: string;
  status?: 'pending' | 'accepted' | 'rejected';
  priority?: string;
  requestedDoctorId?: string;
}

export interface AppointmentRecord {
  id: string;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string | null;
  symptoms: string | null;
  requested_doctor_id?: string | null;
  requested_doctor_name: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
  appointment_time_slot: string | null;
  priority: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_date: string;
  updated_at: string;
}

class AppointmentClient {
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;
  private eventSource: EventSource | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners: Map<'created' | 'updated' | 'deleted', Set<(appointment: AppointmentRecord) => void>> = new Map();

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createAppointment(data: AppointmentData): Promise<AppointmentRecord> {
    const normalizedPayload = this.buildPayload(data);

    const response = await this.client.post('/api/appointments', normalizedPayload);
    return response.data.data as AppointmentRecord;
  }

  async getAppointments(sort: string = '-created_date'): Promise<AppointmentRecord[]> {
    const response = await this.client.get('/api/appointments', { params: { sort } });
    return (response.data?.data ?? []) as AppointmentRecord[];
  }

  async updateAppointment(id: string, updates: Partial<AppointmentData>): Promise<AppointmentRecord> {
    const payload = this.buildPayload({
      patientName: updates.patientName ?? '',
      email: updates.email ?? '',
      phone: updates.phone ?? '',
      symptoms: updates.symptoms ?? '',
      doctorName: updates.doctorName ?? '',
      date: updates.date ?? '',
      time: updates.time ?? '',
      status: updates.status,
      priority: updates.priority,
      requestedDoctorId: updates.requestedDoctorId,
    }, true);

    const response = await this.client.patch(`/api/appointments/${id}`, payload);
    return response.data.data as AppointmentRecord;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    await this.client.delete(`/api/appointments/${id}`);
    return true;
  }

  connectToUpdates(onUpdate?: (appointment: AppointmentRecord) => void): void {
    if (typeof EventSource === 'undefined') {
      console.warn('EventSource not supported in this browser');
      return;
    }

    this.disconnect();

    try {
      const source = new EventSource(`${this.baseUrl}/api/appointments/stream`);
      this.eventSource = source;

      source.addEventListener('init', (event) => {
        const appointments = JSON.parse(event.data) as AppointmentRecord[];
        if (appointments.length) {
          appointments.forEach((apt) => this.notifyListeners('updated', apt));
        }
      });

      source.addEventListener('created', (event) => {
        const appointment = JSON.parse(event.data) as AppointmentRecord;
        onUpdate?.(appointment);
        this.notifyListeners('created', appointment);
      });

      source.addEventListener('updated', (event) => {
        const appointment = JSON.parse(event.data) as AppointmentRecord;
        onUpdate?.(appointment);
        this.notifyListeners('updated', appointment);
      });

      source.addEventListener('deleted', (event) => {
        const appointment = JSON.parse(event.data) as AppointmentRecord;
        this.notifyListeners('deleted', appointment);
      });

      source.onerror = () => {
        console.warn('Appointment stream disconnected, attempting to reconnect...');
        source.close();
        this.eventSource = null;

        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connectToUpdates(onUpdate);
          }, 5000);
        }
      };
    } catch (error) {
      console.error('Failed to establish appointment stream:', error);
    }
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  addEventListener(event: 'created' | 'updated' | 'deleted', callback: (appointment: AppointmentRecord) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  removeEventListener(event: 'created' | 'updated' | 'deleted', callback: (appointment: AppointmentRecord) => void): void {
    const collection = this.listeners.get(event);
    collection?.delete(callback);
  }

  private notifyListeners(event: 'created' | 'updated' | 'deleted', appointment: AppointmentRecord): void {
    const collection = this.listeners.get(event);
    collection?.forEach((callback) => {
      try {
        callback(appointment);
      } catch (error) {
        console.error('Error in appointment listener:', error);
      }
    });
  }

  private buildPayload(data: AppointmentData, isPartial = false) {
    const trimmed = (value?: string) => value?.trim() || undefined;

    const isoTimestamp = data.date && data.time
      ? this.toIsoDateTime(data.date, data.time)
      : undefined;

    const payload: Record<string, unknown> = {
      patientName: trimmed(data.patientName),
      email: trimmed(data.email),
      phone: trimmed(data.phone),
      symptoms: trimmed(data.symptoms),
      doctorName: trimmed(data.doctorName),
      date: trimmed(data.date),
      time: trimmed(data.time),
      status: data.status ?? 'pending',
      priority: data.priority ?? 'medium',
      requestedDoctorId: trimmed(data.requestedDoctorId),
      // Backwards compatibility payload (backend normalizer handles both shapes)
      patient_name: trimmed(data.patientName),
      patient_email: trimmed(data.email),
      patient_phone: trimmed(data.phone),
      symptoms_text: trimmed(data.symptoms),
      requested_doctor_name: trimmed(data.doctorName),
      requested_doctor_id: trimmed(data.requestedDoctorId),
      appointment_date: trimmed(data.date),
      appointment_time_slot: trimmed(data.time),
      appointment_time: isoTimestamp,
      status_text: data.status ?? 'pending',
      priority_level: data.priority ?? 'medium',
    };

    if (isPartial) {
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });
    }

    return payload;
  }

  private toIsoDateTime(date: string, time: string): string | undefined {
    try {
      const parsed = new Date(`${date} ${time}`);
      if (Number.isNaN(parsed.getTime())) {
        return undefined;
      }
      return parsed.toISOString();
    } catch (error) {
      console.error('Failed to parse appointment datetime', { date, time, error });
      return undefined;
    }
  }
}

export const appointmentClient = new AppointmentClient();

export async function checkBackendConnection(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.status === 200;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
}
