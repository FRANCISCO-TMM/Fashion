/* ===========================================================
   trustees.js — page-specific behaviour for trustees.html
   1. Expand / collapse each trustee's full biography
   2. Filter trustees by committee
   =========================================================== */

(function () {
  "use strict";

  function setupAccordion() {
    var toggles = document.querySelectorAll(".bio-toggle");
    toggles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".trustee-card");
        var expanded = card.classList.toggle("expanded");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        btn.textContent = expanded ? "Hide full note" : "Read full note";
      });
    });
  }

  function setupCommitteeFilter() {
    var buttons = document.querySelectorAll("#committeeFilters .filter-btn");
    var cards = document.querySelectorAll(".trustee-card");
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var committee = btn.getAttribute("data-committee");

        cards.forEach(function (card) {
          var match = committee === "all" || card.getAttribute("data-committee") === committee;
          card.hidden = !match;
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupAccordion();
    setupCommitteeFilter();
  });
})();
