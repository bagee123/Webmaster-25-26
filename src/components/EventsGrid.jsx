import React from 'react';
import PropTypes from 'prop-types';
import EventCard from './EventCard';
import { EventCardSkeleton } from './CardSkeletons';
import '../css/eventsGrid.css';

export default function EventsGrid({ events, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="events-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

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

EventsGrid.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })).isRequired,
  isLoading: PropTypes.bool,
};
