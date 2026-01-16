export function getCookieValue(request: Request, name: string) {
  const header = request.headers.get("cookie");
  if (!header) return null;

  for (const part of header.split(";")) {
    const [rawKey, ...rest] = part.split("=");
    if (!rawKey) continue;
    const key = rawKey.trim();
    if (key === name) {
      return decodeURIComponent(rest.join("=").trim());
    }
  }
  return null;
}
