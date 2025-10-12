class Base44Client {
  constructor() {
    this.baseUrl = this.#resolveBaseUrl();
    this.storageEnabled = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    this.keys = {
      appointments: 'base44.appointments',
      doctors: 'base44.doctors',
      patients: 'base44.patients',
    };
    this.appointmentsCache = this.#readCollection(this.keys.appointments);
    this.appointmentStream = null;
    this.appointmentReconnectTimer = null;

    this.entities = {
      Appointment: {
        list: async (options = '') => this.#listAppointments(options),
        create: async (data) => this.#createAppointment(data),
        update: async (id, data) => this.#updateAppointment(id, data),
        delete: async (id) => this.#deleteAppointment(id),
      },
      Doctor: {
        list: async () => this.#readCollection(this.keys.doctors),
        create: async (data) => {
          const doctors = this.#readCollection(this.keys.doctors);
          const newDoctor = {
            id: this.#generateId('doc'),
            availability_status: 'available',
            ...data,
          };
          doctors.push(newDoctor);
          this.#writeCollection(this.keys.doctors, doctors);
          return newDoctor;
        },
        update: async (id, data) => {
          const doctors = this.#readCollection(this.keys.doctors);
          const updated = doctors.map((doctor) => (doctor.id === id ? { ...doctor, ...data } : doctor));
          this.#writeCollection(this.keys.doctors, updated);
          return updated.find((doctor) => doctor.id === id);
        },
        delete: async (id) => {
          const doctors = this.#readCollection(this.keys.doctors);
          const remaining = doctors.filter((doctor) => doctor.id !== id);
          this.#writeCollection(this.keys.doctors, remaining);
          return { success: true };
        },
      },
      Patient: {
        list: async () => this.#readCollection(this.keys.patients),
        create: async (data) => {
          const patients = this.#readCollection(this.keys.patients);
          const newPatient = {
            id: this.#generateId('pat'),
            created_at: new Date().toISOString(),
            ...data,
          };
          patients.unshift(newPatient);
          this.#writeCollection(this.keys.patients, patients);
          return newPatient;
        },
        update: async (id, data) => {
          const patients = this.#readCollection(this.keys.patients);
          const updated = patients.map((patient) => (patient.id === id ? { ...patient, ...data } : patient));
          this.#writeCollection(this.keys.patients, updated);
          return updated.find((patient) => patient.id === id);
        },
        delete: async (id) => {
          const patients = this.#readCollection(this.keys.patients);
          const remaining = patients.filter((patient) => patient.id !== id);
          this.#writeCollection(this.keys.patients, remaining);
          return { success: true };
        },
      },
    };

    this.auth = {
      me: async () => {
        if (typeof window !== 'undefined') {
          const storedUser = JSON.parse(window.localStorage.getItem('user') || '{}');
          if (storedUser && storedUser.hospitalName) {
            return {
              id: storedUser.id,
              full_name: storedUser.full_name || storedUser.fullName,
              hospital_name: storedUser.hospital_name || storedUser.hospitalName,
              email: storedUser.email,
              phone: storedUser.phone,
              role: storedUser.role,
              bio: storedUser.bio,
            };
          }
        }
        return null;
      },
      login: async () => ({ token: 'session-token', user: await this.auth.me() }),
      logout: async () => ({ success: true }),
    };

    if (typeof window !== 'undefined') {
      this.#connectAppointmentStream();
    }
  }

  async #listAppointments(options = '') {
    const sort = typeof options === 'string' ? options : options?.sort;
    try {
      const query = sort ? `?sort=${encodeURIComponent(sort)}` : '';
      const response = await this.#request(`/api/appointments${query}`);
      const data = Array.isArray(response) ? response : response?.data || [];
      const normalized = data.map((appointment) => this.#normalizeAppointment(appointment));
      this.appointmentsCache = normalized;
      this.#persistAppointments();
      return [...this.appointmentsCache];
    } catch (error) {
      console.error('Failed to load appointments from API, falling back to cache:', error);
      if (sort === '-created_date') {
        return [...this.appointmentsCache].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      }
      return [...this.appointmentsCache];
    }
  }

  async #createAppointment(data) {
    const payload = {
      ...data,
      requested_doctor_name: data.requested_doctor_name || data.requested_doctor,
      requested_doctor: undefined,
    };

    try {
      const response = await this.#request('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const appointment = this.#normalizeAppointment(response?.data || response);
      this.#mergeAppointment(appointment);
      return appointment;
    } catch (error) {
      console.error('Failed to create appointment via API, using local fallback:', error);
      const timestamp = new Date().toISOString();
      const appointment = this.#normalizeAppointment({
        id: this.#generateId('apt'),
        ...data,
        requested_doctor: data.requested_doctor || data.requested_doctor_name,
        created_date: timestamp,
        updated_at: timestamp,
      });
      this.#mergeAppointment(appointment);
      return appointment;
    }
  }

  async #updateAppointment(id, data) {
    const payload = {
      ...data,
      requested_doctor_name: data.requested_doctor_name || data.requested_doctor,
      requested_doctor: undefined,
    };

    try {
      const response = await this.#request(`/api/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const appointment = this.#normalizeAppointment(response?.data || response);
      this.#mergeAppointment(appointment);
      return appointment;
    } catch (error) {
      console.error('Failed to update appointment via API, applying local update:', error);
      const updated = this.appointmentsCache.map((appointment) =>
        appointment.id === id
          ? this.#normalizeAppointment({ ...appointment, ...data, updated_at: new Date().toISOString() })
          : appointment
      );
      this.appointmentsCache = updated;
      this.#persistAppointments();
      return this.appointmentsCache.find((appointment) => appointment.id === id);
    }
  }

  async #deleteAppointment(id) {
    try {
      await this.#request(`/api/appointments/${id}`, { method: 'DELETE' });
      this.#removeAppointment(id);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete appointment via API, removing locally:', error);
      this.#removeAppointment(id);
      return { success: false, error };
    }
  }

  #resolveBaseUrl() {
    if (typeof window !== 'undefined') {
      const fromWindow = window.__BASE44_API_BASE_URL__;
      if (fromWindow) {
        return fromWindow.replace(/\/$/, '');
      }
      if (import.meta?.env?.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
      }
    }
    if (typeof process !== 'undefined' && process.env?.BASE44_API_BASE_URL) {
      return process.env.BASE44_API_BASE_URL.replace(/\/$/, '');
    }
    return 'http://localhost:5000';
  }

  async #request(path, options = {}) {
    const url = this.#buildUrl(path);
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: options.body,
    };

    if (config.method === 'GET' || config.method === 'HEAD') {
      delete config.body;
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await response.json() : null;

      if (!response.ok) {
        const error = new Error(payload?.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.body = payload;
        throw error;
      }

      return payload;
    } catch (error) {
      if (error.name === 'TypeError') {
        console.error('Network error while calling API:', error);
      }
      throw error;
    }
  }

  #buildUrl(path) {
    if (!path) {
      return this.baseUrl;
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (path.startsWith('/')) {
      return `${this.baseUrl}${path}`;
    }
    return `${this.baseUrl}/${path}`;
  }

  #connectAppointmentStream() {
    if (typeof EventSource === 'undefined') {
      console.warn('EventSource not supported in this environment; real-time updates disabled.');
      return;
    }

    if (this.appointmentStream) {
      this.appointmentStream.close();
      this.appointmentStream = null;
    }

    if (this.appointmentReconnectTimer) {
      clearTimeout(this.appointmentReconnectTimer);
      this.appointmentReconnectTimer = null;
    }

    try {
      const streamUrl = this.#buildUrl('/api/appointments/stream');
      const source = new EventSource(streamUrl);
      this.appointmentStream = source;

      const safeParse = (raw, fallback = null) => {
        if (!raw) return fallback;
        try {
          return JSON.parse(raw);
        } catch (error) {
          console.error('Failed to parse appointment stream payload:', error, raw);
          return fallback;
        }
      };

      source.addEventListener('init', (event) => {
        const data = safeParse(event.data, []);
        if (Array.isArray(data)) {
          this.#replaceAppointments(data.map((item) => this.#normalizeAppointment(item)));
          console.log('✅ Appointments initialized from server');
        }
      });

      source.addEventListener('created', (event) => {
        const data = safeParse(event.data);
        if (data) {
          const appointment = this.#normalizeAppointment(data);
          this.#mergeAppointment(appointment);
          
          // Show toast notification for new appointment
          if (typeof window !== 'undefined' && window.toast) {
            window.toast.success(
              `🔔 New Appointment!\n${appointment.patient_name} has booked with ${appointment.requested_doctor || 'a doctor'}`,
              { duration: 8000 }
            );
          }
          
          // Play notification sound (optional)
          this.#playNotificationSound();
          
          console.log('🔔 New appointment created:', appointment.patient_name);
        }
      });

      source.addEventListener('updated', (event) => {
        const data = safeParse(event.data);
        if (data) {
          this.#mergeAppointment(this.#normalizeAppointment(data));
          console.log('📝 Appointment updated:', data.id);
        }
      });

      source.addEventListener('deleted', (event) => {
        const data = safeParse(event.data);
        if (data?.id) {
          this.#removeAppointment(data.id);
          console.log('🗑️ Appointment deleted:', data.id);
        }
      });

      source.onerror = () => {
        console.warn('Appointment stream disconnected. Attempting to reconnect...');
        source.close();
        this.appointmentStream = null;
        if (!this.appointmentReconnectTimer) {
          this.appointmentReconnectTimer = setTimeout(() => {
            this.appointmentReconnectTimer = null;
            this.#connectAppointmentStream();
          }, 5000);
        }
      };
    } catch (error) {
      console.error('Failed to establish appointment stream:', error);
    }
  }

  #playNotificationSound() {
    try {
      // Create a simple notification beep using Web Audio API
      if (typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }

  #normalizeAppointment(appointment = {}) {
    const safeArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return [];
    };

    const created = appointment.created_date || appointment.created_at || new Date().toISOString();
    const updated = appointment.updated_at || created;

    return {
      id: appointment.id || this.#generateId('apt'),
      patient_name: appointment.patient_name || '',
      patient_email: appointment.patient_email || appointment.email,
      symptoms: appointment.symptoms || appointment.reason,
      requested_doctor_id: appointment.requested_doctor_id || appointment.doctor_id,
      requested_doctor_name: appointment.requested_doctor_name || appointment.requested_doctor,
      requested_doctor: appointment.requested_doctor_name || appointment.requested_doctor,
      appointment_time: appointment.appointment_time || appointment.requested_time,
      priority: appointment.priority || 'medium',
      status: appointment.status || 'pending',
      document_urls: safeArray(appointment.document_urls),
      uploaded_documents: safeArray(appointment.uploaded_documents),
      created_date: created,
      updated_at: updated,
    };
  }

  #replaceAppointments(list) {
    this.appointmentsCache = Array.isArray(list) ? list : [];
    this.#persistAppointments();
  }

  #mergeAppointment(appointment) {
    if (!appointment || !appointment.id) {
      return;
    }
    const index = this.appointmentsCache.findIndex((item) => item.id === appointment.id);
    if (index >= 0) {
      this.appointmentsCache[index] = { ...this.appointmentsCache[index], ...appointment };
    } else {
      this.appointmentsCache.unshift(appointment);
    }
    this.#persistAppointments();
  }

  #removeAppointment(id) {
    this.appointmentsCache = this.appointmentsCache.filter((appointment) => appointment.id !== id);
    this.#persistAppointments();
  }

  #persistAppointments() {
    this.#writeCollection(this.keys.appointments, this.appointmentsCache);
    this.#syncReactQueryCache();
  }

  #syncReactQueryCache() {
    if (typeof window === 'undefined') {
      return;
    }
    const queryClient = window.__BASE44_QUERY_CLIENT__;
    if (!queryClient?.setQueryData) {
      return;
    }
    try {
      queryClient.setQueryData(['appointments'], () => [...this.appointmentsCache]);
    } catch (error) {
      console.error('Failed to sync appointments to react-query cache:', error);
    }
  }

  #readCollection(key) {
    if (!this.storageEnabled) return [];
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error(`Failed to read collection ${key}:`, error);
      return [];
    }
  }

  #writeCollection(key, data) {
    if (!this.storageEnabled) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to write collection ${key}:`, error);
    }
  }

  #generateId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export const base44 = new Base44Client();
