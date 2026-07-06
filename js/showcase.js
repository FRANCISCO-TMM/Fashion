/* ===========================================================
   showcase.js — page-specific behaviour for showcase.html
   1. Filter garment cards by category
   2. Open/close a details modal (lightbox) per garment
   =========================================================== */

(function () {
  "use strict";

  var garmentData = {
    "luneville-coat": {
      name: "The Lunéville Coat",
      category: "Eveningwear",
      fabric: "Double-faced wool, hand embroidery in Lunéville needlework",
      silhouette: "Fitted shoulder, dropped hem, single hidden closure",
      leadTime: "10–12 weeks from first sitting",
      notes: "The embroidery pattern is logged in the house archive and can be matched to a second piece."
    },
    "nocturne-cape": {
      name: "Nocturne Cape",
      category: "Eveningwear",
      fabric: "Silk velvet, satin-faced lining",
      silhouette: "Floor-length, draped collar, internal weight at the hem",
      leadTime: "6–8 weeks",
      notes: "Designed to sit over both the Sittings Gown and the Veiled Aisle Gown."
    },
    "sittings-gown": {
      name: "Sittings Gown",
      category: "Bridal",
      fabric: "Silk duchesse satin",
      silhouette: "Structured bodice, full skirt, named for its three required fittings",
      leadTime: "16–20 weeks; bridal pieces are booked by season",
      notes: "Pattern is retained permanently; later alterations can be made without a full re-fit."
    },
    "veiled-aisle-gown": {
      name: "Veiled Aisle Gown",
      category: "Bridal",
      fabric: "Silk tulle overlay on a duchesse satin base",
      silhouette: "Soft bodice, layered skirt, detachable veil panel",
      leadTime: "16–20 weeks",
      notes: "The veil panel is cut from the same bolt as the gown to match under both daylight and candlelight."
    },
    "archive-trench": {
      name: "Archive Trench, No. 0461",
      category: "Ready-to-Wear",
      fabric: "Wool gabardine",
      silhouette: "Straight cut, storm flap, belted waist",
      leadTime: "4–6 weeks",
      notes: "Cut from a client pattern first drafted in 1998 and held in the house archive since."
    },
    "ledger-blazer": {
      name: "Ledger Blazer",
      category: "Ready-to-Wear",
      fabric: "Wool twill",
      silhouette: "Single-breasted, structured shoulder, hand-set lapel",
      leadTime: "4–6 weeks",
      notes: "Named for the fitting ledger kept at every appointment, not for any colour or print."
    },
    "selvage-clutch": {
      name: "Selvage Clutch",
      category: "Accessories",
      fabric: "Calfskin leather, brushed gold-tone clasp",
      silhouette: "Structured rectangular frame, detachable wrist strap",
      leadTime: "2–3 weeks",
      notes: "Edges are finished using the same selvage technique as our fabric off-cuts."
    },
    "pattern-pin-brooch": {
      name: "Pattern-Pin Brooch",
      category: "Accessories",
      fabric: "Brass, hand-finished patina",
      silhouette: "Circular, modelled on a tailor's pattern weight",
      leadTime: "Made to order, 2 weeks",
      notes: "A small tribute to the pattern weights used daily in the cutting room."
    },
    "atelier-scarf": {
      name: "Atelier Scarf, No. 12",
      category: "Accessories",
      fabric: "Silk twill",
      silhouette: "90cm square, hand-rolled hem",
      leadTime: "Ready within 2 weeks",
      notes: "Pattern No. 12 references the twelfth motif drawn for the house in 1994."
    }
  };

  function setupFilters() {
    var buttons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".garment-card");
    var emptyState = document.getElementById("emptyState");
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");
        var visibleCount = 0;

        cards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-category") === filter;
          card.hidden = !match;
          if (match) visibleCount++;
        });

        if (emptyState) emptyState.hidden = visibleCount !== 0;
      });
    });
  }

  function setupModal() {
    var overlay = document.getElementById("modalOverlay");
    var closeBtn = document.getElementById("modalClose");
    if (!overlay) return;

    var viewButtons = document.querySelectorAll(".view-btn");
    var lastFocused = null;

    function openModal(id) {
      var item = garmentData[id];
      if (!item) return;
      document.getElementById("modalCategory").textContent = item.category;
      document.getElementById("modalTitle").textContent = item.name;
      document.getElementById("modalFabric").textContent = item.fabric;
      document.getElementById("modalSilhouette").textContent = item.silhouette;
      document.getElementById("modalLeadTime").textContent = item.leadTime;
      document.getElementById("modalNotes").textContent = item.notes;
      lastFocused = document.activeElement;
      overlay.hidden = false;
      closeBtn.focus();
    }

    function closeModal() {
      overlay.hidden = true;
      if (lastFocused) lastFocused.focus();
    }

    viewButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.getAttribute("data-id"));
      });
    });

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) closeModal();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupFilters();
    setupModal();
  });
})();
