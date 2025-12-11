import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import '../css/footer.css';

export default function Footer() {
  const openMap = () => {
    window.open('https://www.google.com/maps/search/Coppell,+TX', '_blank');
  };
  return (
    <footer id="contact" className="footer-root">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About */}
          <div>
            <div className="footer-brand">
              <div className="logo-circle">
                <span className="logo-letter">C</span>
              </div>
              <span className="brand-name">Coppell Hub</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting residents with local support, services, and opportunities to build a stronger community together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-400 hover:text-orange-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#directory" className="text-gray-400 hover:text-orange-400 transition-colors">Resource Directory</a>
              </li>
              <li>
                <a href="#highlights" className="text-gray-400 hover:text-orange-400 transition-colors">Highlights</a>
              </li>
              <li>
                <a href="#submit" className="text-gray-400 hover:text-orange-400 transition-colors">Submit a Resource</a>
              </li>
              <li>
                <a href="#map" onClick={(e) => { e.preventDefault(); openMap(); }} className="text-gray-400 hover:text-orange-400 transition-colors">Map</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Accessibility</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
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

            {/* Social Media */}
            <div className="social-row">
              <a href="#" className="social-btn">
                <Facebook size={18} />
              </a>
              <a href="#" className="social-btn">
                <Twitter size={18} />
              </a>
              <a href="#" className="social-btn">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p className="copyright">© 2025 Coppell Community Resource Hub (WebMaster 2025). All rights reserved.</p>
             <p className="copyright"> <p className="copyright">ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.</p></p>
            <p className="credit">Created for the Coppell HS TSA Webmaster Contest</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
