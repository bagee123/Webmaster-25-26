import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Heart, SearchX } from 'lucide-react';
import PageHero from '../components/PageHero';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import events from '../data/events.js';
import '../css/eventsPage.css';

const eventData = events;

// Dynamically extract unique categories from events
const getCategories = () => {
  const uniqueCategories = [...new Set(eventData.map(e => e.category))];
  return ['All', ...uniqueCategories.sort()];
};

export default function Events() {
  const navigate = useNavigate();
  const categories = getCategories();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { userEvents, toggleUserEvent } = useResources();
  const { isAuthenticated } = useAuth();

  // Calculate category counts
  const categoryCounts = categories.reduce((acc, cat) => {
    if (cat === 'All') {
      acc[cat] = eventData.length;
    } else {
      acc[cat] = eventData.filter(e => e.category === cat).length;
    }
    return acc;
  }, {});

  const filteredEvents = eventData
    .filter(event => selectedCategory === 'All' || event.category === selectedCategory)
    .filter(event => 
      searchQuery === '' || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSaveEvent = (eventId) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      toggleUserEvent(eventId);
    }
  };

  const handleRegister = (event) => {
    // Open registration URL in a new tab if available; otherwise show placeholder alert
    const site = event.website && typeof event.website === 'string' ? event.website.trim() : '';
    if (!site) {
      alert(`Registration for "${event.name}" coming soon! Check back later.`);
      return;
    }

    const url = site.startsWith('http://') || site.startsWith('https://') ? site : `https://${site}`;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      // Fallback to alert if window.open fails
      alert(`Unable to open the registration page. Please visit: ${url}`);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const openCalendar = () => {
    navigate('/calendar');
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
          counts={categoryCounts}
        />

        {/* Events Grid */}
        <div className="events-grid-container">
          {filteredEvents.map((event) => (
            <div key={event.id} className="events-card">
              <div className="events-card-image">
                <img src={event.image} alt={event.name} />
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
                <div className="events-card-actions">
                  <button 
                    className="events-register-button"
                    onClick={() => handleRegister(event)}
                  >
                    More Info
                  </button>
                  <button
                    className={`events-save-button ${
                      userEvents.includes(event.id) ? 'saved' : ''
                    }`}
                    onClick={() => handleSaveEvent(event.id)}
                    title={userEvents.includes(event.id) ? 'Remove from saved' : isAuthenticated ? 'Save event' : 'Sign in to save'}
                  >
                    <Heart size={16} fill={userEvents.includes(event.id) ? 'currentColor' : 'none'} />
                    {userEvents.includes(event.id) ? 'Saved' : isAuthenticated ? 'Save Event' : 'Sign in'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="events-no-results">
            <div className="events-no-results-icon">
              <SearchX size={40} />
            </div>
            <h3>No Events Found</h3>
            <p>We couldn&apos;t find any events matching your criteria. Try adjusting your filters or search term.</p>
            <button className="events-no-results-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
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
          <button className="events-cta-button" onClick={openCalendar}>Open Calendar View</button>
        </div>
      </section>
    </div>
  );
}
