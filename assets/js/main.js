/* ECCSA website — interactions (no dependencies) */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header shadow + back-to-top ---------- */
  const header = $(".header");
  const toTop = $(".to-top");
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 8);
    toTop && toTop.classList.toggle("is-visible", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop && toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Mobile drawer ---------- */
  const drawer = $(".drawer");
  const openBtn = $(".menu-toggle");
  let lastFocus = null;
  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    openBtn && openBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { lastFocus = document.activeElement; const c = $(".drawer__close", drawer); c && c.focus(); }
    else if (lastFocus) lastFocus.focus();
  };
  openBtn && openBtn.addEventListener("click", () => setDrawer(true));
  drawer && $$("[data-close]", drawer).forEach((el) => el.addEventListener("click", () => setDrawer(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) setDrawer(false); });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const end = parseFloat(el.dataset.count);
    if (reduceMotion) { el.textContent = end.toLocaleString(); return; }
    const dur = 1600; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.4 });
    counters.forEach((el) => cio.observe(el));
  } else counters.forEach(runCounter);

  /* ---------- Seamless tickers / marquees (duplicate content) ---------- */
  $$("[data-loop]").forEach((track) => { track.innerHTML += track.innerHTML; $$("a, img", track).slice(track.children.length / 2).forEach((n) => { n.setAttribute("aria-hidden", "true"); n.setAttribute("tabindex", "-1"); }); });

  /* ---------- Toast ---------- */
  let toastEl;
  const toast = (msg) => {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("is-visible");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove("is-visible"), 3600);
  };

  /* ---------- Newsletter (front-end only until a mailing service is connected) ---------- */
  $$("form[data-newsletter]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("input[type=email]", f);
    if (!input.checkValidity()) { input.reportValidity(); return; }
    toast("Thank you! You're subscribed to ECCSA updates.");
    f.reset();
  }));

  /* ---------- Contact form → opens the visitor's email app ---------- */
  const cf = $("form[data-contact]");
  cf && cf.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cf.checkValidity()) { cf.reportValidity(); return; }
    const d = new FormData(cf);
    const subject = `[${d.get("topic")}] ${d.get("subject") || "Website enquiry"}`;
    const body = `Name: ${d.get("name")}\nEmail: ${d.get("email")}\nPhone: ${d.get("phone") || "-"}\nCompany: ${d.get("company") || "-"}\n\n${d.get("message")}`;
    window.location.href = `mailto:info@ethiopianchamber.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast("Opening your email app…");
  });

  /* ---------- Members directory: search + filter ---------- */
  const dir = $(".dir");
  if (dir) {
    const items = $$(".member", dir);
    const input = $("#member-search");
    const chips = $$(".chip[data-filter]");
    const empty = $(".dir-empty");
    const count = $("#member-count");
    let filter = "all";
    const apply = () => {
      const q = (input && input.value || "").trim().toLowerCase();
      let shown = 0;
      items.forEach((it) => {
        const ok = (filter === "all" || it.dataset.type === filter) && it.textContent.toLowerCase().includes(q);
        it.hidden = !ok; if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? "none" : "block";
      if (count) count.textContent = shown;
    };
    input && input.addEventListener("input", apply);
    chips.forEach((c) => c.addEventListener("click", () => {
      chips.forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-pressed", "false"); });
      c.classList.add("is-active"); c.setAttribute("aria-pressed", "true");
      filter = c.dataset.filter; apply();
    }));
    apply();
  }

  /* ---------- Sub-nav active state ---------- */
  const subLinks = $$(".subnav a[href^='#']");
  if (subLinks.length && "IntersectionObserver" in window) {
    const map = new Map(subLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { subLinks.forEach((a) => a.classList.remove("is-active")); const a = map.get(en.target.id); a && a.classList.add("is-active"); }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); s && sio.observe(s); });
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
