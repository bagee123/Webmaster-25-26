import React, { useState } from 'react';
import { Search, Heart, GraduationCap, Users, Calendar, HandHeart, Leaf, Building2, MoreHorizontal, MapPin } from 'lucide-react';
import DetailModal from './DetailModal';
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

const mockResources = [
  { id: 1, name: 'Coppell Family Health Clinic', category: 'health', description: 'Comprehensive family healthcare services including preventive care, wellness checkups, and urgent care.', phone: '(972) 304-3700', email: 'health@coppelltx.gov', website: 'www.coppellclinic.org', address: '123 Main St, Coppell, TX 75019', hours: 'Mon-Fri 8AM-6PM, Sat 9AM-2PM' },
  { id: 2, name: 'Community Learning Center', category: 'education', description: 'Adult education programs, tutoring services, and computer literacy courses for all ages.', phone: '(972) 304-3600', email: 'learning@coppelltx.gov', website: 'www.coppelllearning.org', address: '456 Oak Ave, Coppell, TX 75019', hours: 'Mon-Thu 3PM-8PM, Sat 10AM-3PM' },
  { id: 3, name: 'Food Bank Volunteer Program', category: 'volunteering', description: 'Join our team helping distribute food to families in need. Flexible scheduling available.', phone: '(972) 304-3800', email: 'volunteer@coppelltx.gov', website: 'www.coppellfoodbank.org', address: '789 Park Way, Coppell, TX 75019', hours: 'Flexible scheduling' },
  { id: 4, name: 'Summer Festival Series', category: 'events', description: 'Monthly community celebrations featuring local artists, food vendors, and family activities.', phone: '(972) 304-3500', email: 'events@coppelltx.gov', website: 'www.coppellevents.org', address: 'Various Locations', hours: 'Seasonal - Check website' },
  { id: 5, name: 'Mental Health Support Group', category: 'support', description: 'Free confidential peer support meetings every Tuesday evening at the community center.', phone: '(972) 304-3750', email: 'support@coppelltx.gov', website: 'www.coppellsupport.org', address: '321 Community Blvd, Coppell, TX 75019', hours: 'Tue 6PM-7:30PM' },
  { id: 6, name: 'Parks & Recreation Programs', category: 'recreation', description: 'Youth sports leagues, fitness classes, and outdoor adventure programs for all skill levels.', phone: '(972) 304-3650', email: 'parks@coppelltx.gov', website: 'www.coppellparks.org', address: '555 Sports Dr, Coppell, TX 75019', hours: 'Daily 6AM-10PM' },
  { id: 7, name: 'Senior Care Services', category: 'nonprofits', description: 'Meals on wheels, transportation assistance, and companionship programs for seniors.', phone: '(972) 304-3850', email: 'seniors@coppelltx.gov', website: 'www.coppellseniors.org', address: '888 Golden Years Ln, Coppell, TX 75019', hours: 'Mon-Fri 9AM-5PM' },
  { id: 8, name: 'Youth Mentorship Initiative', category: 'nonprofits', description: 'Connecting young people with caring mentors for guidance and personal development.', phone: '(972) 304-3900', email: 'youth@coppelltx.gov', website: 'www.coppellyouth.org', address: '222 Future St, Coppell, TX 75019', hours: 'After school & weekends' },
  { id: 9, name: 'Mobile Health Screening', category: 'health', description: 'Free monthly health screenings including blood pressure, cholesterol, and diabetes testing.', phone: '(972) 304-3710', email: 'screening@coppelltx.gov', website: 'www.coppellscreening.org', address: 'Mobile Unit', hours: 'Call for schedule' },
  { id: 10, name: 'Job Skills Workshop', category: 'education', description: 'Resume writing, interview preparation, and career counseling services offered weekly.', phone: '(972) 304-3610', email: 'jobs@coppelltx.gov', website: 'www.coppelljobs.org', address: '101 Career Path, Coppell, TX 75019', hours: 'Wed 6PM-8PM, Sat 10AM-12PM' },
  { id: 11, name: 'Community Garden Project', category: 'volunteering', description: 'Help maintain our community garden while learning sustainable growing practices.', phone: '(972) 304-3810', email: 'garden@coppelltx.gov', website: 'www.coppellgarden.org', address: '500 Green Thumb Rd, Coppell, TX 75019', hours: 'Seasonal hours' },
  { id: 12, name: 'Cultural Arts Festival', category: 'events', description: 'Annual celebration of diverse cultures featuring performances, art exhibits, and cuisine.', phone: '(972) 304-3510', email: 'arts@coppelltx.gov', website: 'www.coppellarts.org', address: 'Downtown Coppell', hours: 'Annual event - check dates' },
];

export default function ResourceDirectory() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);

  const filteredResources = mockResources
    .filter(resource => selectedCategory === 'all' || resource.category === selectedCategory)
    .filter(resource => 
      searchQuery === '' || 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

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
            </select>
          </div>

          {/* Resource Cards Grid - Scrollable */}
          <div className="resources-grid">
            {filteredResources.map((resource) => {
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