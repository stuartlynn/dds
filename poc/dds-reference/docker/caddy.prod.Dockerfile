# Caddy front door with the Caddyfile baked in.
# Avoids bind-mounting the config, which breaks under Coolify (host-path resolution
# differs from vanilla docker compose and yields a "mount dir onto file" error).
FROM caddy:2-alpine
COPY docker/Caddyfile /etc/caddy/Caddyfile
