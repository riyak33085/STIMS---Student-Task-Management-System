/**
 * app.js
 * Minimal hash-based router. Matches the current location.hash against a
 * small list of route patterns and renders + mounts the matching view.
 * No external router library is used so the project runs with zero
 * build step — open index.html, or serve the folder, and it works.
 */

const routes = [
  { pattern: /^#\/$/, view: "landing", route: "landing" },
  { pattern: /^#\/dashboard$/, view: "dashboard", route: "dashboard" },
  { pattern: /^#\/task\/([\w-]+)$/, view: "task", route: "task" },
];

function parseRoute(hash) {
  for (const r of routes) {
    const match = hash.match(r.pattern);
    if (match) {
      return { view: r.view, route: r.route, params: { id: match[1] } };
    }
  }
  return { view: "landing", route: "landing", params: {} };
}

function setActiveNav(route) {
  document.querySelectorAll("#topnav a").forEach((a) => {
    const isActive =
      (route === "dashboard" && a.dataset.route === "dashboard") ||
      (route === "landing" && a.dataset.route === "landing") ||
      (route === "task" && a.dataset.route === "dashboard");
    a.classList.toggle("is-active", isActive);
  });
}

function renderApp() {
  const hash = window.location.hash || "#/";
  const { view, route, params } = parseRoute(hash);
  const target = document.getElementById("app");

  target.classList.add("is-fading");
  target.innerHTML = Views[view].render(params);
  Views[view].mount(params);
  setActiveNav(route);

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  requestAnimationFrame(() => target.classList.remove("is-fading"));
}

window.addEventListener("hashchange", renderApp);
window.addEventListener("DOMContentLoaded", renderApp);
