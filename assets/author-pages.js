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
    const seoTitle = document.body.dataset[lang + "Title"] + " — Victoria Sidney";
    document.title = seoTitle;
    const seoDescription = document.body.dataset[lang + "Description"] || document.querySelector('meta[name="description"]')?.content || "";
    const currentPath = location.pathname.endsWith("/index.html") ? location.pathname.slice(0, -10) : location.pathname;
    const canonicalUrl = location.origin + currentPath + "?lang=" + lang;
    const setMeta = (selector, attrs) => { let el = document.querySelector(selector); if (!el) { el = document.createElement("meta"); document.head.appendChild(el); } Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value)); };
    const setLink = (selector, attrs) => { let el = document.querySelector(selector); if (!el) { el = document.createElement("link"); document.head.appendChild(el); } Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value)); };
    setMeta('meta[name="description"]', {name:"description", content:seoDescription});
    setMeta('meta[property="og:type"]', {property:"og:type", content:"website"});
    setMeta('meta[property="og:site_name"]', {property:"og:site_name", content:"Victoria Sidney"});
    setMeta('meta[property="og:title"]', {property:"og:title", content:seoTitle});
    setMeta('meta[property="og:description"]', {property:"og:description", content:seoDescription});
    setMeta('meta[property="og:url"]', {property:"og:url", content:canonicalUrl});
    setMeta('meta[property="og:image"]', {property:"og:image", content:"https://victoria-sidney.github.io/assets/hero.jpg"});
    setMeta('meta[property="og:image:alt"]', {property:"og:image:alt", content:"Victoria Sidney author website"});
    setMeta('meta[property="og:locale"]', {property:"og:locale", content:lang === "uk" ? "uk_UA" : "en_US"});
    setMeta('meta[name="twitter:card"]', {name:"twitter:card", content:"summary_large_image"});
    setMeta('meta[name="twitter:title"]', {name:"twitter:title", content:seoTitle});
    setMeta('meta[name="twitter:description"]', {name:"twitter:description", content:seoDescription});
    setLink('link[data-seo="canonical"]', {rel:"canonical", href:canonicalUrl, "data-seo":"canonical"});
    for (const language of ["uk", "en"]) setLink('link[data-seo="alternate"][hreflang="' + language + '"]', {rel:"alternate", hreflang:language, href:location.origin + currentPath + "?lang=" + language, "data-seo":"alternate"});
    button.textContent = "УКР / ENG";
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