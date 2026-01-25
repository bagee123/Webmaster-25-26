import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import '../css/notFound.css';

/**
 * 404 Not Found Page
 * Displayed when user navigates to non-existent route
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <AlertTriangle size={80} />
        </div>
        
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        
        <p className="not-found-description">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="not-found-actions">
          <button
            onClick={() => navigate('/')}
            className="not-found-btn primary"
          >
            <Home size={20} />
            Go to Home
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="not-found-btn secondary"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="not-found-suggestions">
          <p className="suggestions-title">Or try visiting:</p>
          <ul className="suggestions-list">
            <li><a href="/">Home</a></li>
            <li><a href="/resources">Resources</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/forum">Forum</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
