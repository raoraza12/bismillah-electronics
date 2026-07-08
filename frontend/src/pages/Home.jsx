import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Home.css';

export default function Home() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1000);
  };

  // Calculator state
  const [acSize, setAcSize] = useState('1.5');
  const [dailyHours, setDailyHours] = useState(8);
  const [unitRate, setUnitRate] = useState(55);

  const factor = acSize === '1.0' ? 0.7 : acSize === '1.5' ? 1.0 : 1.35;
  const nonBill = Math.round(1.8 * factor * dailyHours * 30 * unitRate);
  const invBill = Math.round(0.8 * factor * dailyHours * 30 * unitRate);
  const saving  = nonBill - invBill;

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    { image: '/images/product_ac.png', alt: 'Premium Air Conditioner' },
    { image: '/images/product_fridge_2.png', alt: 'Smart Refrigerator' },
    { image: '/images/product_tv.png', alt: '4K Smart LED TV' },
    { image: '/images/product_washer_2.png', alt: 'Automatic Washing Machine' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || '';
    fetch(`${base}/api/items`)
      .then(r => r.json())
      .then(data => { if (data.status === 'success') setProducts(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    { icon: '❄️', name: 'Air Conditioners', desc: 'DC Inverter & Non-Inverter', cat: 'Air Conditioner' },
    { icon: '📺', name: 'LED TVs',           desc: 'Smart 4K & HD Displays',    cat: 'LED TV'          },
    { icon: '🧊', name: 'Refrigerators',     desc: 'No-Frost & Direct Cool',    cat: 'Refrigerator'    },
    { icon: '🧺', name: 'Washing Machines',  desc: 'Front Load & Top Load',     cat: 'Washing Machine' },
    { icon: '🍳', name: 'Kitchen App.',      desc: 'Air Fryers & Blenders',     cat: 'Kitchen Appliances' },
    { icon: '🍲', name: 'Microwaves',        desc: 'Solo & Grill Ovens',        cat: 'Microwave Oven' },
    { icon: '🚰', name: 'Water Dispenser',   desc: 'Hot & Cold Filters',        cat: 'Water Dispenser' },
    { icon: '🥶', name: 'Deep Freezer',      desc: 'Chest Freezers & Coolers',  cat: 'Deep Freezer' },
  ];

  const whyUs = [
    { icon: '🏆', title: 'Authorized Dealer',  desc: 'Official dealer of Haier, Gree, Dawlance & Kenwood with 100% genuine products' },
    { icon: '🚚', title: 'Free Delivery',       desc: 'Free doorstep delivery & installation on orders over Rs.80,000 in Karachi' },
    { icon: '🛡️', title: 'Warranty Assured',   desc: 'Full manufacturer warranty on all products with dedicated after-sales support' },
    { icon: '📞', title: '24/7 Support',        desc: 'Call or WhatsApp us anytime — our team is always ready to assist you' },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">⭐ Best Electronics Retailer in Karachi</div>
            <h1>Premium Home<br /><span>Appliances</span> at<br />Best Prices</h1>
            <p>
              Authorized dealer for Haier, Gree, Dawlance &amp; Kenwood. Genuine products
              with warranty, free installation, and doorstep delivery across Karachi.
            </p>
            <div className="hero-btns">
              <Link to="/products" className="btn btn-orange">
                Shop Now <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-green"
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>
          </div>
          <div className="hero-img">
            {heroSlides.map((slide, idx) => (
              <div key={idx} className={`hero-slide${idx === currentSlide ? ' active' : ''}`}>
                <img src={slide.image} alt={slide.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="stats-strip">
        <div className="stats-strip-inner">
          <div className="stat-block"><strong>10,000+</strong><span>Happy Customers</span></div>
          <div className="stat-block"><strong>15+ Years</strong><span>In Business</span></div>
          <div className="stat-block"><strong>500+</strong><span>Products</span></div>
          <div className="stat-block"><strong>2 Branches</strong><span>Saddar &amp; DHA</span></div>
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="cats-section">
        <div className="container">
          <div className="section-title">
            <h2>Shop by Category</h2>
            <div className="title-line"></div>
            <p>Browse our wide selection of home appliances from top brands</p>
          </div>
          <div className="cats-grid">
            {categories.map(c => (
              <Link key={c.cat} to={`/products?category=${encodeURIComponent(c.cat)}`} className="cat-card">
                <div className="cat-icon">{c.icon}</div>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-title">
            <h2>Featured Products</h2>
            <div className="title-line"></div>
            <p>Top-selling appliances at unbeatable prices</p>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>Loading products...</p>
          ) : (
            <div className="prod-grid">
              {products.map(p => {
                const price = p.discountPrice || p.price;
                const saved = p.discountPrice ? p.price - p.discountPrice : 0;
                return (
                  <div key={p.id} className="prod-card">
                    {saved > 0 && <span className="prod-sale-badge">SAVE Rs.{saved.toLocaleString()}</span>}
                    <div className="prod-img-box" onClick={() => navigate('/products')}>
                      <img src={p.image} alt={p.name} />
                    </div>
                    <div className="prod-info-box">
                      <div className="prod-brand-tag">{p.brand}</div>
                      <div className="prod-name-text">{p.name}</div>
                      <div className="prod-price-row">
                        <span className="prod-price-now">Rs. {price.toLocaleString()}</span>
                        {p.discountPrice && <span className="prod-price-was">Rs. {p.price.toLocaleString()}</span>}
                      </div>
                      <div className="prod-action-row">
                        <button 
                          className={`btn btn-sm ${addedProductId === p.id ? 'btn-green' : 'btn-navy'}`} 
                          onClick={() => handleAddToCart(p)}
                        >
                          {addedProductId === p.id ? '✓ Added' : <><ShoppingCart size={13} /> Add</>}
                        </button>
                        <a
                          href={`https://wa.me/923001234567?text=I want to order: ${encodeURIComponent(p.name)} — Rs.${price.toLocaleString()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-green btn-sm"
                        >
                          <MessageCircle size={13} /> Order
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/products" className="btn btn-outline">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Inverter Savings Calculator ── */}
      <section className="calc-section" id="calculator">
        <div className="container">
          <div className="section-title">
            <h2>⚡ Inverter Savings Calculator</h2>
            <div className="title-line"></div>
            <p>See how much you save monthly by switching to a DC Inverter AC</p>
          </div>
          <div className="calc-box">
            <div className="calc-inputs">
              <div className="calc-field">
                <label>AC Tonnage</label>
                <select value={acSize} onChange={e => setAcSize(e.target.value)}>
                  <option value="1.0">1 Ton</option>
                  <option value="1.5">1.5 Ton</option>
                  <option value="2.0">2 Ton</option>
                </select>
              </div>
              <div className="calc-field">
                <div className="calc-range-val">Daily Usage: {dailyHours} hrs/day</div>
                <input type="range" min="2" max="16" value={dailyHours} onChange={e => setDailyHours(Number(e.target.value))} />
              </div>
              <div className="calc-field">
                <div className="calc-range-val">Unit Rate: Rs. {unitRate}/kWh</div>
                <input type="range" min="30" max="80" value={unitRate} onChange={e => setUnitRate(Number(e.target.value))} />
              </div>
            </div>
            <div className="calc-results">
              <div className="result-tile">
                <div className="r-label">Normal AC Bill</div>
                <div className="r-value">Rs. {nonBill.toLocaleString()}</div>
              </div>
              <div className="result-tile">
                <div className="r-label">Inverter AC Bill</div>
                <div className="r-value">Rs. {invBill.toLocaleString()}</div>
              </div>
              <div className="result-tile is-saving">
                <div className="r-label">Monthly Savings 💰</div>
                <div className="r-value">Rs. {saving.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why BisElec ── */}
      <section className="why-section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose BisElec?</h2>
            <div className="title-line"></div>
          </div>
          <div className="why-grid">
            {whyUs.map(w => (
              <div key={w.title} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
