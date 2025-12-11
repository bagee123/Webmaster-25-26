import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import reactLogo from '../assets/react.svg';
import '../css/eventCard.css';

export default function EventCard({ event }) {
  return (
    <div className="event-card">
      <div className="event-card-image">
        <img src={reactLogo} alt={event.name} />
        <span className="event-category-badge">{event.category}</span>
      </div>
      
      <div className="event-card-content">
        <h3 className="event-card-title">{event.name}</h3>
        
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
        
        <button className="event-card-button">Register Now</button>
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
  }).isRequired,
};
