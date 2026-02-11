import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Html2Docx from './pages/html2Docx';
import FormPage from './pages/FormPage';
import './App.css';
import Dashboard from './pages/dashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800"></div>
            <div className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">Dashboard</Link>
              <Link to="/form" className="text-gray-600 hover:text-blue-600 font-medium transition">Form</Link>
              <Link to="/html2docx" className="text-gray-600 hover:text-blue-600 font-medium transition">HTML to DOCX</Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/html2docx" element={<Html2Docx />} />
        </Routes>
        <footer className='text-center'>
          <p>Developed by Sreelekshmi and Jithu</p>
          <p>Copyright © 2026 TRUE</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
