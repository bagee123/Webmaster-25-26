import React from 'react';
import PropTypes from 'prop-types';
import { Phone, Mail, MapPin, Clock, Globe, Heart } from 'lucide-react';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import '../css/savedResourceItem.css';

export default function SavedResourceItem({ resource }) {
  const { savedItems, toggleSavedItem } = useResources();
  const { isAuthenticated } = useAuth();
  const isSaved = savedItems.includes(Number(resource.id));

  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      toggleSavedItem(Number(resource.id));
    }
  };

  return (
    <div className="saved-resource-item">
      {/* Header */}
      <div className="saved-item-header">
        <div className="saved-item-icon-box">
          <span className="saved-item-icon">📍</span>
        </div>
        <div className="saved-item-header-content">
          <h3 className="saved-item-title">{resource.name}</h3>
          <span className="saved-item-category-badge">{resource.category}</span>
        </div>
        {isAuthenticated && (
          <button 
            className={`saved-item-favorite ${isSaved ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            title={isSaved ? 'Remove from saved' : 'Save to favorites'}
          >
            <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Description */}
      <div className="saved-item-section">
        <h4 className="saved-item-section-title">About This Resource</h4>
        <p className="saved-item-description">{resource.description}</p>
      </div>

      {/* Contact Information */}
      <div className="saved-item-section">
        <h4 className="saved-item-section-title">Contact Information</h4>
        <div className="saved-item-contact-grid">
          <div className="saved-item-contact-item">
            <Phone size={16} className="saved-item-contact-icon" />
            <div>
              <span className="saved-item-contact-label">Phone</span>
              <a href={`tel:${resource.phone}`} className="saved-item-contact-value">
                {resource.phone}
              </a>
            </div>
          </div>
          <div className="saved-item-contact-item">
            <Mail size={16} className="saved-item-contact-icon" />
            <div>
              <span className="saved-item-contact-label">Email</span>
              <a href={`mailto:${resource.email}`} className="saved-item-contact-value">
                {resource.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Location & Hours */}
      <div className="saved-item-section">
        <h4 className="saved-item-section-title">Location & Hours</h4>
        <div className="saved-item-location-grid">
          <div className="saved-item-location-item">
            <MapPin size={16} className="saved-item-location-icon" />
            <div>
              <span className="saved-item-location-label">Address</span>
              <p className="saved-item-location-value">{resource.address}</p>
            </div>
          </div>
          <div className="saved-item-location-item">
            <Clock size={16} className="saved-item-location-icon" />
            <div>
              <span className="saved-item-location-label">Hours</span>
              <p className="saved-item-location-value">{resource.hours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Website */}
      <div className="saved-item-section">
        <a 
          href={`https://${resource.website}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="saved-item-website-btn"
        >
          <Globe size={16} />
          Visit Website
        </a>
      </div>
    </div>
  );
}

SavedResourceItem.propTypes = {
  resource: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    hours: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
  }).isRequired,
};
