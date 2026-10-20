import { SITE } from "./constants";

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

export function carInquiryMessage(car: {
  name: string;
  slug: string;
}): string {
  return `Hi ${SITE.name}, I'm interested in ${car.name}.\n${SITE.url}/cars/${car.slug}`;
}
