import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import * as sandcastle from "@ai-hero/sandcastle";
import { podman } from "@ai-hero/sandcastle/sandboxes/podman";

// ---------------------------------------------------------------------------
// Sandcastle configuration — all custom overrides live here
// ---------------------------------------------------------------------------

const PROVIDER = "omlx";
const MODEL = "Qwen3.6-35B-A3B-8bit";

config({ path: resolve(import.meta.dirname, ".env") });

function readPiConfig(name: string): string {
  return readFileSync(resolve(import.meta.dirname, `pi-config/${name}`), "utf-8");
}

function substituteEnvVars(json: string): string {
  return json.replace(/\$\{([^}]+)}/g, (_match, varName) => {
    return process.env[varName] ?? _match;
  });
}

const PI_MODELS = substituteEnvVars(readPiConfig("models.json"));
const PI_SETTINGS = readPiConfig("settings.json");
const PI_SEARCH = readPiConfig("search.json");

// Install our settings.json, models and search config into the pi agent inside the container.
const piHook = {
  command: `mkdir -p /home/agent/.pi/agent && \
    printf '%s' '${PI_MODELS}' > /home/agent/.pi/agent/models.json && \
    printf '%s' '${PI_SETTINGS}' > /home/agent/.pi/agent/settings.json && \
    mkdir -p /home/agent/.pi/agent/extensions && \
    printf '%s' '${PI_SEARCH}' > /home/agent/.pi/agent/extensions/search.json`,
  sudo: false,
};

const uid = process.getuid ? process.getuid() : 1000;
const gid = process.getgid ? process.getgid() : 1000;

// ---------------------------------------------------------------------------
// Public API — the orchestrator consumes these only
// ---------------------------------------------------------------------------



/** Hooks — includes the pi config injection hook + npm install. */
export function hooks() {
  return {
    sandbox: {
      onSandboxReady: [piHook, { command: "npm install" }],
    },
  };
}

/** Copy node_modules from host into worktree. */
export const copyToWorktree = ["node_modules"];

/** Max iterations for the outer loop. */
export const MAX_ITERATIONS = 10;

// ---------------------------------------------------------------------------
// Helpers — consumed by main.ts
// ---------------------------------------------------------------------------

/** Sandbox factory — returns the ready-to-use sandbox config. */
export function createSandbox() {
  return podman({ containerUid: uid, containerGid: gid });
}

/** Agent factory — returns a `sandcastle.pi()` agent config. */
export function createAgentWithHighThinkingLevel() {
  return sandcastle.pi(`${PROVIDER}/${MODEL}`, {thinking: "xhigh"});
}

export function createAgent() {
  return sandcastle.pi(`${PROVIDER}/${MODEL}`, {thinking: "medium"});
}
