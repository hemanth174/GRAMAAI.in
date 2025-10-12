
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import FindHealthcare from "../pages/find-healthcare/page";
import BookAppointment from "../pages/book-appointment/page";
import AIAssistant from "../pages/ai-assistant/page";
import GovernmentSchemes from "../pages/government-schemes/page";
import HealthNutrition from "../pages/health-nutrition/page";
import Emergency from "../pages/emergency/page";
import AboutPage from '../pages/about/page';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/find-healthcare",
    element: <FindHealthcare />,
  },
  {
    path: "/book-appointment",
    element: <BookAppointment />,
  },
  {
    path: "/ai-assistant",
    element: <AIAssistant />,
  },
  {
    path: "/government-schemes",
    element: <GovernmentSchemes />,
  },
  {
    path: "/health-nutrition",
    element: <HealthNutrition />,
  },
  {
    path: "/emergency",
    element: <Emergency />,
  },
  {
    path: '/about',
    element: <AboutPage />
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
