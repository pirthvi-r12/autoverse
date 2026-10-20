/**
 * PPF (Paint Protection Film) content for AutoVerse.
 * Add photos under public/images/ppf/ and reference them in showcase galleries below.
 */
export type PpfPackage = {
  id: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
};

export type PpfGalleryItem = {
  id: string;
  title: string;
  description?: string;
  image?: string;
};

export type PpfProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type PpfShowcase = {
  id: string;
  vehicle: string;
  title: string;
  summary: string;
  heroImage: string;
  /** e.g. Miracle Ceramic Coated PPF */
  filmBrand?: string;
  warrantyNote?: string;
  gallery: PpfGalleryItem[];
};

export const PPF_FILM = {
  name: "Miracle Paint Protection Film (PPF)",
  shortName: "Miracle Ceramic Coated PPF",
  tagline: "Self-healing paint protection film",
  substrate: "Substrate made in USA",
  lifespan: "Life up to 8 years",
  warranty: "5 years warranty",
  warrantyCovers:
    "Warranty against bubbling, cracking, yellowing, and delamination",
} as const;

export const PPF_STEALTH_FILM = {
  name: "Stealth Paint Protection Film (PPF)",
  shortName: "Stealth Ceramic Coated PPF",
  warrantyCovers:
    "Warranty against bubbling, cracking, and delamination",
} as const;

export const PPF_STEALTH_PRODUCT_FEATURES = [
  "Scratch resistant",
  "Ceramic coated film",
  "Glossy finish & optical clarity",
  "UV protection",
  "Durable against rock chips",
  "Preserves resale value",
  "Easy maintenance — long-term investment",
] as const;

/** Appointments & bookings for PPF (from AutoVerse marketing). */
export const PPF_BOOKING = {
  phoneDisplay: "0335-7344294",
  phoneTel: "+923357344294",
  whatsapp: "923357344294",
  location: "D.H.A Phase 2 Ext, Karachi",
} as const;

export const PPF_PRODUCT_FEATURES = [
  "Self-healing — minor scratches vanish with heat",
  "Scratch resistant",
  "Ceramic coated film",
  "Hydrophobic effect",
  "Glossy finish & optical clarity",
  "UV protection",
  "Durable against rock chips",
  "Preserves resale value",
  "Easy maintenance — long-term investment",
] as const;

export const PPF_PACKAGE_INCLUDES = [
  "2-step paint correction treatment",
  "3 free PPF maintenance sessions",
  "Interior detailing",
] as const;

export const PPF_HEADLINE = {
  title: "PPF — Paint Protection Film",
  subtitle:
    "Miracle & Stealth ceramic-coated PPF at AutoVerse — Fortuner, Corolla Cross, KIA Sportage, Audi, MG, Hilux, and more.",
};

export const PPF_BENEFITS = [
  {
    title: "Rock chip & scratch defense",
    body: "High-impact zones stay protected without changing your car's original paint.",
  },
  {
    title: "Self-healing top coat",
    body: "Light swirls and marks reduce with heat — ideal for daily driven cars.",
  },
  {
    title: "UV & stain resistance",
    body: "Helps guard against fading, bird droppings, and harsh sun exposure.",
  },
  {
    title: "Showroom finish",
    body: "Optically clear film with expert edge-wrapping for an invisible install.",
  },
] as const;

export const PPF_PACKAGES: PpfPackage[] = [
  {
    id: "partial-front",
    name: "Partial Front",
    price: "Quote on inspection",
    tagline: "High-impact areas",
    features: [
      "Partial bonnet & bumper",
      "Headlamps / fog lamps (optional)",
      "Ideal for budget-conscious owners",
    ],
  },
  {
    id: "full-front",
    name: "Full Front",
    price: "Quote on inspection",
    tagline: "Most popular package",
    highlighted: true,
    features: [
      "Full bonnet, bumper & fenders",
      "Mirrors & headlamps",
      "Precision cut & wrapped edges",
    ],
  },
  {
    id: "full-body",
    name: "Full Body",
    price: "Quote on inspection",
    tagline: "Maximum protection",
    highlighted: false,
    features: [
      "Complete exterior panels",
      "Door cups, sills & high-wear zones",
      "Includes paint correction & interior detail — see bundle below",
    ],
  },
];

