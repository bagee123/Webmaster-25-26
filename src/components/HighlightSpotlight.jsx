import React, { useState, useEffect } from 'react';
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

const testimonials = [
  {
    id: 1,
    quote: 'The Coppell Community Resource Hub has been invaluable for our family. We found amazing support services and connected with wonderful volunteers who truly care about our community.',
    author: 'Sarah Johnson',
    title: 'Coppell Resident',
    avatars: ['S', 'J', 'C', 'R'],
  },
  {
    id: 2,
    quote: 'As a volunteer, I\'ve never felt more appreciated. This hub connects people who want to make a difference with opportunities that truly matter. Highly recommended!',
    author: 'Michael Chen',
    title: 'Local Volunteer',
    avatars: ['M', 'C', 'L', 'V'],
  },
  {
    id: 3,
    quote: 'My kids have grown so much through the youth programs here. The mentors are dedicated and the activities are engaging. Best investment in our community!',
    author: 'Jennifer Martinez',
    title: 'Community Parent',
    avatars: ['J', 'M', 'C', 'P'],
  },
  {
    id: 4,
    quote: 'I came here looking for health resources and left with a whole new support network. The staff is friendly and the services are comprehensive.',
    author: 'David Thompson',
    title: 'Healthcare Advocate',
    avatars: ['D', 'T', 'H', 'A'],
  },
  {
    id: 5,
    quote: 'This resource hub is exactly what our community needed. Easy to navigate, helpful staff, and genuine care for making a difference.',
    author: 'Amanda Lee',
    title: 'Community Organizer',
    avatars: ['A', 'L', 'C', 'O'],
  },
];

export default function HighlightSpotlight() {
  const [selectedResource, setSelectedResource] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

        {/* Testimonial Section - Auto-scrolling Carousel */}
        <div className="testimonial-section">
          <h3 className="testimonial-header">What Our Community Says</h3>
          <div className="testimonial-carousel-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}
              >
                <div className="testimonial-avatars">
                  {testimonial.avatars.map((letter, idx) => (
                    <div key={idx} className="testimonial-avatar">
                      {letter}
                    </div>
                  ))}
                </div>
                <blockquote className="testimonial-quote">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <p className="testimonial-author">
                  — {testimonial.author}, {testimonial.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

      {selectedResource && (
        <DetailModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
    </>
  );
}
