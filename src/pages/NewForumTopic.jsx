import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Tag, MessageSquare } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../build/auth';
import { useAuth } from '../context/AuthContext';
import '../css/newForumTopic.css';

const TOPICS_STORAGE_KEY = 'coppell_forum_topics';

const categories = [
  'Recreation',
  'Announcements', 
  'Safety',
  'Education',
  'Business',
  'Events',
  'Questions',
  'Ideas',
  'General'
];

// Local storage functions
const getLocalTopics = () => {
  try {
    const stored = localStorage.getItem(TOPICS_STORAGE_KEY);
    return stored ? JSON.parse(stored).map(t => ({ ...t, timestamp: new Date(t.timestamp) })) : [];
  } catch {
    return [];
  }
};

const saveLocalTopics = (topics) => {
  try {
    localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topics));
  } catch {
    console.log('Error saving topics');
  }
};

export default function NewForumTopic() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: 'Recreation',
    tags: ''
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="new-topic-page">
        <div className="new-topic-container">
          <div className="new-topic-auth-required">
            <MessageSquare size={48} className="new-topic-auth-icon" />
            <h2>Login Required</h2>
            <p>You need to be logged in to start a new discussion.</p>
            <div className="new-topic-auth-actions">
              <button onClick={() => navigate('/login')} className="new-topic-btn-primary">
                Log In
              </button>
              <button onClick={() => navigate('/forum')} className="new-topic-btn-secondary">
                Back to Forum
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitTopic = async (e) => {
    e.preventDefault();
    if (!newTopic.title.trim() || !newTopic.content.trim()) {
      alert('Please fill in the title and content');
      return;
    }

    setIsSubmitting(true);
    
    const localTopicId = `topic-${Date.now()}`; // Fallback ID for local storage only
    const topicData = {
      title: newTopic.title.trim(),
      content: newTopic.content.trim(),
      category: newTopic.category,
      tags: newTopic.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      author: user?.email?.split('@')[0] || 'Anonymous',
      authorEmail: user?.email || '',
      authorId: user?.uid || '',
      timestamp: new Date(),
      replies: 0,
      views: 0,
      likes: 0,
      isPinned: false,
      isResolved: false,
      trending: false
    };

    // Try to save to Firebase in global collection
    let savedToFirebase = false;
    let firebaseDocId = null;
    
    if (user?.uid) {
      try {
        const topicsRef = collection(db, 'forumTopics');
        const docRef = await addDoc(topicsRef, {
          ...topicData,
          timestamp: new Date()
        });
        savedToFirebase = true;
        firebaseDocId = docRef.id; // Use Firebase-generated document ID
      } catch (firebaseError) {
        console.log('Firebase save failed, using local storage:', firebaseError.code);
      }
    }

    // Save to local storage as backup (with appropriate ID)
    const localTopics = getLocalTopics();
    const localTopicData = { ...topicData, id: firebaseDocId || localTopicId };
    saveLocalTopics([localTopicData, ...localTopics]);

    alert(savedToFirebase ? 'Topic created successfully!' : 'Topic saved locally!');
    
    // Navigate using Firebase doc ID if available, otherwise use local ID
    navigate(`/forum/${firebaseDocId || localTopicId}`);
    setIsSubmitting(false);
  };

  return (
    <div className="new-topic-page">
      <div className="new-topic-container">
        <button className="new-topic-back-btn" onClick={() => navigate('/forum')}>
          <ArrowLeft size={20} />
          Back to Forum
        </button>

        <div className="new-topic-header">
          <h1>Start a New Discussion</h1>
          <p>Share your thoughts, ask questions, or connect with the community</p>
        </div>

        <form onSubmit={handleSubmitTopic} className="new-topic-form">
          <div className="new-topic-form-group">
            <label htmlFor="title">Topic Title *</label>
            <input
              id="title"
              type="text"
              value={newTopic.title}
              onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What would you like to discuss?"
              required
            />
          </div>

          <div className="new-topic-form-row">
            <div className="new-topic-form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={newTopic.category}
                onChange={(e) => setNewTopic(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="new-topic-form-group">
              <label htmlFor="tags">
                <Tag size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                value={newTopic.tags}
                onChange={(e) => setNewTopic(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="parks, family, outdoor"
              />
            </div>
          </div>

          <div className="new-topic-form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              value={newTopic.content}
              onChange={(e) => setNewTopic(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Describe your topic in detail...

What do you want to share or discuss with the community?
Include any relevant details, questions, or context."
              rows={12}
              required
            />
            <div className="new-topic-content-hint">
              Be respectful and constructive in your discussions.
            </div>
          </div>

          <div className="new-topic-guidelines">
            <h4>Community Guidelines</h4>
            <ul>
              <li>Be respectful and courteous to all community members</li>
              <li>Stay on topic and post in the appropriate category</li>
              <li>No spam, advertisements, or promotional content</li>
              <li>Share helpful information and be constructive</li>
            </ul>
          </div>

          <div className="new-topic-actions">
            <button type="button" className="new-topic-btn-secondary" onClick={() => navigate('/forum')}>
              Cancel
            </button>
            <button type="submit" className="new-topic-btn-primary" disabled={isSubmitting}>
              <Send size={18} />
              {isSubmitting ? 'Creating...' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