export const PPF_PROCESS: PpfProcessStep[] = [
  {
    step: 1,
    title: "Consultation & prep",
    description:
      "Paint inspection, wash, and panel prep. Lights and trim are masked or removed where needed for clean edges.",
  },
  {
    step: 2,
    title: "Wet install",
    description:
      "Film is positioned with slip solution, then aligned on bonnet, bumpers, doors, and high-wear panels.",
  },
  {
    step: 3,
    title: "Squeegee & trim",
    description:
      "Air and fluid are worked out with squeegees; edges are precision-trimmed and tucked around badges and body lines.",
  },
  {
    step: 4,
    title: "Final QC & handover",
    description:
      "Full walk-around inspection, cure guidance, and aftercare so your PPF stays invisible for years.",
  },
];

const HILUX_ROCCO_GR_GALLERY: PpfGalleryItem[] = [
  {
    id: "rocco-01",
    title: "Miracle PPF — front hero",
    description: "Ceramic coated film with AutoVerse front plate.",
    image: "/images/ppf/hilux-rocco-gr-01-miracle-hero.jpg",
  },
  {
    id: "rocco-02",
    title: "Hood — team install",
    description: "Two-tech wet install on the white GR Sport bonnet.",
    image: "/images/ppf/hilux-rocco-gr-02-hood-team.jpg",
  },
  {
    id: "rocco-03",
    title: "Tailgate — GR Sport badges",
    description: "Film squeegeed over HILUX, GR Sport, and REVO emblems.",
    image: "/images/ppf/hilux-rocco-gr-03-tailgate-gr.jpg",
  },
  {
    id: "rocco-04",
    title: "Rear — Miracle showcase",
    description: "Protected tailgate with Miracle PPF packaging.",
    image: "/images/ppf/hilux-rocco-gr-04-tailgate-product.jpg",
  },
  {
    id: "rocco-05",
    title: "Rear studio finish",
    description: "4x4 decal and AutoVerse rear glass branding.",
    image: "/images/ppf/hilux-rocco-gr-05-rear-studio.jpg",
  },
  {
    id: "rocco-06",
    title: "Side profile",
    description: "Full white Revo Rocco GR with GR fender badge.",
    image: "/images/ppf/hilux-rocco-gr-06-side-profile.jpg",
  },
  {
    id: "rocco-07",
    title: "Headlight gloss",
    description: "Front clip clarity after USA-substrate Miracle PPF.",
    image: "/images/ppf/hilux-rocco-gr-07-headlight-gloss.jpg",
  },
  {
    id: "rocco-08",
    title: "GR Sport interior",
    description: "Cabin handover with AutoVerse floor mats.",
    image: "/images/ppf/hilux-rocco-gr-08-gr-interior.jpg",
  },
  {
    id: "rocco-09",
    title: "Front — wet install",
    description: "Film positioned on grille, bonnet, and bumper.",
    image: "/images/ppf/hilux-rocco-gr-09-front-install.jpg",
  },
  {
    id: "rocco-10",
    title: "Miracle product — studio",
    description: "Self-healing ceramic coated PPF on the Hilux Revo.",
    image: "/images/ppf/hilux-rocco-gr-10-front-product.jpg",
  },
];

const AUDI_A4_GALLERY: PpfGalleryItem[] = [
  {
    id: "audi-01",
    title: "Headlamp — precision tuck",
    description: "Film wrapped around LED housings and panel gaps.",
    image: "/images/ppf/audi-a4-01-headlight-detail.jpg",
  },
  {
    id: "audi-02",
    title: "Door jamb — slip solution",
    description: "Wet install prep on rear door and wheel arch.",
    image: "/images/ppf/audi-a4-02-door-prep.jpg",
  },
  {
    id: "audi-03",
    title: "Side profile — gloss finish",
    description: "Full-body protection with mirror-like reflection.",
    image: "/images/ppf/audi-a4-03-side-profile.jpg",
  },
  {
    id: "audi-04",
    title: "Rear — full protection",
    description: "Completed rear with AutoVerse studio finish.",
    image: "/images/ppf/audi-a4-04-rear-complete.jpg",
  },
  {
    id: "audi-05",
    title: "Hood & fender — wet install",
    description: "Large sheets positioned on the front end.",
    image: "/images/ppf/audi-a4-05-hood-install.jpg",
  },
  {
    id: "audi-06",
    title: "Rear quarter — studio finish",
    description: "C-pillar and quarter panel after install.",
    image: "/images/ppf/audi-a4-06-quarter-finish.jpg",
  },
  {
    id: "audi-07",
    title: "Miracle PPF — product",
    description: "Ceramic coated film used on this full-body job.",
    image: "/images/ppf/audi-a4-07-miracle-ppf-product.jpg",
  },
  {
    id: "audi-08",
    title: "Trunk showcase",
    description: "Miracle PPF packaging and protected rear glass.",
    image: "/images/ppf/audi-a4-08-trunk-showcase.jpg",
  },
  {
    id: "audi-09",
    title: "Headlight finish",
    description: "Hand-trimmed edges on the front lighting.",
    image: "/images/ppf/audi-a4-09-headlight-finish.jpg",
  },
];

