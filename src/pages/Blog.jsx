import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, TrendingUp } from 'lucide-react';
import PageHero from '../components/PageHero';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortDropdown from '../components/SortDropdown';
import '../css/blog.css';
const blog_categories = ["Community", "Volunteering", "Health", "Education", "Business", "Events"];


const categoryImage  = {
  'Community': 'https://plus.unsplash.com/premium_photo-1681505195930-388c317b7a76?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29tbXVuaXR5fGVufDB8fDB8fHww',
  'Volunteering': 'https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Health': 'https://plus.unsplash.com/premium_photo-1675808577247-2281dc17147a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aGVhbHRofGVufDB8fDB8fHww',
  'Education': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZWR1Y2F0aW9ufGVufDB8fDB8fHww',
  'Business': 'https://plus.unsplash.com/premium_photo-1661772661721-b16346fe5b0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QnVzaW5lc3N8ZW58MHx8MHx8fDA%3D',
  'Events': 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZXZlbnRzfGVufDB8fDB8fHww',
}

const returnCategoryImage = (category) => {
  return categoryImage[category] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzMzMzMzMiLz48cmVjdCB4PSIyNSIgeT0iMjUiIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjNjZkOWVmIiBzdHJva2U9IiMwYjdiYzYiIHN0cm9rZS13aWR0aD0iMyIgcng9IjEwIi8+PHRleHQgeD0iMTAwIiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0iQXJpYWwiPlBsYWNlIjwvdGV4dD48L3N2Zz4=';
}

const blogPosts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Blog #${i + 1}`,
  excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  author: 'Author Name',
  date: 'December 5, 2024',
  readTime: '5 min read',
  category: blog_categories[i % blog_categories.length],
  image: returnCategoryImage(blog_categories[i % blog_categories.length]),
  featured: [2,5,14].includes(i + 1),
}));

const categories = ['All', 'Community', 'Volunteering', 'Health', 'Education', 'Business', 'Events'];

export default function Blog() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredPosts = blogPosts
    .filter(post => selectedCategory === 'All' || post.category === selectedCategory)
    .filter(post => 
      searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts;

  return (
    <>
      {/* Hero Section */}
      <PageHero
        title="Community Blog & Stories"
        subtitle="Inspiring stories, local news, and resources to help you get involved in our community"
        className="blog-hero"
      />

      <div className="blog-container">
        {/* Search Bar */}
        <SearchBar
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Category Filters */}
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />


        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="blog-featured-section">
            <div className="blog-section-header">
              <TrendingUp className="blog-section-icon" size={24} />
              <h2>Featured Stories</h2>
            </div>
            <div className="blog-featured-grid">
              {featuredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="blog-featured-card"
                >
                  <div className="blog-card-image-wrapper">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="blog-card-image"
                    />
                    <div className="blog-card-category">
                      <span>{post.category}</span>
                    </div>
                  </div>
                  <div className="blog-card-content">
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-meta">
                      <div className="blog-meta-item">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <div className="blog-meta-item">
                        <Calendar size={14} />
                        <span>{post.date}</span>
                      </div>
                      <div className="blog-meta-item">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <SortDropdown
          options={[
            { value: 'title', label: 'Sort by Title' },
            {value: 'category', label: 'Sort by Caterory' },
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
          ]}
          selected={sortBy}
          onChange={setSortBy}
        />

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <>
            <h2 className="blog-section-title">Latest Articles</h2>
            <div className="blog-regular-grid">
              {regularPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="blog-regular-card"
                >
                  <div className="blog-card-image-wrapper">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="blog-card-image"
                    />
                    <div className="blog-card-category">
                      <span>{post.category}</span>
                    </div>
                  </div>
                  <div className="blog-card-content">
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-meta">
                      <div className="blog-meta-item">
                        <User size={12} />
                        <span>{post.author}</span>
                      </div>
                      <div className="blog-meta-item">
                        <Clock size={12} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filteredPosts.length === 0 && (
          <div className="blog-empty-state">
            <p>No articles found matching your criteria.</p>
          </div>
        )}

        {/* Newsletter Section */}
        <section className="blog-newsletter">
          <div className="blog-newsletter-content">
            <h2 className="blog-newsletter-title">Stay Updated</h2>
            <p className="blog-newsletter-subtitle">
              Subscribe to our newsletter for the latest community stories and updates
            </p>
            <div className="blog-newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="blog-newsletter-input"
              />
              <button className="blog-newsletter-btn">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
