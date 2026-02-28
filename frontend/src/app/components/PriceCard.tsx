import { addToCart } from "../utils/cartStorage";
import { useState } from "react";
import Link from "next/link";

interface PlatformPrice {
    platformName: string;
    platformProductUrl: string;
    price: number;
    currency: string;
    available: boolean;
    promoCode?: string;
    fetchedAt: string;
}

interface PriceCardProps {
    item: PlatformPrice;
    productName: string;
    userEmail?: string;
    productImage?: string;
    handleSave?: (product: any) => void;
}

const PLATFORM_ICONS: Record<string, string> = {
    amazon: "🛒",
    flipkart: "📦",
    meesho: "Ready",
    zepto: "⚡",
    temu: "🌍",
    gadgetflow: "🔥",
    ghgate: "🖥️",
    "gadgetmart": "⭐",
};

function getPlatformIcon(name: string) {
    const lower = name.toLowerCase();
    for (const key of Object.keys(PLATFORM_ICONS)) {
        if (lower.includes(key)) return PLATFORM_ICONS[key];
    }
    return "🏪";
}

function getPlatformColor(name: string) {
    const lower = name.toLowerCase();
    if (lower.includes("gadgetmart")) return "gold-border";
    return "border-white/5";
}

export default function PriceCard({ item, productName, userEmail, productImage, handleSave }: PriceCardProps) {
    const [added, setAdded] = useState(false);
    const isOwnPlatform = item.platformName.toLowerCase().includes("gadgetmart");
    const icon = getPlatformIcon(item.platformName);
    const handleAddToCart = () => {
        addToCart({
            id: productName + item.platformName,
            name: productName,
            platform: item.platformName,
            price: item.price,
            image: productImage
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const getPlatformLogo = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('amazon')) return 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg';
        if (p.includes('flipkart')) return 'https://upload.wikimedia.org/wikipedia/commons/1/18/Flipkart_logo.svg';
        if (p.includes('gadgetmart')) return 'https://cdn-icons-png.flaticon.com/512/3649/3649275.png';
        if (p.includes('reliance')) return 'https://www.reliancedigital.in/build/client/images/rd_logo_2.0.svg';
        if (p.includes('croma')) return 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/LP%20Page%20Banners/2021/PWA/Logo/croma_logo_mx7pbc.png';
        if (p.includes('apple')) return 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg';
        if (p.includes('samsung')) return 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg';
        if (p.includes('meesho')) return 'https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.svg';
        return '';
    };

    const borderClass = getPlatformColor(item.platformName);

    return (
        <div
            className={`relative rounded-[3.5rem] bg-white border ${borderClass === 'gold-border' ? 'border-indigo-600' : 'border-slate-100'} p-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-700 hover:shadow-xl group overflow-hidden animate-in-bespoke`}
        >
            {/* Background Glow */}
            {isOwnPlatform && (
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 blur-[100px] -z-10 group-hover:bg-indigo-100 transition-all duration-1000 opacity-50" />
            )}

            {/* Left: Platform Info */}
            <div className="flex items-center gap-8 w-full md:w-auto">
                <div className="w-24 h-24 flex items-center justify-center rounded-[2.5rem] bg-slate-50 border border-slate-100 p-5 group-hover:scale-110 transition-transform duration-500 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent opacity-50" />
                    {getPlatformLogo(item.platformName) ? (
                        <img src={getPlatformLogo(item.platformName)} alt={item.platformName} className={`max-w-full max-h-full object-contain relative z-10 opacity-90 group-hover:opacity-100 transition-all duration-500`} />
                    ) : (
                        <span className="text-4xl relative z-10">{icon}</span>
                    )}
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 tracking-tighter uppercase">{item.platformName}</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Verified {new Date(item.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        {item.promoCode && (
                            <span className="text-[10px] text-indigo-600 font-black bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-indigo-100">
                                {item.promoCode}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Price + Action */}
            <div className="flex flex-col items-end gap-6 w-full md:w-auto">
                <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2">Today's Price</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-indigo-600">₹</span>
                        <p className="text-5xl font-black text-slate-900 italic tracking-tighter leading-none">
                            {item.price.toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
                    <button
                        onClick={handleAddToCart}
                        className={`px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${added ? "bg-green-600 border-green-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-900 hover:bg-slate-50 hover:border-indigo-200 shadow-sm"
                            }`}
                    >
                        {added ? "✓ Added" : "Add to Cart"}
                    </button>

                    {isOwnPlatform ? (
                        <Link
                            href={`/checkout?product=${encodeURIComponent(productName)}&amount=${item.price}&email=${encodeURIComponent(userEmail || "")}`}
                            className="premium-btn px-10 py-5 rounded-2xl text-[10px] flex items-center gap-3 animate-in-bespoke"
                        >
                            Checkout
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                        </Link>
                    ) : (
                        <a
                            href={item.platformProductUrl && item.platformProductUrl !== "#" ? item.platformProductUrl : "#"}
                            onClick={(e) => {
                                // ... (keeping existing logic)
                                if (!item.platformProductUrl || item.platformProductUrl === "#") {
                                    e.preventDefault();
                                    const cleanName = productName.replace(/\(.*\)/g, '').replace(/Gen\s+\d+/gi, '').replace(/Hot Deal\s*#\d*/gi, '').trim();
                                    let storeUrl = "";
                                    const p = item.platformName.toLowerCase();
                                    if (p.includes('amazon')) storeUrl = `https://www.amazon.in/s?k=${encodeURIComponent(cleanName)}`;
                                    else if (p.includes('flipkart')) storeUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(cleanName)}`;
                                    else if (p.includes('reliance')) storeUrl = `https://www.reliancedigital.in/search?q=${encodeURIComponent(cleanName)}`;
                                    else if (p.includes('croma')) storeUrl = `https://www.croma.com/search/?text=${encodeURIComponent(cleanName)}`;
                                    else if (p.includes('meesho')) storeUrl = `https://www.meesho.com/search?q=${encodeURIComponent(cleanName)}`;
                                    else if (p.includes('zepto')) storeUrl = `https://www.zeptonow.com/search?query=${encodeURIComponent(cleanName)}`;
                                    else if (p.includes('swiggy')) storeUrl = `https://www.swiggy.com/instamart/search?q=${encodeURIComponent(cleanName)}`;
                                    else storeUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanName + ' ' + item.platformName)}&btnI=1`;
                                    window.open(storeUrl, '_blank');
                                }
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border-2 border-indigo-600 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm"
                        >
                            Check Store ↗
                        </a>
                    )}

                    <button
                        onClick={() => handleSave?.({
                            name: productName,
                            brand: item.platformName,
                            category: "Gadget",
                            imageUrl: productImage,
                            price: item.price
                        })}
                        className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-all shrink-0 shadow-sm"
                    >
                        <span className="text-xl">🔖</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
