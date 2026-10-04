import api from '../lib/axios';
import { demoRepository, readDemoDB } from '../lib/demoRepository';
import { DEMO_MODE } from '../lib/demoMode';

export interface Product {
  id: number;
  categoryId: number;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  weightGrams: number;
  status: string;
  stock: number;
  rating?: number;
  soldCount?: number;
  images: { id: number; imageUrl: string; isPrimary: boolean }[];
  tlaterMonthly?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parentId: number | null;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const mockCategories: Category[] = [
  { id: 1, name: "Smartphone & Gadgets", slug: "smartphone-gadgets", description: "", parentId: null },
  { id: 2, name: "Laptop & MacBook", slug: "laptop-macbook", description: "", parentId: null },
  { id: 3, name: "Komponen PC Gaming", slug: "komponen-pc", description: "", parentId: null },
  { id: 4, name: "Aksesoris & Audio", slug: "aksesoris", description: "", parentId: null },
];

const mockProducts: Product[] = [
  // --- Category 1: Smartphone & Gadgets ---
  {
    id: 201,
    categoryId: 1,
    sku: "APL-IP15-128-BLK",
    name: "iPhone 15 128GB - Black Titanium",
    slug: "iphone-15-128gb-black",
    description: "Layar Super Retina XDR 6.1 inci dengan Dynamic Island. Kamera utama 48MP dengan telefoto 2x, chip bertenaga A16 Bionic, dan port USB-C universal.",
    price: 14299000,
    originalPrice: 16499000,
    discountPercentage: 13,
    weightGrams: 470,
    status: "active",
    stock: 24,
    rating: 4.9,
    soldCount: 1420,
    images: [{ id: 501, imageUrl: "/images/products/iphone-15.jpg", isPrimary: true }],
    tlaterMonthly: 1250000
  },
  {
    id: 202,
    categoryId: 1,
    sku: "APL-IP13P-256-BLU",
    name: "iPhone 13 Pro 256GB - Sierra Blue",
    slug: "iphone-13-pro-256gb-sierra-blue",
    description: "Layar Super Retina XDR 6.1 inci dengan ProMotion 120Hz adaptif. Chip A15 Bionic super kencang, sistem tiga kamera pro 12MP dengan sensor-shift OIS dan Cinematic mode.",
    price: 13999000,
    originalPrice: 15999000,
    discountPercentage: 12,
    weightGrams: 490,
    status: "active",
    stock: 12,
    rating: 4.8,
    soldCount: 980,
    images: [{ id: 502, imageUrl: "/images/products/iphone-13-pro.webp", isPrimary: true }],
    tlaterMonthly: 1200000
  },
  {
    id: 203,
    categoryId: 1,
    sku: "SMS-S10-128-BLK",
    name: "Samsung Galaxy S10 128GB - Prism Black",
    slug: "samsung-galaxy-s10-128gb-prism-black",
    description: "Layar lengkung Dynamic AMOLED Cinematic Infinity Display 6.1 inci QHD+, Ultrasonic Fingerprint, triple camera ultra-wide 123 derajat, dan Wireless PowerShare.",
    price: 5499000,
    originalPrice: 6299000,
    discountPercentage: 12,
    weightGrams: 350,
    status: "active",
    stock: 15,
    rating: 4.7,
    soldCount: 820,
    images: [{ id: 503, imageUrl: "/images/products/samsung-s10.webp", isPrimary: true }],
    tlaterMonthly: 490000
  },
  {
    id: 204,
    categoryId: 1,
    sku: "APL-IPX-64-GRY",
    name: "iPhone X 64GB - Space Gray",
    slug: "iphone-x-64gb-space-gray",
    description: "Desain revolusioner layar penuh Super Retina HD OLED 5.8 inci, Face ID berbasis TrueDepth kamera, chip A11 Bionic berarsitektur neural engine, dan bodi baja tahan karat bedah.",
    price: 4299000,
    weightGrams: 380,
    status: "active",
    stock: 10,
    rating: 4.6,
    soldCount: 650,
    images: [{ id: 504, imageUrl: "/images/products/iphone-x.webp", isPrimary: true }],
    tlaterMonthly: 380000
  },
  {
    id: 205,
    categoryId: 1,
    sku: "APL-IPDM6-64-SL",
    name: "Apple iPad Mini (6th Gen) 64GB Wi-Fi - Starlight",
    slug: "ipad-mini-6-64gb-starlight",
    description: "Layar Liquid Retina 8.3 inci tepi-ke-tepi dengan True Tone dan warna luas P3. Didukung chip A15 Bionic berkemampuan grafis tinggi, kamera depan Ultra Wide 12MP dengan Center Stage, dan dukungan Apple Pencil Gen 2.",
    price: 8299000,
    originalPrice: 9499000,
    discountPercentage: 12,
    weightGrams: 580,
    status: "active",
    stock: 18,
    rating: 4.9,
    soldCount: 530,
    images: [{ id: 505, imageUrl: "/images/products/ipad-mini-6.webp", isPrimary: true }],
    tlaterMonthly: 720000
  },
  {
    id: 206,
    categoryId: 1,
    sku: "SMS-TABS8P-128-GRY",
    name: "Samsung Galaxy Tab S8 Plus 128GB 5G with S-Pen - Graphite",
    slug: "samsung-galaxy-tab-s8-plus-128gb",
    description: "Tablet produktivitas layar luas Super AMOLED 12.4 inci 120Hz. Dilengkapi Snapdragon 8 Gen 1 tercepat, stylus S-Pen latensi sangat rendah, kamera ganda depan ultra-wide, dan baterai tahan seharian 10090mAh.",
    price: 12999000,
    originalPrice: 14499000,
    discountPercentage: 10,
    weightGrams: 850,
    status: "active",
    stock: 14,
    rating: 4.8,
    soldCount: 410,
    images: [{ id: 506, imageUrl: "/images/products/samsung-tab-s8.webp", isPrimary: true }],
    tlaterMonthly: 1120000
  },

  // --- Category 2: Laptop & MacBook ---
  {
    id: 207,
    categoryId: 2,
    sku: "APL-MBP14-M3P",
    name: "Apple MacBook Pro 14 M3 Pro 18GB/512GB - Space Grey",
    slug: "macbook-pro-14-m3-pro-space-grey",
    description: "Ditenagai prosesor revolusioner Apple M3 Pro (11-core CPU, 14-core GPU), unified memory 18GB, storage SSD super kencang 512GB, dan layar spektakuler Liquid Retina XDR 14.2 inci dengan kecerahan hingga 1600 nits.",
    price: 35999000,
    originalPrice: 38999000,
    discountPercentage: 7,
    weightGrams: 1610,
    status: "active",
    stock: 8,
    rating: 5.0,
    soldCount: 340,
    images: [{ id: 507, imageUrl: "/images/products/macbook-pro-14.webp", isPrimary: true }],
    tlaterMonthly: 3000000
  },
  {
    id: 208,
    categoryId: 2,
    sku: "ASUS-ZB-PD15-OLED",
    name: "ASUS ZenBook Pro Duo 15 OLED - Celestial Blue",
    slug: "asus-zenbook-pro-duo-15-oled",
    description: "Laptop kreator masa depan dengan dua layar 4K terintegrasi: layar utama 15.6 inci 4K OLED HDR Touchscreen dan layar kedua ScreenPad Plus 14 inci yang otomatis terangkat saat dibuka untuk ergonomi pendinginan maksimal.",
    price: 32499000,
    originalPrice: 35999000,
    discountPercentage: 9,
    weightGrams: 2340,
    status: "active",
    stock: 5,
    rating: 4.8,
    soldCount: 160,
    images: [{ id: 508, imageUrl: "/images/products/asus-zenbook-pro-duo.webp", isPrimary: true }],
    tlaterMonthly: 2750000
  },
  {
    id: 209,
    categoryId: 2,
    sku: "DELL-XPS13-9300",
    name: "Dell XPS 13 9300 InfinityEdge - Platinum Silver",
    slug: "dell-xps-13-9300-infinityedge",
    description: "Laptop ultrabook premium terbuat dari satu blok aluminium CNC presisi dengan palm rest woven carbon fiber. Layar 13.4 inci rasio 16:10 borderless InfinityEdge 4-sisi, ditenagai Intel Core i7 10th Gen dan 16GB LPDDR4x.",
    price: 21499000,
    weightGrams: 1200,
    status: "active",
    stock: 9,
    rating: 4.7,
    soldCount: 220,
    images: [{ id: 509, imageUrl: "/images/products/dell-xps-13.webp", isPrimary: true }],
    tlaterMonthly: 1850000
  },
  {
    id: 210,
    categoryId: 2,
    sku: "HWI-MBX-PRO-GRY",
    name: "Huawei MateBook X Pro - Space Gray",
    slug: "huawei-matebook-x-pro-space-gray",
    description: "Ultrabook berbobot hanya 1.33kg dengan layar 13.9 inci 3K LTPS FullView Touch Display (rasio screen-to-body 91%). Didukung quad-speakers imersif, webcam recessed tersembunyi di keyboard untuk privasi, dan pengisian cepat 65W.",
    price: 18999000,
    originalPrice: 20999000,
    discountPercentage: 9,
    weightGrams: 1330,
    status: "active",
    stock: 7,
    rating: 4.7,
    soldCount: 180,
    images: [{ id: 510, imageUrl: "/images/products/huawei-matebook-x-pro.webp", isPrimary: true }],
    tlaterMonthly: 1620000
  },
  {
    id: 211,
    categoryId: 2,
    sku: "LNV-YG920-CONV",
    name: "Lenovo Yoga 920 2-in-1 Convertible Laptop",
    slug: "lenovo-yoga-920-convertible",
    description: "Laptop hybrid fleksibel dengan engsel watchband rantai jam tangan ikonik yang berputar mulus 360 derajat. Layar sentuh 13.9 inci 4K IPS, audio Dolby Atmos via headphone, dan mikrofon far-field untuk perintah suara jarak jauh.",
    price: 16499000,
    weightGrams: 1370,
    status: "active",
    stock: 11,
    rating: 4.6,
    soldCount: 210,
    images: [{ id: 511, imageUrl: "/images/products/lenovo-yoga-920.webp", isPrimary: true }],
    tlaterMonthly: 1400000
  },
  {
    id: 212,
    categoryId: 2,
    sku: "APL-IMAC27-5K",
    name: "Apple iMac 27-inch 5K Retina Display Intel Core i7",
    slug: "apple-imac-27-5k-retina",
    description: "All-in-One PC desktop idaman para kreator profesional dengan layar spektakuler 27 inci Retina 5K (5120x2880) berteknologi True Tone, grafis Radeon Pro, sistem tiga mikrofon berperekat studio, dan speaker stereo berdentum jernih.",
    price: 28999000,
    originalPrice: 31999000,
    discountPercentage: 9,
    weightGrams: 8900,
    status: "active",
    stock: 6,
    rating: 4.9,
    soldCount: 140,
    images: [{ id: 512, imageUrl: "/images/products/apple-imac-27.jpg", isPrimary: true }],
    tlaterMonthly: 2450000
  },

  // --- Category 3: Komponen PC Gaming ---
  {
    id: 213,
    categoryId: 3,
    sku: "NVD-RTX4090-FE",
    name: "NVIDIA GeForce RTX 4090 Founders Edition 24GB GDDR6X",
    slug: "rtx-4090-fe-24gb",
    description: "Kartu grafis gaming flagship tertinggi di dunia dengan arsitektur NVIDIA Ada Lovelace. Dilengkapi 16384 CUDA cores, 24GB memori GDDR6X 384-bit super cepat, teknologi DLSS 3 Frame Generation, dan sistem pendingin dual-axis flowthrough.",
    price: 34500000,
    originalPrice: 36999000,
    discountPercentage: 6,
    weightGrams: 2180,
    status: "active",
    stock: 4,
    rating: 5.0,
    soldCount: 150,
    images: [{ id: 513, imageUrl: "/images/products/rtx-4090-fe.jpg", isPrimary: true }],
    tlaterMonthly: 2850000
  },
  {
    id: 214,
    categoryId: 3,
    sku: "CSR-VNG-DDR5-32G",
    name: "Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL30",
    slug: "corsair-vengeance-rgb-ddr5-32gb",
    description: "Kit memori RAM gaming DDR5 frekuensi tinggi 6000MHz dengan latency rendah CL30 untuk platform Intel XMP 3.0 & AMD EXPO. Dilengkapi heatsink aluminium padat dan lightbar panoramic 10-zona ARGB yang dapat dikustomisasi via software iCUE.",
    price: 2299000,
    originalPrice: 2599000,
    discountPercentage: 11,
    weightGrams: 160,
    status: "active",
    stock: 35,
    rating: 4.9,
    soldCount: 620,
    images: [{ id: 514, imageUrl: "/images/products/corsair-ddr5-ram.jpg", isPrimary: true }],
    tlaterMonthly: 199000
  },
  {
    id: 215,
    categoryId: 3,
    sku: "SMS-990PRO-2TB",
    name: "Samsung 990 PRO NVMe M.2 SSD 2TB PCIe 4.0",
    slug: "samsung-990-pro-nvme-2tb",
    description: "Solid State Drive M.2 NVMe PCIe 4.0 berkecepatan puncak hingga 7,450 MB/s baca dan 6,900 MB/s tulis. Dilengkapi controller berlapis nikel dan algoritma cerdas kontrol panas untuk stabilitas gaming ekstrem dan olah video 4K/8K.",
    price: 3199000,
    originalPrice: 3499000,
    discountPercentage: 8,
    weightGrams: 80,
    status: "active",
    stock: 40,
    rating: 4.9,
    soldCount: 890,
    images: [{ id: 515, imageUrl: "/images/products/samsung-990-pro.jpg", isPrimary: true }],
    tlaterMonthly: 275000
  },
  {
    id: 216,
    categoryId: 3,
    sku: "AMD-R7-3700X",
    name: "AMD Ryzen 7 3700X 8-Core 16-Thread Socket AM4 Processor",
    slug: "amd-ryzen-7-3700x-am4",
    description: "Prosesor gaming dan multitasking 8-core 16-thread dengan boost clock mencapai 4.4GHz dan GameCache 36MB. Efisiensi arsitektur Zen 2 pada fabrikasi 7nm mutakhir dengan daya konsumsi rendah TDP 65W.",
    price: 2450000,
    originalPrice: 2890000,
    discountPercentage: 15,
    weightGrams: 450,
    status: "active",
    stock: 20,
    rating: 4.8,
    soldCount: 1100,
    images: [{ id: 516, imageUrl: "/images/products/amd-ryzen-7-3700x.jpg", isPrimary: true }],
    tlaterMonthly: 215000
  },
  {
    id: 217,
    categoryId: 3,
    sku: "TVB-APEX-CASE-ARGB",
    name: "TechVibe Apex Liquid Cooled ARGB Mid-Tower Gaming PC Case Rig",
    slug: "techvibe-apex-liquid-cooled-gaming-rig",
    description: "Chassis gaming mid-tower premium berdinding kaca tempered ganda tanpa pilar sudut untuk panorama komponen tanpa halangan. Dilengkapi sistem pendingin cair liquid AIO 360mm, 6 kipas ARGB PWM aliran udara tinggi, dan manajemen kabel profesional.",
    price: 18499000,
    originalPrice: 20999000,
    discountPercentage: 11,
    weightGrams: 14500,
    status: "active",
    stock: 6,
    rating: 4.9,
    soldCount: 75,
    images: [{ id: 517, imageUrl: "/images/products/gaming-pc-rig.jpg", isPrimary: true }],
    tlaterMonthly: 1550000
  },
  {
    id: 218,
    categoryId: 3,
    sku: "LOGI-G102-RGB",
    name: "Logitech G102 Lightsync RGB Optical Gaming Mouse",
    slug: "logitech-g102-lightsync-rgb",
    description: "Mouse gaming legendaris dengan sensor presisi tinggi 8,000 DPI yang dapat disesuaikan. Dilengkapi sistem pegas tombol logam untuk klik yang renyah konsisten, 6 tombol makro, dan pencahayaan Lightsync RGB multi-warna yang memukau.",
    price: 299000,
    originalPrice: 389000,
    discountPercentage: 23,
    weightGrams: 210,
    status: "active",
    stock: 120,
    rating: 4.8,
    soldCount: 4320,
    images: [{ id: 518, imageUrl: "/images/products/logitech-g102.jpg", isPrimary: true }],
    tlaterMonthly: 30000
  },
  {
    id: 219,
    categoryId: 3,
    sku: "SNY-PS5-DISC",
    name: "Sony PlayStation 5 Disc Edition Console + DualSense Controller",
    slug: "playstation-5-disc-edition",
    description: "Pengalaman gaming generasi berikutnya dengan Ultra High Speed SSD kustom 825GB untuk loading instan, teknologi Ray Tracing hardware, audio spasial Tempest 3D, dan inovasi umpan balik haptik serta adaptive trigger pada stik DualSense.",
    price: 8499000,
    originalPrice: 9199000,
    discountPercentage: 7,
    weightGrams: 4500,
    status: "active",
    stock: 16,
    rating: 4.9,
    soldCount: 1870,
    images: [{ id: 519, imageUrl: "/images/products/ps5-console.jpg", isPrimary: true }],
    tlaterMonthly: 720000
  },
  {
    id: 220,
    categoryId: 3,
    sku: "NTD-SW-NEON",
    name: "Nintendo Switch Neon Blue & Neon Red Joy-Con",
    slug: "nintendo-switch-neon-blue-red",
    description: "Konsol game serbaguna yang bertransformasi mulus antara TV Mode di ruang keluarga, Tabletop Mode bersama sahabat, dan Handheld Mode portabel saat bepergian. Lengkap dengan sepasang kontroler Joy-Con dengan motion control HD Rumble.",
    price: 3999000,
    originalPrice: 4499000,
    discountPercentage: 11,
    weightGrams: 900,
    status: "active",
    stock: 28,
    rating: 4.9,
    soldCount: 2450,
    images: [{ id: 520, imageUrl: "/images/products/nintendo-switch.jpg", isPrimary: true }],
    tlaterMonthly: 345000
  },

  // --- Category 4: Aksesoris & Audio ---
  {
    id: 221,
    categoryId: 4,
    sku: "APL-APM-SLV",
    name: "Apple AirPods Max Wireless ANC Headphones - Silver",
    slug: "apple-airpods-max-silver",
    description: "Headphone over-ear mahakarya akustik Apple dengan driver dinamis 40mm berdistorsi sangat rendah. Dilengkapi Active Noise Cancellation tingkat pro, Transparency Mode, audio spasial personalisasi dengan pelacakan kepala real-time, dan bodi aluminium anodized.",
    price: 8499000,
    originalPrice: 9499000,
    discountPercentage: 10,
    weightGrams: 750,
    status: "active",
    stock: 12,
    rating: 4.9,
    soldCount: 420,
    images: [{ id: 521, imageUrl: "/images/products/airpods-max.webp", isPrimary: true }],
    tlaterMonthly: 730000
  },
  {
    id: 222,
    categoryId: 4,
    sku: "SNY-XM4-BLK",
    name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones - Black",
    slug: "sony-wh-1000xm4-black",
    description: "Headphone wireless nomor satu dengan prosesor Noise Cancelling HD QN1, transmisi Bluetooth nirkabel resolusi tinggi codec LDAC, fitur cerdas Speak-to-Chat, sensor pemakaian otomatis, dan daya tahan baterai super awet 30 jam.",
    price: 4299000,
    originalPrice: 4999000,
    discountPercentage: 14,
    weightGrams: 254,
    status: "active",
    stock: 22,
    rating: 4.9,
    soldCount: 1650,
    images: [{ id: 522, imageUrl: "/images/products/sony-wh-1000xm4.jpg", isPrimary: true }],
    tlaterMonthly: 370000
  },
  {
    id: 223,
    categoryId: 4,
    sku: "APL-AP3-MGS",
    name: "Apple AirPods (3rd Generation) with MagSafe Charging Case",
    slug: "apple-airpods-3rd-generation",
    description: "Earbuds nirkabel dengan bentuk berkontur pas, Adaptive EQ yang otomatis menyetel musik ke telinga pengguna, sensor tekanan untuk kontrol instan, daya baterai hingga 30 jam bersama wadah pengisian MagSafe, dan sertifikasi tahan air IPX4.",
    price: 2999000,
    originalPrice: 3299000,
    discountPercentage: 9,
    weightGrams: 200,
    status: "active",
    stock: 45,
    rating: 4.8,
    soldCount: 2890,
    images: [{ id: 523, imageUrl: "/images/products/airpods-3.webp", isPrimary: true }],
    tlaterMonthly: 260000
  },
  {
    id: 224,
    categoryId: 4,
    sku: "APL-W4-44-GLD",
    name: "Apple Watch Series 4 GPS 44mm - Gold Aluminum",
    slug: "apple-watch-series-4-gold-44mm",
    description: "Smartwatch kesehatan modern dengan layar tepi melengkung LTPO OLED luas, sensor jantung optik dan elektrik dengan fitur aplikasi ECG, notifikasi detak jantung tinggi/rendah, deteksi jatuh darurat (Fall Detection), dan casing aluminium emas elegan.",
    price: 3899000,
    originalPrice: 4299000,
    discountPercentage: 9,
    weightGrams: 280,
    status: "active",
    stock: 14,
    rating: 4.7,
    soldCount: 780,
    images: [{ id: 524, imageUrl: "/images/products/apple-watch-s4.webp", isPrimary: true }],
    tlaterMonthly: 335000
  },
  {
    id: 225,
    categoryId: 4,
    sku: "APL-HPM-GRY",
    name: "Apple HomePod Mini Smart Speaker - Space Grey",
    slug: "apple-homepod-mini-space-grey",
    description: "Speaker pintar dengan teknologi audio komputasional canggih menghadirkan dentuman suara 360 derajat yang kaya dan detail dari bodi mungil bulat berbalut kain jaring seamless, dengan lampu backlit warna-warni pada panel sentuh atas.",
    price: 1899000,
    weightGrams: 345,
    status: "active",
    stock: 25,
    rating: 4.7,
    soldCount: 640,
    images: [{ id: 525, imageUrl: "/images/products/homepod-mini.webp", isPrimary: true }],
    tlaterMonthly: 165000
  },
  {
    id: 226,
    categoryId: 4,
    sku: "APL-MGS-BAT",
    name: "Apple MagSafe Battery Pack 1460mAh",
    slug: "apple-magsafe-battery-pack",
    description: "Powerbank magnetik portabel nirkabel resmi Apple yang menempel presisi di bodi iPhone via MagSafe. Pengisian daya otomatis tanpa tombol on/off, aman dibawa bepergian, dan mendukung passthrough charging hingga 15W saat tersambung kabel Lightning.",
    price: 1499000,
    originalPrice: 1799000,
    discountPercentage: 16,
    weightGrams: 115,
    status: "active",
    stock: 32,
    rating: 4.6,
    soldCount: 1120,
    images: [{ id: 526, imageUrl: "/images/products/magsafe-battery.webp", isPrimary: true }],
    tlaterMonthly: 130000
  },
  {
    id: 227,
    categoryId: 4,
    sku: "BTS-FLX-YZU",
    name: "Beats Flex Wireless Earphones - Yuzu Yellow",
    slug: "beats-flex-wireless-yuzu-yellow",
    description: "Earphone nirkabel fleksibel berdesain neckband ringan kabel Flex-Form yang nyaman dipakai sepanjang hari. Baterai tahan 12 jam dengan fitur pengisian kilat Fast Fuel 10 menit untuk 1.5 jam pemakaian, serta earbud magnetik auto-pause.",
    price: 999000,
    originalPrice: 1250000,
    discountPercentage: 20,
    weightGrams: 120,
    status: "active",
    stock: 30,
    rating: 4.7,
    soldCount: 950,
    images: [{ id: 527, imageUrl: "/images/products/beats-flex.webp", isPrimary: true }],
    tlaterMonthly: 88000
  },
  {
    id: 228,
    categoryId: 4,
    sku: "APL-MGK-SLV",
    name: "Apple Magic Keyboard Wireless Bluetooth - Silver",
    slug: "apple-magic-keyboard-silver",
    description: "Keyboard nirkabel ramping berprofil rendah terbuat dari aluminium kokoh dengan mekanisme gunting (scissor switch) yang presisi dan stabil di setiap tombol. Baterai isi ulang internal bertahan sebulan lebih dalam sekali pengisian.",
    price: 1799000,
    originalPrice: 2099000,
    discountPercentage: 14,
    weightGrams: 350,
    status: "active",
    stock: 26,
    rating: 4.8,
    soldCount: 840,
    images: [{ id: 528, imageUrl: "/images/products/apple-magic-keyboard.jpg", isPrimary: true }],
    tlaterMonthly: 155000
  }
];

if (DEMO_MODE) demoRepository.init(mockProducts, [], [], [], []);

export const CatalogService = {
  async getCategories() {
    if (DEMO_MODE) return mockCategories;
    return (await api.get('/api/v1/catalog/categories')).data;
  },
  async getProducts(params?: any) {
    if (DEMO_MODE) {
      const db = readDemoDB();
      const list = db.products.length ? db.products : mockProducts;
      let filtered = [...list];
      if (params?.categoryId) {
        filtered = filtered.filter(p => p.categoryId === Number(params.categoryId));
      }
      if (params?.maxPrice) {
        filtered = filtered.filter(p => p.price <= params.maxPrice);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.sku.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }
      return { items: filtered, total: filtered.length, page: 1, limit: filtered.length };
    }
    return (await api.get('/api/v1/catalog/products', { params })).data;
  },
  async getProductBySlug(slug: string) {
    if (DEMO_MODE) {
      const db = readDemoDB();
      const list = db.products.length ? db.products : mockProducts;
      const product = list.find(p => p.slug === slug);
      if (!product) throw new Error("Not Found");
      return product;
    }
    return (await api.get(`/api/v1/catalog/products/${slug}`)).data;
  },
  async getProductReviews(id: number) {
    if (DEMO_MODE) {
      const db = readDemoDB();
      const revs = db.reviews.filter(r => r.productId === id);
      if (revs.length) return revs;
      return [
        { id: 1, userId: 101, userName: "Budi Santoso", rating: 5, comment: "Barang 100% original bergaransi resmi, pengiriman super aman dan packing rapi!", createdAt: "2026-09-15" },
        { id: 2, userId: 102, userName: "Agus Pratama", rating: 5, comment: "Mantap, dapet cicilan TLater 0% bunga ringan. Layanan TechVibe terbaik!", createdAt: "2026-09-16" },
        { id: 3, userId: 103, userName: "Siti Rahma", rating: 4, comment: "Kualitas bintang 5, performa luar biasa dan pengiriman kilat sampai di hari yang sama.", createdAt: "2026-09-20" }
      ];
    }
    return (await api.get(`/api/v1/catalog/products/${id}/reviews`)).data;
  }
};
