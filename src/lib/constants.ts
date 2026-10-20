export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "AutoVerse",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  city: process.env.NEXT_PUBLIC_CITY ?? "Karachi",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+923001234567",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "923001234567",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hello@autoverse.com",
  address:
    process.env.NEXT_PUBLIC_ADDRESS ??
    "AutoVerse Showroom, Karachi, Sindh, Pakistan",
  mapsUrl:
    process.env.NEXT_PUBLIC_MAPS_URL ??
    "https://maps.google.com/maps?q=AutoVerse,Karachi,Pakistan&hl=en&z=14",
  mapsEmbedUrl:
    process.env.NEXT_PUBLIC_MAPS_EMBED_URL ??
    "https://maps.google.com/maps?q=AutoVerse,Karachi,Pakistan&hl=en&z=14&output=embed",
} as const;

/** Brand palette from AutoVerse logo */
export const BRAND = {
  name: "AutoVerse",
  tagline: "Drive Your Dream",
  logoSrc: "/brand/autoverse-logo.jpg",
  markSrc: "/brand/autoverse-mark.jpg",
  wordmarkSrc: "/brand/autoverse-wordmark.png",
  primary: "#1383A1",
  primaryDark: "#0c5f75",
  primaryDeep: "#083844",
  accent: "#60DBFB",
  ink: "#062028",
} as const;

export const ACCENT = BRAND.accent;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/#inspection", label: "Inspection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const BRANDS = [
  "Toyota",
  "Honda",
  "Suzuki",
  "Kia",
  "Hyundai",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "MG",
  "Changan",
] as const;

export const INSPECTION_PACKAGES = [
  {
    id: "basic" as const,
    name: "Basic",
    price: "PKR 3,500",
    features: ["Visual exterior/interior", "OBD scan", "Test drive"],
  },
  {
    id: "standard" as const,
    name: "Standard",
    price: "PKR 6,500",
    features: ["Everything in Basic", "Underbody check", "Fluid levels"],
  },
  {
    id: "full_premium" as const,
    name: "Full Premium",
    price: "PKR 12,000",
    features: [
      "Complete 150-point check",
      "Compression test",
      "Detailed PDF report",
    ],
  },
];

export const DEFAULT_CHECKLIST = {
  engine: { score: 0, notes: "" },
  transmission: { score: 0, notes: "" },
  suspension: { score: 0, notes: "" },
  brakes: { score: 0, notes: "" },
  tyres: { score: 0, notes: "" },
  electrical: { score: 0, notes: "" },
  ac: { score: 0, notes: "" },
  interior: { score: 0, notes: "" },
  exterior_paint: { score: 0, notes: "" },
  accident_history: { score: 0, notes: "" },
};
