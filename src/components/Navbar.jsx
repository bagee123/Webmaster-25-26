import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, Moon, Sun, LogOut, Settings, Bookmark, Calendar } from 'lucide-react';
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout, isAuthenticated } = useAuth();

  // Get user initials from email
  const getUserInitials = () => {
    if (!user?.email) return '';
    const parts = user.email.split('@')[0].split('.');
    return (parts[0][0] + (parts[1]?.[0] || parts[0][1] || '')).toUpperCase();
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            {isAuthenticated ? (
              <div className="user-menu-container" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`user-initials-btn ${isLoggingOut ? 'logging-out' : ''}`}
                  type="button"
                  title={user?.email}
                >
                  {getUserInitials()}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown-menu">
                    <div className="user-menu-header">
                      <span className="user-email-label">{user?.email}</span>
                    </div>
                    <Link
                      to="/saved-items"
                      onClick={() => setShowUserMenu(false)}
                      className="user-menu-item"
                    >
                      <Bookmark size={16} />
                      <span>My Saved Items</span>
                    </Link>
                    <Link
                      to="/calendar"
                      onClick={() => setShowUserMenu(false)}
                      className="user-menu-item"
                    >
                      <Calendar size={16} />
                      <span>My Calendar</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      className="user-menu-item"
                      type="button"
                    >
                      <Settings size={16} />
                      <span>Profile Settings</span>
                    </button>
                    <hr className="user-menu-divider" />
                    <button
                      onClick={async () => {
                        setIsLoggingOut(true);
                        await new Promise(resolve => setTimeout(resolve, 500));
                        await logout();
                        setShowUserMenu(false);
                        setIsLoggingOut(false);
                        window.location.href = '/';
                      }}
                      className="user-menu-item logout"
                      type="button"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="nav-login-btn"
                type="button"
              >
                <LogIn size={18} />
                Login
              </button>
            )}
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
                <div className="user-menu-container" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`user-initials-btn-mobile ${isLoggingOut ? 'logging-out' : ''}`}
                    type="button"
                    title={user?.email}
                  >
                    {getUserInitials()}
                  </button>
                  {showUserMenu && (
                    <div className="user-dropdown-menu-mobile">
                      <div className="user-menu-header">
                        <span className="user-email-label">{user?.email}</span>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="user-menu-item"
                        type="button"
                      >
                        <Settings size={16} />
                        <span>Profile Settings</span>
                      </button>
                      <hr className="user-menu-divider" />
                      <button
                        onClick={async () => {
                          setIsLoggingOut(true);
                          await new Promise(resolve => setTimeout(resolve, 500));
                          await logout();
                          setShowUserMenu(false);
                          setIsMobileMenuOpen(false);
                          setIsLoggingOut(false);
                          window.location.href = '/';
                        }}
                        className="user-menu-item logout"
                        type="button"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
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
