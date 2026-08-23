"use client";

import { useEffect, useState, type AnchorHTMLAttributes } from "react";

/**
 * External link to another Civic Lab app on a different registrable domain
 * (Portland Permits). Cookies can't cross domains, so when the visitor is
 * signed in here we append an `sso=1` hint — the destination app sees it and
 * immediately attempts the WorkOS redirect, signing the visitor in without a
 * password. Anonymous visitors get the plain URL and are never bounced
 * through the identity provider.
 */

let signedInPromise: Promise<boolean> | null = null;

function fetchSignedIn(): Promise<boolean> {
  signedInPromise ??= fetch("/api/member/me", { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { signedIn?: boolean } | null) => Boolean(data?.signedIn))
    .catch(() => false);
  return signedInPromise;
}

export function withSsoHint(url: string): string {
  return url + (url.includes("?") ? "&" : "?") + "sso=1";
}

type SsoLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function SsoLink({ href, children, ...rest }: SsoLinkProps) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    fetchSignedIn().then((value) => {
      if (active) setSignedIn(value);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <a href={signedIn ? withSsoHint(href) : href} {...rest}>
      {children}
    </a>
  );
}
