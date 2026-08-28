// Eigener Lade-Mechanismus statt reinem browser.i18n.getMessage(), weil browser.i18n fest an
// die Browser-Oberflächensprache gekoppelt ist und sich zur Laufzeit nicht überschreiben lässt.
// Für "Auto" nutzen wir trotzdem browser.i18n.getUILanguage() als Signal.
const messageCache = {};

async function loadMessages(lang) {
  if (messageCache[lang]) return messageCache[lang];
  const url = browser.runtime.getURL(`_locales/${lang}/messages.json`);
  const raw = await fetch(url).then((res) => res.json());
  const messages = {};
  for (const [key, entry] of Object.entries(raw)) messages[key] = entry.message;
  messageCache[lang] = messages;
  return messages;
}

function resolveLang(languagePref) {
  if (languagePref === "de" || languagePref === "en") return languagePref;
  return browser.i18n.getUILanguage().startsWith("de") ? "de" : "en";
}

async function applyLanguage(languagePref) {
  const lang = resolveLang(languagePref);
  const messages = await loadMessages(lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (messages[key]) el.textContent = messages[key];
  });
}

const sortSelect = document.getElementById("sort-select");
const languageSelect = document.getElementById("language-select");

browser.storage.local.get({ sortKey: "default", uiLanguage: "auto" }).then(({ sortKey, uiLanguage }) => {
  sortSelect.value = sortKey;
  languageSelect.value = uiLanguage;
  applyLanguage(uiLanguage);
});

sortSelect.addEventListener("change", () => {
  browser.storage.local.set({ sortKey: sortSelect.value });
});

languageSelect.addEventListener("change", () => {
  browser.storage.local.set({ uiLanguage: languageSelect.value });
  applyLanguage(languageSelect.value);
});
