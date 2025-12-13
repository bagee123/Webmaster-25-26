import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react';
import '../css/blogDetail.css';

const blogPosts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Blog #${i + 1}`,
  author: 'Author Name',
  date: 'December 5, 2024',
  readTime: '5 min read',
  category: 'Community',
  image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMzMzMzMzMiLz48cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSI3MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNjZkOWVmIiBzdHJva2U9IiMwYjdiYzYiIHN0cm9rZS13aWR0aD0iMyIgcng9IjEwIi8+PHRleHQgeD0iNDAwIiB5PSIyMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNDgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0iQXJpYWwiPlBsYWNlSG9sZGVyIjwvdGV4dD48L3N2Zz4=',
  content: `
    <h3>Lorem Ipsum Dolor Sit Amet</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

    <h3>Duis Aute Irure Dolor</h3>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

    <h3>Nemo Enim Ipsam Voluptatem</h3>
    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>

    <p>Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</p>

    <h3>Quis Autem Vel Eum</h3>
    <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>

    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
  `,
}));

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="blog-detail-not-found">
        <div className="blog-detail-not-found-content">
          <h2>Post Not Found</h2>
          <button
            onClick={() => navigate('/blog')}
            className="blog-detail-back-btn"
          >
            Return to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      {/* Header */}
      <div className="blog-detail-header">
        <img
          src={post.image}
          alt={post.title}
          className="blog-detail-header-image"
        />
        <div className="blog-detail-header-overlay"></div>
        <div className="blog-detail-header-content">
          <button
            onClick={() => navigate('/blog')}
            className="blog-detail-back-link"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </button>
          <span className="blog-detail-category">{post.category}</span>
          <h1 className="blog-detail-title">{post.title}</h1>
          <div className="blog-detail-meta">
            <div className="blog-detail-meta-item">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="blog-detail-meta-item">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="blog-detail-meta-item">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="blog-detail-content">
        {/* Action Bar */}
        <div className="blog-detail-actions">
          <div className="blog-detail-actions-left">
            <button className="blog-detail-action-btn">
              <Heart size={18} />
              <span>42</span>
            </button>
            <button className="blog-detail-action-btn">
              <MessageCircle size={18} />
              <span>8</span>
            </button>
          </div>
          <button className="blog-detail-share-btn">
            <Share2 size={18} />
            Share
          </button>
        </div>

        {/* Article Content */}
        <article 
          className="blog-detail-article"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Bio */}
        <div className="blog-detail-author-bio">
          <div className="blog-detail-author-avatar">
            {post.author.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="blog-detail-author-info">
            <h3>About {post.author}</h3>
            <p>
              {post.author} is a passionate community advocate and regular contributor to the Coppell Community Resource Hub. 
              With years of experience in community organizing and social services, they bring valuable insights to help residents connect with local resources.
            </p>
          </div>
        </div>

        {/* Related Articles */}
        <div className="blog-detail-related">
          <h3>Related Articles</h3>
          <div className="blog-detail-related-grid">
            {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map((relatedPost) => (
              <div
                key={relatedPost.id}
                onClick={() => navigate(`/blog/${relatedPost.id}`)}
                className="blog-detail-related-card"
              >
                <div className="blog-detail-related-image">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                  />
                </div>
                <div className="blog-detail-related-content">
                  <span className="blog-detail-related-category">
                    {relatedPost.category}
                  </span>
                  <h4>{relatedPost.title}</h4>
                  <div className="blog-detail-related-meta">
                    <span>{relatedPost.author}</span>
                    <span>•</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