const MG_HS_GALLERY: PpfGalleryItem[] = [
  {
    id: "mg-01",
    title: "Front end — mirror gloss",
    description: "LED headlamps and grille after Miracle PPF.",
    image: "/images/ppf/mg-hs-01-front-gloss.jpg",
  },
  {
    id: "mg-02",
    title: "Hood — wet install",
    description: "Film draped and squeegeed on the front clip.",
    image: "/images/ppf/mg-hs-02-hood-install.jpg",
  },
  {
    id: "mg-03",
    title: "Side profile — deep gloss",
    description: "Rear quarter and doors with showroom reflection.",
    image: "/images/ppf/mg-hs-03-side-gloss.jpg",
  },
  {
    id: "mg-04",
    title: "Studio — Miracle PPF",
    description: "Self-healing ceramic coated film on this MG HS.",
    image: "/images/ppf/mg-hs-04-studio-product.jpg",
  },
  {
    id: "mg-05",
    title: "Rear — HS badge",
    description: "Protected tailgate with AutoVerse studio finish.",
    image: "/images/ppf/mg-hs-05-rear-showcase.jpg",
  },
  {
    id: "mg-06",
    title: "Interior — delivery ready",
    description: "Cabin protected with AutoVerse floor mats at handover.",
    image: "/images/ppf/mg-hs-06-interior.jpg",
  },
  {
    id: "mg-07",
    title: "Miracle PPF — front showcase",
    description: "Product and finished front-end gloss in our bay.",
    image: "/images/ppf/mg-hs-07-front-product.jpg",
  },
  {
    id: "mg-08",
    title: "Full front hero",
    description: "Black MG HS protected with Miracle paint protection film.",
    image: "/images/ppf/mg-hs-08-front-hero.jpg",
  },
];

const COROLLA_CROSS_GALLERY: PpfGalleryItem[] = [
  {
    id: "cross-01",
    title: "Miracle PPF — studio hero",
    description: "Advanced paint protection film with deep black gloss.",
    image: "/images/ppf/corolla-cross-01-product-hero.jpg",
  },
  {
    id: "cross-02",
    title: "Front three-quarter",
    description: "Corolla Cross after ceramic coated PPF install.",
    image: "/images/ppf/corolla-cross-02-front-angle.jpg",
  },
  {
    id: "cross-03",
    title: "Front clip — clarity",
    description: "Headlamps and hood with mirror-like reflection.",
    image: "/images/ppf/corolla-cross-03-front-gloss.jpg",
  },
  {
    id: "cross-04",
    title: "Hood detail",
    description: "Studio lighting on a flawless protected finish.",
    image: "/images/ppf/corolla-cross-04-hood-detail.jpg",
  },
  {
    id: "cross-05",
    title: "Full side profile",
    description: "Complete side protection and gloss retention.",
    image: "/images/ppf/corolla-cross-05-full-side.jpg",
  },
  {
    id: "cross-06",
    title: "Rear quarter",
    description: "Taillight and quarter panel finish.",
    image: "/images/ppf/corolla-cross-06-rear-quarter.jpg",
  },
  {
    id: "cross-07",
    title: "Side profile",
    description: "Doors, sills, and arches protected end to end.",
    image: "/images/ppf/corolla-cross-07-side-profile.jpg",
  },
  {
    id: "cross-08",
    title: "Rear gloss",
    description: "LED taillights and rear body lines.",
    image: "/images/ppf/corolla-cross-08-rear-gloss.jpg",
  },
  {
    id: "cross-09",
    title: "COROLLA CROSS badge",
    description: "Protected pillar trim and factory lettering.",
    image: "/images/ppf/corolla-cross-09-rear-badge.jpg",
  },
  {
    id: "cross-10",
    title: "Front — wet install",
    description: "PPF application on grille and bumper.",
    image: "/images/ppf/corolla-cross-10-front-install.jpg",
  },
];

