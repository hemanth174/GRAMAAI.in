
import type { RouteObject } from 'react-router-dom';
import HomePage from '../pages/home/page';
import LandingPage from '../pages/landing/page';
import DoctorDashboard from '../pages/doctor/dashboard/page';
import AppointmentDetailsPage from '../pages/doctor/appointment-details/page';
import PatientLoginPage from '../pages/patient-login/page';
import PatientDashboardPage from '../pages/patient-dashboard/page';
import DoctorDashboardPage from '../pages/doctor-dashboard/page';
import DoctorsPage from '../pages/doctors/page';
import NotFoundPage from '../pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/landing',
    element: <LandingPage />
  },
  {
    path: '/patient-login',
    element: <PatientLoginPage />
  },
  {
    path: '/doctor-dashboard',
    element: <DoctorDashboard />
  },
  {
    path: '/appointment-details/:appointmentId',
    element: <AppointmentDetailsPage />
  },
  {
    path: '/patient-dashboard',
    element: <PatientDashboardPage />
  },
  {
    path: '/doctor-dashboard-old',
    element: <DoctorDashboardPage />
  },
  {
    path: '/doctors',
    element: <DoctorsPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;
