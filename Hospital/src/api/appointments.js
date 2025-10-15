import { httpClient } from './httpClient';

const resource = '/api/appointments';

export const fetchAppointments = async (params = {}) => {
  const response = await httpClient.get(resource, { params });
  return response.data?.data ?? [];
};

export const fetchAppointmentById = async (id) => {
  const response = await httpClient.get(`${resource}/${id}`);
  return response.data?.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await httpClient.patch(`${resource}/${id}`, { status });
  return response.data?.data;
};

export const updateAppointment = async (id, payload) => {
  const response = await httpClient.patch(`${resource}/${id}`, payload);
  return response.data?.data;
};
