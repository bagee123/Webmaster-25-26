import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../build/auth';
import { useAuth } from '../context/AuthContext';
import '../css/writeBlog.css';

const categories = ['Community', 'Events', 'Education', 'Health', 'Business', 'Volunteering', 'Sports', 'Arts', 'Technology', 'Environment'];

// Local storage functions
const getLocalPosts = () => {
  try {
    const stored = localStorage.getItem('blogPosts');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalPosts = (posts) => {
  try {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

export default function WriteBlog() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Community',
    imageUrl: ''
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="write-blog-page">
        <div className="write-blog-container">
          <div className="write-blog-auth-required">
            <h2>Login Required</h2>
            <p>You need to be logged in to write a blog post.</p>
            <div className="write-blog-auth-actions">
              <button onClick={() => navigate('/login')} className="write-blog-btn-primary">
                Log In
              </button>
              <button onClick={() => navigate('/blog')} className="write-blog-btn-secondary">
                Back to Blog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      const localPostId = `post-${Date.now()}`; // Fallback ID for local storage only

      const postData = {
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
      let firebaseDocId = null;
      
      if (user?.uid) {
        try {
          const postsRef = collection(db, 'blogPosts');
          const docRef = await addDoc(postsRef, {
            ...postData,
            date: new Date()
          });
          savedToFirebase = true;
          firebaseDocId = docRef.id; // Use Firebase-generated document ID
        } catch (firebaseError) {
          console.log('Firebase save failed, using local storage:', firebaseError.code);
        }
      }

      // Save to local storage as backup (with local ID)
      const localPosts = getLocalPosts();
      const localPostData = { ...postData, id: firebaseDocId || localPostId };
      saveLocalPosts([localPostData, ...localPosts]);

      alert(savedToFirebase ? 'Blog post published successfully!' : 'Blog post saved locally!');
      
      // Navigate using Firebase doc ID if available, otherwise use local ID
      navigate(`/blog/${firebaseDocId || localPostId}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="write-blog-page">
      <div className="write-blog-container">
        <button className="write-blog-back-btn" onClick={() => navigate('/blog')}>
          <ArrowLeft size={20} />
          Back to Blog
        </button>

        <div className="write-blog-header">
          <h1>Write a Blog Post</h1>
          <p>Share your story with the Coppell community</p>
        </div>

        <form onSubmit={handleSubmitPost} className="write-blog-form">
          <div className="write-blog-form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter an engaging title for your blog post"
              required
            />
          </div>

          <div className="write-blog-form-row">
            <div className="write-blog-form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={newPost.category}
                onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="write-blog-form-group">
              <label htmlFor="imageUrl">
                <Image size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Image URL (optional)
              </label>
              <input
                id="imageUrl"
                type="url"
                value={newPost.imageUrl}
                onChange={(e) => setNewPost(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="write-blog-form-group">
            <label htmlFor="excerpt">Short Description (optional)</label>
            <input
              id="excerpt"
              type="text"
              value={newPost.excerpt}
              onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief description - will be auto-generated from content if left empty"
            />
          </div>

          <div className="write-blog-form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your blog post content here...

Use double line breaks for new paragraphs.

Share your thoughts, experiences, and stories with the community!"
              rows={20}
              required
            />
            <div className="write-blog-content-hint">
              Word count: {newPost.content.split(/\s+/).filter(w => w).length} • 
              Estimated read time: {Math.max(1, Math.ceil(newPost.content.split(/\s+/).filter(w => w).length / 200))} min
            </div>
          </div>

          {newPost.imageUrl && (
            <div className="write-blog-preview-image">
              <label>Image Preview</label>
              <img src={newPost.imageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          <div className="write-blog-actions">
            <button type="button" className="write-blog-btn-secondary" onClick={() => navigate('/blog')}>
              Cancel
            </button>
            <button type="submit" className="write-blog-btn-primary" disabled={isSubmitting}>
              <Send size={18} />
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
