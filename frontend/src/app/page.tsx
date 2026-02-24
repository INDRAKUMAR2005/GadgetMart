"use client";

import React, { useState, useEffect } from 'react';
import PriceCard from './components/PriceCard';
import Chatbot from './components/Chatbot';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCart } from './utils/cartStorage';

const GADGET_IMAGES = [
  'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800', // iPhone
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800', // MacBook
  'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800', // Phone
  'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&q=80&w=800', // Apple Watch
  'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&q=80&w=800', // AirPods (Guaranteed Fix)
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800', // iPad
  'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?auto=format&fit=crop&q=80&w=800', // Camera
  'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800', // Laptop
  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800', // Gaming
  'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=800', // Speaker
];

const GADGET_CATEGORIES = [
  { name: 'Smartphones', icon: '📱' },
  { name: 'Laptops', icon: '💻' },
  { name: 'Audio', icon: '🎧' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Cameras', icon: '📷' },
];

const getImagePath = (name: string, category: string = '') => {
  const n = name.toLowerCase();
  const c = category.toLowerCase();

  if (n.includes('airpod') || n.includes('buds') || n.includes('pods')) return GADGET_IMAGES[4];
  if (n.includes('watch') || n.includes('wearable')) return GADGET_IMAGES[3];
  if (n.includes('iphone')) return GADGET_IMAGES[0];
  if (n.includes('macbook')) return GADGET_IMAGES[1];
  if (n.includes('ipad') || n.includes('pad')) return GADGET_IMAGES[5];
  if (n.includes('playstation') || n.includes('ps5') || n.includes('gaming') || n.includes('xbox') || c.includes('gaming')) return GADGET_IMAGES[8];

  if (n.includes('laptop') || c.includes('laptops')) return GADGET_IMAGES[7];
  if (n.includes('phone') || c.includes('smartphones')) return GADGET_IMAGES[2];
  if (n.includes('audio') || n.includes('headphone') || c.includes('audio') || n.includes('speaker')) return GADGET_IMAGES[9];
  if (n.includes('camera') || c.includes('cameras')) return GADGET_IMAGES[6];

  return GADGET_IMAGES[2];
};

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'Asus', 'Microsoft'];

const PARTNER_LOGOS = [
  { name: 'Amazon', color: 'text-orange-500' },
  { name: 'Flipkart', color: 'text-blue-500' },
  { name: 'Reliance Digital', color: 'text-red-500' },
  { name: 'Croma', color: 'text-teal-500' },
  { name: 'Apple Store', color: 'text-zinc-900' },
  { name: 'Samsung Shop', color: 'text-blue-700' },
];

const NEW_LAUNCHES = Array.from({ length: 60 }, (_, i) => ({
  name: ['iPhone 16 Pro Max', 'Samsung S25 Ultra', 'MacBook Pro M4 Max', 'ROG Ally X2', 'Sony PS5 Pro Digital', 'iPad Air M3 Pro', 'Pixel 9 Pro XL', 'Dell XPS 16', 'AirPods Max 2026', 'Nintendo Switch 2 OLED', 'Surface Laptop 7', 'Logitech MX Anywhere 4', 'Sony A9 III', 'DJI Mavic 4 Pro', 'GoPro Hero 14 Black', 'Razer Blade 18', 'Apple Watch Ultra 3', 'Bose QuietComfort Ultra', 'HP Spectre x360', 'Lenovo Legion 9i'][i % 20] + (i >= 20 ? ` Gen ${Math.floor(i / 20) + 1}` : ''),
  brand: ['Apple', 'Samsung', 'ASUS', 'Sony', 'Google', 'Dell', 'Nintendo', 'Microsoft', 'Logitech', 'DJI', 'GoPro', 'Razer', 'Bose', 'HP', 'Lenovo'][i % 15],
  price: 89999 + (i * 3500),
  icon: '📱',
  image: getImagePath(['iPhone 16 Pro Max', 'Samsung S25 Ultra', 'MacBook Pro M4 Max', 'ROG Ally X2', 'Sony PS5 Pro Digital', 'iPad Air M3 Pro', 'Pixel 9 Pro XL', 'Dell XPS 16', 'AirPods Max 2026', 'Nintendo Switch 2 OLED', 'Surface Laptop 7', 'Logitech MX Anywhere 4', 'Sony A9 III', 'DJI Mavic 4 Pro', 'GoPro Hero 14 Black', 'Razer Blade 18', 'Apple Watch Ultra 3', 'Bose QuietComfort Ultra', 'HP Spectre x360', 'Lenovo Legion 9i'][i % 20]),
}));

