import type { PpfGalleryItem } from "@/lib/ppf-services";

export const CERAMIC_BOOKING = {
  phoneDisplay: "0335-7344294",
  phoneTel: "+923357344294",
  whatsapp: "923357344294",
  location: "D.H.A Phase 2 Ext, Karachi",
} as const;

export const CERAMIC_HEADLINE = {
  title: "Ceramic coating — 3M & AutoVerse",
  subtitle:
    "Mirror-gloss paint correction and ceramic protection at AutoVerse. Full interior and engine-bay detailing for SUVs like the Land Cruiser ZX.",
} as const;

export const CERAMIC_PACKAGE_INCLUDES = [
  "3M paint correction (rubbing compound)",
  "Finishing compound",
  "3M ceramic coating",
  "Interior detailing",
  "Seats removal",
  "Carpet washing",
  "Roof cleaning",
  "Engine room detailing",
  "Wash",
  "Wax",
  "Chrome rust removal",
] as const;

export const CERAMIC_PROTECTION_FROM = [
  "Dust",
  "Water spotting",
  "Bird droppings",
  "Chemicals",
  "UV rays",
  "Acid rain",
  "Oxidation",
] as const;

export const CERAMIC_FEATURED = {
  vehicle: "Toyota Land Cruiser ZX",
  title: "Land Cruiser ZX — detailed by AutoVerse",
  summary:
    "Full AutoVerse ceramic coating package on this Land Cruiser ZX — 3M correction and ceramic coat for deep black gloss, plus interior, carpets, roof, engine bay, and chrome restoration.",
  heroImage: "/images/ceramic/landcruiser-zx-08-studio-front.jpg",
} as const;

export const CERAMIC_GALLERY: PpfGalleryItem[] = [
  {
    id: "lc-01",
    title: "Studio front — mirror gloss",
    description: "AutoVerse plate and LED front after coating.",
    image: "/images/ceramic/landcruiser-zx-01-front-hero.jpg",
  },
  {
    id: "lc-02",
    title: "Front three-quarter",
    description: "Deep reflection on black ZX paint.",
    image: "/images/ceramic/landcruiser-zx-02-front-angle.jpg",
  },
  {
    id: "lc-03",
    title: "Interior — handover ready",
    description: "Leather cabin with AutoVerse floor mats.",
    image: "/images/ceramic/landcruiser-zx-03-interior.jpg",
  },
  {
    id: "lc-04",
    title: "Rear quarter — ZX badge",
    description: "Protected tailgate and rear glass branding.",
    image: "/images/ceramic/landcruiser-zx-04-rear-quarter.jpg",
  },
  {
    id: "lc-05",
    title: "Rear full — V8 & WALD",
    description: "Land Cruiser rear with showroom finish.",
    image: "/images/ceramic/landcruiser-zx-05-rear-full.jpg",
  },
  {
    id: "lc-06",
    title: "Rear gloss",
    description: "Taillights and chrome after detailing.",
    image: "/images/ceramic/landcruiser-zx-06-rear-gloss.jpg",
  },
  {
    id: "lc-07",
    title: "V8 — close-up shine",
    description: "Ceramic coat clarity on the quarter panel.",
    image: "/images/ceramic/landcruiser-zx-07-v8-gloss.jpg",
  },
  {
    id: "lc-08",
    title: "Front detail",
    description: "Headlamps, grille, and coated hood.",
    image: "/images/ceramic/landcruiser-zx-08-studio-front.jpg",
  },
];
