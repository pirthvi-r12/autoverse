import { SITE } from "./constants";
import { PPF_BOOKING } from "./ppf-services";

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function inspectionWhatsAppMessage(params: {
  carName?: string;
  packageName?: string;
}): string {
  const { carName, packageName } = params;
  let msg = `Hi ${SITE.name}, I would like to book a car inspection.`;
  if (carName) msg += `\nCar: ${carName}`;
  if (packageName) msg += `\nPackage: ${packageName}`;
  msg += `\nCity: ${SITE.city}`;
  return msg;
}

export function ppfWhatsAppMessage(params: {
  packageName?: string;
  carModel?: string;
}): string {
  const { packageName, carModel } = params;
  let msg = `Hi ${SITE.name}, I would like to enquire about PPF (Paint Protection Film).`;
  if (carModel) msg += `\nCar: ${carModel}`;
  if (packageName) msg += `\nPackage: ${packageName}`;
  msg += `\nLocation: ${PPF_BOOKING.location}`;
  return msg;
}

export function ppfWhatsAppUrl(message: string): string {
  return `https://wa.me/${PPF_BOOKING.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function ceramicCoatingWhatsAppMessage(params: {
  carModel?: string;
}): string {
  const { carModel } = params;
  let msg = `Hi ${SITE.name}, I would like to book ceramic coating / detailing.`;
  if (carModel) msg += `\nCar: ${carModel}`;
  msg += `\nLocation: D.H.A Phase 2 Ext, Karachi`;
  return msg;
}

export function ceramicCoatingWhatsAppUrl(message: string): string {
  return `https://wa.me/${PPF_BOOKING.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function carInquiryMessage(car: {
  name: string;
  slug: string;
}): string {
  return `Hi ${SITE.name}, I'm interested in ${car.name}.\n${SITE.url}/cars/${car.slug}`;
}