const HOT_OFFERS = Array.from({ length: 60 }, (_, i) => ({
  name: ['Galaxy Buds 3 Pro', 'Logitech G Pro X Superlight', 'Kindle Oasis 4', 'Sony WH-Ultimate', 'GoPro Hero 13 Mini', 'Apple Watch SE 3', 'Dyson V15 Detect', 'Marshall Middleton', 'Fitbit Sense 3', 'Beats Solo 4', 'Bose QC Comfort', 'Razer Viper V3', 'Samsung T9 4TB', 'Keychron K2 Max', 'Anker 737 Pro', 'Ugreen Revodok', 'Elgato Stream Deck +', 'Shure SM7B Pro', 'Philips Hue Sync', 'Nanoleaf Shapes'][i % 20] + (i >= 20 ? ` (Hot Deal #${i + 1})` : ''),
  brand: ['Samsung', 'Logitech', 'Amazon', 'Sony', 'GoPro', 'Apple', 'Dyson', 'Marshall', 'Fitbit', 'Beats', 'Bose', 'Razer', 'Keychron', 'Anker', 'Ugreen', 'Elgato', 'Shure', 'Philips', 'Nanoleaf'][i % 19],
  price: 9999 + (i * 900),
  icon: '🎁',
  image: getImagePath(['Galaxy Buds 3 Pro', 'Logitech G Pro X Superlight', 'Kindle Oasis 4', 'Sony WH-Ultimate', 'GoPro Hero 13 Mini', 'Apple Watch SE 3', 'Dyson V15 Detect', 'Marshall Middleton', 'Fitbit Sense 3', 'Beats Solo 4', 'Bose QC Comfort', 'Razer Viper V3', 'Samsung T9 4TB', 'Keychron K2 Max', 'Anker 737 Pro', 'Ugreen Revodok', 'Elgato Stream Deck +', 'Shure SM7B Pro', 'Philips Hue Sync', 'Nanoleaf Shapes'][i % 20]),
}));

const FloatingCart = () => {
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const updateCount = () => setCount(getCart().reduce((acc, item) => acc + item.quantity, 0));
    updateCount();
    window.addEventListener('cart-updated', updateCount);
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

  if (count === 0) return null;

  return (
    <button
      onClick={() => router.push('/cart')}
      className="fixed bottom-12 right-12 z-50 bg-blue-600 text-white px-8 py-6 rounded-[2rem] font-black shadow-2xl shadow-blue-600/40 hover:scale-110 active:scale-95 transition-all flex items-center gap-4 group"
    >
      <div className="relative">
        <span className="text-2xl">🛒</span>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600">{count}</span>
      </div>
      <span className="uppercase tracking-widest text-sm">View Cart</span>
    </button>
  );
};

