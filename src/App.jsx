import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ResourceProvider } from './context/ResourceContext';
import Home from './pages/Home';
import ResourceDirectoryPage from './pages/ResourceDirectoryPage';
import Highlights from './pages/Highlights';
import SubmitResource from './pages/SubmitResource';
import Map from './pages/Map';
import Contact from './pages/Contact';


export default function App() {
  return (
    <Router>
      <ResourceProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<ResourceDirectoryPage />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/submit" element={<SubmitResource />} />
          <Route path="/map" element={<Map />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </ResourceProvider>
    </Router>
  );
}
