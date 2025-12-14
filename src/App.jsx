import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './css/app.css';
import './css/animations.css';
import './css/components.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ResourceDirectoryPage from './pages/ResourceDirectoryPage';
import Events from './pages/Events';
import Contact from './pages/Contact';
import SubmitResource from './pages/SubmitResource';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Highlights from './pages/Highlights';
import References from './pages/References';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import { ResourceProvider } from './context/ResourceContext';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Prevent browser from restoring scroll position
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLoginClick = () => {
    navigate('/login');
    window.scrollTo(0, 0);
  };

  return (
    <ResourceProvider>
      <ScrollToTop />
      <Navbar onLoginClick={handleLoginClick} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<ResourceDirectoryPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/submit-resource" element={<SubmitResource />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/highlights" element={<Highlights />} />
        <Route path="/references" element={<References />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
      <Footer />
    </ResourceProvider>
  );
}
