import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, Moon, Sun, LogOut, User } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import '../css/navbar.css';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Resources', href: '/resources' },
  { label: 'Events', href: '/events' },
  { label: 'Highlights', href: '/highlights' },
  { label: 'Blog', href: '/blog' },
  { label: 'References', href: '/references' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ onLoginClick = () => {} }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout, isAuthenticated } = useAuth();

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
          <Link to="/" className="navbar-logo" onClick={handleNavClick}>
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
              onClick={toggleDarkMode}
              className="nav-dark-mode-btn"
              aria-label="Toggle dark mode"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={onLoginClick}
              className="nav-login-btn"
              type="button"
            >
              <LogIn size={18} />
              Login
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="navbar-toggle"
            type="button"
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
            <div className="navbar-mobile-actions">
              <button
                onClick={toggleDarkMode}
                className="nav-dark-mode-btn-mobile"
                aria-label="Toggle dark mode"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              {isAuthenticated ? (
                <div className="user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="user-profile-btn"
                    type="button"
                  >
                    <User size={18} />
                    <span className="user-email">{user?.email}</span>
                  </button>
                  {showUserMenu && (
                    <button
                      onClick={async () => {
                        await logout();
                        setShowUserMenu(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="nav-logout-btn"
                      type="button"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="nav-login-btn-mobile"
                  type="button"
                >
                  <LogIn size={18} />
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onLoginClick: PropTypes.func,
};
