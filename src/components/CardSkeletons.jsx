import '../css/cardSkeleton.css';

export function ResourceCardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="skeleton-badge"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text"></div>
      <div style={{ flex: 1 }}></div>
      <div className="skeleton-button"></div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="event-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-badge-small"></div>
        <div className="skeleton-title" style={{ marginBottom: '12px' }}></div>
        <div className="skeleton-lines">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
        </div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
}
