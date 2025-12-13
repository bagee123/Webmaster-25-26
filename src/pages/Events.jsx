import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Filter, Bookmark } from 'lucide-react';
import PageHero from '../components/PageHero';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortDropdown from '../components/SortDropdown';
import '../css/eventsPage.css';
import reactLogo from '../assets/react.svg';

const eventData = [
  {
    id: 1,
    name: 'Community Farmers Market',
    date: 'December 14, 2024',
    time: '8:00 AM - 12:00 PM',
    location: 'Town Square',
    category: 'Community',
    attendees: 250,
    description: 'Shop fresh, local produce and handmade goods from Coppell vendors. Live music and food trucks available.',
    image: 'placeholder',
  },
  {
    id: 2,
    name: 'Holiday Food Drive',
    date: 'December 20, 2024',
    time: '10:00 AM - 4:00 PM',
    location: 'Community Center',
    category: 'Volunteering',
    attendees: 150,
    description: 'Help collect and sort food donations for families in need this holiday season. Volunteer registration required.',
    image: 'placeholder',
  },
  {
    id: 3,
    name: 'Free Health Fair',
    date: 'January 5, 2025',
    time: '9:00 AM - 2:00 PM',
    location: 'Recreation Center',
    category: 'Health',
    attendees: 300,
    description: 'Free health screenings, wellness workshops, and consultations with healthcare professionals. Open to all residents.',
    image: 'placeholder',
  },
  {
    id: 4,
    name: 'Youth Arts Workshop',
    date: 'January 12, 2025',
    time: '2:00 PM - 5:00 PM',
    location: 'Library',
    category: 'Education',
    attendees: 50,
    description: 'Creative workshop for ages 8-16 featuring painting, drawing, and mixed media. All materials provided.',
    image: 'placeholder',
  },
  {
    id: 5,
    name: 'Senior Social Gathering',
    date: 'January 18, 2025',
    time: '1:00 PM - 4:00 PM',
    location: 'Senior Center',
    category: 'Social',
    attendees: 75,
    description: 'Monthly social event featuring games, refreshments, and entertainment for seniors. Transportation available upon request.',
    image: 'placeholder',
  },
  {
    id: 6,
    name: 'Small Business Networking Night',
    date: 'January 25, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Chamber of Commerce',
    category: 'Business',
    attendees: 100,
    description: 'Connect with local business owners, share resources, and explore collaboration opportunities. Light refreshments provided.',
    image: 'placeholder',
  },
];

const categories = ['All', 'Community', 'Volunteering', 'Health', 'Education', 'Social', 'Business'];

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedEvents, setSavedEvents] = useState(new Set());

  const filteredEvents = eventData
    .filter(event => selectedCategory === 'All' || event.category === selectedCategory)
    .filter(event => 
      searchQuery === '' || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const toggleSavedEvent = (eventId) => {
    const newSaved = new Set(savedEvents);
    if (newSaved.has(eventId)) {
      newSaved.delete(eventId);
    } else {
      newSaved.add(eventId);
    }
    setSavedEvents(newSaved);
  };

  return (
    <div className="events-page-wrapper">
      {/* Header */}
      <PageHero
        title="Community Events"
        subtitle="Discover upcoming events, workshops, and gatherings in Coppell"
        className="events-header-section"
      />

      <div className="events-main-container">
        {/* Search Bar */}
        {/* Search Bar */}
        <SearchBar
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filters */}
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />

        {/* Events Grid */}
        <div className="events-grid-container">
          {filteredEvents.map((event) => (
            <div key={event.id} className="events-card">
              <div className="events-card-image">
                <img src={reactLogo} alt={event.name} />
                <div className="events-card-category-badge">
                  <span>{event.category}</span>
                </div>
              </div>
              <div className="events-card-content">
                <h3 className="events-card-title">{event.name}</h3>
                <div className="events-card-details">
                  <div className="events-detail-item">
                    <Calendar size={16} />
                    <span>{event.date}</span>
                  </div>
                  <div className="events-detail-item">
                    <Clock size={16} />
                    <span>{event.time}</span>
                  </div>
                  <div className="events-detail-item">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="events-detail-item">
                    <Users size={16} />
                    <span>{event.attendees} expected attendees</span>
                  </div>
                </div>
                <p className="events-card-description">{event.description}</p>
                <button className="events-register-button">Register Now</button>
                <button
                  className={`events-save-button ${
                    savedEvents.has(event.id) ? 'saved' : ''
                  }`}
                  onClick={() => toggleSavedEvent(event.id)}
                >
                  <Bookmark size={16} />
                  {savedEvents.has(event.id) ? 'Saved' : 'Save Event'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="events-no-results">
            <p>No events found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Calendar View CTA */}
      <section className="events-calendar-cta">
        <div className="events-cta-container">
          <Calendar className="events-cta-icon" size={48} />
          <h2 className="events-cta-title">View Full Calendar</h2>
          <p className="events-cta-description">
            See all upcoming events in a monthly calendar view and add them to your personal calendar
          </p>
          <button className="events-cta-button">Open Calendar View</button>
        </div>
      </section>
    </div>
  );
}
