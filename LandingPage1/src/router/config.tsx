
import { RouteObject } from 'react-router-dom';
import HomePage from '../pages/home/page';
import LandingPage from '../pages/landing/page';
import PatientLoginPage from '../pages/login/patient/page';
import DoctorLoginPage from '../pages/login/doctor/page';
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
    path: '/login/patient',
    element: <PatientLoginPage />
  },
  {
    path: '/login/doctor',
    element: <DoctorLoginPage />
  },
  {
    path: '/patient-dashboard',
    element: <PatientDashboardPage />
  },
  {
    path: '/doctor-dashboard',
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
