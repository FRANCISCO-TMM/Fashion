/* ===========================================================
   THE PRESTIGE COUTURE — shared script.js
   Loaded on all five pages. Handles:
   1. Active navigation link state
   2. Mobile nav toggle
   3. Seamless press-ticker marquee
   4. Live DOM structure viewer (walks document.body)
   5. Footer year
   =========================================================== */

(function () {
  "use strict";

  /* ---------- 1. Active nav link ---------- */
  function markActiveNav() {
    var current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-list a, .footer-nav a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === current) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- 2. Mobile nav toggle ---------- */
  function setupNavToggle() {
    var toggle = document.getElementById("navToggle");
    var list = document.getElementById("navList");
    if (!toggle || !list) return;
    toggle.addEventListener("click", function () {
      var open = list.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    list.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        list.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 3. Seamless marquee ----------
     The ticker holds one <span> of text. We clone it once so the
     CSS animation (translateX 0 -> -50%) loops with no visible seam,
     and pause it for users who do not want motion. */
  function setupTicker() {
    var track = document.getElementById("tickerTrack");
    if (!track) return;
    var clone = track.innerHTML;
    track.insertAdjacentHTML("beforeend", clone);
  }

  /* ---------- 4. DOM structure viewer ----------
     Recursively walks the live document.body and renders an
     indented tree of element tags, ids and classes — a literal,
     on-demand visualisation of this page's Document Object Model. */
  function buildDomTree(node, depth, lines, maxDepth) {
    if (depth > maxDepth) return;
    Array.prototype.forEach.call(node.children, function (el) {
      if (el.id === "domPanel" || el.classList.contains("dom-panel")) return;
      var tag = el.tagName.toLowerCase();
      var id = el.id ? "#" + el.id : "";
      var cls = el.className && typeof el.className === "string"
        ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
        : "";
      if (cls === ".") cls = "";
      var indent = "  ".repeat(depth);
      var branch = depth === 0 ? "" : "└─ ";
      lines.push(indent + branch + "<" + tag + ">" + id + cls);
      buildDomTree(el, depth + 1, lines, maxDepth);
    });
  }

  function renderDomTree() {
    var out = document.getElementById("domTree");
    if (!out) return;
    var lines = ["<body>"];
    buildDomTree(document.body, 1, lines, 5);
    var totalEls = document.querySelectorAll("body *").length;
    lines.push("");
    lines.push("Total elements in this page's DOM: " + totalEls);
    out.textContent = lines.join("\n");
  }

  function setupDomPanel() {
    var openBtn = document.getElementById("domToggle");
    var closeBtn = document.getElementById("domClose");
    var panel = document.getElementById("domPanel");
    if (!openBtn || !panel) return;

    openBtn.addEventListener("click", function () {
      renderDomTree(); // re-walk the live DOM every time it is opened
      panel.hidden = false;
      closeBtn.focus();
    });
    closeBtn.addEventListener("click", function () {
      panel.hidden = true;
      openBtn.focus();
    });
    panel.addEventListener("click", function (e) {
      if (e.target === panel) panel.hidden = true;
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) panel.hidden = true;
    });
  }

  /* ---------- 5. Footer year ---------- */
  function setYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    markActiveNav();
    setupNavToggle();
    setupTicker();
    setupDomPanel();
    setYear();
  });
})();

