"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  ["Portfolio", "/ced"],
  ["Initiatives", "/ced/initiatives"],
  ["Decisions", "/ced/decisions"],
  ["Timeline", "/ced/timeline"],
  ["Dependencies", "/ced/dependencies"],
  ["Money", "/ced/money"],
  ["Outcomes", "/ced/outcomes"],
  ["Oversight", "/ced/oversight"],
  ["Changes", "/ced/changes"],
];
export default function CedNav() {
  const path = usePathname();
  return (
    <nav aria-label="CED portfolio" className="ced-nav">
      {links.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          aria-current={
            path === href ||
            (href === "/ced/initiatives" && path.startsWith(href + "/"))
              ? "page"
              : undefined
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