const KIA_SPORTAGE_GALLERY: PpfGalleryItem[] = [
  {
    id: "sportage-01",
    title: "Headlight — glossy finish",
    description: "Front clip clarity after Miracle ceramic coated PPF.",
    image: "/images/ppf/kia-sportage-01-headlight-gloss.jpg",
  },
  {
    id: "sportage-02",
    title: "Fender — wet install",
    description: "Hand squeegee work on hood and front fender.",
    image: "/images/ppf/kia-sportage-02-fender-install.jpg",
  },
  {
    id: "sportage-03",
    title: "Rear quarter",
    description: "Taillight and quarter panel with deep black gloss.",
    image: "/images/ppf/kia-sportage-03-rear-quarter.jpg",
  },
  {
    id: "sportage-04",
    title: "Side profile",
    description: "Chrome trim and doors protected end to end.",
    image: "/images/ppf/kia-sportage-04-side-profile.jpg",
  },
  {
    id: "sportage-05",
    title: "Front angle",
    description: "Sportage front three-quarter studio finish.",
    image: "/images/ppf/kia-sportage-05-front-angle.jpg",
  },
  {
    id: "sportage-06",
    title: "Miracle PPF hero",
    description: "Advanced paint protection film in our bay.",
    image: "/images/ppf/kia-sportage-06-miracle-hero.jpg",
  },
  {
    id: "sportage-07",
    title: "Rear — SPORTAGE badge",
    description: "Film tucked around the KIA tailgate emblem.",
    image: "/images/ppf/kia-sportage-07-rear-badge.jpg",
  },
  {
    id: "sportage-08",
    title: "Front three-quarter",
    description: "Tiger-nose grille and LED headlamps protected.",
    image: "/images/ppf/kia-sportage-08-front-three-quarter.jpg",
  },
  {
    id: "sportage-09",
    title: "Miracle product — front",
    description: "USA-substrate PPF with 5-year warranty coverage.",
    image: "/images/ppf/kia-sportage-09-product-front.jpg",
  },
];

const FORTUNER_2021_GALLERY: PpfGalleryItem[] = [
  {
    id: "fortuner-01",
    title: "Stealth PPF — studio hero",
    description: "Advanced paint protection on this 2021 Fortuner.",
    image: "/images/ppf/fortuner-2021-01-stealth-hero.jpg",
  },
  {
    id: "fortuner-02",
    title: "Hood — wet install",
    description: "Film squeegeed on the front clip.",
    image: "/images/ppf/fortuner-2021-02-hood-install.jpg",
  },
  {
    id: "fortuner-03",
    title: "Door panel install",
    description: "Precision work on rear door and glass line.",
    image: "/images/ppf/fortuner-2021-03-door-install.jpg",
  },
  {
    id: "fortuner-04",
    title: "Side profile",
    description: "Running boards and chrome trim protected.",
    image: "/images/ppf/fortuner-2021-04-side-profile.jpg",
  },
  {
    id: "fortuner-05",
    title: "Driver side gloss",
    description: "Mirror-like reflection along the body.",
    image: "/images/ppf/fortuner-2021-05-driver-side.jpg",
  },
  {
    id: "fortuner-06",
    title: "Rear quarter",
    description: "Taillight and quarter panel finish.",
    image: "/images/ppf/fortuner-2021-06-rear-quarter.jpg",
  },
  {
    id: "fortuner-07",
    title: "Rear three-quarter",
    description: "AutoVerse studio finish on the tailgate.",
    image: "/images/ppf/fortuner-2021-07-rear-gloss.jpg",
  },
  {
    id: "fortuner-08",
    title: "Front detail",
    description: "Headlamps and grille with deep gloss.",
    image: "/images/ppf/fortuner-2021-08-front-detail.jpg",
  },
  {
    id: "fortuner-09",
    title: "Rear — full view",
    description: "4x4 V badging and protected rear glass.",
    image: "/images/ppf/fortuner-2021-09-rear-full.jpg",
  },
  {
    id: "fortuner-10",
    title: "Rear quarter shine",
    description: "LED taillights and chrome FORTUNER strip.",
    image: "/images/ppf/fortuner-2021-10-rear-three-quarter.jpg",
  },
];

