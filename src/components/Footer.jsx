import React from 'react';
import './Footer.css';

/**
 * Footer component for the website.
 * Displays copyright information, developer's link, and other useful links.
 */

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} InnoShop. All rights reserved.</p>
        <ul className="footer-links">
          <li><a href="https://jadyn-chowdhury.me/">Jadyn Chowdhury</a></li>
        </ul>
        
        <ul className="footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
