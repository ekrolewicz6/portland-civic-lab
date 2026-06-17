import type { Member } from "@/lib/membership";

interface UserLike {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
}

export interface HeaderMember {
  name: string;
  email: string;
  initials: string;
  role: string;
  avatarUrl?: string | null;
}

function initialsFor(name: string, email: string): string {
  const parts = name
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const letters =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0]?.slice(0, 2) || email.slice(0, 2);
  return letters.toUpperCase();
}

export function toHeaderMember(user: UserLike, member?: Member | null): HeaderMember {
  const first = member?.first_name ?? user.firstName ?? null;
  const last = member?.last_name ?? user.lastName ?? null;
  const name = [first, last].filter(Boolean).join(" ") || user.email;
  return {
    name,
    email: user.email,
    initials: initialsFor(name, user.email),
    role: member?.role ?? "member",
    avatarUrl: member?.avatar_url ?? user.profilePictureUrl ?? null,
  };
}

