import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, Moon, Sun, LogOut, Settings, Bookmark, Calendar, Shield } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import '../css/navbar.css';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Resources', href: '/resources' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Forum', href: '/forum' },
  { label: 'Contact', href: '/contact' },
  { label: 'References', href: '/references' },
];

export default function Navbar({ onLoginClick = () => {} }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout, isAuthenticated } = useAuth();

  // Get user initials from email
  const getUserInitials = () => {
    if (!user?.email) return '';
    const parts = user.email.split('@')[0].split('.');
    return (parts[0][0] + (parts[1]?.[0] || parts[0][1] || '')).toUpperCase();
  };

  // Check if user is admin
  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        setIsAdmin(idTokenResult.claims.admin === true);
      }).catch(() => {
        setIsAdmin(false);
      });
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Close user menu and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      // Close mobile menu when clicking outside (but not on the toggle button)
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && 
          !e.target.closest('.navbar-toggle')) {
        setIsMobileMenuOpen(false);
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

          <div className="navbar-desktop" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={handleNavClick}
                className={`nav-link ${isActive(link.href) ? 'nav-link-active' : ''}`}
                aria-current={isActive(link.href) ? 'page' : undefined}
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
                  aria-expanded={showUserMenu}
                  aria-haspopup="menu"
                  aria-controls="user-dropdown-menu"
                >
                  {getUserInitials()}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown-menu" id="user-dropdown-menu" role="menu">
                    <div className="user-menu-header">
                      <span className="user-email-label">{user?.email}</span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="user-menu-item"
                      role="menuitem"
                    >
                      <Settings size={16} />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/saved-items"
                      onClick={() => setShowUserMenu(false)}
                      className="user-menu-item"
                      role="menuitem"
                    >
                      <Bookmark size={16} />
                      <span>My Saved Items</span>
                    </Link>
                    <Link
                      to="/calendar"
                      onClick={() => setShowUserMenu(false)}
                      className="user-menu-item"
                      role="menuitem"
                    >
                      <Calendar size={16} />
                      <span>My Calendar</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/resources"
                        onClick={() => setShowUserMenu(false)}
                        className="user-menu-item admin-link"
                        role="menuitem"
                      >
                        <Shield size={16} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="user-menu-item logout"
                      type="button"
                      role="menuitem"
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
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="navbar-mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="navbar-mobile" ref={mobileMenuRef} id="navbar-mobile-menu" role="navigation" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={handleNavClick}
                className={`nav-link-mobile ${isActive(link.href) ? 'nav-link-mobile-active' : ''}`}
                aria-current={isActive(link.href) ? 'page' : undefined}
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
                    aria-expanded={showUserMenu}
                    aria-haspopup="menu"
                    aria-controls="user-dropdown-menu-mobile"
                  >
                    {getUserInitials()}
                  </button>
                  {showUserMenu && (
                    <div className="user-dropdown-menu-mobile" id="user-dropdown-menu-mobile" role="menu">
                      <div className="user-menu-header">
                        <span className="user-email-label">{user?.email}</span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => {
                          setShowUserMenu(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="user-menu-item"
                        role="menuitem"
                      >
                        <Settings size={16} />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/saved-items"
                        onClick={() => {
                          setShowUserMenu(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="user-menu-item"
                        role="menuitem"
                      >
                        <Bookmark size={16} />
                        <span>My Saved Items</span>
                      </Link>
                      <Link
                        to="/calendar"
                        onClick={() => {
                          setShowUserMenu(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="user-menu-item"
                        role="menuitem"
                      >
                        <Calendar size={16} />
                        <span>My Calendar</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin/resources"
                          onClick={() => {
                            setShowUserMenu(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="user-menu-item admin-link"
                          role="menuitem"
                        >
                          <Shield size={16} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <hr className="user-menu-divider" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setIsMobileMenuOpen(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="user-menu-item logout"
                        type="button"
                        role="menuitem"
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

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="navbar-logout-modal-overlay" role="presentation">
            <div className="navbar-logout-modal" role="alertdialog" aria-labelledby="logout-modal-title" aria-describedby="logout-modal-description">
              <div className="modal-header">
                <h3 id="logout-modal-title">Confirm Logout</h3>
              </div>
              <div className="modal-body" id="logout-modal-description">
                <p>Are you sure you want to logout?</p>
                <p className="modal-subtext">You will need to log in again to access your personalized features.</p>
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="modal-btn-cancel"
                  disabled={isLoggingOut}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsLoggingOut(true);
                    try {
                      await logout();
                      setShowLogoutConfirm(false);
                      setShowUserMenu(false);
                      navigate('/');
                    } catch {
                      setIsLoggingOut(false);
                    }
                  }}
                  className="modal-btn-logout"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
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
