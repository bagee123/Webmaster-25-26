import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import '../css/events.css';

const events = [
  { id: 1, name: 'Community Farmers Market', date: 'Dec 14, 2024', time: '8:00 AM', location: 'Town Square' },
  { id: 2, name: 'Holiday Food Drive', date: 'Dec 20, 2024', time: '10:00 AM', location: 'Community Center' },
  { id: 3, name: 'Free Health Fair', date: 'Jan 5, 2025', time: '9:00 AM', location: 'Recreation Center' },
  { id: 4, name: 'Youth Arts Workshop', date: 'Jan 12, 2025', time: '2:00 PM', location: 'Library' },
  { id: 5, name: 'Senior Social Gathering', date: 'Jan 18, 2025', time: '1:00 PM', location: 'Senior Center' },
];

export default function EventsStrip() {
  return (
    <section className="events-section">
      <div className="events-container">
        <div className="events-header">
          <div>
            <h3>Upcoming Events</h3>
            <p>Stay connected with community activities and gatherings</p>
          </div>
          <button className="view-all-btn">View All</button>
        </div>

        <div className="events-scroll-wrapper">
          <div className="events-scroll-container">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-content">
                  <div className="event-date-badge">
                    <span className="date-month">DEC</span>
                    <span className="date-day">14</span>
                  </div>
                  <div className="event-details">
                    <h4>{event.name}</h4>
                    <div className="event-info">
                      <div className="info-item">
                        <Calendar size={14} />
                        <span>{event.date}</span>
                      </div>
                      <div className="info-item">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                      <div className="info-item">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="events-fade-gradient"></div>
        </div>
      </div>
    </section>
  );
}
