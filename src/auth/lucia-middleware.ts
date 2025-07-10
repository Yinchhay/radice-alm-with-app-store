// Minimal helpers for session extraction in middleware (no DB, no Node.js APIs)
export function readBearerToken(header: string | null | undefined): string | null {
  if (!header) return null;
  const match = header.match(/^Bearer (.+)$/);
  return match ? match[1] : null;
}

export function readSessionCookie(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/auth_session=([^;]+)/);
  return match ? match[1] : null;
} 