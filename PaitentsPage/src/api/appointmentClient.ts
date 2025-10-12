// API client for appointment management
// Connects patient portal to the patient portal backend

const API_BASE_URL = 'http://localhost:5001';

export interface AppointmentData {
  patient_name: string;
  patient_email?: string;
  symptoms: string;
  requested_doctor_id?: string;
  requested_doctor_name: string;
  appointment_time: string;
  priority?: string;
  status?: string;
  document_urls?: string[];
  uploaded_documents?: string[];
}

export interface Appointment extends AppointmentData {
  id: string;
  created_date: string;
  updated_at: string;
}

class AppointmentClient {
  private baseUrl: string;
  private eventSource: EventSource | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners: Map<string, Set<(appointment: Appointment) => void>> = new Map();

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Create a new appointment
   */
  async createAppointment(data: AppointmentData): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseUrl}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create appointment');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Get all appointments
   */
  async getAppointments(sort: string = '-created_date'): Promise<Appointment[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/appointments?sort=${encodeURIComponent(sort)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }

  /**
   * Update an appointment
   */
  async updateAppointment(id: string, updates: Partial<AppointmentData>): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseUrl}/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update appointment');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  /**
   * Delete an appointment
   */
  async deleteAppointment(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }
  }

  /**
   * Connect to real-time appointment updates via Server-Sent Events
   */
  connectToUpdates(onUpdate?: (appointment: Appointment) => void): void {
    if (typeof EventSource === 'undefined') {
      console.warn('EventSource not supported in this browser');
      return;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    try {
      const source = new EventSource(`${this.baseUrl}/api/appointments/stream`);
      this.eventSource = source;

      source.addEventListener('init', (event) => {
        const appointments = JSON.parse(event.data);
        console.log('Initial appointments loaded:', appointments.length);
      });

      source.addEventListener('created', (event) => {
        const appointment = JSON.parse(event.data);
        console.log('New appointment created:', appointment);
        if (onUpdate) {
          onUpdate(appointment);
        }
        this.notifyListeners('created', appointment);
      });

      source.addEventListener('updated', (event) => {
        const appointment = JSON.parse(event.data);
        console.log('Appointment updated:', appointment);
        if (onUpdate) {
          onUpdate(appointment);
        }
        this.notifyListeners('updated', appointment);
      });

      source.addEventListener('deleted', (event) => {
        const { id } = JSON.parse(event.data);
        console.log('Appointment deleted:', id);
        this.notifyListeners('deleted', { id } as any);
      });

      source.onerror = () => {
        console.warn('Appointment stream disconnected, reconnecting...');
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

  /**
   * Disconnect from real-time updates
   */
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

  /**
   * Add event listener for appointment changes
   */
  addEventListener(event: 'created' | 'updated' | 'deleted', callback: (appointment: Appointment) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event: 'created' | 'updated' | 'deleted', callback: (appointment: Appointment) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  /**
   * Notify all listeners of an event
   */
  private notifyListeners(event: 'created' | 'updated' | 'deleted', appointment: Appointment): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(appointment);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }
}

// Export singleton instance
export const appointmentClient = new AppointmentClient();

// Export helper to check backend connection
export async function checkBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
}
