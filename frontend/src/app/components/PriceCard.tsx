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
    return "border-slate-100";
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
            className={`relative rounded-[2.5rem] sm:rounded-[3.5rem] bg-white border ${isOwnPlatform ? 'border-amber-400' : 'border-slate-100'} p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8 transition-all duration-700 hover:shadow-xl group overflow-hidden animate-in-bespoke`}
        >
            {/* Background Glow — amber for GadgetMart */}
            {isOwnPlatform && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 blur-[80px] -z-10 group-hover:bg-amber-100 transition-all duration-1000 opacity-60" />
            )}

            {/* Left: Platform Info */}
            <div className="flex items-center gap-5 sm:gap-8 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center rounded-[1.5rem] sm:rounded-[2rem] bg-slate-50 border border-slate-100 p-3 sm:p-4 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    {getPlatformLogo(item.platformName) ? (
                        <img src={getPlatformLogo(item.platformName)} alt={item.platformName} className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 transition-all" />
                    ) : (
                        <span className="text-3xl">{icon}</span>
                    )}
                </div>
                <div>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight mb-1.5 tracking-tighter uppercase">{item.platformName}</h3>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Verified {new Date(item.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        {item.promoCode && (
                            <span className="text-[10px] text-amber-600 font-black bg-amber-50 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-amber-200">
                                {item.promoCode}
                            </span>
                        )}
                        {isOwnPlatform && (
                            <span className="text-[10px] text-amber-600 font-black bg-amber-50 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-amber-200">★ Best Deal</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Price + Actions */}
            <div className="flex flex-col sm:items-end gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="sm:text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Today's Price</span>
                    <div className="flex items-baseline gap-2 sm:justify-end">
                        <span className="text-lg sm:text-xl font-bold text-amber-500">₹</span>
                        <p className="text-4xl sm:text-5xl font-black text-slate-900 italic tracking-tighter leading-none">
                            {item.price.toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto sm:justify-end">
                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${added
                            ? "bg-green-500 border-green-500 text-white shadow-lg scale-95"
                            : "bg-white border-slate-100 text-slate-900 hover:bg-amber-50 hover:border-amber-200 shadow-sm"}`}
                    >
                        {added ? "✓ Added" : "Add to Cart"}
                    </button>

                    {/* Checkout (GadgetMart) or Check Store (external) */}
                    {isOwnPlatform ? (
                        <Link
                            href={`/checkout?product=${encodeURIComponent(productName)}&amount=${item.price}&email=${encodeURIComponent(userEmail || "")}`}
                            className="premium-btn px-8 py-4 rounded-2xl text-[10px] flex items-center gap-2 animate-in-bespoke"
                        >
                            Checkout
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                        </Link>
                    ) : (
                        <a
                            href={item.platformProductUrl && item.platformProductUrl !== "#" ? item.platformProductUrl : "#"}
                            onClick={(e) => {
                                if (!item.platformProductUrl || item.platformProductUrl === "#") {
                                    e.preventDefault();
                                    const cleanName = productName.replace(/\(.*\)/g, '').replace(/Gen\s+\d+/gi, '').replace(/Hot Deal\s*#\d*/gi, '').trim();
                                    const p = item.platformName.toLowerCase();
                                    let storeUrl = "";
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
                            className="bg-white border-2 border-amber-400 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 hover:bg-amber-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            Check Store ↗
                        </a>
                    )}

                    {/* Save button */}
                    <button
                        onClick={() => handleSave?.({ name: productName, brand: item.platformName, category: "Gadget", imageUrl: productImage, price: item.price })}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center hover:bg-amber-50 hover:border-amber-200 transition-all shrink-0 shadow-sm"
                    >
                        <span className="text-lg">🔖</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
