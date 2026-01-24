import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './css/app.css';
import './css/animations.css';
import './css/components.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ResourceProvider } from './context/ResourceContext';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ResourceDirectoryPage = lazy(() => import('./pages/ResourceDirectoryPage'));
const SavedItems = lazy(() => import('./pages/SavedItems'));
const Events = lazy(() => import('./pages/Events'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Contact = lazy(() => import('./pages/Contact'));
const SubmitResource = lazy(() => import('./pages/SubmitResource'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const References = lazy(() => import('./pages/References'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const WriteBlog = lazy(() => import('./pages/WriteBlog'));
const About = lazy(() => import('./pages/About'));
const Forum = lazy(() => import('./pages/Forum'));
const ForumTopicDetail = lazy(() => import('./pages/ForumTopicDetail'));
const NewForumTopic = lazy(() => import('./pages/NewForumTopic'));

// Loading fallback component
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh',
    fontSize: '1.1rem',
    color: '#64748b'
  }}>
    Loading...
  </div>
);

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
    <AuthProvider>
      <ResourceProvider>
        <ScrollToTop />
        <Navbar onLoginClick={handleLoginClick} />
        <main style={{ flex: 1 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resources" element={<ResourceDirectoryPage />} />
              <Route path="/saved-items" element={<SavedItems />} />
              <Route path="/events" element={<Events />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/submit-resource" element={<SubmitResource />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/new-topic" element={<NewForumTopic />} />
              <Route path="/forum/:id" element={<ForumTopicDetail />} />
              <Route path="/references" element={<References />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/write" element={<WriteBlog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </ResourceProvider>
    </AuthProvider>
  );
}
