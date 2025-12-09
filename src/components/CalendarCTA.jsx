import React from 'react';
import { Calendar } from 'lucide-react';
import '../css/calendarCta.css';

export default function CalendarCTA() {
  return (
    <section className="calendar-cta">
      <div className="calendar-cta-content">
        <Calendar size={48} className="calendar-cta-icon" />
        <h2>View Full Calendar</h2>
        <p>See all upcoming events in a monthly calendar view and add them to your personal calendar</p>
        <button className="calendar-cta-button">Open Calendar View</button>
      </div>
    </section>
  );
}
