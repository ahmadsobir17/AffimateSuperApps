import { SelectOption, ThemeCategory } from '@/types';

export const MAX_TRIAL = 7;

export const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
export const EXCHANGE_RATE = 16000; // 1 USD = 16,000 IDR

// Gender Options
export const GENDER_OPTIONS = [
    { value: 'Male', label: 'Pria' },
    { value: 'Female', label: 'Wanita' },
];

// Character Style Options
export const CHARACTER_STYLES: SelectOption[] = [
    { value: 'Photorealistic', label: '📸 Foto Asli (Realistis)' },
    { value: 'Cinematic 8k', label: '🎬 Cinematic Movie' },
    { value: '3D Disney Animation', label: '🧸 3D Disney/Pixar' },
    { value: 'Anime Modern', label: '🎨 Anime Modern' },
    { value: 'Cyberpunk Aesthetic', label: '🤖 Cyberpunk' },
];

// Age Options
export const AGE_OPTIONS: SelectOption[] = [
    { value: '25 years old', label: 'Dewasa Muda (20-an)' },
    { value: 'teenager', label: 'Remaja (Teen)' },
    { value: 'child', label: 'Anak-anak' },
    { value: '35 years old', label: 'Dewasa Matang (30-an)' },
    { value: 'middle aged', label: 'Paruh Baya (40-50)' },
    { value: 'elderly', label: 'Lansia' },
];

// Ethnicity Options
export const ETHNICITY_OPTIONS: SelectOption[] = [
    { value: 'Indonesian asian', label: '🇮🇩 Indonesia' },
    { value: 'Southeast Asian', label: '🌏 Asia Tenggara (Malay/Thai/Viet)' },
    { value: 'East Asian', label: '🇨🇳/🇯🇵 Asia Timur' },
    { value: 'Caucasian', label: '🇺🇸/🇪🇺 Bule (Caucasian)' },
    { value: 'Middle Eastern', label: '🇸🇦 Timur Tengah' },
    { value: 'African', label: '🌍 African' },
    { value: 'Latin American', label: '🇧🇷 Latino' },
];

// Hair Style Options
export const HAIR_STYLES: SelectOption[] = [
    { value: 'natural hair', label: 'Natural' },
    { value: 'long wavy hair', label: 'Panjang Bergelombang' },
    { value: 'short bob cut', label: 'Pendek (Bob)' },
    { value: 'hijab', label: 'Hijab (Modern)' },
    { value: 'ponytail', label: 'Kuncir Kuda' },
    { value: 'messy bun', label: 'Messy Bun' },
    { value: 'bald', label: 'Botak' },
];

// Hair Color Options
export const HAIR_COLORS: SelectOption[] = [
    { value: 'black', label: 'Hitam' },
    { value: 'dark brown', label: 'Coklat Tua' },
    { value: 'blonde', label: 'Pirang' },
    { value: 'redhead', label: 'Merah' },
    { value: 'pastel pink', label: 'Pink Pastel' },
    { value: 'grey', label: 'Abu-abu' },
];

// Body Type Options
export const BODY_TYPES: SelectOption[] = [
    { value: 'average fit body', label: 'Ideal / Fit' },
    { value: 'slim model body', label: 'Kurus (Model)' },
    { value: 'muscular gym body', label: 'Berotot (Gym)' },
    { value: 'curvy plus size', label: 'Plus Size (Curvy)' },
];

// Outfit Options
export const OUTFIT_OPTIONS: SelectOption[] = [
    { value: 'casual t-shirt and jeans', label: 'Santai (Kaos & Jeans)' },
    { value: 'professional business suit', label: 'Kantoran (Jas/Blazer)' },
    { value: 'modern streetwear', label: 'Streetwear (Hypebeast)' },
    { value: 'elegant evening gown', label: 'Gaun Malam (Mewah)' },
    { value: 'traditional batik', label: 'Batik Indonesia' },
    { value: 'sporty activewear', label: 'Olahraga (Sporty)' },
];

// Product Studio Model Options
export const MODEL_OPTIONS: SelectOption[] = [
    { value: 'no humans, product focus only', label: '📦 Tanpa Model (Fokus Produk)' },
    { value: 'held by a hand, hand model, close up', label: '✋ Model Tangan (Hand Model)' },
    { value: 'with a professional female model', label: '👩 Model Wanita' },
    { value: 'with a professional male model', label: '👨 Model Pria' },
    { value: 'with a female model wearing hijab', label: '🧕 Model Hijab' },
    { value: 'custom_model', label: '👤 Unggah Model Sendiri (Custom)' },
];

