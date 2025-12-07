import React from 'react';
import '../css/navbar.css';


export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-inner">
                <h1 className="logo">Coppell Community Resource Hub</h1>
                <nav>
                    <a href="#">Home</a>
                    <a href="#resources">Resource Directory</a>
                    <a href="#">Highlights</a>
                    <a href="#">Submit a Resource</a>
                    <a href="#">Map</a>
                    <a href="#">Contact</a>
                </nav>
            </div>
        </header>
    );
}