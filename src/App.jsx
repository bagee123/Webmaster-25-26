import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './css/app.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DarkModeToggle from './components/DarkModeToggle';
import Home from './pages/Home';
import ResourceDirectoryPage from './pages/ResourceDirectoryPage';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Highlights from './pages/Highlights';
import SubmitResource from './pages/SubmitResource';

export default function App() {
  return (
    <>
      <DarkModeToggle />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<ResourceDirectoryPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/highlights" element={<Highlights />} />
        <Route path="/submit-resource" element={<SubmitResource />} />
      </Routes>
      <Footer />
    </>
  );
}
