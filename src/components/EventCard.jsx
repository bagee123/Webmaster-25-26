import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar, Clock, MapPin, Users, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import reactLogo from '../assets/react.svg';
import '../css/eventCard.css';

export default function EventCard({ event }) {
  const { userEvents, toggleUserEvent } = useResources();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isSignedUp = userEvents.includes(event.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Event rating (default to 4 if not provided)
  const rating = event.rating || 4;
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);

  const handleSignup = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      toggleUserEvent(event.id);
    }
  };

  return (
    <div className="event-card">
      <div className="event-card-image">
        <img 
          src={reactLogo} 
          alt={event.name}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0.5 }}
        />
        <span className="event-category-badge">{event.category}</span>
      </div>
      
      <div className="event-card-content">
        <h3 className="event-card-title">{event.name}</h3>
        
        {/* Event Rating */}
        <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
          {stars.map((filled, idx) => (
            <Star
              key={idx}
              size={14}
              style={{
                fill: filled ? '#ea580c' : '#d1d5db',
                color: filled ? '#ea580c' : '#d1d5db'
              }}
            />
          ))}
        </div>
        
        <div className="event-card-details">
          <div className="event-detail">
            <Calendar size={16} />
            <span>{event.date}</span>
          </div>
          <div className="event-detail">
            <Clock size={16} />
            <span>{event.time}</span>
          </div>
          <div className="event-detail">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="event-detail">
            <Users size={16} />
            <span>{event.attendees} expected attendees</span>
          </div>
        </div>
        <p className="event-card-description">{event.description}</p>
        
        <button 
          onClick={handleSignup}
          className={`event-card-button ${isSignedUp ? 'signed-up' : ''}`}
        >
          {isSignedUp ? (
            <>
              <CheckCircle size={18} />
              Signed Up
            </>
          ) : isAuthenticated ? (
            'Register Now'
          ) : (
            'Sign In to Register'
          )}
        </button>
      </div>
    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    attendees: PropTypes.number,
    description: PropTypes.string,
    rating: PropTypes.number,
  }).isRequired,
};
