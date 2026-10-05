"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { initiatives } from "@/lib/ced/model";
export default function LegacyRedirect() {
  const router = useRouter();
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    router.replace(initiatives.has(id) ? `/ced/initiatives/${id}` : "/ced");
  }, [router]);
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">CED Portfolio Map</h1>
      <p className="mt-4">
        The CED portfolio has moved.{" "}
        <Link href="/ced" className="underline">
          Open the portfolio map →
        </Link>
      </p>
    </div>
  );
}