export const PPF_SHOWCASES: PpfShowcase[] = [
  {
    id: "corolla-cross",
    vehicle: "Toyota Corolla Cross",
    title: "Corolla Cross — Miracle PPF",
    summary:
      "This Corolla Cross was protected with USA-substrate Miracle ceramic coated PPF — self-healing, hydrophobic, and rock-chip resistant, with our full-service package including paint correction and interior detailing.",
    heroImage: "/images/ppf/corolla-cross-01-product-hero.jpg",
    filmBrand: PPF_FILM.shortName,
    warrantyNote: `${PPF_FILM.lifespan} · ${PPF_FILM.warranty}`,
    gallery: COROLLA_CROSS_GALLERY,
  },
  {
    id: "kia-sportage",
    vehicle: "KIA Sportage",
    title: "KIA Sportage — Miracle PPF",
    summary:
      "This Sportage was wrapped in Miracle ceramic coated PPF — USA substrate, self-healing and hydrophobic protection, plus our package with 2-step paint correction, three maintenance visits, and interior detailing.",
    heroImage: "/images/ppf/kia-sportage-06-miracle-hero.jpg",
    filmBrand: PPF_FILM.shortName,
    warrantyNote: `${PPF_FILM.lifespan} · ${PPF_FILM.warranty}`,
    gallery: KIA_SPORTAGE_GALLERY,
  },
  {
    id: "audi-a4",
    vehicle: "Audi A4",
    title: "Audi A4 — full body Miracle PPF",
    summary:
      "This A4 TFSI received full exterior protection with Miracle ceramic coated PPF — gloss retention, self-healing film, and invisible edges finished in the AutoVerse studio.",
    heroImage: "/images/ppf/audi-a4-04-rear-complete.jpg",
    filmBrand: PPF_FILM.name,
    warrantyNote: `${PPF_FILM.lifespan} · ${PPF_FILM.warranty}`,
    gallery: AUDI_A4_GALLERY,
  },
  {
    id: "mg-hs",
    vehicle: "MG HS",
    title: "MG HS — Miracle PPF protection",
    summary:
      "This black MG HS was protected with Miracle self-healing ceramic coated PPF — deep gloss on the body, professional wet install, and a delivery-ready cabin from AutoVerse.",
    heroImage: "/images/ppf/mg-hs-08-front-hero.jpg",
    filmBrand: PPF_FILM.name,
    warrantyNote: `${PPF_FILM.lifespan} · ${PPF_FILM.warranty}`,
    gallery: MG_HS_GALLERY,
  },
  {
    id: "fortuner-2021",
    vehicle: "Toyota Fortuner 2021",
    title: "Fortuner 2021 — Stealth PPF",
    summary:
      "This 2021 Fortuner was protected with Stealth ceramic coated PPF — scratch and rock-chip resistant, UV stable gloss, plus our bundle with 2-step paint correction, three maintenance visits, and interior detailing.",
    heroImage: "/images/ppf/fortuner-2021-01-stealth-hero.jpg",
    filmBrand: PPF_STEALTH_FILM.shortName,
    warrantyNote: PPF_STEALTH_FILM.warrantyCovers,
    gallery: FORTUNER_2021_GALLERY,
  },
  {
    id: "hilux-rocco-gr",
    vehicle: "Toyota Hilux Revo Rocco GR",
    title: "Rocco GR — Miracle PPF",
    summary:
      "This Hilux Revo Rocco GR Sport was protected with USA-substrate Miracle ceramic coated PPF — self-healing, hydrophobic, and rock-chip resistant, with 2-step paint correction, three maintenance visits, and interior detailing from AutoVerse.",
    heroImage: "/images/ppf/hilux-rocco-gr-01-miracle-hero.jpg",
    filmBrand: PPF_FILM.shortName,
    warrantyNote: `${PPF_FILM.lifespan} · ${PPF_FILM.warranty}`,
    gallery: HILUX_ROCCO_GR_GALLERY,
  },
];

/** @deprecated Use PPF_SHOWCASES — first showcase for backwards compatibility */
export const PPF_FEATURED_JOB = PPF_SHOWCASES[0];

export const PPF_GALLERY: PpfGalleryItem[] = PPF_SHOWCASES.flatMap(
  (s) => s.gallery
);

export const PPF_FAQ = [
  {
    q: "Which PPF brand does AutoVerse use?",
    a: `We install ${PPF_FILM.name} (${PPF_FILM.substrate.toLowerCase()}, self-healing; ${PPF_FILM.lifespan}; ${PPF_FILM.warranty}) and ${PPF_STEALTH_FILM.name} (ceramic coated gloss film). ${PPF_FILM.warrantyCovers}. ${PPF_STEALTH_FILM.warrantyCovers}.`,
  },
  {
    q: "How long does PPF last?",
    a: "Miracle PPF is rated for up to 8 years of service life with a 5-year warranty against bubbling, cracking, yellowing, and delamination. We explain aftercare and include maintenance visits with qualifying packages.",
  },
  {
    q: "Can PPF be removed without damaging paint?",
    a: "Yes — when installed and removed professionally, PPF is designed to come off without harming factory paint.",
  },
  {
    q: "Do you offer ceramic coating with PPF?",
    a: "Miracle film is already ceramic coated. Ask us about maintenance products and combo packages for extra gloss and easier washing.",
  },
] as const;
