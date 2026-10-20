/** Sold & delivered customer photos (showroom handovers). */
export type SoldDelivery = {
  id: string;
  /** Full car name shown under the photo */
  name: string;
  /** Model / variant line */
  model: string;
  year: number;
  image: string;
  feedback: string;
};

export const SOLD_DELIVERIES: SoldDelivery[] = [
  {
    id: "pixis-2021",
    name: "Toyota Pixis",
    model: "Pixis",
    year: 2021,
    image: "/images/sold-deliveries/01-toyota-pixis-2021.jpg",
    feedback: "Alhamdulillah — sold & delivered by AutoVerse.",
  },
  {
    id: "mira-2012",
    name: "Daihatsu Mira",
    model: "Mira",
    year: 2012,
    image: "/images/sold-deliveries/02-daihatsu-mira-2012.jpg",
    feedback: "Another happy delivery from AutoVerse.",
  },
  {
    id: "alto-vxr-2021",
    name: "Suzuki Alto VXR",
    model: "Alto VXR",
    year: 2021,
    image: "/images/sold-deliveries/03-suzuki-alto-vxr-2021.jpg",
    feedback: "Smooth handover — congrats to our customer!",
  },
  {
    id: "altis-se-2022",
    name: "Toyota Corolla Altis Special Edition",
    model: "Corolla Altis Special Edition",
    year: 2022,
    image: "/images/sold-deliveries/04-toyota-altis-special-2022.jpg",
    feedback: "Sold out — premium Altis delivered.",
  },
  {
    id: "cultus-2021",
    name: "Suzuki Cultus VXL AGS",
    model: "Cultus VXL AGS",
    year: 2021,
    image: "/images/sold-deliveries/05-suzuki-cultus-vxl-2021.jpg",
    feedback: "Delivered with AutoVerse ceremonial handover.",
  },
  {
    id: "alto-ags-2019",
    name: "Suzuki Alto AGS",
    model: "Alto AGS",
    year: 2019,
    image: "/images/sold-deliveries/06-suzuki-alto-ags-2019.jpg",
    feedback: "Trusted city car — sold by AutoVerse.",
  },
  {
    id: "swift-glx-2025-promo",
    name: "Suzuki Swift GLX",
    model: "Swift GLX",
    year: 2025,
    image: "/images/sold-deliveries/07-suzuki-swift-glx-2025.jpg",
    feedback: "Latest Swift GLX — sold out at AutoVerse.",
  },
  {
    id: "yaris-2020",
    name: "Toyota Yaris 1500 ATIV",
    model: "Yaris 1500 ATIV",
    year: 2020,
    image: "/images/sold-deliveries/08-toyota-yaris-2020.jpg",
    feedback: "Congrats on your new Yaris!",
  },
  {
    id: "sportage-2020",
    name: "Kia Sportage AWD",
    model: "Sportage AWD",
    year: 2020,
    image: "/images/sold-deliveries/09-kia-sportage-awd-2020.jpg",
    feedback: "AWD Sportage delivered — thank you for choosing AutoVerse.",
  },
  {
    id: "swift-glx-2025-delivery",
    name: "Suzuki Swift GLX",
    model: "Swift GLX",
    year: 2025,
    image: "/images/sold-deliveries/10-suzuki-swift-glx-2025-delivery.jpg",
    feedback: "Keys handed over — another Swift GLX sold.",
  },
  {
    id: "swift-glx-2026",
    name: "Suzuki Swift GLX",
    model: "Swift GLX",
    year: 2026,
    image: "/images/sold-deliveries/11-suzuki-swift-glx-2026.jpg",
    feedback: "Brand new Swift — delivered by AutoVerse.",
  },
  {
    id: "yaris-2021",
    name: "Toyota Yaris 1500",
    model: "Yaris 1500",
    year: 2021,
    image: "/images/sold-deliveries/12-toyota-yaris-2021.jpg",
    feedback: "Yaris 2021 sold out — happy customer.",
  },
  {
    id: "corolla-grande-2021",
    name: "Toyota Corolla Grande",
    model: "Corolla Grande",
    year: 2021,
    image: "/images/sold-deliveries/13-toyota-corolla-grande-2021.jpg",
    feedback: "Corolla Grande delivery — Alhamdulillah.",
  },
];
