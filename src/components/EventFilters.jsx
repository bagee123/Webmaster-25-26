import React from 'react';
import { Search, Filter } from 'lucide-react';
import '../css/eventFilters.css';

const categories = ['All', 'Community', 'Volunteering', 'Health', 'Education', 'Social', 'Business'];

export default function EventFilters({ selectedCategory, onCategoryChange, searchQuery, onSearchChange }) {
  return (
    <div className="events-filters">
      {/* Search Bar */}
      <div className="events-search-container">
        <div className="events-search-box">
          <Search className="events-search-icon" size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="events-search-input"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="events-filter-controls">
        <div className="events-category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`events-category-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
        <button className="events-more-filters-btn">
          <Filter size={16} />
          <span>More Filters</span>
        </button>
      </div>
    </div>
  );
}
