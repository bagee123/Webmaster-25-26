import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heart, GraduationCap, Users, Calendar, HandHeart, Leaf, Building2, MapPin, ChevronDown } from 'lucide-react';
import DetailModal from './DetailModal';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import SortDropdown from './SortDropdown';
import resources from '../data/resources';
import '../css/directory.css';

const categoryOptions = [
  'All',
  'Health',
  'Education',
  'Volunteering',
  'Events',
  'Support Services',
  'Recreation',
  'Nonprofits',
];

// Map display names to resource category values
const categoryMap = {
  'All': 'all',
  'Health': 'health',
  'Education': 'education',
  'Volunteering': 'volunteering',
  'Events': 'events',
  'Support Services': 'support',
  'Recreation': 'recreation',
  'Nonprofits': 'nonprofits',
};

// Map category values to icons
const categoryIcons = {
  'health': Heart,
  'education': GraduationCap,
  'volunteering': HandHeart,
  'events': Calendar,
  'support': Users,
  'recreation': Leaf,
  'nonprofits': Building2,
};


export default function ResourceDirectory() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [displayCount, setDisplayCount] = useState(8);

  useEffect(() => {
    // Check if category was passed via navigation state
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location]);

  useEffect(() => {
    const handleCategorySelected = (event) => {
      const categoryId = event.detail.categoryId;
      setSelectedCategory(categoryId);
    };

    window.addEventListener('categorySelected', handleCategorySelected);
    return () => window.removeEventListener('categorySelected', handleCategorySelected);
  }, []);

  // Reset filters when expanding to trigger fresh animation
  useEffect(() => {
    // Force animation reset on expand
  }, [displayCount]);

  const filteredResources = resources
    .filter(resource => {
      const resourceCategory = categoryMap[selectedCategory];
      return resourceCategory === 'all' || resource.category === resourceCategory;
    })
    .filter(resource => 
      searchQuery === '' || 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, undefined, {numeric: true});
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      if (sortBy === 'newest') {
        return b.id - a.id;
      }
      return 0;
    });
   
  const itemsToShow = filteredResources.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(displayCount + 12);
  };

  const getCategoryIcon = (categoryValue) => {
    return categoryIcons[categoryValue] || MapPin;
  };

  return (
    <>
      <section id="directory" className="directory-section">
        <div className="directory-container">
          {/* Search Bar */}
          <SearchBar
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Category Filters */}
          <CategoryFilter
            categories={categoryOptions}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />

          {/* Sort Dropdown */}
          <SortDropdown
            options={[
              { value: 'name', label: 'Sort by Name' },
              { value: 'category', label: 'Sort by Category' },
              { value: 'newest', label: 'Sort by Newest' },
            ]}
            selected={sortBy}
            onChange={setSortBy}
          />

          {/* Resource Cards Grid - Scrollable */}
          <div className="resources-grid">
            {itemsToShow.map((resource, index) => {
              const Icon = getCategoryIcon(resource.category);
              return (
                <div
                  key={resource.id}
                  data-card-index={index}
                  onClick={() => setSelectedResource(resource)}
                  className="resource-card"
                  style={{
                    animationDelay: '0s',
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') setSelectedResource(resource);
                  }}
                >
                  <div className="card-header">
                    <div className="card-icon-box">
                      <Icon className="card-icon" size={24} />
                    </div>
                    <span className="card-badge">{resource.category}</span>
                  </div>
                  <h3 className="card-title">{resource.name}</h3>
                  <p className="card-description">{resource.description}</p>
                  <div className="card-footer">
                    <MapPin size={14} />
                    <span>Coppell, TX</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredResources.length > displayCount && (
            <div className="collapsible-parent">
               <button onClick={handleLoadMore} className="collapsible">
                  <ChevronDown style={{ 
                    transition: 'transform 0.6s ease-in-out',
                    display: 'inline-block'
                  }} />
                  Load More
               </button>
            </div>   
          )}

          {filteredResources.length === 0 && (
            <div className="no-results">
              <p>No resources found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedResource && (
        <DetailModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
    </>
  );
}