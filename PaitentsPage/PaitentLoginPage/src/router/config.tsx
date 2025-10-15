import { RouteObject } from 'react-router-dom';
import HomePage from '../pages/home/page';
import PatientLogin from '../pages/PatientsPage/PatientLogin';
import PatientRegister from '../pages/PatientsPage/PatientRegister';
import PatientDashboard from '../pages/PatientDashboard/page';
import NotFound from '../pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/patient-login',
    element: <PatientLogin />,
  },
  {
    path: '/patient-register',
    element: <PatientRegister />,
  },
  {
    path: '/patient-dashboard',
    element: <PatientDashboard />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;