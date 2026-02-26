export const GADGET_IMAGES = [
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800', // iPhone
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800', // MacBook
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800', // Phone
    'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&q=80&w=800', // Apple Watch
    'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&q=80&w=800', // AirPods
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800', // iPad
    'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?auto=format&fit=crop&q=80&w=800', // Camera
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800', // Laptop
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800', // Gaming
    'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=800', // Speaker
];

export const GADGET_CATEGORIES = [
    { name: 'Smartphones', icon: '📱' },
    { name: 'Laptops', icon: '💻' },
    { name: 'Audio', icon: '🎧' },
    { name: 'Gaming', icon: '🎮' },
    { name: 'Cameras', icon: '📷' },
];

export const getImagePath = (name: string, category: string = '') => {
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

export const BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'Asus', 'Microsoft'];

export const NEW_LAUNCHES = Array.from({ length: 60 }, (_, i) => ({
    name: ['iPhone 16 Pro Max', 'Samsung S25 Ultra', 'MacBook Pro M4 Max', 'ROG Ally X2', 'Sony PS5 Pro Digital', 'iPad Air M3 Pro', 'Pixel 9 Pro XL', 'Dell XPS 16', 'AirPods Max 2026', 'Nintendo Switch 2 OLED', 'Surface Laptop 7', 'Logitech MX Anywhere 4', 'Sony A9 III', 'DJI Mavic 4 Pro', 'GoPro Hero 14 Black', 'Razer Blade 18', 'Apple Watch Ultra 3', 'Bose QuietComfort Ultra', 'HP Spectre x360', 'Lenovo Legion 9i'][i % 20] + (i >= 20 ? ` Gen ${Math.floor(i / 20) + 1}` : ''),
    brand: ['Apple', 'Samsung', 'ASUS', 'Sony', 'Google', 'Dell', 'Nintendo', 'Microsoft', 'Logitech', 'DJI', 'GoPro', 'Razer', 'Bose', 'HP', 'Lenovo'][i % 15],
    price: 89999 + (i * 3500),
    icon: '📱',
    image: getImagePath(['iPhone 16 Pro Max', 'Samsung S25 Ultra', 'MacBook Pro M4 Max', 'ROG Ally X2', 'Sony PS5 Pro Digital', 'iPad Air M3 Pro', 'Pixel 9 Pro XL', 'Dell XPS 16', 'AirPods Max 2026', 'Nintendo Switch 2 OLED', 'Surface Laptop 7', 'Logitech MX Anywhere 4', 'Sony A9 III', 'DJI Mavic 4 Pro', 'GoPro Hero 14 Black', 'Razer Blade 18', 'Apple Watch Ultra 3', 'Bose QuietComfort Ultra', 'HP Spectre x360', 'Lenovo Legion 9i'][i % 20]),
}));

export const HOT_OFFERS = Array.from({ length: 60 }, (_, i) => ({
    name: ['Galaxy Buds 3 Pro', 'Logitech G Pro X Superlight', 'Kindle Oasis 4', 'Sony WH-Ultimate', 'GoPro Hero 13 Mini', 'Apple Watch SE 3', 'Dyson V15 Detect', 'Marshall Middleton', 'Fitbit Sense 3', 'Beats Solo 4', 'Bose QC Comfort', 'Razer Viper V3', 'Samsung T9 4TB', 'Keychron K2 Max', 'Anker 737 Pro', 'Ugreen Revodok', 'Elgato Stream Deck +', 'Shure SM7B Pro', 'Philips Hue Sync', 'Nanoleaf Shapes'][i % 20] + (i >= 20 ? ` (Hot Deal #${i + 1})` : ''),
    brand: ['Samsung', 'Logitech', 'Amazon', 'Sony', 'GoPro', 'Apple', 'Dyson', 'Marshall', 'Fitbit', 'Beats', 'Bose', 'Razer', 'Keychron', 'Anker', 'Ugreen', 'Elgato', 'Shure', 'Philips', 'Nanoleaf'][i % 19],
    price: 9999 + (i * 900),
    icon: '🎁',
    image: getImagePath(['Galaxy Buds 3 Pro', 'Logitech G Pro X Superlight', 'Kindle Oasis 4', 'Sony WH-Ultimate', 'GoPro Hero 13 Mini', 'Apple Watch SE 3', 'Dyson V15 Detect', 'Marshall Middleton', 'Fitbit Sense 3', 'Beats Solo 4', 'Bose QC Comfort', 'Razer Viper V3', 'Samsung T9 4TB', 'Keychron K2 Max', 'Anker 737 Pro', 'Ugreen Revodok', 'Elgato Stream Deck +', 'Shure SM7B Pro', 'Philips Hue Sync', 'Nanoleaf Shapes'][i % 20]),
}));
