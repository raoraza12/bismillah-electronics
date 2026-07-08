import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Search, Trash2, Plus, Minus, X, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, toast } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [bounce, setBounce] = useState(false);
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const searchRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-active' : '';

  // Trigger bounce animation on cart count increase
  useEffect(() => {
    if (cartCount === 0) return;
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), 400);
    return () => clearTimeout(timer);
  }, [cartCount]);

  // Show floating cart on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloatingCart(true);
      } else {
        setShowFloatingCart(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch all products once for suggestions
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || 'https://bismillah-electronics-gold.vercel.app';
    fetch(`${base}/api/items`)
      .then(r => r.json())
      .then(data => { if (data.status === 'success') setAllProducts(data.data); })
      .catch(() => {});
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Filter suggestions as user types
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setActiveIdx(-1);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = val.toLowerCase();
    const matched = [];
    const seen = new Set();
    allProducts.forEach(p => {
      // Match product name
      if (p.name.toLowerCase().includes(q) && !seen.has(p.name)) {
        seen.add(p.name);
        matched.push({ type: 'product', label: p.name, category: p.category, brand: p.brand });
      }
      // Match brand
      if (p.brand.toLowerCase().includes(q) && !seen.has('brand_' + p.brand)) {
        seen.add('brand_' + p.brand);
        matched.push({ type: 'brand', label: p.brand, category: p.category });
      }
      // Match category
      if (p.category.toLowerCase().includes(q) && !seen.has('cat_' + p.category)) {
        seen.add('cat_' + p.category);
        matched.push({ type: 'category', label: p.category, category: p.category });
      }
    });
    setSuggestions(matched.slice(0, 8));
    setShowSuggestions(matched.length > 0);
  };

  const handleSuggestionClick = (s) => {
    setShowSuggestions(false);
    setSearch('');
    if (s.type === 'category') {
      navigate(`/products?category=${encodeURIComponent(s.category)}`);
    } else if (s.type === 'brand') {
      navigate(`/products?search=${encodeURIComponent(s.label)}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(s.label)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeIdx]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleCheckout = () => {
    if (!cartItems.length) return;
    const lines = cartItems
      .map(i => `• ${i.name} x${i.quantity} = Rs.${((i.discountPrice || i.price) * i.quantity).toLocaleString()}`)
      .join('\n');
    const msg = `Salam BisElec! Order karna chahta hoon:\n\n${lines}\n\nKul Total: Rs.${cartTotal.toLocaleString()}\n\nPlease confirm kardein. Shukriya!`;
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      {/* ─── Top Bar ─── */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <span className="topbar-item">📢 Authorized Dealer — Haier · Gree · Dawlance · Kenwood</span>
            <span className="topbar-item">🚚 Free Delivery on orders over Rs.80,000</span>
          </div>
          <div className="topbar-right">
            <a href="tel:+923001234567" className="topbar-item">📞 +92 300 1234567</a>
            <span className="topbar-item">📍 Saddar &amp; DHA Karachi</span>
          </div>
        </div>
      </div>

      {/* ─── Main Header ─── */}
      <header className="site-header">
        {/* Logo + Search + Actions row */}
        <div className="header-main-row">
          {/* Mobile hamburger menu toggle */}
          <button className="hdr-mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="hdr-logo">
            <div className="hdr-logo-icon">⚡</div>
            <div className="hdr-logo-text">
              <strong>Bismillah Electronics</strong>
              <span>Karachi · Saddar & DHA</span>
            </div>
          </Link>

          {/* Search with Autocomplete */}
          <div className="hdr-search-wrap" ref={searchRef}>
            <form className="hdr-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search ACs, LED TVs, Fridges, Washing Machines..."
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                autoComplete="off"
              />
              <button type="submit"><Search size={18} /></button>
            </form>
            {showSuggestions && (
              <ul className="search-suggestions">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className={`suggestion-item${i === activeIdx ? ' active' : ''}`}
                    onMouseDown={() => handleSuggestionClick(s)}
                  >
                    <span className="suggestion-icon">
                      {s.type === 'category' ? '📂' : s.type === 'brand' ? '🏷️' : '🔍'}
                    </span>
                    <span className="suggestion-label">{s.label}</span>
                    <span className="suggestion-type">
                      {s.type === 'category' ? 'Category' : s.type === 'brand' ? 'Brand' : s.category}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="hdr-actions">
            <button className="hdr-cart-btn" onClick={() => setCartOpen(true)}>
              <div style={{ position: 'relative', display: 'inline-flex' }} className={bounce ? 'cart-bounce' : ''}>
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="hdr-cart-badge">{cartCount}</span>}
              </div>
              <span>Cart</span>
            </button>

            <a
              href="https://wa.me/923001234567?text=Hello%20BisElec!%20I%20need%20help"
              target="_blank"
              rel="noopener noreferrer"
              className="hdr-wa-btn"
            >
              <MessageCircle size={17} /> WhatsApp Order
            </a>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hdr-nav">
          <div className="hdr-nav-inner">
            <ul className="hdr-nav-list">
              <li><Link to="/" className={isActive('/')}>Home</Link></li>
              {/* All Products Dropdown */}
              <li className="hdr-nav-dropdown">
                <Link to="/products" className={`dropdown-trigger-link ${isActive('/products')}`}>
                  All Products ▾
                </Link>
                <ul className="dropdown-menu">
                  <li><Link to="/products?category=Air%20Conditioner">❄️ Air Conditioners</Link></li>
                  <li><Link to="/products?category=LED%20TV">📺 LED TVs</Link></li>
                  <li><Link to="/products?category=Refrigerator">🧊 Refrigerators</Link></li>
                  <li><Link to="/products?category=Washing%20Machine">🫧 Washing Machines</Link></li>
                  <li><Link to="/products?category=Kitchen%20Appliances">🍳 Kitchen Appliances</Link></li>
                  <li><Link to="/products?category=Microwave%20Oven">🍲 Microwave Ovens</Link></li>
                  <li><Link to="/products?category=Water%20Dispenser">🚰 Water Dispensers</Link></li>
                  <li><Link to="/products?category=Deep%20Freezer">🥶 Deep Freezers</Link></li>
                </ul>
              </li>

              <li><Link to="/about" className={isActive('/about')}>About</Link></li>
              <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* ─── Mobile Menu Drawer ─── */}
      <div className={`menu-overlay${mobileMenuOpen ? ' is-open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
        <div className="menu-panel" onClick={e => e.stopPropagation()}>
          <div className="menu-panel-head">
            <h3>📂 Navigation Menu</h3>
            <button className="menu-close-x" onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="menu-panel-body">
            <div className="menu-panel-links">
              <Link to="/" className={isActive('/')} onClick={() => setMobileMenuOpen(false)}>🏠 Home</Link>
              <Link to="/products" className={isActive('/products')} onClick={() => setMobileMenuOpen(false)}>📦 All Products</Link>
              <Link to="/products?category=Air%20Conditioner" onClick={() => setMobileMenuOpen(false)}>❄️ Air Conditioners</Link>
              <Link to="/products?category=LED%20TV" onClick={() => setMobileMenuOpen(false)}>📺 LED TVs</Link>
              <Link to="/products?category=Refrigerator" onClick={() => setMobileMenuOpen(false)}>🧊 Refrigerators</Link>
              <Link to="/products?category=Washing%20Machine" onClick={() => setMobileMenuOpen(false)}>🧺 Washing Machines</Link>
              <Link to="/products?category=Kitchen%20Appliances" onClick={() => setMobileMenuOpen(false)}>🍳 Kitchen Appliances</Link>
              <Link to="/products?category=Microwave%20Oven" onClick={() => setMobileMenuOpen(false)}>🍲 Microwave Ovens</Link>
              <Link to="/products?category=Water%20Dispenser" onClick={() => setMobileMenuOpen(false)}>🚰 Water Dispensers</Link>
              <Link to="/products?category=Deep%20Freezer" onClick={() => setMobileMenuOpen(false)}>🥶 Deep Freezers</Link>
              <Link to="/about" className={isActive('/about')} onClick={() => setMobileMenuOpen(false)}>ℹ️ About Us</Link>
              <Link to="/contact" className={isActive('/contact')} onClick={() => setMobileMenuOpen(false)}>📞 Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Cart Drawer ─── */}
      <div className={`cart-overlay${cartOpen ? ' is-open' : ''}`} onClick={() => setCartOpen(false)}>
        <div className="cart-panel" onClick={e => e.stopPropagation()}>
          {/* Head */}
          <div className="cart-panel-head">
            <h3>🛒 Cart ({cartCount} item{cartCount !== 1 ? 's' : ''})</h3>
            <button className="cart-close-x" onClick={() => setCartOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="cart-panel-body">
            {cartItems.length === 0 ? (
              <div className="cart-empty-msg">
                <ShoppingCart size={52} strokeWidth={1} />
                <p>Your cart is empty</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Add products to get started!</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-prod-row">
                  <img className="cart-prod-img" src={item.image} alt={item.name} />
                  <div className="cart-prod-info">
                    <h4>{item.name}</h4>
                    <div className="cart-prod-price">
                      Rs. {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </div>
                    <div className="cart-qty-row">
                      <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus size={12} />
                      </button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={12} />
                      </button>
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="cart-panel-foot">
              <div className="cart-total-row">
                <span>Total:</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <button className="cart-wa-checkout" onClick={handleCheckout}>
                <MessageCircle size={18} /> Checkout on WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Floating Sticky Cart Button (on scroll) ─── */}
      {cartCount > 0 && (
        <button 
          className={`floating-cart-btn${showFloatingCart ? ' visible' : ''}`}
          onClick={() => setCartOpen(true)}
          title="Open Cart"
        >
          <div style={{ position: 'relative', display: 'flex' }}>
            <ShoppingCart size={24} />
            <span className="floating-cart-badge">{cartCount}</span>
          </div>
        </button>
      )}

      {/* ─── Toast Popup ─── */}
      <div className={`cart-toast${toast.show ? ' show' : ''}`}>
        <div className="cart-toast-icon">✓</div>
        <span>{toast.message}</span>
      </div>
    </>
  );
}
