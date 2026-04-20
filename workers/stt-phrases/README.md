# STT Phrases Telemetry Worker

Cloudflare Worker that receives user-submitted STT retry phrases from PasteSuiteAI.

## Setup

1. Install Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Create KV namespace: `wrangler kv namespace create STT_PHRASES`
4. Copy the namespace ID into `wrangler.toml`
5. Deploy: `wrangler deploy`
6. Route `pastesuiteai.com/api/stt-phrases` to this worker in Cloudflare DNS/Routes

## Reviewing Submissions

In Cloudflare Dashboard > Workers & Pages > KV > STT_PHRASES:
- Each entry has metadata (language, app_version, phrase_count, received_at)
- Click an entry to see the full phrase list
- Entries auto-expire after 90 days

## Adding Reviewed Phrases to the App

Good phrases go into `RESPONSE_HALLUCINATION_PHRASES` in
`frontend/src-tauri/src/domain/constants.rs` for the next release.
