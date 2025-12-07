import React from 'react';
import { Link } from 'react-router-dom';
import '../css/navbar.css';


export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h1 className="logo">Coppell Community Resource Hub</h1>
                </Link>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/directory">Resource Directory</Link>
                    <Link to="/highlights">Highlights</Link>
                    <Link to="/submit">Submit a Resource</Link>
                    <Link to="/map">Map</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
            </div>
        </header>
    );
}