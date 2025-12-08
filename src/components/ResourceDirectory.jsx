import React, { useState, useEffect } from 'react';
import { Search, Heart, GraduationCap, Users, Calendar, HandHeart, Leaf, Building2, MoreHorizontal, MapPin, ChevronDown } from 'lucide-react';
import DetailModal from './DetailModal';
import resources from '../data/resources';
import '../css/directory.css';

const categories = [
  { id: 'all', label: 'All', icon: MoreHorizontal },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'volunteering', label: 'Volunteering', icon: HandHeart },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'support', label: 'Support Services', icon: Users },
  { id: 'recreation', label: 'Recreation', icon: Leaf },
  { id: 'nonprofits', label: 'Nonprofits', icon: Building2 },
];


export default function ResourceDirectory() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleCategorySelected = (event) => {
      const categoryId = event.detail.categoryId;
      setSelectedCategory(categoryId);
    };

    window.addEventListener('categorySelected', handleCategorySelected);
    return () => window.removeEventListener('categorySelected', handleCategorySelected);
  }, []);

  const filteredResources = resources
    .filter(resource => selectedCategory === 'all' || resource.category === selectedCategory)
    .filter(resource => 
      searchQuery === '' || 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      if (sortBy === 'newest') {
        return b.id - a.id;
      }
      return 0;
    });
   
  const itemsPerRow = 4;
  const collapsedRows = 2;
  const itemsToShow = isExpanded ? filteredResources : filteredResources.slice(0, collapsedRows * itemsPerRow);

  const handleCollapseClick = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setTimeout(() => {
        const directionSection = document.getElementById('directory');
        if (directionSection) {
          directionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || MoreHorizontal;
  };

  return (
    <>
      <section id="directory" className="directory-section">
        <div className="directory-container">
          <div className="directory-header">
            <h2>Interactive Resource Directory</h2>
            <p>Search and filter through our comprehensive database of community resources</p>
          </div>

          {/* Search Bar */}
          <div className="search-wrapper">
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="category-filters">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="sort-wrapper">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
              <option value="newest">Sort by Newest</option>
            </select>
          </div>

          {/* Resource Cards Grid - Scrollable */}
          <div className="resources-grid">
            {itemsToShow.map((resource) => {
              const Icon = getCategoryIcon(resource.category);
              return (
                <div
                  key={resource.id}
                  onClick={() => setSelectedResource(resource)}
                  className="resource-card"
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

          {filteredResources.length > itemsPerRow * 2 && (
            <div className="collapsible-parent">
               <button onClick={handleCollapseClick} className="collapsible">
                  <ChevronDown style={{ 
                    transform: isExpanded ? 'rotate(180deg) translateY(0px)' : 'rotate(0deg) translateY(-12px)', 
                    transition: 'transform 0.6s ease-in-out',
                    display: 'inline-block'
                  }} />
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