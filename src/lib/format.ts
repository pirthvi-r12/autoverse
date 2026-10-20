export function formatPrice(pkr: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(pkr);
}

export function formatKm(km: number): string {
  return `${km.toLocaleString()} km`;
}
