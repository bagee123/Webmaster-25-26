import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logoImage from '../assets/logo.jpeg';
import '../css/footer.css';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer id="contact" className="footer-root">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <div className="footer-brand">
              <img src={logoImage} alt="Coppell Community Hub logo" className="brand-logo" />
              <span className="brand-name">Coppell Hub</span>
            </div>
            <p className="footer-description">
              Connecting residents with local support, services, and opportunities to build a stronger community together.
            </p>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/resources" className="footer-link">Resource Directory</Link>
              </li>
              <li>
                <Link to="/events" className="footer-link">Events</Link>
              </li>
              <li>
                <Link to="/#submit-resource" className="footer-link" onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  setTimeout(() => {
                    const submitSection = document.getElementById('submit-resource');
                    if (submitSection) {
                      submitSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}>Submit a Resource</Link>
              </li>
              <li>
                <a href="https://www.google.com/maps/search/Coppell,+TX" className="footer-link" target="_blank" rel="noopener noreferrer">View Map</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about" className="footer-link">About Us</Link>
              </li>
              <li>
                <Link to="/blog" className="footer-link">Blog</Link>
              </li>
              <li>
                <Link to="/forum" className="footer-link">Community Forum</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact Us</Link>
              </li>
              <li>
                <Link to="/references" className="footer-link">References</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="contact-list">
              <li className="contact-row">
                <Mail size={18} className="contact-icon" />
                <span className="contact-text">info@coppellhub.org</span>
              </li>
              <li className="contact-row">
                <Phone size={18} className="contact-icon" />
                <span className="contact-text">(555) 123-4567</span>
              </li>
              <li className="contact-row">
                <MapPin size={18} className="contact-icon" />
                <span className="contact-text">123 Community Way<br />Coppell, TX 75019</span>
              </li>
            </ul>

            {/* Social media links - implement with real URLs when accounts are created */}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p className="copyright">© 2025 Coppell Community Resource Hub (WebMaster 2025). All rights reserved.</p>
            <p className="copyright">Icons by Lucide (ISC License). THE SOFTWARE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND.</p>
            <p className="credit">Created for the Coppell HS TSA Webmaster Contest</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
