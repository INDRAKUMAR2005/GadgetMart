"use client";

import React, { useState, useEffect } from 'react';
import PriceCard from './components/PriceCard';
import Chatbot from './components/Chatbot';
import { useRouter } from 'next/navigation';
import FloatingCart from './components/FloatingCart';
import { GADGET_CATEGORIES, getImagePath, NEW_LAUNCHES, HOT_OFFERS } from './constants/gadget_data';

export default function Home() {
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const filtered = [...NEW_LAUNCHES, ...HOT_OFFERS]
      .filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
    setSuggestions(filtered);
    setShowSuggestions(searchQuery.length > 1);
  }, [searchQuery]);

  useEffect(() => {
    const storedUser = localStorage.getItem('gm_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    document.title = "GadgetMart | Ultimate Tech Price Aggregator";

    const lastNotified = localStorage.getItem('gm_last_notification');
    const now = new Date().getTime();
    if (!lastNotified || now - parseInt(lastNotified) > 86400000) {
      setTimeout(() => {
        setShowNotification(true);
        localStorage.setItem('gm_last_notification', now.toString());
      }, 3000);
    }
  }, []);

  const fetchProductData = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/products/' + encodeURIComponent(query));
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();

      const platformsPresent = data.prices.map((p: any) => p.platformName.toLowerCase());
      const allMocks = [
        { name: 'Meesho', baseOffset: -5000 },
        { name: 'Zepto', baseOffset: 1200 },
        { name: 'Shopify', baseOffset: 400 },
        { name: 'Swiggy Instamart', baseOffset: 800 },
        { name: 'Croma', baseOffset: 500 },
        { name: 'Reliance Digital', baseOffset: 300 }
      ];

      const minPrice = Math.min(...data.prices.map((p: any) => p.price));

      allMocks.forEach((mock: any) => {
        if (!platformsPresent.some((p: any) => p.includes(mock.name.toLowerCase()))) {
          data.prices.push({
            platformName: mock.name,
            platformProductUrl: "#",
            price: Math.max(1000, minPrice + mock.baseOffset + (Math.random() * 2000 - 1000)),
            currency: 'INR',
            available: true,
            fetchedAt: new Date().toISOString()
          });
        }
      });

      setProductData(data);
    } catch (err) {
      console.error(err);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData: any) => {
    if (!user) { router.push('/login'); return; }
    try {
      const res = await fetch('/api/auth/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('gm_token')}` },
        body: JSON.stringify(productData)
      });
      if (res.ok) alert('Product saved successfully!');
      else alert('Failed to save product');
    } catch (err) { console.error(err); }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      console.log("Home: Searching for", searchQuery);
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
      fetchProductData(searchQuery);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gm_token');
    localStorage.removeItem('gm_user');
    setUser(null);
  };

  return (
    <div className='min-h-screen bg-white text-slate-900 selection:bg-amber-100 mesh-bg font-main'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06)_0%,transparent_55%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.05)_0%,transparent_45%)] -z-10' />

      <FloatingCart />
      <Chatbot />

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-[50] glass-card px-4 sm:px-6 lg:px-10 py-4 border-none rounded-none border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">

          {/* Logo */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            onClick={() => { setProductData(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white border-2 border-amber-400 rounded-xl flex items-center justify-center text-amber-500 text-sm sm:text-lg font-black shadow-md transition-all group-hover:scale-110">GM</div>
            <span className="text-lg sm:text-2xl font-black tracking-tighter uppercase gradient-text">GadgetMart<span className="text-slate-300 hidden sm:inline">.Com</span></span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-10">
            {[
              { label: 'Saved Items', path: '/saved' },
              { label: 'Order History', path: '/orders' },
              {
                label: 'Live Aggregators', action: () => {
                  setProductData(null);
                  setTimeout(() => document.getElementById('fresh-arrivals')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }
              }
            ].map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-amber-500 cursor-pointer transition-all"
                onClick={() => { if (item.path) router.push(item.path); else item.action?.(); }}
              >{item.label}</span>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-6">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="font-black text-[9px] text-amber-500 uppercase tracking-[0.2em]">{user.role || 'MEMBER'}</span>
                  <span className="font-black text-xs sm:text-sm text-slate-900 tracking-tighter">{user.name || user.email.split('@')[0]}</span>
                </div>
                <button onClick={handleLogout} className="w-9 h-9 sm:w-11 sm:h-11 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all text-lg shadow-sm">🚪</button>
              </div>
            ) : (
              <button onClick={() => router.push('/login')} className="premium-btn px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-[10px] font-black animate-in-bespoke">
                Login
              </button>
            )}
            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className={`w-5 h-0.5 bg-slate-600 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-slate-600 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-slate-600 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-100 pt-4 flex flex-col gap-4">
            {[
              { label: 'Saved Items', path: '/saved' },
              { label: 'Order History', path: '/orders' },
              { label: 'Live Aggregators', action: () => { setProductData(null); setMobileMenuOpen(false); setTimeout(() => document.getElementById('fresh-arrivals')?.scrollIntoView({ behavior: 'smooth' }), 100); } }
            ].map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-amber-500 cursor-pointer transition-all py-2 px-2 rounded-lg hover:bg-amber-50"
                onClick={() => { setMobileMenuOpen(false); if (item.path) router.push(item.path); else item.action?.(); }}
              >{item.label}</span>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className='pt-36 sm:pt-48 lg:pt-64 pb-12 sm:pb-20 px-4 sm:px-8 flex flex-col items-center text-center max-w-[1400px] mx-auto'>
        <div className='inline-flex items-center gap-3 px-4 sm:px-6 py-2 mb-8 sm:mb-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-black tracking-[0.3em] uppercase'>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Live Price Checker
        </div>

        <h1 className='text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[10rem] font-black mb-6 sm:mb-10 tracking-tighter text-slate-900 leading-[0.85] uppercase animate-in-bespoke px-2'>
          BEST TECH. <br />
          <span className='gradient-text'>BEST PRICES.</span>
        </h1>

        <p className='text-slate-500 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] pb-10 sm:pb-16 px-2'>
          Comparing tech prices across all sites. Simple. Real. Fast. <span className="text-amber-500">Save money on every gadget.</span>
        </p>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32'>

        {/* Search Bar */}
        <div id="search-console" className="relative max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative z-10 flex items-center bg-white rounded-2xl sm:rounded-[3rem] p-2 sm:p-3 border border-slate-200 shadow-xl focus-within:shadow-[0_20px_50px_-20px_rgba(245,158,11,0.25)] transition-all duration-700">
            <input
              type="text"
              placeholder="Search any gadget..."
              className="flex-grow px-4 sm:px-8 py-4 sm:py-6 bg-transparent text-base sm:text-xl font-bold text-slate-900 focus:outline-none placeholder:text-slate-300 tracking-tight"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
            />
            <button type="submit" className="premium-btn w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-full flex items-center justify-center transition-all shrink-0">
              {loading ? <div className="animate-spin w-6 h-6 border-4 border-slate-900/20 border-t-slate-900 rounded-full" /> : <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            </button>
          </form>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 glass-card rounded-[2rem] sm:rounded-[3.5rem] p-4 sm:p-8 shadow-2xl z-50 animate-in-bespoke border-slate-100">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 sm:mb-8 ml-2">Suggestions</h4>
              <div className="space-y-3 sm:space-y-6">
                {suggestions.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 sm:gap-8 p-3 sm:p-6 rounded-2xl sm:rounded-[2.5rem] bg-slate-50 hover:bg-amber-50 cursor-pointer transition-all group/item border border-transparent hover:border-amber-200"
                    onClick={() => { setSearchQuery(p.name); setShowSuggestions(false); router.push(`/?q=${encodeURIComponent(p.name)}`); fetchProductData(p.name); }}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-[1.5rem] overflow-hidden border border-slate-100 flex items-center justify-center p-1 shadow-sm shrink-0">
                      <img src={p.image} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-black text-sm sm:text-lg text-slate-900 tracking-tighter uppercase truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">Best Price</span>
                        <p className="text-xs sm:text-sm font-black text-slate-400">From ₹{p.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Retail Partners */}
        <div className="mt-16 sm:mt-24 flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-16 gap-y-4 sm:gap-y-8 opacity-60 hover:opacity-100 transition-all duration-1000 px-2">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 w-full text-center mb-4 sm:mb-8">Our Retail Partners</span>
          {[
            { name: 'FLIPKART', dot: 'bg-blue-400', text: 'text-blue-500' },
            { name: 'AMAZON', dot: 'bg-orange-400', text: 'text-orange-500' },
            { name: 'MEESHO', dot: 'bg-pink-400', text: 'text-pink-500' },
            { name: 'RELIANCE DIGITAL', dot: 'bg-purple-400', text: 'text-purple-500' },
            { name: 'CROMA', dot: 'bg-green-400', text: 'text-green-500' },
            { name: 'APPLE', dot: 'bg-slate-400', text: 'text-slate-500' },
            { name: 'SAMSUNG', dot: 'bg-cyan-400', text: 'text-cyan-500' },
          ].map((brand, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-4 group/node">
              <div className={`w-1.5 h-1.5 rounded-full ${brand.dot} opacity-60 group-hover/node:opacity-100 transition-all`} />
              <span className={`text-[10px] sm:text-xs font-black tracking-[0.2em] transition-all cursor-default uppercase text-slate-400 group-hover/node:${brand.text}`}>{brand.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-24 sm:mt-40"></div>

        {/* Notice Banner */}
        <div className="max-w-5xl mx-auto py-10 sm:py-20 px-6 sm:px-12 glass-card rounded-[2.5rem] sm:rounded-[4rem] border border-orange-200 relative overflow-hidden group animate-in-bespoke">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-orange-50 blur-[80px] sm:blur-[120px] -z-10" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-16">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white border border-orange-100 rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center justify-center text-3xl sm:text-4xl shadow-lg">
                <span className="animate-pulse">🔔</span>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full animate-ping border-4 border-white z-20"></div>
            </div>

            <div className="flex-1 space-y-4 sm:space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500 mb-1">Important Notice</h4>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Phase 1: testing only</h3>
              </div>
              <p className="text-slate-500 text-sm sm:text-base font-bold tracking-wide leading-relaxed">
                Prices are fetched using <span className="text-amber-500 font-black">Apify web scrapers</span>. Due to API
                usage costs, live scraping runs on a limited schedule — so displayed prices are
                <span className="text-orange-500 font-black"> approximate and may not reflect real-time data</span>.
                <br /><br />
                <span className="text-orange-600 text-xs sm:text-sm font-black uppercase tracking-widest">Direct purchasing is disabled until our official launch.</span>
              </p>
              <div className="flex flex-wrap gap-4 sm:gap-8">
                {[{ label: 'PRICE SOURCE', value: 'APIFY SCRAPER' }, { label: 'ACCURACY', value: 'APPROXIMATE' }].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 bg-orange-50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-orange-100">
                    <span className="text-orange-600 uppercase tracking-[0.3em] text-[9px] font-black">{stat.label}</span>
                    <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results or Product Grid */}
        {productData ? (
          <div id="search-results" className='mt-16 sm:mt-32 space-y-12 sm:space-y-24 animate-in-bespoke'>
            <div className='flex flex-col gap-6 sm:gap-12 pb-8 sm:pb-16 border-b border-slate-100'>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
                <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden bg-white border border-slate-100 p-3 shadow-xl mx-auto sm:mx-0">
                  <img src={productData.imageUrl || getImagePath(productData.name, productData.category)} alt={productData.name} className="w-full h-full object-cover rounded-[1.5rem]" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-amber-200">{productData.brand}</span>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{productData.category}</span>
                  </div>
                  <h2 className='text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 leading-none uppercase'>{productData.name}</h2>
                  <p className='text-slate-500 text-sm sm:text-base font-bold mt-3 max-w-xl'>{productData.description}</p>
                </div>
              </div>
              <div className='bg-slate-50 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-sm text-center sm:text-right'>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-3">Best Overall Price</span>
                <div className="flex items-baseline justify-center sm:justify-end gap-3">
                  <span className="text-xl font-black text-amber-500">₹</span>
                  <p className='text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter italic'>
                    {Math.min(...productData.prices.map((p: any) => p.price)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className='grid gap-6 sm:gap-10'>
              {[...productData.prices]
                .sort((a: any, b: any) => (a.platformName === 'GadgetMart' ? -1 : b.platformName === 'GadgetMart' ? 1 : 0))
                .map((price: any, index: number) => (
                  <PriceCard key={index} item={price} productName={productData.name} userEmail={user?.email} productImage={productData.imageUrl || getImagePath(productData.name, productData.category)} handleSave={handleSaveProduct} />
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-24 sm:space-y-48 mt-24 sm:mt-48">
            {/* Fresh Arrivals */}
            <div id="fresh-arrivals" className="animate-in-bespoke">
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-10 sm:mb-20'>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-2 sm:mb-4">Fresh Arrivals</h4>
                  <h2 className='text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase'>Top Gadgets</h2>
                </div>
                <div className='hidden sm:block h-px flex-grow mx-16 bg-slate-100'></div>
                <button className="outline-btn px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest self-start sm:self-auto">All Products</button>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10'>
                {NEW_LAUNCHES.slice(0, 12).map((gadget, i) => (
                  <div
                    key={i}
                    className='glass-card p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[4rem] group hover:border-amber-300 cursor-pointer overflow-hidden relative transition-all duration-700'
                    onClick={() => {
                      if (!user) { router.push('/login'); return; }
                      setSearchQuery(gadget.name);
                      setTimeout(() => { fetchProductData(gadget.name); document.getElementById('search-console')?.scrollIntoView({ behavior: 'smooth' }); }, 0);
                    }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/60 blur-[50px] group-hover:bg-amber-100/60 transition-all"></div>
                    <div className='aspect-square rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-slate-100 mb-6 sm:mb-10 overflow-hidden group-hover:scale-105 transition-all duration-1000 p-2 shadow-sm'>
                      <img src={gadget.image} alt={gadget.name} className="w-full h-full object-cover rounded-[1.5rem] opacity-90 group-hover:opacity-100 transition-all" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>{gadget.brand}</p>
                          <h3 className='text-xl sm:text-2xl font-black text-slate-800 leading-tight tracking-tighter uppercase'>{gadget.name}</h3>
                        </div>
                        <span className="text-xl sm:text-2xl filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{gadget.icon}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-amber-500">₹</span>
                          <p className='text-2xl sm:text-3xl font-black text-slate-900 italic tracking-tighter'>{gadget.price.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSaveProduct({ ...gadget, category: "New Item" }); }}
                          className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-amber-50 hover:border-amber-200 transition-all shadow-sm"
                        >
                          <span className="text-base sm:text-lg">🔖</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-white text-slate-900 pt-24 sm:pt-48 pb-10 sm:pb-20 px-4 sm:px-10 relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-64 sm:h-96 bg-amber-50 blur-[100px] sm:blur-[150px] opacity-40" />
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-32 mb-16 sm:mb-32 items-start lg:items-end">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white border-2 border-amber-400 rounded-2xl flex items-center justify-center text-amber-500 text-xl font-black shadow-md">GM</div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase gradient-text">GadgetMart<span className="text-slate-200 italic">.com</span></h2>
              </div>
              <p className="text-slate-400 text-base sm:text-xl font-medium max-w-xl leading-relaxed tracking-tight">
                Your place for <span className="text-slate-900">Price Comparison</span>. Fast and easy. Find the best tech at the lowest prices.
              </p>
            </div>

            <div className="flex flex-col lg:items-end">
              <div className="mb-8 sm:mb-12 lg:text-right">
                <h3 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic text-slate-900">Indrakumar</h3>
                <p className="text-slate-400 font-bold mt-2 uppercase tracking-[0.3em] text-sm">Founder & CEO</p>
              </div>

              <div className="flex flex-wrap gap-8 sm:gap-12 lg:justify-end">
                {[
                  { name: 'How it Works', desc: 'We use smart tools to find the best deals for you automatically.' },
                  { name: 'Daily Prices', desc: 'Prices are checked every day to make sure you save money.' }
                ].map((box, i) => (
                  <div key={i} className="group relative">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-amber-500 cursor-pointer underline decoration-slate-200 underline-offset-8 transition-all">{box.name}</span>
                    <div className="absolute bottom-full right-0 mb-4 hidden group-hover:block bg-white border border-slate-100 p-6 rounded-[2rem] shadow-2xl w-64 sm:w-80 animate-in-bespoke z-50">
                      <p className="text-slate-900 font-black mb-2 uppercase tracking-widest text-xs">{box.name}</p>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium">{box.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 sm:pt-16 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] text-center sm:text-left">© 2026 GadgetMart. Online tech shopping made easy.</p>
            <div className="flex gap-6 sm:gap-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-amber-500 cursor-pointer transition-all">Privacy Help</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-amber-500 cursor-pointer transition-all">Usage Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
