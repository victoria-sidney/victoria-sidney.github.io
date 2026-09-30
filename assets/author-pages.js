(() => {
  const supported = value => value === "en" || value === "uk";
  let saved;
  try { saved = localStorage.getItem("vs-lang"); } catch {}
  const requested = new URLSearchParams(location.search).get("lang");
  let lang = supported(requested) ? requested : supported(saved) ? saved : "uk";
  const button = document.querySelector("[data-language-toggle]");
  function setLanguage(next) {
    lang = next;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-content-lang]").forEach(node => {
      node.hidden = node.dataset.contentLang !== lang;
    });
    document.querySelectorAll("[data-uk][data-en]").forEach(node => {
      node.textContent = node.dataset[lang];
    });
    document.querySelectorAll("[data-page]").forEach(node => {
      node.href = node.dataset.page + "?lang=" + lang + (node.dataset.anchor || "");
    });
    document.title = document.body.dataset[lang + "Title"] + " — Victoria Sidney";
    button.textContent = lang === "uk" ? "UA" : "EN";
    button.setAttribute("aria-label", lang === "uk" ? "Switch to English" : "Перемкнути на українську");
    button.title = button.getAttribute("aria-label");
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
    try { localStorage.setItem("vs-lang", lang); } catch {}
  }
  button.addEventListener("click", () => setLanguage(lang === "uk" ? "en" : "uk"));
  setLanguage(lang);
})();