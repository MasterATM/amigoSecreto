import { config } from "dotenv";
import { resolve } from "node:path";
import process from "node:process";
import * as sandcastle from "@ai-hero/sandcastle";
import { podman } from "@ai-hero/sandcastle/sandboxes/podman";

// ---------------------------------------------------------------------------
// Sandcastle configuration — all custom overrides live here
// ---------------------------------------------------------------------------

const PROVIDER = "ollama";
const MODEL = "Qwen3.6-35B-A3B-8bit";

config({ path: resolve(import.meta.dirname, ".env") });

const PI_MODELS = JSON.stringify({
  providers: {
    ollama: {
      baseUrl: process.env.OPENAI_BASE_URL,
      api: "openai-completions",
      apiKey: process.env.OPENAI_API_KEY,
      models: [{ id: MODEL }],
    },
  },
});

const PI_SETTINGS = JSON.stringify({
  defaultProvider: PROVIDER,
  defaultModel: MODEL,
  defaultThinkingLevel: "medium",
  hideThinkingBlock: false,
  compaction: {
    enabled: true,
    contextWindow: 100_000,
    reserveTokens: 40_000,
    keepRecentTokens: 20_000,
  },
});

// Install our settings.json and models into the pi agent inside the container.
const piHook = {
  command: `mkdir -p /home/agent/.pi/agent && \
    printf '%s' '${PI_MODELS}' > /home/agent/.pi/agent/models.json && \
    printf '%s' '${PI_SETTINGS}' > /home/agent/.pi/agent/settings.json`,
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
