import React, { useRef, useState } from 'react';
import { ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CursorRippleField from './CursorRippleField';
import '../css/hero.css';

export default function Hero() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const heroSectionRef = useRef(null);

 

  const handleSubmitClick = () => {
    const submitSection = document.getElementById('submit-resource');
    if (submitSection) {
      submitSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero-section" ref={heroSectionRef}>
      {/* Animated background layers */}
      <div className="hero-background">
        <div className="bg-layer bg-layer-1"></div>
        <div className="bg-layer bg-layer-2"></div>
        <div className="bg-layer bg-layer-3"></div>
        <div className="hero-overlay"></div>
        <div className="animated-blob blob-1"></div>
        <div className="animated-blob blob-2"></div>
        <div className="animated-blob blob-3"></div>
        <CursorRippleField containerRef={heroSectionRef} />
      </div>

      <div className="hero-content">
        {/* Animated icon indicator */}
        <div className="hero-icon-container">
          <div className="hero-icon-wrapper">
            <Users className="hero-icon" size={48} />
          </div>
        </div>

        {/* Reveal animated heading */}
        <h1 className="hero-title">Connecting Coppell Residents with Local Support and Services</h1>
        
        {/* Reveal animated paragraph */}
        <p className="hero-description">
          Your comprehensive guide to community resources, local services, and support networks.
          Discover opportunities to get help, volunteer, and connect with your neighbors.
        </p>

        {/* Staggered button animations */}
        <div className="hero-buttons">
          <button 
            className={`btn-explore ${isLoading ? 'loading' : ''}`}
            onClick={() => navigate('/resources')}
            disabled={isLoading}
          >
            <span className="btn-text">Explore Resources</span>
            <ArrowRight className="arrow-icon" size={18} />
            {isLoading && <span className="loading-spinner"></span>}
          </button>
          <button className="btn-submit" onClick={handleSubmitClick}>
            <span>Submit a Resource</span>
          </button>
        </div>

        {/* Trust indicators with animation */}
        <div className="hero-stats">
          <div className="stat-card stat-card-1">
            <div className="stat-number">500+</div>
            <div className="stat-label">Local Resources</div>
          </div>
          <div className="stat-card stat-card-2">
            <div className="stat-number">12</div>
            <div className="stat-label">Service Categories</div>
          </div>
          <div className="stat-card stat-card-3">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Access Available</div>
          </div>
        </div>
      </div>

      {/* Parallax scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-dot"></div>
      </div>
    </section>
  );
}