export default function Home() {
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
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

    // Daily Deal Push Notification Simulation
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
      setProductData(data);
    } catch (err) {
      console.error(err);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData: any) => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('/api/auth/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('gm_token')}`
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        alert('Product saved successfully!');
      } else {
        alert('Failed to save product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Auth Wall for Search
    if (!user) {
      router.push('/login');
      return;
    }

    setShowSuggestions(false);
    if (searchQuery.trim()) {
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
    <div className='min-h-screen bg-white text-zinc-950 selection:bg-blue-100 mesh-bg'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10' />

      <FloatingCart />

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-xl border-b border-zinc-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2" onClick={() => { setProductData(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg font-black">GM</div>
            <span>Gadget<span className="text-blue-600">Mart</span></span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-6">

              <span
                className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 cursor-pointer"
                onClick={() => router.push('/saved')}
              >
                Saved
              </span>
              <span
                className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 cursor-pointer"
                onClick={() => document.getElementById('fresh-arrivals')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Aggregators
              </span>
              <span
                className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 cursor-pointer"
                onClick={() => document.getElementById('system-status')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Hot Fixes
              </span>
              <span
                className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 cursor-pointer"
                onClick={() => router.push('/orders')}
              >
                My Orders
              </span>
            </div>
            {user ? (
              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                  <span className="font-bold text-[10px] text-blue-600 uppercase tracking-widest leading-none mb-1">{user.role || 'MEMBER'}</span>
                  <span className="font-black text-sm text-zinc-900 leading-none truncate max-w-[150px]">{user.name || user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-zinc-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all border border-zinc-200 shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <button
                  onClick={() => router.push('/login')}
                  className="bg-zinc-950 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-950/20 holographic"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <header className='pt-48 pb-16 px-6 flex flex-col items-center text-center'>
        <div className='inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-black animate-fade-in tracking-tight uppercase'>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Next-Gen Price Aggregator V2.0
        </div>
        <h1 className='text-6xl md:text-[8rem] font-black mb-8 tracking-tighter text-zinc-900 leading-[0.85]'>
          Tech Found. <br />
          <span className='gradient-text'>Prices Compared.</span>
        </h1>
        <p className='text-zinc-500 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed pb-8'>
          Real-time price intelligence across <span className="text-zinc-900 font-black">Global Retailers</span>. <br />
          Always get the absolute <span className="text-blue-600 font-bold">Lowest Price</span> guaranteed.
        </p>

        {/* Partner Logos */}
        <div id="system-status" className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 mt-8 mb-16">
          {PARTNER_LOGOS.map((logo) => (
            <div key={logo.name} className={`text-sm md:text-xl font-black italic tracking-tighter ${logo.color}`}>
              {logo.name}
            </div>
          ))}
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 pb-32'>
        <div className="relative group max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative z-10 flex items-center bg-white/80 backdrop-blur-2xl rounded-[2rem] p-2 premium-shadow border border-white/50 group-focus-within:border-blue-500/50 transition-all">
            <input
              type="text"
              placeholder="Search for iPhones, MacBooks, or specialized gear..."
              className="flex-grow px-8 py-4 bg-transparent text-lg font-semibold text-zinc-900 focus:outline-none placeholder:text-zinc-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
            />
            <button type="submit" className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
              {loading ? <div className="animate-spin w-6 h-6 border-3 border-white/20 border-t-white rounded-full" /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            </button>
          </form>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white/70 backdrop-blur-3xl rounded-[2.5rem] border border-zinc-100 p-6 shadow-2xl z-50 animate-in slide-in-from-top-4 duration-300">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 ml-2">Quick Matches</h4>
              <div className="space-y-4">
                {suggestions.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all group/item"
                    onClick={() => {
                      setSearchQuery(p.name);
                      setShowSuggestions(false);
                      router.push(`/?q=${encodeURIComponent(p.name)}`);
                      fetchProductData(p.name);
                    }}
                  >
                    <div className="w-12 h-12 bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100 flex items-center justify-center text-xl grayscale group-hover/item:grayscale-0 transition-all">
                      <img src={p.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-zinc-900">{p.name}</p>
                      <p className="text-xs font-bold text-blue-600">₹{p.price.toLocaleString()}</p>
                    </div>
                    <svg className="w-5 h-5 text-zinc-300 group-hover/item:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Project Prototype Disclaimer */}
        <div className="max-w-4xl mx-auto mt-12 p-8 bg-zinc-950 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -z-10 group-hover:bg-blue-600/30 transition-all duration-700" />
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-600/20 shrink-0 animate-pulse">⚠️</div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Project Integrity & Transparency</h4>
              <p className="text-zinc-300 font-medium leading-relaxed">
                This is my <span className="text-white font-black">Project Prototype</span>. Due to extreme API maintenance costs, I am currently utilizing <span className="text-white font-black">Apify's data streams</span> for demonstration.
                <span className="block mt-2 text-zinc-400 italic">It does not show real-time prices across all platforms yet.</span>
              </p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-sm font-bold text-white">
                  📍 <span className="text-blue-400 uppercase tracking-widest text-[10px] mr-2">Highlight</span>
                  You can check the exact details and live pricing of any product by using the <span className="text-blue-400 underline decoration-2 underline-offset-4">Grab Now</span> feature.
                </p>
              </div>
            </div>
          </div>
        </div>


        {productData ? (
          <div className='space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-500'>
            <div className='flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-100 pb-12 gap-6'>
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border border-zinc-100 shadow-lg shrink-0">
                  <img src={productData.imageUrl || getImagePath(productData.name, productData.category)} alt={productData.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className='text-5xl font-black tracking-tighter text-zinc-900'>{productData.name}</h2>
                  <p className='text-zinc-500 text-lg font-medium mb-2'>{productData.brand} • {productData.category}</p>
                  <p className='text-blue-600/60 text-sm font-bold uppercase tracking-widest'>{productData.description}</p>
                </div>
              </div>
              <div className='text-right'>
                <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">Global Best Price</span>
                <p className='text-5xl font-black text-blue-600'>
                  ₹{Math.min(...productData.prices.map((p: any) => p.price)).toLocaleString()}
                </p>
              </div>
            </div>
            {/* Disclaimer Section - Priority Placement */}
            <div className='p-8 bg-orange-50 border-2 border-orange-100 rounded-[3rem] mt-8 animate-in fade-in zoom-in duration-500'>
              <div className='flex items-start gap-6 text-orange-900'>
                <span className="text-3xl">⚠️</span>
                <div className="space-y-4">
                  <p className="font-black underline uppercase tracking-[0.2em] text-xs">Important Disclaimer</p>
                  <p className="text-sm font-medium leading-relaxed opacity-90">
                    Due to high premium API maintenance costs, GadgetMart utilizes <strong>Apify Data Streams</strong> for real-time price aggregation.
                    This is an <strong>experimental aggregator</strong>. Please do not initiate purchases based solely on these results as they may originate from unofficial or third-party listings.
                    Always verify pricing and authenticity on the official retailer websites.
                  </p>
                </div>
              </div>
            </div>

            <div className='grid gap-8 mt-12'>
              {[...productData.prices]
                .sort((a: any, b: any) => (a.platformName === 'GadgetMart' ? -1 : b.platformName === 'GadgetMart' ? 1 : 0))
                .map((price: any, index: number) => (
                  <PriceCard
                    key={index}
                    item={price}
                    productName={productData.name}
                    userEmail={user?.email}
                    productImage={productData.imageUrl || getImagePath(productData.name, productData.category)}
                    handleSave={handleSaveProduct}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-32">
            {/* Hot Offers (Live Deals) */}
            <div id="extreme-deals">
              <div className='flex items-center justify-between mb-12'>
                <div>
                  <h2 className='text-4xl font-black text-zinc-900 tracking-tight'>Extreme Deals</h2>
                  <p className="text-zinc-500 font-medium">Hand-picked lowest prices found today.</p>
                </div>
                <div className='h-px flex-grow mx-8 bg-zinc-100 hidden md:block'></div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {HOT_OFFERS.slice(0, 10).map((gadget, i) => (
                  <div key={i} className='flex items-center gap-6 glass-card p-6 rounded-[2.5rem] border hover:border-blue-600 hover:shadow-2xl transition-all cursor-pointer group holographic'
                    onClick={() => {
                      if (!user) {
                        router.push('/login');
                        return;
                      }
                      setSearchQuery(gadget.name);
                      setTimeout(() => fetchProductData(gadget.name), 0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className='w-40 h-40 rounded-[2rem] overflow-hidden border border-zinc-100 shrink-0'>
                      <img src={gadget.image} alt={gadget.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse uppercase">Deal</span>
                        <h3 className='text-xl font-black text-zinc-900'>{gadget.name}</h3>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveProduct({
                            name: gadget.name,
                            brand: gadget.brand,
                            category: "Gadget",
                            imageUrl: gadget.image,
                            price: gadget.price
                          });
                        }}
                        className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all group/save"
                      >
                        <span className="text-lg">🔖</span>
                      </button>
                    </div>
                    <p className='text-zinc-400 font-bold text-xs uppercase tracking-widest mb-4'>{gadget.brand}</p>
                    <div className="flex items-baseline gap-2">
                      <p className='text-3xl font-black text-zinc-950'>₹{gadget.price.toLocaleString()}</p>
                      <span className="text-zinc-300 text-sm line-through font-bold">₹{(gadget.price * 1.4).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Launches (Fresh Arrivals) */}
            <div id="fresh-arrivals">
              <div className='flex items-center justify-between mb-12'>
                <div>
                  <h2 className='text-4xl font-black text-zinc-900 tracking-tight'>Fresh Arrivals</h2>
                  <p className="text-zinc-500 font-medium">Verified new tech launching globally.</p>
                </div>
                <div className='h-px flex-grow mx-8 bg-zinc-100 hidden md:block'></div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {NEW_LAUNCHES.map((gadget, i) => (
                  <div key={i} className='glass-card p-6 rounded-[2.5rem] border border-white/50 hover:border-blue-200 hover:bg-white/60 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer group holographic'
                    onClick={() => {
                      if (!user) {
                        router.push('/login');
                        return;
                      }
                      setSearchQuery(gadget.name);
                      setTimeout(() => fetchProductData(gadget.name), 0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className='aspect-square rounded-[2rem] overflow-hidden mb-8 border border-zinc-100 group-hover:scale-105 transition-transform'>
                      <img src={gadget.image} alt={gadget.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-grow">
                          <h3 className='text-2xl font-black text-zinc-900 leading-tight'>{gadget.name}</h3>
                          <p className='text-zinc-400 font-bold text-sm uppercase tracking-widest mt-1'>{gadget.brand}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-lg">{gadget.icon}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveProduct({
                                name: gadget.name,
                                brand: gadget.brand,
                                category: "New Arrival",
                                imageUrl: gadget.image,
                                price: gadget.price
                              });
                            }}
                            className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all group/save"
                          >
                            <span className="text-lg">🔖</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center bg-white rounded-2xl p-4 border border-zinc-100 mt-4">
                        <p className='text-xl font-black text-zinc-900'>₹{gadget.price.toLocaleString()}</p>
                        <span className="text-blue-600 font-black text-xs uppercase tracking-widest">Compare →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
        }
      </main >

      {/* Creative Footer */}
      < footer className="bg-zinc-950 text-white pt-32 pb-12 px-6 overflow-hidden relative" >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-64 bg-blue-600 blur-[120px] opacity-20" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-zinc-950 text-xl font-black">GM</div>
                <h2 className="text-4xl font-black tracking-tighter italic">GadgetMart Pro.</h2>
              </div>
              <p className="text-zinc-400 text-xl font-medium max-w-md mb-12 leading-relaxed">
                The world's most advanced price intelligence engine for elite tech consumers. Built by innovators, for enthusiasts.
              </p>
              <p className="text-zinc-600 font-bold text-sm uppercase tracking-widest mt-4">Connect with us on LinkedIn for official updates.</p>
            </div>
            <div className="flex flex-col justify-end lg:items-end">
              <div className="mb-12">
                <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] block mb-4">Masterminds Behind GadgetMart</span>
                <h3 className="text-5xl font-black tracking-tighter">Indrakumar</h3>
                <p className="text-zinc-500 font-bold mt-2 uppercase tracking-widest">Lead Engineer & UI Designer</p>
              </div>
              <div className="flex flex-wrap gap-12 lg:justify-end text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                <div className="group relative">
                  <span className="hover:text-white transition-colors cursor-pointer underline decoration-blue-600">Documentation</span>
                  <div className="absolute bottom-full mb-4 hidden group-hover:block bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl w-72 text-left animate-in fade-in zoom-in duration-300">
                    <p className="text-blue-500 mb-2">Technical Core</p>
                    <p className="text-zinc-100 normal-case font-medium leading-relaxed">System built using a 6-tier microservices architecture. Comprehensive logic docs available for API Gateway, Auth flow, and Price Aggregation strategies in the project brain.</p>
                  </div>
                </div>
                <div className="group relative">
                  <span className="hover:text-white transition-colors cursor-pointer underline decoration-blue-600">API Access</span>
                  <div className="absolute bottom-full mb-4 hidden group-hover:block bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl w-72 text-left animate-in fade-in zoom-in duration-300">
                    <p className="text-blue-500 mb-2">Developer Gateway</p>
                    <p className="text-zinc-100 normal-case font-medium leading-relaxed">Public REST endpoints active at port 8080. Features include real-time product queries, category filtering, and price history (experimental).</p>
                  </div>
                </div>
                <div className="group relative">
                  <span className="hover:text-white transition-colors cursor-pointer underline decoration-blue-600">Infrastructure</span>
                  <div className="absolute bottom-full mb-4 hidden group-hover:block bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl w-72 text-left animate-in fade-in zoom-in duration-300">
                    <p className="text-blue-500 mb-2">Cloud Foundation</p>
                    <p className="text-zinc-100 normal-case font-medium leading-relaxed">Orchestrated with Docker Compose. Services include Eureka for discovery, Redis for price caching, and MongoDB for high-speed catalog retrieval.</p>
                  </div>
                </div>
                <div className="group relative">
                  <span className="hover:text-white transition-colors cursor-pointer underline decoration-blue-600">Terms</span>
                  <div className="absolute bottom-full mb-4 hidden group-hover:block bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl w-72 text-left animate-in fade-in zoom-in duration-300">
                    <p className="text-blue-500 mb-2">Usage Agreement</p>
                    <p className="text-zinc-100 normal-case font-medium leading-relaxed">Information is retrieved from third-party APIs. We do not process direct payments; all transactions occur on official retailer platforms.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">© 2026 GadgetMart. Built with Java, Spring Boot & Next.js</p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer >
      <Chatbot />

      {/* Premium Daily Notification Toast */}
      {
        showNotification && (
          <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-10 duration-700">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/20 max-w-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] -z-10 group-hover:bg-blue-600/40 transition-all" />
              <button onClick={() => setShowNotification(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">✕</button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
                <div>
                  <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest block">Daily Flash Sale</span>
                  <h4 className="text-white font-black text-xl tracking-tighter">Extreme Tech Drop</h4>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Grab the <span className="text-white font-bold">AirPods Pro Max (2026 Edition)</span> at a record-low price of <span className="text-blue-400 font-black">₹34,999</span> for the next 4 hours!
              </p>
              <button
                onClick={() => { setShowNotification(false); document.getElementById('extreme-deals')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="w-full bg-white text-zinc-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl"
              >
                Claim Deal Now →
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
}