// Studio Theme Options
export const STUDIO_THEMES: SelectOption[] = [
    { value: 'minimalist white podium with soft lighting', label: '🏳️ Putih Minimalis (Bersih)' },
    { value: 'luxury dark marble surface with golden accents', label: '💎 Mewah (Marmer & Emas)' },
    { value: 'wooden table with natural sunlight and plants', label: '🌿 Alam (Kayu & Tanaman)' },
    { value: 'pastel pink aesthetic room background', label: '🌸 Pastel Aesthetic (Ceria)' },
    { value: 'kitchen counter with blurred background', label: '🍳 Dapur Modern' },
    { value: 'futuristic neon podium cyberpunk style', label: '🚀 Futuristik Neon' },
];

// Lighting Options
export const LIGHTING_OPTIONS: SelectOption[] = [
    { value: 'soft diffused lighting', label: 'Soft & Diffused (Lembut)' },
    { value: 'hard dramatic lighting', label: 'Dramatic (Tajam & Kontras)' },
    { value: 'natural sunlight with shadows', label: 'Natural Sunlight (Matahari Alami)' },
    { value: 'cinematic teal and orange lighting', label: 'Cinematic (Film Look)' },
];

// Camera Angle Options
export const ANGLE_OPTIONS: SelectOption[] = [
    { value: 'front view eye level', label: 'Depan (Eye Level)' },
    { value: 'top down flat lay', label: 'Dari Atas (Flat Lay)' },
    { value: 'low angle hero shot', label: 'Dari Bawah (Hero Shot)' },
    { value: 'isometric view 45 degree', label: 'Isometric (45 Derajat)' },
];

// Script Platform Options
export const PLATFORM_OPTIONS: SelectOption[] = [
    { value: 'TikTok', label: 'TikTok' },
    { value: 'Instagram Reels', label: 'Reels' },
    { value: 'YouTube Shorts', label: 'Shorts' },
];

// Duration Options
export const DURATION_OPTIONS: SelectOption[] = [
    { value: '15-30 detik', label: 'Singkat (15-30s)' },
    { value: '45-60 detik', label: 'Medium (45-60s)' },
    { value: '60-90 detik', label: 'Panjang (Story)' },
];

// Tone Options
export const TONE_OPTIONS: SelectOption[] = [
    { value: 'Santai & Viral', label: '😎 Santai & Viral' },
    { value: 'Profesional & Edukatif', label: '🎓 Profesional' },
    { value: 'Lucu & Komedi', label: '🤣 Lucu' },
    { value: 'Hard Selling / Promo', label: '🔥 Hard Selling' },
    { value: 'Emotional & Story', label: '😢 Emosional' },
];

// Language Options
export const LANGUAGE_OPTIONS: SelectOption[] = [
    { value: 'Bahasa Indonesia Gaul', label: 'Indo (Gaul)' },
    { value: 'Bahasa Indonesia Formal', label: 'Indo (Formal)' },
    { value: 'English', label: 'English' },
    { value: 'Basa Jawa', label: 'Jawa (Lokal)' },
    { value: 'Basa Sunda', label: 'Sunda (Lokal)' },
];

// Script Structure Options
export const STRUCTURE_OPTIONS: SelectOption[] = [
    { value: 'Hook-Problem-Solution', label: '🪝 Hook - Problem - Solution' },
    { value: 'Storytelling', label: '📖 Storytelling' },
    { value: 'Listicle / Tips', label: '📝 Listicle / Tips' },
    { value: 'Before-After', label: '🔄 Before & After' },
    { value: 'Q&A Response', label: '❓ Q&A Response' },
];

// VEO Style Options
export const VEO_STYLES: SelectOption[] = [
    { value: 'Cinematic Realistic', label: '🎬 Cinematic Realistic (Default)' },
    { value: '3D Animation Pixar Style', label: '🧸 3D Animation (Pixar)' },
    { value: 'Anime Style', label: '🎨 Anime Style' },
    { value: 'Vintage Film Look', label: '🎞️ Vintage Film (Grainy)' },
    { value: 'Cyberpunk Neon', label: '🤖 Cyberpunk Neon' },
    { value: 'Drone Footage', label: '🚁 Drone Footage (Aerial)' },
];

