import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../css/hero.css';

export default function Hero() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/resources');
    window.scrollTo(0, 0);
  };

  const handleSubmitClick = () => {
    const submitSection = document.getElementById('submit-resource');
    if (submitSection) {
      submitSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <h1>Connecting Coppell Residents with Local Support and Services</h1>
        <p>
          Your comprehensive guide to community resources, local services, and support networks.
          Discover opportunities to get help, volunteer, and connect with your neighbors.
        </p>

        <div className="hero-buttons">
          <button className="btn-explore" onClick={handleExploreClick}>
            Explore Resources
            <ArrowRight className="arrow-icon" size={18} />
          </button>
          <button className="btn-submit" onClick={handleSubmitClick}>Submit a Resource</button>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Local Resources</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">12</div>
            <div className="stat-label">Service Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Access Available</div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-dot"></div>
      </div>
    </section>
  );
}
