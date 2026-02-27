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

      // MOCK AGGREGATOR FALLBACK (Frontend): 
      // Ensure all 6 platforms are visible if backend only returns basic seeded data
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
            platformProductUrl: "#", // PriceCard will handle generating this
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
    <div className='min-h-screen bg-[#050b2d] text-[#f1f5f9] selection:bg-[#d4af37]/30 mesh-bg font-main'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15)_0%,_transparent_55%),_radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.08)_0%,_transparent_45%)] -z-10' />

      <FloatingCart />
      <Chatbot />

      {/* Nav: Sapphire Glass */}
      <nav className="fixed top-0 left-0 right-0 z-[50] glass-card px-10 py-6 border-none rounded-none border-b border-white/5">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setProductData(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div className="w-12 h-12 bg-[#111d43] gold-border rounded-xl flex items-center justify-center text-[#d4af37] text-xl font-black shadow-2xl transition-all group-hover:scale-110">GM</div>
              <span className="text-2xl font-black tracking-tighter uppercase gradient-text">GadgetMart<span className="opacity-40">.Pro</span></span>
            </div>
            <div className="hidden lg:flex items-center gap-10">
              {[
                { label: 'Saved Items', path: '/saved' },
                {
                  label: 'Live Aggregators', action: () => {
                    setProductData(null);
                    setTimeout(() => {
                      document.getElementById('fresh-arrivals')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }
              ].map((item, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]/60 hover:text-[#d4af37] cursor-pointer transition-all"
                  onClick={() => {
                    if (item.path) router.push(item.path);
                    else item.action?.();
                  }}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-10">
            <span
              className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]/60 hover:text-[#d4af37] cursor-pointer transition-all"
              onClick={() => router.push('/orders')}
            >
              Order History
            </span>
            {user ? (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="font-black text-[9px] text-[#d4af37] uppercase tracking-[0.2em] mb-1">{user.role || 'ELITE MEMBER'}</span>
                  <span className="font-black text-sm text-white tracking-tighter">{user.name || user.email.split('@')[0]}</span>
                </div>
                <button onClick={handleLogout} className="w-12 h-12 gold-border rounded-xl flex items-center justify-center hover:bg-[#d4af37]/10 transition-all text-xl">🚪</button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="premium-btn px-10 py-4 rounded-2xl text-[10px] font-black animate-in-bespoke"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <header className='pt-64 pb-24 px-10 flex flex-col items-center text-center max-w-[1400px] mx-auto'>
        <div className='inline-flex items-center gap-3 px-6 py-2 mb-12 rounded-full glass-card border-[#d4af37]/20 text-[#d4af37] text-[10px] font-black tracking-[0.3em] uppercase'>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
          </span>
          Global Intelligence V3.14
        </div>

        <h1 className='text-7xl md:text-[10rem] font-black mb-10 tracking-tighter text-white leading-[0.82] uppercase animate-in-bespoke'>
          HARDWARE. <br />
          <span className='gradient-text'>BEYOND LIMITS.</span>
        </h1>

        <p className='text-zinc-400 text-xl md:text-2xl max-w-4xl mx-auto font-black uppercase tracking-[0.2em] pb-16'>
          THE ULTIMATE ECOSYSTEM FOR <span className="text-white">NEXT-GEN PRICE DISCOVERY</span>. <br />
          DISCOVER. VALIDATE. SECURE. <span className="text-[#d4af37]">PURE SIGNAL. ZERO NOISE.</span>
        </p>

      </header>

      <main className='max-w-7xl mx-auto px-6 pb-32'>
        {/* Search Architecture */}
        <div id="search-console" className="relative max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative z-10 flex items-center bg-[#0f172a]/40 backdrop-blur-3xl rounded-[3rem] p-3 gold-border shadow-2xl group focus-within:shadow-[0_0_60px_-20px_rgba(212,175,55,0.4)] transition-all duration-700">
            <input
              type="text"
              placeholder="Query the database for elite hardware..."
              className="flex-grow px-10 py-6 bg-transparent text-xl font-bold text-white focus:outline-none placeholder:text-zinc-800 tracking-tight"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
            />
            <button type="submit" className="premium-btn w-20 h-20 rounded-full flex items-center justify-center transition-all">
              {loading ? <div className="animate-spin w-8 h-8 border-4 border-white/20 border-t-white rounded-full" /> : <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            </button>
          </form>

          {/* Precision Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-6 glass-card rounded-[3.5rem] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-50 animate-in-bespoke border-[#d4af37]/20">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-8 ml-4">Neural Matches</h4>
              <div className="space-y-6">
                {suggestions.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-8 p-6 rounded-[2.5rem] bg-white/5 hover:bg-[#d4af37]/10 cursor-pointer transition-all group/item border border-transparent hover:border-[#d4af37]/20"
                    onClick={() => {
                      setSearchQuery(p.name);
                      setShowSuggestions(false);
                      router.push(`/?q=${encodeURIComponent(p.name)}`);
                      fetchProductData(p.name);
                    }}
                  >
                    <div className="w-20 h-20 bg-[#050b2d] rounded-[1.5rem] overflow-hidden gold-border flex items-center justify-center p-2">
                      <img src={p.image} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-black text-xl text-white tracking-tighter uppercase">{p.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full uppercase tracking-widest leading-none">Best Floor Price</span>
                        <p className="text-sm font-black text-white/50">From ₹{p.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all">
                      <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Global Retail Matrix: Minimalist Name-Only Display */}
        <div className="mt-24 flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-60 hover:opacity-100 transition-all duration-1000 px-6">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4af37] w-full text-center mb-8">Synchronized Market Nodes</span>
          {['FLIPKART', 'AMAZON', 'MEESHO', 'RELIANCE DIGITAL', 'CROMA', 'APPLE', 'SAMSUNG'].map((node, i) => (
            <div key={i} className="flex items-center gap-4 group/node">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/30 group-hover:bg-[#d4af37] transition-all" />
              <span className="text-xs font-black text-white/50 group-hover:text-white tracking-[0.2em] transition-all cursor-default uppercase">{node}</span>
            </div>
          ))}
        </div>

        <div className="mt-40"></div>

        {/* Operational Mandate Banner: API & Launch Notice */}
        <div className="max-w-6xl mx-auto py-20 px-12 glass-card rounded-[4rem] border border-red-500/20 relative overflow-hidden group animate-in-bespoke">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 blur-[120px] -z-10" />

          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="relative shrink-0">
              <div className="w-28 h-28 bg-[#111d43] border border-red-500/30 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl relative z-10">
                <span className="animate-pulse">⚠️</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping border-[6px] border-[#050b2d] z-20"></div>
            </div>

            <div className="flex-1 space-y-8">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500">Infrastructure Alert • Phase 1 Testing</h4>
                <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Operational Warning.</h3>
              </div>

              <p className="text-zinc-300 text-xl font-black uppercase tracking-widest leading-relaxed max-w-4xl">
                DUE TO <span className="text-white">API MAINTENANCE COSTS</span>, WE ARE CURRENTLY UTILIZING <span className="text-[#d4af37]">APIFY DATA STREAMS</span> FOR AGGREGATION.
                <br /><br />
                <span className="text-red-500 underline decoration-red-500/30 underline-offset-8">PLEASE REFRAIN FROM FINALIZING ANY ACQUISITIONS UNTIL THE OFFICIAL PLATFORM LAUNCH.</span>
                ALL CURRENT TRANSACTIONS ARE FOR SIMULATION PURPOSES ONLY.
              </p>

              <div className="flex flex-wrap gap-8 items-center pt-4">
                {[
                  { label: 'STATUS', value: 'PRE-LAUNCH MODE' },
                  { label: 'DATA ENGINE', value: 'APIFY NODES ACTIVE' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-4 bg-red-500/10 px-6 py-3 rounded-2xl border border-red-500/20">
                    <span className="text-red-500 uppercase tracking-[0.3em] text-[9px] font-black">{stat.label}</span>
                    <span className="text-white font-black text-[11px] uppercase tracking-widest">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Dynamic Aggregated Results */}
        {productData ? (
          <div id="search-results" className='mt-32 space-y-24 animate-in-bespoke'>
            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-12 pb-16 border-b border-white/5'>
              <div className="flex items-center gap-12">
                <div className="w-48 h-48 rounded-[3.5rem] overflow-hidden bg-[#050b2d] gold-border p-4 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-all duration-700">
                  <img src={productData.imageUrl || getImagePath(productData.name, productData.category)} alt={productData.name} className="w-full h-full object-cover rounded-[2.5rem]" />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-black uppercase tracking-[0.3em] rounded-full gold-border">{productData.brand}</span>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{productData.category}</span>
                  </div>
                  <h2 className='text-6xl font-black tracking-tighter text-white leading-none uppercase'>{productData.name}</h2>
                  <p className='text-[#d4af37]/60 text-lg font-bold mt-4 max-w-xl'>{productData.description}</p>

                  {/* Result-Specific Operational Alert */}
                  <div className="mt-8 inline-flex items-center gap-4 bg-red-500/10 border border-red-500/30 px-6 py-3 rounded-2xl animate-pulse">
                    <span className="text-red-500 text-sm">⚠️</span>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">
                      <span className="text-red-500">BETA NOTICE:</span> SIMULATED AGGREGATION VIA APIFY. REFRAIN FROM PURCHASE UNTIL OFFICIAL LAUNCH.
                    </p>
                  </div>
                </div>
              </div>
              <div className='lg:text-right bg-white/[0.02] p-10 rounded-[3rem] gold-border'>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] block mb-4">Floor Price Index</span>
                <div className="flex items-baseline lg:justify-end gap-3">
                  <span className="text-2xl font-black text-[#d4af37]">₹</span>
                  <p className='text-7xl font-black text-white tracking-tighter italic'>
                    {Math.min(...productData.prices.map((p: any) => p.price)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className='grid gap-10'>
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
          <div className="space-y-48 mt-48">
            {/* Elite Drops (Fresh Arrivals) */}
            <div id="fresh-arrivals" className="animate-in-bespoke">
              <div className='flex items-center justify-between mb-20'>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37] mb-4">The Repository</h4>
                  <h2 className='text-6xl font-black text-white tracking-tighter uppercase'>Elite Drops</h2>
                </div>
                <div className='h-px flex-grow mx-16 bg-white/5'></div>
                <button className="outline-btn px-12 py-5 rounded-2xl text-[10px] uppercase tracking-widest">View Archive</button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
                {NEW_LAUNCHES.slice(0, 12).map((gadget, i) => (
                  <div key={i} className='glass-card p-10 rounded-[4rem] group hover:border-[#d4af37]/40 cursor-pointer overflow-hidden relative transition-all duration-700'
                    onClick={() => {
                      if (!user) { router.push('/login'); return; }
                      setSearchQuery(gadget.name);
                      setTimeout(() => {
                        fetchProductData(gadget.name);
                        document.getElementById('search-console')?.scrollIntoView({ behavior: 'smooth' });
                      }, 0);
                    }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 blur-[60px] group-hover:bg-[#d4af37]/15 transition-all"></div>
                    <div className='aspect-square rounded-[2.5rem] bg-[#050b2d] gold-border mb-10 overflow-hidden group-hover:scale-105 transition-all duration-1000 p-2'>
                      <img src={gadget.image} alt={gadget.name} className="w-full h-full object-cover rounded-[2rem] opacity-80 group-hover:opacity-100 transition-all" />
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className='text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1'>{gadget.brand}</p>
                          <h3 className='text-3xl font-black text-white leading-tight tracking-tighter uppercase'>{gadget.name}</h3>
                        </div>
                        <span className="text-2xl filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{gadget.icon}</span>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-[#d4af37]">₹</span>
                          <p className='text-3xl font-black text-white italic tracking-tighter'>{gadget.price.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveProduct({ ...gadget, category: "Elite Drop" });
                          }}
                          className="w-14 h-14 rounded-2xl bg-white/5 gold-border flex items-center justify-center hover:bg-[#d4af37]/10 transition-all"
                        >
                          <span className="text-lg">🔖</span>
                        </button>
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

      {/* Footer: Tech Concierge Aesthetic */}
      <footer className="bg-[#050b2d] text-[#f8fafc] pt-48 pb-20 px-10 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-96 bg-[#d4af37]/5 blur-[150px] opacity-10" />
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-32 items-end">
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-16 bg-[#111d43] gold-border rounded-2xl flex items-center justify-center text-[#d4af37] text-2xl font-black">GM</div>
                <h2 className="text-5xl font-black tracking-tighter uppercase gradient-text">GadgetMart<span className="opacity-20 italic">.Elite</span></h2>
              </div>
              <p className="text-zinc-500 text-2xl font-medium max-w-xl leading-relaxed tracking-tight">
                The absolute benchmark for <span className="text-white">Price Intelligence</span>. Built for those who demand precision, Acquire tech at its true floor price.
              </p>
            </div>

            <div className="flex flex-col lg:items-end">
              <div className="mb-12 lg:text-right">
                <span className="text-[#d4af37] font-black text-[10px] uppercase tracking-[0.5em] block mb-4">Architecture Lead</span>
                <h3 className="text-6xl font-black tracking-tighter uppercase italic">Indrakumar</h3>
                <p className="text-zinc-600 font-bold mt-2 uppercase tracking-[0.3em]">Chief Engineering Officer</p>
              </div>

              <div className="flex flex-wrap gap-12 lg:justify-end">
                {[
                  { name: 'Core Protocols', desc: '6-tier microservices built on Spring Boot & Next.js 15+.' },
                  { name: 'Neural Link', desc: 'Real-time price aggregation via distributed Apify nodes.' }
                ].map((box, i) => (
                  <div key={i} className="group relative">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]/60 hover:text-[#d4af37] cursor-pointer underline decoration-[#d4af37]/40 underline-offset-8 transition-all">{box.name}</span>
                    <div className="absolute bottom-full right-0 mb-6 hidden group-hover:block glass-card p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-[#d4af37]/20 w-80 animate-in-bespoke">
                      <p className="text-white font-bold mb-4 uppercase tracking-widest text-xs">{box.name}</p>
                      <p className="text-zinc-500 text-sm leading-relaxed font-medium">{box.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 GadgetMart Elite Systems. Private Infrastructure.</p>
            <div className="flex gap-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 hover:text-white cursor-pointer transition-all">Privacy Node</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 hover:text-white cursor-pointer transition-all">Service Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
