import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, ThumbsUp, Eye, Clock, TrendingUp,
  Users, Plus, Search, Filter, Pin,
  MessageCircle, Heart, Share2, Bookmark, BookmarkCheck,
  CheckCircle, AlertCircle, HelpCircle, Lightbulb,
  ChevronRight, Send, X, BarChart3, Vote
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../build/auth';
import PageHero from '../components/PageHero';
import '../css/forum.css';

// Local storage keys
const TOPICS_STORAGE_KEY = 'coppell_forum_topics';
const POLLS_STORAGE_KEY = 'coppell_forum_polls';
const BOOKMARKS_STORAGE_KEY = 'coppell_forum_bookmarks';

// Helper functions
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

const getLocalPolls = () => {
  try {
    const stored = localStorage.getItem(POLLS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalPolls = (polls) => {
  try {
    localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(polls));
  } catch {
    console.log('Error saving polls');
  }
};

const getBookmarks = () => {
  try {
    const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveBookmarks = (bookmarks) => {
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    console.log('Error saving bookmarks');
  }
};

const defaultTopics = [
  {
    id: 'default-1',
    title: 'Best places for family picnics in Coppell?',
    author: 'Sarah Johnson',
    authorEmail: 'sarah@example.com',
    category: 'Recreation',
    content: 'Looking for recommendations on parks with good facilities for kids and BBQ areas. Would love to hear about your favorite spots!',
    replies: 24,
    views: 342,
    likes: 18,
    isPinned: true,
    isResolved: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ['parks', 'family', 'outdoor'],
    trending: true
  },
  {
    id: 'default-2',
    title: 'Community garden update - New plots available!',
    author: 'Mike Chen',
    authorEmail: 'mike@example.com',
    category: 'Announcements',
    content: 'Exciting news! We have 15 new garden plots ready for spring planting. Contact the community center to reserve yours.',
    replies: 45,
    views: 892,
    likes: 67,
    isPinned: true,
    isResolved: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    tags: ['gardening', 'community', 'announcement'],
    trending: true
  },
  {
    id: 'default-3',
    title: 'Anyone interested in starting a book club?',
    author: 'Emily Rodriguez',
    authorEmail: 'emily@example.com',
    category: 'Groups & Clubs',
    content: "I'd love to start a monthly book club. Looking for 8-10 interested readers who enjoy discussing fiction and non-fiction alike.",
    replies: 31,
    views: 456,
    likes: 42,
    isPinned: false,
    isResolved: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tags: ['books', 'social', 'monthly'],
    trending: true
  },
  {
    id: 'default-4',
    title: 'Local business recommendations needed',
    author: 'David Park',
    authorEmail: 'david@example.com',
    category: 'Support Local',
    content: 'Just moved to Coppell! Looking for recommendations for plumber, electrician, and handyman services. Thanks in advance!',
    replies: 18,
    views: 234,
    likes: 12,
    isPinned: false,
    isResolved: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ['services', 'local business', 'help'],
    trending: false
  },
  {
    id: 'default-5',
    title: 'Youth sports registration opening soon',
    author: 'Lisa Thompson',
    authorEmail: 'lisa@example.com',
    category: 'Youth & Education',
    content: 'Spring soccer and baseball registration starts next week. Early bird discount available until the end of the month.',
    replies: 28,
    views: 678,
    likes: 54,
    isPinned: false,
    isResolved: false,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ['sports', 'youth', 'registration'],
    trending: true
  },
  {
    id: 'default-6',
    title: 'Ideas for summer festival activities?',
    author: 'James Wilson',
    authorEmail: 'james@example.com',
    category: 'Events',
    content: "Planning committee is gathering ideas for this year's summer festival. What would you like to see? Food, music, activities?",
    replies: 52,
    views: 1024,
    likes: 89,
    isPinned: false,
    isResolved: false,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    tags: ['festival', 'planning', 'ideas'],
    trending: true
  }
];

const categories = [
  { name: 'All Topics', icon: MessageSquare, count: 0 },
  { name: 'Announcements', icon: AlertCircle, count: 0 },
  { name: 'Recreation', icon: Heart, count: 0 },
  { name: 'Groups & Clubs', icon: Users, count: 0 },
  { name: 'Support Local', icon: Lightbulb, count: 0 },
  { name: 'Youth & Education', icon: TrendingUp, count: 0 },
  { name: 'Events', icon: MessageCircle, count: 0 }
];

const polls = [
  {
    id: 'poll-1',
    question: 'What type of community event would you most like to see?',
    options: [
      { text: 'Outdoor Concert Series', votes: 234 },
      { text: 'Food Truck Festival', votes: 189 },
      { text: 'Art & Craft Fair', votes: 156 },
      { text: 'Sports Tournament', votes: 98 }
    ],
    totalVotes: 677,
    endsIn: '3 days',
    createdBy: 'Community Team'
  },
  {
    id: 'poll-2',
    question: 'Best time for community meetings?',
    options: [
      { text: 'Weekday Evenings', votes: 145 },
      { text: 'Saturday Mornings', votes: 198 },
      { text: 'Sunday Afternoons', votes: 167 },
      { text: 'Virtual Only', votes: 78 }
    ],
    totalVotes: 588,
    endsIn: '5 days',
    createdBy: 'Community Team'
  }
];

export default function Forum() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [topics, setTopics] = useState([...getLocalTopics(), ...defaultTopics]);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', content: '', category: 'Recreation', tags: '' });
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', '', '', ''], duration: '7' });
  const [likedTopics, setLikedTopics] = useState([]);
  const [pollVotes, setPollVotes] = useState({});
  const [bookmarkedTopics, setBookmarkedTopics] = useState(getBookmarks());
  const [allPolls, setAllPolls] = useState([...getLocalPolls(), ...polls]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load topics from Firebase on mount
  useEffect(() => {
    let unsubscribe = null;
    
    const loadTopics = async () => {
      // First load local topics
      const localTopics = getLocalTopics();
      
      // Create a Map to ensure unique topics by ID
      const topicsMap = new Map();
      
      // Add defaults first (lowest priority)
      defaultTopics.forEach(t => topicsMap.set(t.id, t));
      
      // Add local topics (higher priority - overwrites defaults)
      localTopics.forEach(t => topicsMap.set(t.id, t));
      
      setTopics(Array.from(topicsMap.values()));
      
      // Try Firebase - load from global collection (accessible to all users)
      try {
        const topicsRef = collection(db, 'forumTopics');
        const q = query(topicsRef, orderBy('timestamp', 'desc'));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          const firebaseTopics = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
            isFirebaseTopic: true
          }));
          
          // Create fresh Map for combining
          const allTopicsMap = new Map();
          
          // Add defaults first (lowest priority)
          defaultTopics.forEach(t => allTopicsMap.set(t.id, t));
          
          // Add local topics (medium priority)
          localTopics.forEach(t => allTopicsMap.set(t.id, t));
          
          // Add Firebase topics (highest priority - overwrites others)
          firebaseTopics.forEach(t => allTopicsMap.set(t.id, t));
          
          setTopics(Array.from(allTopicsMap.values()));
        }, (error) => {
          console.log('Firebase unavailable, using local storage:', error.code);
        });
      } catch (error) {
        console.log('Firebase setup error:', error);
      }
    };

    loadTopics();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []); // No dependency on user - data should load for everyone

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getCategoryCounts = () => {
    const counts = {};
    topics.forEach(topic => {
      counts[topic.category] = (counts[topic.category] || 0) + 1;
    });
    counts['All Topics'] = topics.length;
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const filteredTopics = topics.filter(topic => {
    const matchesCategory = selectedCategory === 'All Topics' || topic.category === selectedCategory;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'popular') return (b.likes || 0) - (a.likes || 0);
    if (sortBy === 'trending') return (b.views || 0) - (a.views || 0);
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const handleNewTopic = async () => {
    if (!isAuthenticated) {
      alert('Please log in to create a new topic');
      return;
    }
    navigate('/forum/new-topic');
  };

  const handleSubmitTopic = async (e) => {
    e.preventDefault();
    if (!newTopic.title.trim() || !newTopic.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    const topicId = `topic-${Date.now()}`;
    const topicData = {
      id: topicId,
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
    if (user?.uid) {
      try {
        const topicsRef = collection(db, 'forumTopics');
        await addDoc(topicsRef, {
          ...topicData,
          timestamp: new Date()
        });
        savedToFirebase = true;
        console.log('Topic saved to Firebase successfully');
      } catch (firebaseError) {
        console.error('Firebase save failed:', firebaseError.code, firebaseError.message);
      }
    } else {
      console.log('No user logged in, skipping Firebase save');
    }

    // Always save to local storage as backup
    const localTopics = getLocalTopics();
    saveLocalTopics([topicData, ...localTopics]);

    // Update UI immediately
    setTopics(prev => [topicData, ...prev]);
    
    setNewTopic({ title: '', content: '', category: 'Recreation', tags: '' });
    setShowNewTopicModal(false);
    setIsSubmitting(false);
    alert(savedToFirebase ? 'Topic created successfully!' : 'Topic saved locally!');
  };

  const handleCreatePoll = () => {
    if (!isAuthenticated) {
      alert('Please log in to create a poll');
      return;
    }
    setShowPollModal(true);
  };

  const handleSubmitPoll = (e) => {
    e.preventDefault();
    if (!newPoll.question.trim() || newPoll.options.filter(o => o.trim()).length < 2) {
      alert('Please provide a question and at least 2 options');
      return;
    }

    const pollData = {
      id: `poll-${Date.now()}`,
      question: newPoll.question.trim(),
      options: newPoll.options.filter(o => o.trim()).map(text => ({ text, votes: 0 })),
      totalVotes: 0,
      endsIn: `${newPoll.duration} days`,
      createdBy: user?.email?.split('@')[0] || 'Anonymous'
    };

    const localPolls = getLocalPolls();
    saveLocalPolls([pollData, ...localPolls]);
    setAllPolls(prev => [pollData, ...prev]);
    
    setNewPoll({ question: '', options: ['', '', '', ''], duration: '7' });
    setShowPollModal(false);
    alert('Poll created successfully!');
  };

  const handleBookmark = (topicId) => {
    if (!isAuthenticated) {
      alert('Please log in to bookmark topics');
      return;
    }

    const isBookmarked = bookmarkedTopics.includes(topicId);
    const newBookmarks = isBookmarked 
      ? bookmarkedTopics.filter(id => id !== topicId)
      : [...bookmarkedTopics, topicId];
    
    setBookmarkedTopics(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  const handleLike = async (topicId) => {
    if (!isAuthenticated) {
      alert('Please log in to like topics');
      return;
    }

    const isLiked = likedTopics.includes(topicId);
    
    if (isLiked) {
      setLikedTopics(prev => prev.filter(id => id !== topicId));
    } else {
      setLikedTopics(prev => [...prev, topicId]);
    }

    // Update topic likes in state
    setTopics(prev => prev.map(topic => {
      if (topic.id === topicId) {
        return { ...topic, likes: (topic.likes || 0) + (isLiked ? -1 : 1) };
      }
      return topic;
    }));

    // Update local storage
    const localTopics = getLocalTopics();
    const updatedLocalTopics = localTopics.map(topic => {
      if (topic.id === topicId) {
        return { ...topic, likes: (topic.likes || 0) + (isLiked ? -1 : 1) };
      }
      return topic;
    });
    saveLocalTopics(updatedLocalTopics);
  };

  const handlePollVote = (pollId, optionIndex) => {
    if (!isAuthenticated) {
      alert('Please log in to vote');
      return;
    }
    
    // Check if already voted
    if (pollVotes[pollId] !== undefined) {
      alert('You have already voted on this poll');
      return;
    }
    
    setPollVotes(prev => ({
      ...prev,
      [pollId]: optionIndex
    }));

    // Update poll votes
    setAllPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        const updatedOptions = poll.options.map((opt, idx) => 
          idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return { ...poll, options: updatedOptions, totalVotes: poll.totalVotes + 1 };
      }
      return poll;
    }));

    // Save to local storage
    const localPolls = getLocalPolls();
    const updatedPolls = localPolls.map(poll => {
      if (poll.id === pollId) {
        const updatedOptions = poll.options.map((opt, idx) => 
          idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return { ...poll, options: updatedOptions, totalVotes: poll.totalVotes + 1 };
      }
      return poll;
    });
    saveLocalPolls(updatedPolls);
  };

  const handleTopicClick = (topicId) => {
    navigate(`/forum/${topicId}`);
  };

  const forumStats = [
    { label: 'Active Members', value: 3500, icon: Users },
    { label: 'Total Topics', value: topics.length + 1234, icon: MessageSquare },
    { label: 'Discussions', value: 8900, icon: MessageCircle },
    { label: 'Resolved Topics', value: 950, icon: CheckCircle }
  ];

  return (
    <div className="forum-page">
      <PageHero
        title="Community Forum"
        subtitle="Connect with neighbors, share ideas, ask questions, and stay informed about what's happening in Coppell"
        className="forum-hero"
      />

      {/* Forum Stats */}
      <section className="forum-stats-section">
        <div className="forum-stats-grid">
          {forumStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="forum-stat-card">
                <div className="forum-stat-icon">
                  <Icon size={28} />
                </div>
                <div className="forum-stat-info">
                  <div className="forum-stat-value">{stat.value.toLocaleString()}</div>
                  <div className="forum-stat-label">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content */}
      <section className="forum-main">
        <div className="forum-container">
          <div className="forum-layout">
            {/* Sidebar - Categories */}
            <aside className="forum-sidebar">
              <div className="forum-sidebar-card">
                <div className="forum-sidebar-header">
                  <Filter size={20} />
                  <h3>Categories</h3>
                </div>

                <div className="forum-categories-list">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.name;
                    const count = categoryCounts[category.name] || 0;
                    
                    return (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`forum-category-btn ${isActive ? 'active' : ''}`}
                      >
                        <div className="forum-category-left">
                          <Icon size={18} />
                          <span>{category.name}</span>
                        </div>
                        <span className="forum-category-count">{count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Community Guidelines */}
                <div className="forum-guidelines">
                  <div className="forum-guidelines-header">
                    <HelpCircle size={18} />
                    <span>Community Guidelines</span>
                  </div>
                  <p>Be respectful, helpful, and kind. Together we build a better community.</p>
                </div>
              </div>
            </aside>

            {/* Main Content - Topics */}
            <div className="forum-content">
              {/* Search and Actions */}
              <div className="forum-actions">
                <div className="forum-search">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="forum-new-topic-btn" onClick={handleNewTopic}>
                  <Plus size={18} />
                  New Topic
                </button>
              </div>

              {/* Sort Options */}
              <div className="forum-sort-bar">
                <h2>{filteredTopics.length} Discussions</h2>
                <div className="forum-sort-buttons">
                  {['recent', 'popular', 'trending'].map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`forum-sort-btn ${sortBy === sort ? 'active' : ''}`}
                    >
                      {sort.charAt(0).toUpperCase() + sort.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics List */}
              <div className="forum-topics-list">
                {filteredTopics.map((topic) => (
                  <div 
                    key={topic.id} 
                    className="forum-topic-card"
                    onClick={() => handleTopicClick(topic.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="forum-topic-avatar">
                      {topic.author?.charAt(0).toUpperCase() || 'A'}
                    </div>

                    <div className="forum-topic-content">
                      {/* Header */}
                      <div className="forum-topic-header">
                        <div className="forum-topic-badges">
                          {topic.isPinned && (
                            <span className="forum-badge pinned">
                              <Pin size={12} />
                              Pinned
                            </span>
                          )}
                          {topic.trending && (
                            <span className="forum-badge trending">
                              <TrendingUp size={12} />
                              Trending
                            </span>
                          )}
                          <span className="forum-badge category">{topic.category}</span>
                          {topic.isResolved && (
                            <span className="forum-badge resolved">
                              <CheckCircle size={12} />
                              Resolved
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="forum-topic-title">{topic.title}</h3>
                      <p className="forum-topic-excerpt">{topic.content}</p>

                      {/* Tags */}
                      {topic.tags && topic.tags.length > 0 && (
                        <div className="forum-topic-tags">
                          {topic.tags.map((tag) => (
                            <span key={tag} className="forum-tag">#{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="forum-topic-meta">
                        <span className="forum-topic-author">{topic.author}</span>
                        <span className="forum-meta-separator">•</span>
                        <span className="forum-topic-time">
                          <Clock size={14} />
                          {formatTimestamp(topic.timestamp)}
                        </span>
                      </div>

                      {/* Footer Stats */}
                      <div className="forum-topic-footer">
                        <div className="forum-topic-stats">
                          <button 
                            className={`forum-stat-btn ${likedTopics.includes(topic.id) ? 'liked' : ''}`}
                            onClick={(e) => { e.stopPropagation(); handleLike(topic.id); }}
                          >
                            <ThumbsUp size={16} />
                            <span>{topic.likes || 0}</span>
                          </button>
                          <div className="forum-stat-item">
                            <MessageCircle size={16} />
                            <span>{topic.replies || 0}</span>
                          </div>
                          <div className="forum-stat-item">
                            <Eye size={16} />
                            <span>{topic.views || 0}</span>
                          </div>
                        </div>

                        <div className="forum-topic-actions">
                          <button 
                            className={`forum-action-btn ${bookmarkedTopics.includes(topic.id) ? 'bookmarked' : ''}`}
                            onClick={(e) => { e.stopPropagation(); handleBookmark(topic.id); }}
                          >
                            {bookmarkedTopics.includes(topic.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                          </button>
                          <button className="forum-action-btn" onClick={(e) => e.stopPropagation()}>
                            <Share2 size={16} />
                          </button>
                          <ChevronRight size={18} className="forum-chevron" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Community Polls */}
              <div className="forum-polls-section">
                <div className="forum-polls-header">
                  <h2>
                    <BarChart3 size={24} />
                    Active Polls
                  </h2>
                  <button className="forum-create-poll-btn" onClick={handleCreatePoll}>
                    <Vote size={16} />
                    Create Poll
                  </button>
                </div>
                <div className="forum-polls-list">
                  {allPolls.map((poll) => (
                    <div key={poll.id} className="forum-poll-card">
                      <div className="forum-poll-header">
                        <span className="forum-poll-label">Community Poll</span>
                        <span className="forum-poll-ends">Ends in {poll.endsIn}</span>
                      </div>

                      <h3>{poll.question}</h3>
                      {poll.createdBy && (
                        <p className="forum-poll-author">by {poll.createdBy}</p>
                      )}

                      <div className="forum-poll-options">
                        {poll.options.map((option, index) => {
                          const percentage = poll.totalVotes > 0 
                            ? Math.round((option.votes / poll.totalVotes) * 100) 
                            : 0;
                          const isSelected = pollVotes[poll.id] === index;
                          const hasVoted = pollVotes[poll.id] !== undefined;

                          return (
                            <button
                              key={index}
                              onClick={() => handlePollVote(poll.id, index)}
                              className={`forum-poll-option ${isSelected ? 'selected' : ''} ${hasVoted ? 'voted' : ''}`}
                              disabled={hasVoted}
                            >
                              <div 
                                className="forum-poll-progress" 
                                style={{ width: hasVoted ? `${percentage}%` : '0%' }}
                              />
                              <div className="forum-poll-option-content">
                                <span>{option.text}</span>
                                {hasVoted && (
                                  <div className="forum-poll-option-stats">
                                    <span className="forum-poll-votes">{option.votes} votes</span>
                                    <span className="forum-poll-percentage">{percentage}%</span>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="forum-poll-total">
                        {poll.totalVotes.toLocaleString()} total votes
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="forum-cta-section">
        <div className="forum-cta-content">
          <Users size={48} />
          <h2>Be Part of the Conversation</h2>
          <p>
            Your ideas, questions, and experiences help make Coppell a better place for everyone.
            Join thousands of neighbors already engaged in meaningful discussions.
          </p>
          <button className="forum-cta-btn" onClick={handleNewTopic}>
            Start Your First Topic
            <ChevronRight size={18} />
          </button>

          <div className="forum-cta-features">
            <div className="forum-cta-feature">
              <MessageSquare size={32} />
              <h4>Ask Questions</h4>
              <p>Get help from neighbors</p>
            </div>
            <div className="forum-cta-feature">
              <Lightbulb size={32} />
              <h4>Share Ideas</h4>
              <p>Contribute to community projects</p>
            </div>
            <div className="forum-cta-feature">
              <TrendingUp size={32} />
              <h4>Stay Informed</h4>
              <p>Latest community updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="forum-modal-overlay" onClick={() => setShowNewTopicModal(false)}>
          <div className="forum-modal" onClick={(e) => e.stopPropagation()}>
            <div className="forum-modal-header">
              <h2>Create New Topic</h2>
              <button className="forum-modal-close" onClick={() => setShowNewTopicModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitTopic} className="forum-modal-form">
              <div className="forum-form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's your topic about?"
                  required
                />
              </div>

              <div className="forum-form-group">
                <label>Category *</label>
                <select
                  value={newTopic.category}
                  onChange={(e) => setNewTopic(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.filter(c => c.name !== 'All Topics').map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="forum-form-group">
                <label>Content *</label>
                <textarea
                  value={newTopic.content}
                  onChange={(e) => setNewTopic(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your thoughts, questions, or ideas..."
                  rows={5}
                  required
                />
              </div>

              <div className="forum-form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTopic.tags}
                  onChange={(e) => setNewTopic(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., community, events, help"
                />
              </div>

              <div className="forum-modal-actions">
                <button type="button" className="forum-btn-secondary" onClick={() => setShowNewTopicModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="forum-btn-primary" disabled={isSubmitting}>
                  <Send size={18} />
                  {isSubmitting ? 'Posting...' : 'Post Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Poll Modal */}
      {showPollModal && (
        <div className="forum-modal-overlay" onClick={() => setShowPollModal(false)}>
          <div className="forum-modal" onClick={(e) => e.stopPropagation()}>
            <div className="forum-modal-header">
              <h2>Create New Poll</h2>
              <button className="forum-modal-close" onClick={() => setShowPollModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitPoll} className="forum-modal-form">
              <div className="forum-form-group">
                <label>Question *</label>
                <input
                  type="text"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="What would you like to ask the community?"
                  required
                />
              </div>

              <div className="forum-form-group">
                <label>Options (at least 2 required)</label>
                {newPoll.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newPoll.options];
                      newOptions[index] = e.target.value;
                      setNewPoll(prev => ({ ...prev, options: newOptions }));
                    }}
                    placeholder={`Option ${index + 1}`}
                    style={{ marginBottom: '0.5rem' }}
                  />
                ))}
                <button 
                  type="button" 
                  className="forum-add-option-btn"
                  onClick={() => setNewPoll(prev => ({ ...prev, options: [...prev.options, ''] }))}
                >
                  <Plus size={14} />
                  Add Option
                </button>
              </div>

              <div className="forum-form-group">
                <label>Duration (days)</label>
                <select
                  value={newPoll.duration}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, duration: e.target.value }))}
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>

              <div className="forum-modal-actions">
                <button type="button" className="forum-btn-secondary" onClick={() => setShowPollModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="forum-btn-primary">
                  <BarChart3 size={18} />
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
