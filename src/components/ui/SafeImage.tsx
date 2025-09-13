
"use client";

import Image, { type ImageProps } from "next/image";

// Accept src possibly undefined/null/empty. Render fallback or nothing.
type Props = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;     // optional placeholder asset, e.g. "/images/placeholder.png"
  renderFallback?: () => JSX.Element | null; // custom fallback component
};

function isValidHttpUrl(url?: string | null) {
  if (!url) return false;
  const s = url.trim();
  if (!s) return false;
  try {
    const u = new URL(s, "http://_ignore_");
    // allow protocol-relative and absolute http(s)
    return /^https?:\/\//.test(u.protocol) || s.startsWith("//");
  } catch {
    return false;
  }
}

export default function SafeImage({
  src,
  fallbackSrc,
  renderFallback,
  alt,
  ...rest
}: Props) {
  const ok = isValidHttpUrl(src);
  if (!ok) {
    if (renderFallback) return renderFallback();
    if (fallbackSrc) return <Image alt={alt ?? ""} src={fallbackSrc} {...rest} />;
    return null; // don’t render anything if we truly have no image
  }
  // At this point src is non-empty and valid
  return <Image alt={alt ?? ""} src={src as string} {...rest} />;
}
