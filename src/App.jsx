import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './css/app.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DarkModeToggle from './components/DarkModeToggle';
import Home from './pages/Home';
import ResourceDirectoryPage from './pages/ResourceDirectoryPage';
import Events from './pages/Events';
import Contact from './pages/Contact';
import SubmitResource from './pages/SubmitResource';
import Login from './pages/Login';
import Highlights from './pages/Highlights';
import { ResourceProvider } from './context/ResourceContext';

export default function App() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
    window.scrollTo(0, 0);
  };

  return (
    <ResourceProvider>
      <DarkModeToggle />
      <Navbar onLoginClick={handleLoginClick} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<ResourceDirectoryPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/submit-resource" element={<SubmitResource />} />
        <Route path="/login" element={<Login />} />
        <Route path="/highlights" element={<Highlights />} />
      </Routes>
      <Footer />
    </ResourceProvider>
  );
}