// VEO Shot Options
export const VEO_SHOTS: SelectOption[] = [
    { value: 'Medium Shot', label: 'Medium Shot (Normal)' },
    { value: 'Close Up', label: 'Close Up (Wajah)' },
    { value: 'Wide Shot', label: 'Wide Shot (Pemandangan)' },
    { value: 'Macro Detail', label: 'Macro (Detail Produk)' },
    { value: 'Low Angle', label: 'Low Angle (Heroic)' },
];

// VEO Camera Movement Options
export const VEO_CAMERA_MOVEMENTS: SelectOption[] = [
    { value: 'Static Tripod', label: 'Static (Diam)' },
    { value: 'Slow Pan Right', label: 'Pan Right (Geser Kanan)' },
    { value: 'Slow Zoom In', label: 'Zoom In (Mendekat)' },
    { value: 'Orbit Around Subject', label: 'Orbit (Memutar)' },
    { value: 'Handheld Shake', label: 'Handheld (Goyang Alami)' },
];

// TTS Voice Options
export const TTS_VOICES = {
    free: [
        { value: 'Kore', label: '👩 Kore (Natural & Santai)' },
        { value: 'Leda', label: '👩 Leda (Lembut/Soft)' },
        { value: 'Zephyr', label: '👩 Zephyr (Jernih & Jelas)' },
        { value: 'Puck', label: '👦 Puck (Energik & Viral)' },
        { value: 'Fenrir', label: '👨 Fenrir (Wibawa & Berat)' },
        { value: 'Charon', label: '👴 Charon (Deep Storytelling)' },
    ],
    premium: [
        { value: 'Aoede', label: '🔒 Aoede (Elegan & Formal)' },
        { value: 'Callirrhoe', label: '🔒 Callirrhoe (Easy-going)' },
        { value: 'Autonoe', label: '🔒 Autonoe (Ceria & Bright)' },
        { value: 'Despina', label: '🔒 Despina (Halus & Smooth)' },
    ],
};

// Smart Theme Database
export const SMART_THEMES: Record<ThemeCategory, string[]> = {
    fashion: [
        'hanging on a modern rack in a boutique',
        'folded neatly on a rustic wooden surface',
        'laid out on a clean white bed sheet (flatlay)',
        'urban streetwear aesthetic with concrete background',
        'soft lifestyle shot in a bright living room',
        'minimalist studio grey background',
        'sunlit outdoor park vibe',
    ],
    food: [
        'on a marble kitchen counter with scattered ingredients',
        'rustic wooden table with natural sunlight',
        'picnic setup on grass with blurred background',
        'dark moody photography with dramatic shadows',
        'clean minimalist plate presentation',
    ],
    tech: [
        'futuristic neon cyberpunk glowing background',
        'clean minimalistic white desk setup',
        'floating in mid-air with tech abstract shapes',
        'matte black surface with dramatic lighting',
    ],
    beauty: [
        'on a bathroom vanity with mirror reflection',
        'surrounded by flowers and silk cloth',
        'pastel colored geometric podiums',
        'water ripple effect background',
    ],
    general: [
        'minimalist white podium',
        'luxury dark marble surface',
        'natural sunlight with shadows',
        'studio rim lighting',
        'bokeh city lights background',
    ],
};

// Random Arrays for Mass Generation
export const LIGHTING_STYLES = [
    'soft diffused lighting',
    'hard dramatic lighting',
    'natural sunlight',
    'cinematic teal orange',
    'studio rim lighting',
    'golden hour',
];

export const CAMERA_ANGLES = [
    'front view',
    'high angle',
    'low angle hero shot',
    'isometric view',
    'close up detail',
];

// FOMO Data
export const FOMO_NAMES = [
    'Agus S.', 'Budi P.', 'Siti A.', 'Dewi L.', 'Rizky R.',
    'Putri M.', 'Eko W.', 'Dian K.', 'Fajar I.', 'Indah S.',
    'Reza A.', 'Nanda P.', 'Dadan S.', 'Lina T.', 'Yudi C.',
];

export const FOMO_LOCATIONS = [
    'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Bali',
    'Yogyakarta', 'Semarang', 'Makassar', 'Bekasi', 'Tangerang',
];

export const FOMO_PRODUCTS = ['Akses Premium', 'Paket Lifetime', 'Bundle Studio'];

export const PRICING = {
    CHARACTER: 0.12,
    PRODUCT_IMAGE: 0.10,
    SCRIPT: 0.02,
    TTS: 0.05,
    VEO: 0.50,
};
