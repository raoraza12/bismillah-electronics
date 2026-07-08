import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Hero carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    { image: '/images/product_ac.png',      label: 'DC Inverter ACs',       offer: 'Up to 15% OFF',  color: '#0f2557' },
    { image: '/images/product_fridge_2.png', label: 'No-Frost Refrigerators', offer: 'Up to 10% OFF', color: '#0d5c2f' },
    { image: '/images/product_tv.png',       label: '4K Smart LED TVs',      offer: 'Up to 12% OFF',  color: '#7c1c1c' },
    { image: '/images/product_washer_2.png', label: 'Auto Washing Machines', offer: 'Free Delivery',   color: '#4a1f7a' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || 'https://bismillah-electronics-gold.vercel.app';
    fetch(`${base}/api/items`)
      .then(r => r.json())
      .then(data => { if (data.status === 'success') setProducts(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    { img: '/images/cat_ac.png',        name: 'Air Conditioners', desc: 'DC Inverter & Non-Inverter', cat: 'Air Conditioner' },
    { img: '/images/cat_tv.png',        name: 'LED TVs',           desc: 'Smart 4K & HD Displays',    cat: 'LED TV'          },
    { img: '/images/cat_fridge.png',    name: 'Refrigerators',     desc: 'No-Frost & Direct Cool',    cat: 'Refrigerator'    },
    { img: '/images/cat_washer.png',    name: 'Washing Machines',  desc: 'Front Load & Top Load',     cat: 'Washing Machine' },
    { img: '/images/cat_kitchen.png',   name: 'Kitchen App.',      desc: 'Air Fryers & Blenders',     cat: 'Kitchen Appliances' },
    { img: '/images/cat_microwave.png', name: 'Microwaves',        desc: 'Solo & Grill Ovens',        cat: 'Microwave Oven' },
    { img: '/images/product_dispenser.png', name: 'Water Dispensers', desc: 'Hot & Cold Filters',    cat: 'Water Dispenser' },
    { img: '/images/product_freezer.png',   name: 'Deep Freezers',    desc: 'Chest Freezers & Coolers', cat: 'Deep Freezer' },
  ];

  const whyUs = [
    { icon: '🏆', title: 'Authorized Dealer',  desc: 'Official dealer of Haier, Gree, Dawlance & Kenwood with 100% genuine products' },
    { icon: '🚚', title: 'Free Delivery',       desc: 'Free doorstep delivery & installation on orders over Rs.80,000 in Karachi' },
    { icon: '🛡️', title: 'Warranty Assured',   desc: 'Full manufacturer warranty on all products with dedicated after-sales support' },
    { icon: '📞', title: '24/7 Support',        desc: 'Call or WhatsApp us anytime — our team is always ready to assist you' },
  ];

  // Hot items by category
  const hotCategories = ['Air Conditioner', 'LED TV', 'Refrigerator', 'Microwave Oven'];
  const hotItems = hotCategories.map(cat => products.find(p => p.category === cat)).filter(Boolean);

  return (
    <div>
      {/* ── Scrolling Offer Ticker ── */}
      <div className="offer-ticker">
        <div className="ticker-track">
          {[
            '🎉 Flat 10% Off Sitewide',
            '🚚 Free Delivery on Orders Rs.80,000 & Above',
            '⭐ Welcome to Bismillah Electronics',
            '✅ Authorized Dealer of Haier',
            '✅ Authorized Dealer of Gree',
            '✅ Authorized Dealer of Dawlance',
            '🎉 Flat 10% Off Sitewide',
            '🚚 Free Delivery on Orders Rs.80,000 & Above',
            '⭐ Welcome to Bismillah Electronics',
            '✅ Authorized Dealer of Kenwood',
            '💰 Up to 15% Off on Inverter ACs',
            '📞 WhatsApp Order Available',
          ].map((t, i) => (
            <span key={i} className="ticker-item">{t}</span>
          ))}
        </div>
      </div>

      {/* ── Compact Hero Carousel ── */}
      <section className="hero-compact">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide-compact${idx === currentSlide ? ' active' : ''}`}
            style={{ '--hero-bg': slide.color }}
          >
            <div className="hero-slide-inner">
              <div className="hero-slide-text">
                <div className="hero-offer-pill">🔥 {slide.offer}</div>
                <h2>Bismillah Electronics</h2>
                <p>{slide.label} — Best Prices in Karachi</p>
                <div className="hero-slide-btns">
                  <Link to="/products" className="btn btn-orange">Shop Now <ArrowRight size={15}/></Link>
                  <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="btn btn-white-outline">
                    <MessageCircle size={15}/> WhatsApp
                  </a>
                </div>
              </div>
              <div className="hero-slide-img">
                <img src={slide.image} alt={slide.label} />
              </div>
            </div>
          </div>
        ))}
        {/* Dots */}
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === currentSlide ? ' active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
        {/* Arrows */}
        <button className="hero-arrow left" onClick={() => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length)}>
          <ChevronLeft size={22}/>
        </button>
        <button className="hero-arrow right" onClick={() => setCurrentSlide(p => (p + 1) % heroSlides.length)}>
          <ChevronRight size={22}/>
        </button>
      </section>

      {/* ── Stats Strip ── */}
      <div className="stats-strip">
        <div className="stats-strip-inner">
          <div className="stat-block"><strong>10,000+</strong><span>Happy Customers</span></div>
          <div className="stat-block"><strong>15+ Years</strong><span>In Business</span></div>
          <div className="stat-block"><strong>500+</strong><span>Products</span></div>
          <div className="stat-block"><strong>2 Branches</strong><span>Saddar & DHA</span></div>
        </div>
      </div>

      {/* ── Shop by Category ── */}
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
                <div className="cat-img-wrap">
                  <img src={c.img} alt={c.name} />
                </div>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flash Deals Horizontal Scroll Strip ── */}
      {hotItems.length > 0 && (
        <section className="flash-strip">
          <div className="flash-strip-inner">
            <div className="flash-strip-header">
              <h3>🔥 Flash Deals / Hot Items</h3>
              <Link to="/products">View All Deals</Link>
            </div>
            <div className="flash-scroll">
              {hotItems.map(p => {
                const price = p.discountPrice || p.price;
                const pct = p.discountPrice ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;
                return (
                  <div key={p.id} className="flash-item" onClick={() => navigate('/products')}>
                    {pct > 0 && <span className="flash-pct-badge">{pct}% OFF</span>}
                    <div className="flash-img">
                      <img src={p.image} alt={p.name} />
                    </div>
                    <div className="flash-info">
                      <div className="flash-brand">{p.brand}</div>
                      <div className="flash-name">{p.name}</div>
                      <div className="flash-prices">
                        <span className="flash-now">Rs. {price.toLocaleString()}</span>
                        {p.discountPrice && <span className="flash-was">Rs. {p.price.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-title">
            <h2>Featured Products</h2>
            <div className="title-line"></div>
            <p>Hand-picked appliances from top brands</p>
          </div>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>Loading products...</p>
          ) : (
            <div className="prod-grid">
              {products.slice(0, 8).map(p => {
                const price = p.discountPrice || p.price;
                const saved = p.discountPrice ? p.price - p.discountPrice : 0;
                const pct   = p.discountPrice ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;
                return (
                  <div key={p.id} className="prod-card">
                    {pct > 0 && <span className="prod-sale-badge">{pct}% OFF</span>}
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
                          {addedProductId === p.id ? '✓ Added' : <><ShoppingCart size={13}/> Add</>}
                        </button>
                        <a
                          href={`https://wa.me/923001234567?text=I want to order: ${encodeURIComponent(p.name)} — Rs.${price.toLocaleString()}`}
                          target="_blank" rel="noopener noreferrer"
                          className="btn btn-green btn-sm"
                        >
                          <MessageCircle size={13}/> Order
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/products" className="btn btn-outline">View All Products <ArrowRight size={16}/></Link>
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
            <h2>Why Choose Bismillah Electronics?</h2>
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
