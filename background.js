// Chrome lädt background.js als einzelnen MV3-Service-Worker (kein scripts-Array wie bei Firefox),
// daher hier selbst das Polyfill nachladen. In Firefox ist `browser` bereits nativ vorhanden und
// browser-polyfill.min.js schon über manifest.json eingebunden — dieser Aufruf ist dort ein No-Op.
if (typeof browser === "undefined" && typeof importScripts === "function") {
  importScripts("browser-polyfill.min.js");
}

// Erzwingt eine gewählte Standardsortierung bei Amazon-Suchen, bevor die Seite lädt.
//
// Zwei Mechanismen, weil Amazon Suchen auf zwei verschiedenen Wegen ausliefert:
// 1. "Harte" Navigation (URL eingeben, Link folgen, normaler Formular-Submit) → echter
//    main_frame-Request, den declarativeNetRequest vor dem Laden umschreiben kann.
// 2. "Weiche" Navigation (z.B. Klick auf einen Autocomplete-Vorschlag): Amazon rendert das
//    Ergebnis per JS und ändert die Adressleiste nur per history.pushState — es gibt dabei
//    KEINEN neuen Netzwerk-Request, den declarativeNetRequest sehen könnte. Dafür dient
//    webNavigation.onHistoryStateUpdated als Fallback: es erkennt genau diese URL-Änderungen
//    und erzwingt dann gezielt einen echten Reload mit gesetztem Sortier-Parameter.
//
// Die Sortier-Keys (siehe SORT_OPTIONS) sind interne Amazon-API-Werte, keine lokalisierten
// UI-Strings — gegen amazon.de/.com/.co.uk/.fr live verifiziert identisch, daher hier für
// alle TLDs wiederverwendet.
const AMAZON_TLDS = [
  "de", "com", "co.uk", "fr", "it", "es", "nl", "pl", "se",
  "com.be", "ie", "ca", "com.mx", "com.br", "co.jp", "in",
  "sg", "com.au", "ae", "sa", "com.tr", "co.za", "eg",
];
const AMAZON_HOSTS = new Set(AMAZON_TLDS.map((tld) => `www.amazon.${tld}`));
const DOMAIN_ALTERNATION = AMAZON_TLDS.map((tld) => tld.replace(/\./g, "\\.")).join("|");
const SORT_PARAM = "s";

// "default" heißt: keine Regel aktiv, Amazons normale "Empfohlen"-Sortierung bleibt unangetastet.
const DEFAULT_SORT = "default";
const SORT_OPTIONS = {
  default: null,
  bestseller: "exact-aware-popularity-rank",
  price_asc: "price-asc-rank",
  price_desc: "price-desc-rank",
  rating: "review-rank",
  newest: "date-desc-rank",
};

const ALLOW_RULE_ID = 1;
const REDIRECT_RULE_ID = 2;

function buildAllowRule() {
  return {
    id: ALLOW_RULE_ID,
    priority: 2,
    action: { type: "allow" },
    condition: {
      regexFilter: `^https://www\\.amazon\\.(${DOMAIN_ALTERNATION})/s\\?.*[?&]s=`,
      resourceTypes: ["main_frame"],
    },
  };
}

function buildRedirectRule(sortValue) {
  return {
    id: REDIRECT_RULE_ID,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        regexSubstitution: `https://www.amazon.\\1/s?\\2&${SORT_PARAM}=${sortValue}`,
      },
    },
    condition: {
      regexFilter: `^https://www\\.amazon\\.(${DOMAIN_ALTERNATION})/s\\?(.*k=.*)$`,
      resourceTypes: ["main_frame"],
    },
  };
}

async function updateRules(sortKey) {
  const sortValue = SORT_OPTIONS[sortKey];
  const existing = await browser.declarativeNetRequest.getDynamicRules();
  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((rule) => rule.id),
    addRules: sortValue ? [buildAllowRule(), buildRedirectRule(sortValue)] : [],
  });
}

// Fallback für weiche (SPA-artige) Navigationen, die declarativeNetRequest nie zu sehen bekommt.
browser.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  if (details.frameId !== 0) return; // nur Top-Level-Frame, keine iframes

  const { sortKey } = await browser.storage.local.get({ sortKey: DEFAULT_SORT });
  const sortValue = SORT_OPTIONS[sortKey];
  if (!sortValue) return;

  let url;
  try {
    url = new URL(details.url);
  } catch {
    return;
  }
  if (!AMAZON_HOSTS.has(url.hostname)) return;
  if (url.pathname !== "/s") return;
  if (!url.searchParams.has("k")) return;
  if (url.searchParams.has(SORT_PARAM)) return;

  url.searchParams.set(SORT_PARAM, sortValue);
  browser.tabs.update(details.tabId, { url: url.toString() }).catch((err) => {
    console.error("Amazon Sortierung: tabs.update fehlgeschlagen", err);
  });
});

async function init() {
  const { sortKey } = await browser.storage.local.get({ sortKey: DEFAULT_SORT });
  await updateRules(sortKey);
}

browser.runtime.onInstalled.addListener(async () => {
  // Migration von der alten Checkbox-Version (Schlüssel "enabled": boolean).
  const stored = await browser.storage.local.get({ enabled: undefined, sortKey: undefined });
  if (stored.sortKey === undefined) {
    const migrated = stored.enabled === false ? DEFAULT_SORT : "bestseller";
    await browser.storage.local.set({ sortKey: migrated });
    await browser.storage.local.remove("enabled");
  }
  await init();
});

browser.runtime.onStartup.addListener(init);

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.sortKey) {
    updateRules(changes.sortKey.newValue);
  }
});

init();
