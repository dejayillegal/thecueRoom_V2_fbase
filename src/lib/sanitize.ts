
export function normalizeUrl(u?: string | null): string | null {
  if (!u) return null;
  const s = u.trim();
  if (!s) return null;
  // reject data:, javascript:, about:blank, etc.
  if (!/^https?:\/\//i.test(s) && !s.startsWith("//")) return null;
  return s;
}

export function coerceImage<T extends { image?: string | null }>(o: T): T {
  const image = normalizeUrl(o.image);
  return { ...o, image };
}
