/* ===========================================================
   home.js — page-specific behaviour for index.html
   1. Scroll-reveal sections (IntersectionObserver)
   2. Rotating press / client quote carousel
   =========================================================== */

(function () {
  "use strict";

  /* ---------- 1. Scroll reveal ---------- */
  function setupReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* ---------- 2. Quote carousel ---------- */
  var quotes = [
    {
      text: "The house treats a fitting like a conversation, not a transaction — you leave knowing more about the coat than the price.",
      source: "Édition Noire, Resort 2027 review"
    },
    {
      text: "What struck us was the ledger room: a paper pattern for every client the house has ever dressed, going back to 1992.",
      source: "The Atelier Gazette"
    },
    {
      text: "Our wedding gown was remade twice before either of us were happy with the shoulder. They never once suggested we settle.",
      source: "M. & Mme. Lareau, private clients"
    },
    {
      text: "Quiet, exacting, unbothered by trend cycles — this is a house built for people who plan to keep what they buy.",
      source: "La Maison Review"
    }
  ];
  var quoteIndex = 0;

  function renderQuote() {
    var textEl = document.getElementById("quoteText");
    var sourceEl = document.getElementById("quoteSource");
    if (!textEl || !sourceEl) return;
    var q = quotes[quoteIndex];
    textEl.textContent = "\u201C" + q.text + "\u201D";
    sourceEl.textContent = "— " + q.source;
  }

  function setupQuoteCarousel() {
    var prev = document.getElementById("quotePrev");
    var next = document.getElementById("quoteNext");
    if (!prev || !next) return;

    renderQuote();

    next.addEventListener("click", function () {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      renderQuote();
    });
    prev.addEventListener("click", function () {
      quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length;
      renderQuote();
    });

    var autoplay = setInterval(function () {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      renderQuote();
    }, 7000);

    var carousel = document.getElementById("quoteCarousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", function () { clearInterval(autoplay); });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupReveal();
    setupQuoteCarousel();
  });
})();
