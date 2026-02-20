import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import Dashboard from './pages/dashboardPage';
import UnauthorizedPage from './pages/Page401';
import './App.css';
import ScrollWrapper from './components/ScrollWrapper';
import Header from './components/Header';
import Footer from './components/Footer';
import Page401 from './pages/Page401';

function AppContent() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isLocked = searchParams.get('locked') === 'true';

  return (
    <ScrollWrapper>
      <div className="min-h-screen" data-scroll-container>
        <Header />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="*" element={<Page401 />} />
        </Routes>
        <Footer />
      </div>
    </ScrollWrapper>
  );
}

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer />
    </Router>
  );
}

export default App;
