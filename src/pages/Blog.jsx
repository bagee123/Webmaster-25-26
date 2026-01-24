import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, TrendingUp, Plus, X, Send, Image } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../build/auth';
import { useAuth } from '../context/AuthContext';
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

// Local storage key for posts
const BLOG_STORAGE_KEY = 'coppell_blog_posts';

// Helper to get posts from local storage
const getLocalPosts = () => {
  try {
    const stored = localStorage.getItem(BLOG_STORAGE_KEY);
    if (stored) {
      const posts = JSON.parse(stored);
      return posts.map(p => ({ ...p, date: new Date(p.date) }));
    }
  } catch {
    console.log('Error reading local storage');
  }
  return [];
};

// Helper to save posts to local storage
const saveLocalPosts = (posts) => {
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    console.log('Error saving to local storage');
  }
};

const defaultBlogPosts = Array.from({ length: 6 }, (_, i) => ({
  id: `default-${i + 1}`,
  title: `Community Spotlight: Local Heroes Making a Difference #${i + 1}`,
  excerpt: 'Discover the inspiring stories of Coppell residents who are going above and beyond to make our community a better place for everyone.',
  author: 'Community Team',
  authorEmail: 'team@coppellhub.com',
  date: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)),
  readTime: `${5 + i} min read`,
  category: blog_categories[i % blog_categories.length],
  image: returnCategoryImage(blog_categories[i % blog_categories.length]),
  content: `<h3>Making Our Community Stronger</h3>
<p>Every day, members of our community step up to make Coppell a better place. From organizing neighborhood clean-ups to supporting local food banks, these unsung heroes demonstrate what it means to be a good neighbor.</p>

<h3>How You Can Get Involved</h3>
<p>There are many ways to contribute to our community. Whether you have an hour a week or a full day to spare, your involvement matters. Check out our resources page to find volunteer opportunities near you.</p>

<p>Remember, small acts of kindness can create ripples of positive change throughout our entire community. Start today and be part of something bigger than yourself.</p>`,
  featured: i === 0,
  likes: Math.floor(Math.random() * 50) + 10,
  comments: [],
}));

const categories = ['All', 'Community', 'Volunteering', 'Health', 'Education', 'Business', 'Events'];

export default function Blog() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [blogPosts, setBlogPosts] = useState([...getLocalPosts(), ...defaultBlogPosts]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Community',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load blog posts - try Firebase first, fall back to local storage
  useEffect(() => {
    let unsubscribe = null;
    
    const loadPosts = async () => {
      // First, load local posts immediately
      const localPosts = getLocalPosts();
      
      // Create a Map to ensure unique posts by ID
      const postsMap = new Map();
      
      // Add defaults first (lowest priority)
      defaultBlogPosts.forEach(p => postsMap.set(p.id, p));
      
      // Add local posts (higher priority - overwrites defaults)
      localPosts.forEach(p => postsMap.set(p.id, p));
      
      setBlogPosts(Array.from(postsMap.values()));
      
      // Try Firebase - load from global collection (accessible to all users)
      try {
        const postsRef = collection(db, 'blogPosts');
        const q = query(postsRef, orderBy('date', 'desc'));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          const firebasePosts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate() || new Date(),
            isFirebasePost: true
          }));
          
          // Create fresh Map for combining
          const allPostsMap = new Map();
          
          // Add defaults first (lowest priority)
          defaultBlogPosts.forEach(p => allPostsMap.set(p.id, p));
          
          // Add local posts (medium priority)
          localPosts.forEach(p => allPostsMap.set(p.id, p));
          
          // Add Firebase posts (highest priority - overwrites others)
          firebasePosts.forEach(p => allPostsMap.set(p.id, p));
          
          setBlogPosts(Array.from(allPostsMap.values()));
        }, (error) => {
          console.log('Firebase unavailable, using local storage:', error.code);
        });
      } catch (error) {
        console.log('Firebase setup error:', error);
      }
    };

    loadPosts();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []); // No dependency on user - data should load for everyone

  const formatDate = (date) => {
    if (typeof date === 'string') return date;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      alert('Please log in to create a blog post');
      return;
    }
    navigate('/blog/write');
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in the title and content');
      return;
    }

    setIsSubmitting(true);
    try {
      const wordCount = newPost.content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      const postId = `post-${Date.now()}`;

      const postData = {
        id: postId,
        title: newPost.title.trim(),
        excerpt: newPost.excerpt.trim() || newPost.content.substring(0, 150) + '...',
        content: `<p>${newPost.content.split('\n\n').join('</p><p>')}</p>`,
        category: newPost.category,
        author: user?.email?.split('@')[0] || 'Anonymous',
        authorEmail: user?.email || '',
        authorId: user?.uid || '',
        date: new Date(),
        readTime: `${readTime} min read`,
        image: newPost.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzMzMzMzMiLz48cmVjdCB4PSIyNSIgeT0iMjUiIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjNjZkOWVmIiBzdHJva2U9IiMwYjdiYzYiIHN0cm9rZS13aWR0aD0iMyIgcng9IjEwIi8+PHRleHQgeD0iMTAwIiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0iQXJpYWwiPlBsYWNlIjwvdGV4dD48L3N2Zz4=',
        featured: false,
        likes: 0,
        comments: []
      };

      // Try to save to Firebase in global collection
      let savedToFirebase = false;
      if (user?.uid) {
        try {
          const postsRef = collection(db, 'blogPosts');
          await addDoc(postsRef, {
            ...postData,
            date: new Date() // Firestore will convert this
          });
          savedToFirebase = true;
        } catch (firebaseError) {
          console.log('Firebase save failed, using local storage:', firebaseError.code);
        }
      }

      // Always save to local storage as backup
      const localPosts = getLocalPosts();
      saveLocalPosts([postData, ...localPosts]);

      // Update UI immediately
      setBlogPosts(prev => [postData, ...prev]);
      
      setNewPost({ title: '', excerpt: '', content: '', category: 'Community', imageUrl: '' });
      setShowCreateModal(false);
      alert(savedToFirebase ? 'Blog post published successfully!' : 'Blog post saved locally!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <PageHero
        title="Community Blog & Stories"
        subtitle="Inspiring stories, local news, and resources to help you get involved in our community"
        className="blog-hero"
      />

      <div className="blog-container">
        {/* Actions Bar */}
        <div className="blog-actions-bar">
          {/* Search Bar */}
          <SearchBar
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {/* Create Post Button */}
          <button className="blog-create-btn" onClick={handleCreatePost}>
            <Plus size={18} />
            Write a Post
          </button>
        </div>

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
                        <span>{formatDate(post.date)}</span>
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
            { value: 'category', label: 'Sort by Category' },
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

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="blog-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
            <div className="blog-modal-header">
              <h2>Write a Blog Post</h2>
              <button className="blog-modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitPost} className="blog-modal-form">
              <div className="blog-form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your blog title"
                  required
                />
              </div>

              <div className="blog-form-group">
                <label>Category *</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="blog-form-group">
                <label>Short Description</label>
                <input
                  type="text"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description (optional - will be auto-generated)"
                />
              </div>

              <div className="blog-form-group">
                <label>
                  <Image size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="blog-form-group">
                <label>Content *</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content here... Use double line breaks for new paragraphs."
                  rows={10}
                  required
                />
              </div>

              <div className="blog-modal-actions">
                <button type="button" className="blog-btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="blog-btn-primary" disabled={isSubmitting}>
                  <Send size={18} />
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
