export function buildCarSlug(
  brand: string,
  model: string,
  year: number,
  id: string
): string {
  const base = `${brand}-${model}-${year}-${id}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base.slice(0, 120);
}

export function parseCarSlug(slug: string): { idHint: string } {
  const parts = slug.split("-");
  const idHint = parts[parts.length - 1] ?? slug;
  return { idHint };
}
