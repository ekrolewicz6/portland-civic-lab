import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Support Portland Civic Lab — keep the public tools free";

export default function Image() {
  return ogImage({
      eyebrow: "Support the Lab",
      headline: "Keep Portland's civic tools free",
      description: "Every dashboard, deep-dive, and atlas is free — no paywall, no account, no charge. Supporters keep it that way and fund what's next."
    });
}
