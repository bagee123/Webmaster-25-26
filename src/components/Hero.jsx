import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import reactLogo from '../assets/react.svg';
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
                <img
                    src={reactLogo}
                    alt="Community gathering"
                    className="hero-image"
                />
                <div className="hero-overlay"></div>
            </div>

            <div className="hero-content">
                <h1>Connecting Coppell Residents with Local Support and Services</h1>
                <p>
                    Your comprehensive guide to community resources, local services, and support networks.
                    Discover opportunities to get help, volunteer, and connect with your neighbors.
                </p>

                <div className="hero-buttons">
                    <button
                        onClick={handleExploreClick}
                        className="btn-explore"
                    >
                        <Search size={20} />
                        Explore Resources
                        <ArrowRight size={20} className="arrow-icon" />
                    </button>
                    <button
                        onClick={handleSubmitClick}
                        className="btn-submit"
                    >
                        Submit a Resource
                    </button>
                </div>

                {/* Stats */}
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

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <div className="scroll-dot"></div>
            </div>
        </section>
    );
}