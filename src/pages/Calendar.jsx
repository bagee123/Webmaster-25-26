import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import eventsData from '../data/events';
import '../css/calendar.css';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const { userEvents, toggleUserEvent } = useResources();
  const { isAuthenticated } = useAuth();

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getUserEventsForDay = (day) => {
    return eventsData.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear() &&
        userEvents.includes(event.id)
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (!isAuthenticated) {
    return (
      <div className="calendar-page">
        <div className="calendar-empty">
          <h2>Sign In to View Your Events</h2>
          <p>Create an account or sign in to see your registered volunteer events.</p>
          <Link to="/login" className="calendar-cta">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>My Events Calendar</h1>
        <p>View and manage your registered volunteer events</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-nav">
          <button onClick={previousMonth} className="nav-button">
            <ChevronLeft size={20} />
          </button>
          <h2>{monthName}</h2>
          <button onClick={nextMonth} className="nav-button">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="day empty"></div>
            ))}
            {days.map(day => {
              const dayEvents = getUserEventsForDay(day);
              return (
                <div key={day} className={`day ${dayEvents.length > 0 ? 'has-events' : ''}`}>
                  <div className="day-number">{day}</div>
                  {dayEvents.length > 0 && (
                    <div className="day-events">
                      {dayEvents.map(event => (
                        <div key={event.id} className="event-dot" title={event.name}></div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-dot"></div>
            <span>Events registered</span>
          </div>
        </div>
      </div>

      <div className="upcoming-events">
        <h2>Your Upcoming Events</h2>
        {userEvents.length === 0 ? (
          <div className="no-events">
            <p>No events registered yet. Browse and sign up for volunteer opportunities!</p>
            <Link to="/events" className="calendar-cta">
              View Events
            </Link>
          </div>
        ) : (
          <div className="events-list">
            {eventsData
              .filter(event => userEvents.includes(event.id))
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-info">
                    <h3>{event.name}</h3>
                    <div className="event-meta">
                      <span className="event-date">
                        📅 {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="event-time">
                        <Clock size={14} />
                        {event.time}
                      </span>
                      <span className="event-location">
                        <MapPin size={14} />
                        {event.location}
                      </span>
                    </div>
                    <p>{event.description}</p>
                  </div>
                  <button
                    onClick={() => toggleUserEvent(event.id)}
                    className="event-remove"
                    title="Remove from calendar"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
