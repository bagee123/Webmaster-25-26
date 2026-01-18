import React from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/ResourceCard';
import '../css/savedItems.css';

export default function SavedItems() {
  const { getSavedResources, loading } = useResources();
  const { isAuthenticated } = useAuth();
  const savedResources = getSavedResources();

  if (!isAuthenticated) {
    return (
      <div className="saved-items-container">
        <div className="saved-items-empty">
          <div className="empty-state">
            <Bookmark size={64} />
            <h2>Sign In to Save Items</h2>
            <p>Create an account or sign in to save your favorite resources for later.</p>
            <Link to="/login" className="cta-button">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-items-page">
      <div className="saved-items-header">
        <Link to="/resources" className="back-button">
          <ArrowLeft size={20} />
          Back to Resources
        </Link>
        <div className="header-content">
          <h1>My Saved Items</h1>
          <p>{savedResources.length} saved resource{savedResources.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="saved-items-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : savedResources.length === 0 ? (
          <div className="saved-items-empty">
            <div className="empty-state">
              <Bookmark size={64} />
              <h2>No Saved Items Yet</h2>
              <p>Browse resources and click the heart icon to save them here.</p>
              <Link to="/resources" className="cta-button">
                Browse Resources
              </Link>
            </div>
          </div>
        ) : (
          <div className="saved-items-grid">
            {savedResources.map(resource => (
              <ResourceCard key={resource.id} item={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
