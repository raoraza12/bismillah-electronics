import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingCart, MessageCircle, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Products.css';

export default function Products() {
  const { addToCart } = useCart();
  const location = useLocation();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  // Read URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const search = params.get('search');
    if (cat) setSelectedCategory(cat);
    else setSelectedCategory('All');
    if (search) setSearchQuery(decodeURIComponent(search));
    else setSearchQuery('');
  }, [location.search]);

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || '';
    fetch(`${base}/api/items`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success') setAllProducts(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Derived values
  const categories = ['All', ...new Set(allProducts.map(p => p.category))];
  const brands = [...new Set(allProducts.map(p => p.brand))];

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedBrands([]);
    setMaxPrice(250000);
    setSortBy('default');
    setSearchQuery('');
  };

  // Filter + sort
  let filtered = allProducts.filter(p => {
    const price = p.discountPrice || p.price;
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchPrice = price <= maxPrice;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchBrand && matchPrice && matchSearch;
  });

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      {/* Banner */}
      <div className="page-hero">
        <div className="container">
          <h1>All Products</h1>
          <p>Browse our complete catalogue of genuine home appliances with best prices</p>
        </div>
      </div>

      <div className="container products-page-wrap">
        <div className="products-layout">
          {/* ── Sidebar ── */}
          <aside className="filter-sidebar">
            <div className="sidebar-top">
              <span>🔧 Filter Products</span>
              <button className="sidebar-reset-btn" onClick={clearFilters}>Reset</button>
            </div>

            {/* Category */}
            <div className="filter-section">
              <div className="filter-section-title">Category</div>
              <div className="cat-tabs">
                {categories.map(c => (
                  <button
                    key={c}
                    className={`cat-tab-btn ${selectedCategory === c ? 'is-active' : ''}`}
                    onClick={() => setSelectedCategory(c)}
                  >
                    {c === 'All' ? '🏠 All Products' :
                     c === 'Air Conditioner' ? '❄️ Air Conditioners' :
                     c === 'LED TV' ? '📺 LED TVs' :
                     c === 'Refrigerator' ? '🧊 Refrigerators' :
                     c === 'Washing Machine' ? '🧺 Washing Machines' :
                     c === 'Kitchen Appliances' ? '🍳 Kitchen App.' :
                     c === 'Microwave Oven' ? '🍲 Microwaves' :
                     c === 'Water Dispenser' ? '🚰 Water Dispensers' :
                     c === 'Deep Freezer' ? '🥶 Deep Freezers' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="filter-section">
              <div className="filter-section-title">Brand</div>
              <div className="brand-list">
                {brands.map(b => (
                  <label key={b} className="brand-check-item">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="filter-section">
              <div className="filter-section-title">Max Price</div>
              <div className="price-slider-wrap">
                <div className="price-slider-val">Rs. {maxPrice.toLocaleString()}</div>
                <input
                  type="range"
                  min="50000"
                  max="250000"
                  step="5000"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                />
                <div className="price-range-hints">
                  <span>Rs. 50k</span><span>Rs. 250k</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Products Main ── */}
          <div className="products-main-area">
            {/* Toolbar */}
            <div className="products-toolbar">
              <span className="toolbar-count">
                Showing <strong>{filtered.length}</strong> of {allProducts.length} products
                {selectedCategory !== 'All' && <> in <strong>{selectedCategory}</strong></>}
              </span>
              <select className="sort-dropdown" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="default">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <p style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading products...</p>
            ) : (
              <div className="catalog-grid">
                {filtered.length === 0 ? (
                  <div className="no-products">
                    <h3>No products found</h3>
                    <p>Try changing your filters or search term</p>
                    <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={clearFilters}>
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filtered.map(p => {
                    const price = p.discountPrice || p.price;
                    const saved = p.discountPrice ? p.price - p.discountPrice : 0;
                    return (
                      <div key={p.id} className="catalog-card">
                        {saved > 0 && <span className="catalog-badge">SAVE Rs.{saved.toLocaleString()}</span>}
                        <div className="catalog-img-wrap" onClick={() => setSelectedProduct(p)}>
                          <img src={p.image} alt={p.name} />
                        </div>
                        <div className="catalog-body">
                          <div className="catalog-brand">{p.brand}</div>
                          <div className="catalog-name">{p.name}</div>
                          <div className="catalog-price">
                            <span className="now">Rs. {price.toLocaleString()}</span>
                            {p.discountPrice && <span className="was">Rs. {p.price.toLocaleString()}</span>}
                          </div>
                          <div className="catalog-actions">
                            <button className="add-btn" onClick={() => addToCart(p)}>
                              <ShoppingCart size={14}/> Add to Cart
                            </button>
                            <a
                              href={`https://wa.me/923001234567?text=I want to order: ${encodeURIComponent(p.name)} — Rs.${price.toLocaleString()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="wa-btn"
                            >
                              <MessageCircle size={14}/>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-bg" onClick={() => setSelectedProduct(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-top-bar">
              <h3>{selectedProduct.brand} — {selectedProduct.category}</h3>
              <button className="modal-x-btn" onClick={() => setSelectedProduct(null)}><X size={20}/></button>
            </div>
            <div className="modal-body">
              <div className="modal-product-img">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="modal-product-info">
                <h2>{selectedProduct.name}</h2>
                <div className="modal-price-block">
                  <span className="m-price">Rs. {(selectedProduct.discountPrice || selectedProduct.price).toLocaleString()}</span>
                  {selectedProduct.discountPrice && (
                    <span className="m-was">Rs. {selectedProduct.price.toLocaleString()}</span>
                  )}
                </div>
                <p className="modal-desc">
                  {selectedProduct.description}
                </p>
                <div className="modal-specs-title">Specifications</div>
                <div className="specs-table">
                  {Object.entries(selectedProduct.specifications).map(([k, v]) => (
                    <div key={k} className="modal-spec-row">
                      <span className="sk">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                      <span className="sv">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="modal-cta-row">
                  <button className="m-add" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
                    <ShoppingCart size={16}/> Add to Cart
                  </button>
                  <a
                    href={`https://wa.me/923001234567?text=I want to order: ${encodeURIComponent(selectedProduct.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m-wa"
                  >
                    <MessageCircle size={16}/> Order on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
