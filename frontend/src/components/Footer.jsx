import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-brand-name">⚡ BisElec</div>
              <p>Karachi's most trusted electronics retailer since 2010. Authorized dealer for Haier, Gree, Dawlance, and Kenwood with genuine products, free delivery, and expert after-sales support.</p>
              <div className="footer-contact-item"><Phone size={14}/> +92 300 1234567</div>
              <div className="footer-contact-item"><MapPin size={14}/> Saddar & DHA Phase 6, Karachi</div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">🏠 Home</Link></li>
                <li><Link to="/products">📦 All Products</Link></li>
                <li><Link to="/about">ℹ️ About Us</Link></li>
                <li><Link to="/contact">📞 Contact Us</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-col">
              <h4>Categories</h4>
              <ul>
                <li><Link to="/products?category=Air Conditioner">❄️ Air Conditioners</Link></li>
                <li><Link to="/products?category=LED TV">📺 LED TVs</Link></li>
                <li><Link to="/products?category=Refrigerator">🧊 Refrigerators</Link></li>
                <li><Link to="/products?category=Washing Machine">🫧 Washing Machines</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4>Get in Touch</h4>
              <ul>
                <li><a href="tel:+923001234567"><Phone size={13}/> +92 300 1234567</a></li>
                <li>
                  <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={13}/> WhatsApp Order
                  </a>
                </li>
                <li><a href="#"><MapPin size={13}/> Saddar Branch</a></li>
                <li><a href="#"><MapPin size={13}/> DHA Phase 6 Branch</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2025 BisElec Electronics. All rights reserved. | Karachi, Pakistan 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}
