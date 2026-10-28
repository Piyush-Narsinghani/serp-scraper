// Cloudflare Worker relay for the SERP scraper page.
// Forwards GET requests to serpapi.com only and adds CORS headers so the GitHub Pages site can read the reply.
// It stores nothing; the API key travels inside the forwarded URL exactly as the page sends it.
const ALLOWED_HOSTS = ["serpapi.com"];
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const target = new URL(request.url).searchParams.get("url");
    let u;
    try { u = new URL(target); } catch { return new Response("missing or bad ?url=", { status: 400, headers: CORS }); }
    if (u.protocol !== "https:" || !ALLOWED_HOSTS.includes(u.hostname)) return new Response("host not allowed", { status: 403, headers: CORS });
    const upstream = await fetch(u.toString(), { headers: { "Accept": "application/json" } });
    const body = await upstream.arrayBuffer();
    return new Response(body, { status: upstream.status, headers: { ...CORS, "Content-Type": upstream.headers.get("Content-Type") || "application/json" } });
  },
};
