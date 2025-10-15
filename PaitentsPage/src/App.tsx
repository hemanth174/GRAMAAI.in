
import { BrowserRouter } from 'react-router-dom';
import { useRoutes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import routes from './router/config';
import './i18n';
import NotificationWrapper from './components/NotificationWrapper';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  return (
    <BrowserRouter>
      <NotificationWrapper>
        <ScrollToTop />
        <AppRoutes />
      </NotificationWrapper>
    </BrowserRouter>
  );
}

export default App;
