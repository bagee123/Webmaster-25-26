import React from 'react';
import '../css/hero.css';


export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-overlay">
                <h2>Connecting Coppell Residents with Local Support and Services</h2>
                <p>Your guide to community resources, local services, and volunteer opportunities.</p>
                <div className="hero-buttons">
                    <button className="btn-light">Explore Resources</button>
                    <button className="btn-dark">Submit a Resource</button>
                </div>
            </div>
        </section>
    );
}