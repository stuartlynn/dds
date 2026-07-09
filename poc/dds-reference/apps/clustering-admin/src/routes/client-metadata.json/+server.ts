import { json, type RequestHandler } from "@sveltejs/kit";
import { base } from "$app/paths";

/**
 * Serves the atproto OAuth client metadata document for production sign-in.
 *
 * The document is generated dynamically from the incoming request origin so that
 * `client_id` exactly matches the URL Bluesky fetches this from, and the redirect URI
 * shares that origin. This means the same build works for any deployed hostname without
 * baking a URL in at build time (behind Caddy, `url.origin` reflects the public origin
 * because the prod compose sets `ORIGIN` / `PROTOCOL_HEADER` / `HOST_HEADER`).
 *
 * In local development the app uses the RFC 8252 loopback client instead (see
 * `$lib/auth.svelte`), so this endpoint is only consumed in production.
 */
export const prerender = false;

export const GET: RequestHandler = ({ url }) => {
  const appBase = `${url.origin}${base}`;
  return json(
    {
      client_id: `${appBase}/client-metadata.json`,
      client_name: "DDS Clustering Admin",
      client_uri: appBase,
      redirect_uris: [`${appBase}/oauth/callback`],
      scope: "atproto transition:generic",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      application_type: "web",
      dpop_bound_access_tokens: true,
    },
    { headers: { "cache-control": "max-age=300" } },
  );
};
