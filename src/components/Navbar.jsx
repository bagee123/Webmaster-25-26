import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';
import '../css/navbar.css';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Resources', href: '/resources' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ onLoginClick = () => {} }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="logo-badge">C</div>
            <span className="logo-text">Coppell Community Resource Hub</span>
          </Link>

          <div className="navbar-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={handleNavClick}
                className={`nav-link ${isActive(link.href) ? 'nav-link-active' : ''}`}
              >
                {link.label}
                <span className="nav-underline"></span>
              </Link>
            ))}
            <button
              onClick={onLoginClick}
              className="nav-login-btn"
            >
              <LogIn size={18} />
              Login
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="navbar-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="navbar-mobile">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={handleNavClick}
                className={`nav-link-mobile ${isActive(link.href) ? 'nav-link-mobile-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLoginClick();
              }}
              className="nav-login-btn-mobile"
            >
              <LogIn size={18} />
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onLoginClick: PropTypes.func,
};