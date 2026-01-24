import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ThumbsUp, Eye, Clock, MessageCircle, 
  Send, Share2, Bookmark, BookmarkCheck, Flag,
  MoreHorizontal, Edit2, Trash2, CheckCircle, Pin,
  Heart, Reply
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../build/auth';
import '../css/forumTopicDetail.css';

// Local storage keys
const TOPICS_STORAGE_KEY = 'coppell_forum_topics';
const REPLIES_STORAGE_KEY = 'coppell_forum_replies';
const BOOKMARKS_STORAGE_KEY = 'coppell_forum_bookmarks';

// Helper functions for local storage
const getLocalTopics = () => {
  try {
    const stored = localStorage.getItem(TOPICS_STORAGE_KEY);
    return stored ? JSON.parse(stored).map(t => ({ ...t, timestamp: new Date(t.timestamp) })) : [];
  } catch {
    return [];
  }
};

const getLocalReplies = (topicId) => {
  try {
    const stored = localStorage.getItem(REPLIES_STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : {};
    return (all[topicId] || []).map(r => ({ ...r, timestamp: new Date(r.timestamp) }));
  } catch {
    return [];
  }
};

const saveLocalReplies = (topicId, replies) => {
  try {
    const stored = localStorage.getItem(REPLIES_STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : {};
    all[topicId] = replies;
    localStorage.setItem(REPLIES_STORAGE_KEY, JSON.stringify(all));
  } catch {
    console.log('Error saving replies');
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
  }
];

const defaultReplies = {
  'default-1': [
    {
      id: 'reply-1',
      author: 'John Smith',
      authorEmail: 'john@example.com',
      content: 'Andrew Brown Park is amazing! They have great playgrounds and covered picnic areas. We go there almost every weekend.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likes: 12,
      isAnswer: false
    },
    {
      id: 'reply-2',
      author: 'Maria Garcia',
      authorEmail: 'maria@example.com',
      content: 'I recommend Coppell Nature Park for a more quiet experience. Less crowded and beautiful trails for kids to explore.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      likes: 8,
      isAnswer: true
    }
  ],
  'default-2': [
    {
      id: 'reply-3',
      author: 'Tom Wilson',
      authorEmail: 'tom@example.com',
      content: 'This is great news! How do we sign up for a plot? Is there a waiting list?',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 5,
      isAnswer: false
    }
  ],
  'default-3': [
    {
      id: 'reply-4',
      author: 'Lisa Brown',
      authorEmail: 'lisa@example.com',
      content: 'Count me in! I love reading and have been looking for a book club to join.',
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
      likes: 15,
      isAnswer: false
    }
  ]
};

export default function ForumTopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showActions, setShowActions] = useState(null);
  const [likedReplies, setLikedReplies] = useState([]);
  const [sortReplies, setSortReplies] = useState('newest');

  useEffect(() => {
    const loadTopic = async () => {
      setLoading(true);
      let firebaseLoaded = false;
      
      // Check bookmarks
      const bookmarks = getBookmarks();
      setIsBookmarked(bookmarks.includes(id));

      // Check if it's a default topic
      if (id.startsWith('default-')) {
        const defaultTopic = defaultTopics.find(t => t.id === id);
        if (defaultTopic) {
          setTopic(defaultTopic);
          setLikesCount(defaultTopic.likes || 0);
          const topicReplies = defaultReplies[id] || [];
          const localReplies = getLocalReplies(id);
          setReplies([...localReplies, ...topicReplies]);
          setLoading(false);
          return;
        }
      }

      // For topic-* IDs (local-only topics), check local storage
      if (id.startsWith('topic-')) {
        const localTopics = getLocalTopics();
        const localTopic = localTopics.find(t => t.id === id);
        if (localTopic) {
          setTopic(localTopic);
          setLikesCount(localTopic.likes || 0);
          setReplies(getLocalReplies(id));
          setLoading(false);
          return;
        }
        // If not found locally, show not found (topic-* IDs are local-only)
        setTopic(null);
        setLoading(false);
        return;
      }

      // For Firebase document IDs, try local storage first as cache
      const localTopics = getLocalTopics();
      const localTopic = localTopics.find(t => t.id === id);
      if (localTopic) {
        setTopic(localTopic);
        setLikesCount(localTopic.likes || 0);
        setReplies(getLocalReplies(id));
      }

      // Try Firebase - load from global collection
      try {
        const topicRef = doc(db, 'forumTopics', id);
        
        const unsubscribe = onSnapshot(topicRef, (docSnap) => {
          firebaseLoaded = true;
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTopic({
              id: docSnap.id,
              ...data,
              timestamp: data.timestamp?.toDate() || new Date()
            });
            setLikesCount(data.likes || 0);
            setReplies(data.replies || []);
          } else if (!localTopic) {
            // Only show "not found" if it's not in Firebase AND not in local storage
            setTopic(null);
          }
          setLoading(false);
        }, () => {
          // Firebase error - use local data if available
          firebaseLoaded = true;
          if (!localTopic) {
            setTopic(null);
          }
          setLoading(false);
        });

        // Set a timeout to stop loading after 5 seconds if Firebase hasn't responded
        const timeout = setTimeout(() => {
          if (!firebaseLoaded && !localTopic) {
            setTopic(null);
            setLoading(false);
          }
        }, 5000);

        return () => {
          clearTimeout(timeout);
          unsubscribe();
        };
      } catch {
        setLoading(false);
      }
    };

    loadTopic();
  }, [id]); // Only depend on id - data should load for everyone, not just logged in users

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleLikeTopic = () => {
    if (!isAuthenticated) {
      alert('Please log in to like this topic');
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
  };

  const handleLikeReply = (replyId) => {
    if (!isAuthenticated) {
      alert('Please log in to like this reply');
      return;
    }

    const isLiked = likedReplies.includes(replyId);
    if (isLiked) {
      setLikedReplies(prev => prev.filter(id => id !== replyId));
    } else {
      setLikedReplies(prev => [...prev, replyId]);
    }

    setReplies(prev => prev.map(reply => {
      if (reply.id === replyId) {
        return { ...reply, likes: (reply.likes || 0) + (isLiked ? -1 : 1) };
      }
      return reply;
    }));
  };

  const handleBookmark = () => {
    const bookmarks = getBookmarks();
    if (isBookmarked) {
      saveBookmarks(bookmarks.filter(b => b !== id));
    } else {
      saveBookmarks([...bookmarks, id]);
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: topic.title,
          text: topic.content,
          url: url
        });
      } catch {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    
    if (!isAuthenticated) {
      alert('Please log in to reply');
      return;
    }

    setIsSubmitting(true);
    
    const replyData = {
      id: `reply-${Date.now()}`,
      author: user?.email?.split('@')[0] || 'Anonymous',
      authorEmail: user?.email || '',
      authorId: user?.uid || '',
      content: replyingTo 
        ? `@${replyingTo.author} ${newReply.trim()}`
        : newReply.trim(),
      timestamp: new Date(),
      likes: 0,
      isAnswer: false,
      parentReplyId: replyingTo?.id || null
    };

    // Update local state
    const updatedReplies = [replyData, ...replies];
    setReplies(updatedReplies);
    saveLocalReplies(id, updatedReplies);
    
    setNewReply('');
    setReplyingTo(null);
    setIsSubmitting(false);
  };

  const handleEditReply = (reply) => {
    setEditingReply(reply.id);
    setEditContent(reply.content);
    setShowActions(null);
  };

  const handleSaveEdit = (replyId) => {
    if (!editContent.trim()) return;

    const updatedReplies = replies.map(reply => {
      if (reply.id === replyId) {
        return { ...reply, content: editContent.trim(), edited: true };
      }
      return reply;
    });

    setReplies(updatedReplies);
    saveLocalReplies(id, updatedReplies);
    setEditingReply(null);
    setEditContent('');
  };

  const handleDeleteReply = (replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    const updatedReplies = replies.filter(reply => reply.id !== replyId);
    setReplies(updatedReplies);
    saveLocalReplies(id, updatedReplies);
    setShowActions(null);
  };

  const handleMarkAsAnswer = (replyId) => {
    const updatedReplies = replies.map(reply => ({
      ...reply,
      isAnswer: reply.id === replyId ? !reply.isAnswer : false
    }));
    setReplies(updatedReplies);
    saveLocalReplies(id, updatedReplies);
    setShowActions(null);
  };

  const sortedReplies = [...replies].sort((a, b) => {
    // Always show answers first
    if (a.isAnswer && !b.isAnswer) return -1;
    if (!a.isAnswer && b.isAnswer) return 1;
    
    if (sortReplies === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
    if (sortReplies === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp);
    if (sortReplies === 'popular') return (b.likes || 0) - (a.likes || 0);
    return 0;
  });

  if (loading) {
    return (
      <div className="forum-topic-loading">
        <div className="forum-topic-loading-spinner"></div>
        <p>Loading discussion...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="forum-topic-not-found">
        <div className="forum-topic-not-found-content">
          <h2>Topic Not Found</h2>
          <p>This discussion may have been removed or does not exist.</p>
          <button onClick={() => navigate('/forum')} className="forum-topic-back-btn">
            Return to Forum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forum-topic-detail">
      {/* Header */}
      <div className="forum-topic-header">
        <button onClick={() => navigate('/forum')} className="forum-topic-back-link">
          <ArrowLeft size={20} />
          Back to Forum
        </button>
      </div>

      {/* Main Topic */}
      <div className="forum-topic-main">
        <div className="forum-topic-badges">
          {topic.isPinned && (
            <span className="forum-topic-badge pinned">
              <Pin size={12} />
              Pinned
            </span>
          )}
          {topic.isResolved && (
            <span className="forum-topic-badge resolved">
              <CheckCircle size={12} />
              Resolved
            </span>
          )}
          <span className="forum-topic-badge category">{topic.category}</span>
        </div>

        <h1 className="forum-topic-title">{topic.title}</h1>

        <div className="forum-topic-author-info">
          <div className="forum-topic-avatar">
            {topic.author?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="forum-topic-author-details">
            <span className="forum-topic-author-name">{topic.author}</span>
            <span className="forum-topic-timestamp">
              <Clock size={14} />
              {formatTimestamp(topic.timestamp)}
            </span>
          </div>
        </div>

        <div className="forum-topic-body">
          <p>{topic.content}</p>
        </div>

        {topic.tags && topic.tags.length > 0 && (
          <div className="forum-topic-tags">
            {topic.tags.map((tag) => (
              <span key={tag} className="forum-topic-tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="forum-topic-actions">
          <div className="forum-topic-stats">
            <button 
              className={`forum-topic-action-btn ${liked ? 'liked' : ''}`}
              onClick={handleLikeTopic}
            >
              <ThumbsUp size={18} fill={liked ? 'currentColor' : 'none'} />
              <span>{likesCount}</span>
            </button>
            <div className="forum-topic-stat">
              <MessageCircle size={18} />
              <span>{replies.length} replies</span>
            </div>
            <div className="forum-topic-stat">
              <Eye size={18} />
              <span>{topic.views || 0} views</span>
            </div>
          </div>
          <div className="forum-topic-action-buttons">
            <button 
              className={`forum-topic-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={handleBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            <button className="forum-topic-action-btn" onClick={handleShare} title="Share">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      <div className="forum-reply-form-container">
        <h3>
          <MessageCircle size={20} />
          {replyingTo ? `Replying to ${replyingTo.author}` : 'Add a Reply'}
          {replyingTo && (
            <button className="forum-reply-cancel" onClick={() => setReplyingTo(null)}>
              Cancel
            </button>
          )}
        </h3>
        <form onSubmit={handleSubmitReply} className="forum-reply-form">
          <div className="forum-reply-input-wrapper">
            <div className="forum-reply-avatar">
              {isAuthenticated ? (user?.email?.[0]?.toUpperCase() || 'U') : '?'}
            </div>
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder={isAuthenticated ? "Share your thoughts..." : "Log in to reply..."}
              disabled={!isAuthenticated}
              rows={4}
            />
          </div>
          <button 
            type="submit" 
            className="forum-reply-submit"
            disabled={!isAuthenticated || isSubmitting || !newReply.trim()}
          >
            <Send size={18} />
            {isSubmitting ? 'Posting...' : 'Post Reply'}
          </button>
        </form>
      </div>

      {/* Replies Section */}
      <div className="forum-replies-section">
        <div className="forum-replies-header">
          <h3>{replies.length} Replies</h3>
          <div className="forum-replies-sort">
            <select value={sortReplies} onChange={(e) => setSortReplies(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="forum-replies-list">
          {sortedReplies.length === 0 ? (
            <div className="forum-no-replies">
              <MessageCircle size={48} />
              <p>No replies yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            sortedReplies.map((reply) => (
              <div 
                key={reply.id} 
                className={`forum-reply ${reply.isAnswer ? 'answer' : ''}`}
              >
                {reply.isAnswer && (
                  <div className="forum-reply-answer-badge">
                    <CheckCircle size={14} />
                    Accepted Answer
                  </div>
                )}
                
                <div className="forum-reply-header">
                  <div className="forum-reply-author">
                    <div className="forum-reply-avatar">
                      {reply.author?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="forum-reply-meta">
                      <span className="forum-reply-author-name">{reply.author}</span>
                      <span className="forum-reply-timestamp">
                        {formatTimestamp(reply.timestamp)}
                        {reply.edited && <span className="forum-reply-edited">(edited)</span>}
                      </span>
                    </div>
                  </div>
                  
                  <div className="forum-reply-actions-menu">
                    <button 
                      className="forum-reply-menu-btn"
                      onClick={() => setShowActions(showActions === reply.id ? null : reply.id)}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {showActions === reply.id && (
                      <div className="forum-reply-dropdown">
                        {isAuthenticated && reply.authorEmail === user?.email && (
                          <>
                            <button onClick={() => handleEditReply(reply)}>
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button onClick={() => handleDeleteReply(reply.id)} className="delete">
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </>
                        )}
                        {isAuthenticated && topic.authorEmail === user?.email && (
                          <button onClick={() => handleMarkAsAnswer(reply.id)}>
                            <CheckCircle size={14} />
                            {reply.isAnswer ? 'Remove Answer' : 'Mark as Answer'}
                          </button>
                        )}
                        <button>
                          <Flag size={14} />
                          Report
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {editingReply === reply.id ? (
                  <div className="forum-reply-edit">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                    />
                    <div className="forum-reply-edit-actions">
                      <button onClick={() => setEditingReply(null)} className="cancel">
                        Cancel
                      </button>
                      <button onClick={() => handleSaveEdit(reply.id)} className="save">
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="forum-reply-content">{reply.content}</p>
                )}

                <div className="forum-reply-footer">
                  <div className="forum-reply-actions">
                    <button 
                      className={`forum-reply-action ${likedReplies.includes(reply.id) ? 'liked' : ''}`}
                      onClick={() => handleLikeReply(reply.id)}
                    >
                      <Heart size={16} fill={likedReplies.includes(reply.id) ? 'currentColor' : 'none'} />
                      <span>{reply.likes || 0}</span>
                    </button>
                    <button 
                      className="forum-reply-action"
                      onClick={() => {
                        setReplyingTo(reply);
                        document.querySelector('.forum-reply-form textarea')?.focus();
                      }}
                    >
                      <Reply size={16} />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
