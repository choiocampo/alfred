/**
 * Theme: respects prefers-color-scheme until the user explicitly toggles;
 * then preference is persisted in localStorage (non-obvious UX choice).
 */
const THEME_KEY = "ao-theme";

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function setStoredTheme(value) {
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {
    /* ignore quota / private mode */
  }
}

function effectiveThemeIsDark() {
  const root = document.documentElement;
  const attr = root.getAttribute("data-theme");
  if (attr === "dark") return true;
  if (attr === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function syncThemeToggleLabel() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;
  const isDark = effectiveThemeIsDark();
  btn.setAttribute("aria-pressed", String(isDark));
  btn.textContent = isDark ? "Light mode" : "Dark mode";
}

function initTheme() {
  const root = document.documentElement;
  const stored = getStoredTheme();
  if (stored === "dark" || stored === "light") {
    root.setAttribute("data-theme", stored);
  } else {
    root.removeAttribute("data-theme");
  }
  syncThemeToggleLabel();

  document
    .querySelector("[data-theme-toggle]")
    ?.addEventListener("click", () => {
      const next = effectiveThemeIsDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      setStoredTheme(next);
      syncThemeToggleLabel();
    });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!getStoredTheme()) {
        root.removeAttribute("data-theme");
        syncThemeToggleLabel();
      }
    });
}

/** Sticky nav: mobile drawer */
function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-mobile-nav]");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  panel.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

/** Scrollspy: highlight the section nearest the top of the viewport */
function initScrollSpy() {
  const nav = document.querySelector(".nav-main");
  if (!nav) return;
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  if (!links.length) return;

  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const update = () => {
    const y = window.scrollY + Math.min(160, window.innerHeight * 0.22);
    let currentId = sections[0]?.id;
    for (const section of sections) {
      if (section.offsetTop <= y) currentId = section.id;
    }
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${currentId}`;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/** Subtle section reveal */
function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  const els = [...document.querySelectorAll(".reveal")];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  els.forEach((el) => io.observe(el));
}

/**
 * Contact: opens default mail client. Set CONTACT_EMAIL when you have a
 * public address; until then the button stays disabled with a clear hint.
 */
const CONTACT_EMAIL = "choiocampobhe@gmail.com";

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const submit = form.querySelector('button[type="submit"]');
  if (submit) {
    if (!CONTACT_EMAIL) {
      submit.disabled = true;
      submit.setAttribute("aria-disabled", "true");
    } else {
      submit.disabled = false;
      submit.removeAttribute("aria-disabled");
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!CONTACT_EMAIL) return;

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const from = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const subject = encodeURIComponent(`Website inquiry from ${name || "visitor"}`);
    const body = encodeURIComponent(
      `${message}\n\n—\nFrom: ${name}\nReply-To: ${from}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initScrollSpy();
  initReveal();
  initContactForm();
});
