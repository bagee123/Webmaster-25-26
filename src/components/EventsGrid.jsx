import React from 'react';
import EventCard from './EventCard';
import '../css/eventsGrid.css';

export default function EventsGrid({ events }) {
  if (events.length === 0) {
    return (
      <div className="events-no-results">
        <p>No events found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="events-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
