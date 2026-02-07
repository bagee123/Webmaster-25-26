import React from 'react';
import { Target, Heart, Users, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import '../css/about.css';

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'We prioritize the needs of Coppell residents and work to ensure everyone has access to vital resources.',
  },
  {
    icon: Users,
    title: 'Inclusivity',
    description: 'Our platform welcomes all residents regardless of background, embracing the diversity that makes Coppell strong.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously improve our platform with new features and better ways to connect residents with resources.',
  },
  {
    icon: Target,
    title: 'Transparency',
    description: 'We maintain clear, accurate information and welcome feedback to ensure we serve the community effectively.',
  },
];

const team = [
  { name: 'Emily Rodriguez', role: 'Executive Director', initials: 'ER' },
  { name: 'Michael Chen', role: 'Technology Lead', initials: 'MC' },
  { name: 'Sarah Mitchell', role: 'Community Outreach', initials: 'SM' },
  { name: 'James Patterson', role: 'Resource Coordinator', initials: 'JP' },
  { name: 'Linda Martinez', role: 'Volunteer Manager', initials: 'LM' },
  { name: 'Robert Kim', role: 'Communications', initials: 'RK' },
];

export default function About() {
  const navigate = useNavigate();

  const handleBrowseClick = () => {
    navigate('/resources');
    window.scrollTo(0, 0);
  };

  const handleContactClick = () => {
    navigate('/contact');
    window.scrollTo(0, 0);
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <PageHero
        title="About Our Mission"
        subtitle="Building stronger connections between Coppell residents and the resources they need to thrive"
        className="about-hero"
      />

      {/* Mission Statement */}
      <section className="about-section about-mission">
        <div className="about-container">
          <h2>Our Mission</h2>
          <p className="mission-text">
            The Coppell Community Resource Hub exists to bridge the gap between residents and essential services. 
            We believe that everyone deserves easy access to healthcare, education, support services, and opportunities 
            to give back. By centralizing this information and making it searchable and accessible, we empower our 
            community members to find help when they need it and contribute when they can.
          </p>
          <div className="mission-stats">
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Resources Listed</div>
            </div>
            <div className="stat">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Residents Helped</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Partner Organizations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section about-values">
        <div className="about-container">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="value-card">
                  <div className="value-icon">
                    <Icon size={28} />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-section about-story">
        <div className="about-container">
          <h2>Our Story</h2>
          <div className="story-content">
            <p>
              The Coppell Community Resource Hub began in 2019 when a group of concerned residents realized 
              that many valuable community services were going underutilized simply because people did not know 
              they existed. A family struggling to find mental health resources, a senior citizen unaware of 
              available transportation services, a parent looking for after-school programs—these stories were 
              too common.
            </p>
            <p>
              What started as a simple spreadsheet shared among neighbors has grown into a comprehensive platform 
              serving thousands of Coppell residents. Today, we partner with local government, nonprofits, schools, 
              healthcare providers, and businesses to maintain the most complete directory of community resources 
              available.
            </p>
            <p>
              But we are more than just a database. We are a bridge connecting people in need with those who can help, 
              and we are constantly working to make that connection easier, faster, and more effective. Every resource 
              added, every search performed, every connection made brings us closer to our vision of a community where 
              no one has to struggle alone.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section about-team">
        <div className="about-container">
          <div className="section-header">
            <h2>Our Team</h2>
            <p>Dedicated professionals working to serve the Coppell community</p>
          </div>

          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  {member.initials}
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-section about-cta">
        <div className="about-container about-cta-content">
          <h2>Join Our Community</h2>
          <p>Whether you need help, want to volunteer, or have resources to share, we are here to connect you</p>
          <div className="cta-buttons">
            <button className="cta-btn cta-btn-primary" onClick={handleBrowseClick}>
              Browse Resources
            </button>
            <button className="cta-btn cta-btn-secondary" onClick={handleContactClick}>
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
