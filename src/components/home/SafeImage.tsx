"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image with a fallback: if the optimizer ever answers with an error
 * (a transient Vercel failure showed the alt text on the homepage once),
 * the tile re-renders with the original file instead of a broken frame.
 */
export default function SafeImage({ alt, ...props }: ImageProps) {
  const [raw, setRaw] = useState(false);
  return <Image {...props} alt={alt} unoptimized={raw || props.unoptimized} onError={() => setRaw(true)} />;
}
