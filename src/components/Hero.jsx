import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import '../css/hero.css';

export default function Hero() {
    const handleExploreClick = () => {
        const resourceSection = document.getElementById('directory');
        if (resourceSection) {
            resourceSection.scrollIntoView({ behavior: 'smooth' });
        }
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
                    src="https://images.unsplash.com/photo-1632580254134-94c4a73dab76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBwZW9wbGV8ZW58MXx8fHwxNzY1MTA0MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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