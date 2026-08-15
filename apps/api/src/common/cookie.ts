export function readCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const entry of cookieHeader.split(';')) {
    const [key, ...valueParts] = entry.trim().split('=');
    if (key === name) return decodeURIComponent(valueParts.join('='));
  }
  return undefined;
}
