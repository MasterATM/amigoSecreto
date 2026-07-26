#!/usr/bin/env bash
set -euo pipefail
export CONTAINERS_CONF=/dev/null

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)

WORKDIR="$(pwd)"
CONTAINER="sandcastle-amigosecreto"

# Remove existing container to allow recreation
podman rm -f "$CONTAINER" &>/dev/null || true

# Create and start container with workspace mount
podman run \
  --name "$CONTAINER" \
  --entrypoint /bin/bash \
  -v "$WORKDIR:/home/agent/workspace" \
  -w /home/agent \
  -d \
  localhost/sandcastle:amigosecreto \
  -c 'sleep infinity'

# Inject pi config files directly into container (no disk writes)
podman exec "$CONTAINER" sh -c "mkdir -p /home/agent/.pi/agent/extensions"
sed "s|\${OPENAI_BASE_URL}|${OPENAI_BASE_URL}|g; s|\${OPENAI_API_KEY}|${OPENAI_API_KEY}|g" \
  "$SCRIPT_DIR/pi-config/models.json" \
  | podman exec -i "$CONTAINER" sh -c "cat > /home/agent/.pi/agent/models.json"
podman cp "$SCRIPT_DIR/pi-config/settings.json" "$CONTAINER:/home/agent/.pi/agent/settings.json"
podman cp "$SCRIPT_DIR/pi-config/search.json" "$CONTAINER:/home/agent/.pi/agent/extensions/search.json"

# Exec into container
podman exec -it "$CONTAINER" bash
