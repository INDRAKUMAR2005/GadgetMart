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
    if (lower.includes("gadgetmart")) return "from-blue-50 to-indigo-50 border-blue-100";
    if (lower.includes("amazon")) return "from-orange-50 to-yellow-50 border-orange-100";
    if (lower.includes("flipkart")) return "from-sky-50 to-blue-50 border-sky-100";
    if (lower.includes("meesho")) return "from-pink-50 to-rose-50 border-pink-100";
    return "from-zinc-50 to-zinc-100 border-zinc-200";
}

export default function PriceCard({ item, productName, userEmail, productImage, handleSave }: PriceCardProps) {
    const [added, setAdded] = useState(false);
    const isOwnPlatform = item.platformName.toLowerCase().includes("gadgetmart");
    const icon = getPlatformIcon(item.platformName);
    const colorClass = getPlatformColor(item.platformName);

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
        if (p.includes('flipkart')) return 'https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-448d53.svg';
        if (p.includes('gadgetmart')) return 'https://cdn-icons-png.flaticon.com/512/3649/3649275.png'; // GM Icon
        if (p.includes('reliance')) return 'https://www.reliancedigital.in/build/client/images/rd_logo_2.0.svg';
        if (p.includes('croma')) return 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/LP%20Page%20Banners/2021/PWA/Logo/croma_logo_mx7pbc.png';
        if (p.includes('apple')) return 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg';
        if (p.includes('samsung')) return 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg';
        return '';
    };

    return (
        <div
            className={`relative rounded-[2.5rem] bg-white border-2 ${colorClass} p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] group`}
        >
            {/* Left: Platform Info */}
            <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-20 h-20 flex items-center justify-center rounded-[1.5rem] bg-white border-2 border-zinc-50 p-4 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    {getPlatformLogo(item.platformName) ? (
                        <img src={getPlatformLogo(item.platformName)} alt={item.platformName} className="max-w-full max-h-full object-contain" />
                    ) : (
                        <span className="text-4xl">{icon}</span>
                    )}
                </div>
                <div>
                    <h3 className="text-2xl font-black text-zinc-900 leading-tight mb-1">{item.platformName}</h3>
                    <div className="flex items-center gap-3">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                            Last Scan: {new Date(item.fetchedAt).toLocaleTimeString()}
                        </p>
                        {item.promoCode && (
                            <span className="text-[10px] text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                                {item.promoCode}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Price + Action */}
            <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                <div className="text-right">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Instant Price</span>
                    <p className="text-4xl font-black text-zinc-950 italic">
                        ₹{item.price.toLocaleString("en-IN")}
                    </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={handleAddToCart}
                        className={`flex-grow md:flex-none px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${added ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                            }`}
                    >
                        {added ? "✓ Added" : "Add to Cart"}
                    </button>

                    {isOwnPlatform ? (
                        <Link
                            href={`/checkout?product=${encodeURIComponent(productName)}&amount=${item.price}&email=${encodeURIComponent(userEmail || "")}`}
                            className="flex-grow md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
                        >
                            Checkout Now
                        </Link>
                    ) : (
                        <a
                            href={item.platformProductUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-grow md:flex-none text-center border-2 border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-zinc-900/10 animate-subtle-pulse"
                        >
                            Grab Now ↗
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
                        className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all border-2 border-transparent hover:border-blue-100 shrink-0"
                    >
                        <span className="text-xl">🔖</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
