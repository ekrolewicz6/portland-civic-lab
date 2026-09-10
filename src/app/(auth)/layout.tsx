import BrandMark from "@/components/BrandMark";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      {/* Minimal header */}
      <header className="bg-[var(--color-canopy)] text-white">
        <div className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center h-14">
            <Link href="/" className="flex items-center gap-3 group">
              <BrandMark className="h-8 w-8" />
              <span className="font-editorial-normal text-[17px] tracking-tight leading-none">
                Portland Civic Lab
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-5 py-12">
        {children}
      </main>
    </div>
  );
}
