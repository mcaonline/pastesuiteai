// Cloudflare Worker: STT Phrases Telemetry Endpoint
// Receives user-submitted STT retry phrase tables and stores them in KV.
// No authentication. No public read access. Manual review only.

const MAX_BODY_BYTES = 50 * 1024; // 50 KB
const MAX_PHRASES = 100;
const MAX_PHRASE_LEN = 200;
const MAX_LANGUAGE_LEN = 10;
const MAX_VERSION_LEN = 20;
const MAX_ADDED_LEN = 10;
const KV_TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function validate(data) {
  if (!data || typeof data !== "object") return "Invalid JSON";

  if (typeof data.language !== "string" || data.language.length === 0 || data.language.length > MAX_LANGUAGE_LEN)
    return "Invalid language";

  if (typeof data.app_version !== "string" || data.app_version.length === 0 || data.app_version.length > MAX_VERSION_LEN)
    return "Invalid app_version";

  if (!Array.isArray(data.phrases) || data.phrases.length === 0 || data.phrases.length > MAX_PHRASES)
    return "Invalid phrases array (1-" + MAX_PHRASES + " entries required)";

  for (let i = 0; i < data.phrases.length; i++) {
    const p = data.phrases[i];
    if (!p || typeof p.phrase !== "string" || p.phrase.length === 0 || p.phrase.length > MAX_PHRASE_LEN)
      return "Invalid phrase at index " + i;
    if (typeof p.added !== "string" || p.added.length > MAX_ADDED_LEN)
      return "Invalid added date at index " + i;
  }

  return null; // valid
}

function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    // Size check
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_BODY_BYTES) {
      return jsonResponse({ error: "Payload too large" }, 413);
    }

    let data;
    try {
      const text = await request.text();
      if (text.length > MAX_BODY_BYTES) {
        return jsonResponse({ error: "Payload too large" }, 413);
      }
      data = JSON.parse(text);
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }

    const validationError = validate(data);
    if (validationError) {
      return jsonResponse({ error: validationError }, 400);
    }

    // Store in KV
    const now = Date.now();
    const key = `${data.language}_${now}_${randomHex(4)}`;
    const metadata = {
      language: data.language,
      app_version: data.app_version,
      phrase_count: data.phrases.length,
      received_at: new Date(now).toISOString(),
    };

    try {
      await env.STT_PHRASES.put(key, JSON.stringify(data), {
        expirationTtl: KV_TTL_SECONDS,
        metadata,
      });
    } catch {
      return jsonResponse({ error: "Internal error" }, 500);
    }

    return jsonResponse({ ok: true });
  },
};
