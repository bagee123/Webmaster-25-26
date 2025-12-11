import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Phone, Mail, MapPin, Clock, Globe, Heart } from 'lucide-react';
import '../css/modal.css';

export default function DetailModal({ resource, onClose }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon-box">
            <span className="modal-icon">📍</span>
          </div>
          <div>
            <h2 className="modal-title">{resource.name}</h2>
            <span className="modal-category-badge">{resource.category}</span>
          </div>
        </div>

        {/* Main Description */}
        <div className="modal-section">
          <h3 className="modal-section-title">About This Resource</h3>
          <p className="modal-description">{resource.description}</p>
        </div>

        {/* Contact Information */}
        <div className="modal-section">
          <h3 className="modal-section-title">Contact Information</h3>
          <div className="contact-info-grid">
            <div className="contact-info-item">
              <Phone size={18} className="contact-info-icon" />
              <div>
                <span className="contact-label">Phone</span>
                <a href={`tel:${resource.phone}`} className="contact-value">
                  {resource.phone}
                </a>
              </div>
            </div>
            <div className="contact-info-item">
              <Mail size={18} className="contact-info-icon" />
              <div>
                <span className="contact-label">Email</span>
                <a href={`mailto:${resource.email}`} className="contact-value">
                  {resource.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="modal-section">
          <h3 className="modal-section-title">Location & Hours</h3>
          <div className="location-hours-grid">
            <div className="location-item">
              <MapPin size={18} className="location-icon" />
              <div>
                <span className="location-label">Address</span>
                <p className="location-value">{resource.address}</p>
              </div>
            </div>
            <div className="location-item">
              <Clock size={18} className="location-icon" />
              <div>
                <span className="location-label">Hours</span>
                <p className="location-value">{resource.hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Website */}
        <div className="modal-section">
          <h3 className="modal-section-title">Learn More</h3>
          <a href={`https://${resource.website}`} target="_blank" rel="noopener noreferrer" className="website-btn">
            <Globe size={18} />
            Visit Website
          </a>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button 
            className={`btn-favorite ${isFavorited ? 'active' : ''}`}
            onClick={handleFavoriteClick}
          >
            <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
            {isFavorited ? 'Saved!' : 'Save to Favorites'}
          </button>
          <button className="btn-close-modal" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

DetailModal.propTypes = {
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
  onClose: PropTypes.func.isRequired,
};
