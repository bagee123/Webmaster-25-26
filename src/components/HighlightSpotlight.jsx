import React, { useState } from 'react';
import { Heart, Users, Sparkles } from 'lucide-react';
import DetailModal from './DetailModal';
import '../css/highlights.css';

const highlights = [
  {
    id: 1,
    icon: Heart,
    title: 'Community Health Initiative',
    description: 'Free health screenings, wellness workshops, and mental health resources available to all Coppell residents. Our comprehensive program ensures everyone has access to quality healthcare.',
    color: 'rose-pink',
    bgColor: 'rose-pink-light',
  },
  {
    id: 2,
    icon: Users,
    title: 'Volunteer Network',
    description: 'Connect with local opportunities to make a difference. From tutoring students to supporting seniors, find meaningful ways to give back to your community every day.',
    color: 'blue-cyan',
    bgColor: 'blue-cyan-light',
  },
  {
    id: 3,
    icon: Sparkles,
    title: 'Youth Development Programs',
    description: 'Enrichment activities, mentorship programs, and skill-building workshops designed to help young people thrive academically, socially, and personally.',
    color: 'amber-orange',
    bgColor: 'amber-orange-light',
  },
];

export default function HighlightSpotlight() {
  const [selectedResource, setSelectedResource] = useState(null);

  const handleLearnMore = (highlight) => {
    const resource = {
      id: highlight.id,
      name: highlight.title,
      category: highlight.color || 'community',
      description: highlight.description,
      phone: '(555) 555-5555',
      email: 'info@placeholder.local',
      address: '123 Service Street, Coppell, TX 75019',
      hours: 'Mon-Fri 9AM-5PM',
      website: 'example.org',
    };
    setSelectedResource(resource);
  };

  return (
    <>
      <section id="highlights" className="highlights-section">
        <div className="highlights-container">
        <div className="highlights-header">
          <h2>Featured Community Resources</h2>
          <p>
            Highlighting the most impactful programs and services making a difference in our community
          </p>
        </div>

        <div className="highlights-grid">
          {highlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <div
                key={highlight.id}
                className={`highlight-card highlight-${highlight.color}`}
              >
                <div className={`highlight-icon-wrapper highlight-bg-${highlight.bgColor}`}>
                  <Icon size={32} strokeWidth={2} />
                </div>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
                <button
                  onClick={() => handleLearnMore(highlight)}
                  className={`highlight-btn highlight-btn-${highlight.color}`}
                >
                  Learn More
                </button>
              </div>
            );
          })}
        </div>

        {/* Testimonial Section */}
        <div className="testimonial-section">
          <div className="testimonial-avatars">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="testimonial-avatar"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <blockquote className="testimonial-quote">
            &ldquo;The Coppell Community Resource Hub has been invaluable for our family. We found amazing support services and connected with wonderful volunteers who truly care about our community.&rdquo;
          </blockquote>
          <p className="testimonial-author">
            — Sarah Johnson, Coppell Resident
          </p>
        </div>
      </div>
    </section>

      {selectedResource && (
        <DetailModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
    </>
  );
}
