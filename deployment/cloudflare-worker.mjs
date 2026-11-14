export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      if (!env.API_ORIGIN) return new Response('Backend is not configured', { status: 503 });
      const origin = new URL(env.API_ORIGIN);
      if (origin.protocol !== 'https:') return new Response('Invalid backend configuration', { status: 503 });
      const target = new URL(url.pathname + url.search, origin.origin);
      const forwarded = new Request(target, request);
      forwarded.headers.delete('host');
      // Preserve HTTP-only session cookies on the frontend's origin.
      return fetch(forwarded, { redirect: 'manual' });
    }
    return env.ASSETS.fetch(request);
  },
};
