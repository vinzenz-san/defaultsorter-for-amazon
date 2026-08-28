import { mkdirSync, cpSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseManifest = JSON.parse(readFileSync(path.join(rootDir, "manifest.json"), "utf8"));

// manifest.json (source of truth) is Firefox's shape: background.scripts (array, includes the
// polyfill) + browser_specific_settings. Chrome's MV3 wants a single background.service_worker
// file and rejects the Firefox-only gecko key, so this derives the Chrome variant instead of
// hand-maintaining two manifests. background.js itself loads the polyfill via importScripts()
// when it detects it's running as a Chrome service worker (see top of background.js).
export function manifestFor(target) {
  const manifest = structuredClone(baseManifest);
  if (target === "chrome") {
    delete manifest.browser_specific_settings;
    manifest.background = { service_worker: "background.js" };
  }
  return manifest;
}

const FILES = ["browser-polyfill.min.js", "background.js", "popup.html", "popup.js"];
const DIRS = ["icons", "_locales"];

// Assembles a self-contained, "Load unpacked"-ready extension folder for
// `target` ("firefox" | "chrome") at outDir.
export function stageTarget(target, outDir) {
  mkdirSync(outDir, { recursive: true });
  for (const file of FILES) {
    cpSync(path.join(rootDir, file), path.join(outDir, file));
  }
  for (const dir of DIRS) {
    cpSync(path.join(rootDir, dir), path.join(outDir, dir), { recursive: true });
  }
  writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifestFor(target), null, 2));
}
