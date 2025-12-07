import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../css/navbar.css';


export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (mobileOpen && navRef.current && !navRef.current.contains(e.target)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [mobileOpen]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 900 && mobileOpen) setMobileOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [mobileOpen]);

    const toggleMobile = () => setMobileOpen((s) => !s);
    const closeMobile = () => setMobileOpen(false);

    return (
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-inner">
                <Link to="/" className="brand" onClick={closeMobile} aria-label="Home">
                    <h1 className="logo">
                        <span className="logo-gradient">Coppell Community</span>
                        <span className="logo-mini">Resource Hub</span>
                    </h1>
                </Link>

                <nav ref={navRef} className={`nav-links ${mobileOpen ? 'open' : ''}`} aria-expanded={mobileOpen}>
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobile}>Home</NavLink>
                    <NavLink to="/directory" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobile}>Resource Directory</NavLink>
                    <NavLink to="/highlights" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobile}>Highlights</NavLink>
                    <NavLink to="/submit" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobile}>Submit a Resource</NavLink>
                    <NavLink to="/map" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobile}>Map</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobile}>Contact</NavLink>
                    <div className="nav-indicator" aria-hidden="true" />
                </nav>

                <button
                    className={`hamburger ${mobileOpen ? 'is-active' : ''}`}
                    onClick={toggleMobile}
                    aria-label="Toggle menu"
                    aria-expanded={mobileOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </header>
    );
}