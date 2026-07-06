/* ===========================================================
   events.js — page-specific behaviour for events.html
   1. Live per-event countdown timers
   2. Filter events by type
   3. Generate and download a .ics calendar file per event
   =========================================================== */

(function () {
  "use strict";

  /* ---------- 1. Countdown timers ---------- */
  function updateCountdowns() {
    var cards = document.querySelectorAll(".event-card");
    var now = new Date();

    cards.forEach(function (card) {
      var target = new Date(card.getAttribute("data-datetime"));
      var box = card.querySelector("[data-countdown]");
      if (!box) return;
      var diff = target - now;

      if (diff <= 0) {
        box.innerHTML = '<p style="font-family:var(--mono); font-size:0.8rem; color:var(--oxblood);">This event has concluded.</p>';
        return;
      }

      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var m = Math.floor((diff / (1000 * 60)) % 60);
      var s = Math.floor((diff / 1000) % 60);

      var dEl = box.querySelector("[data-d]");
      var hEl = box.querySelector("[data-h]");
      var mEl = box.querySelector("[data-m]");
      var sEl = box.querySelector("[data-s]");
      if (dEl) dEl.textContent = String(d).padStart(2, "0");
      if (hEl) hEl.textContent = String(h).padStart(2, "0");
      if (mEl) mEl.textContent = String(m).padStart(2, "0");
      if (sEl) sEl.textContent = String(s).padStart(2, "0");
    });
  }

  /* ---------- 2. Filter by type ---------- */
  function setupFilters() {
    var buttons = document.querySelectorAll("#eventFilters .filter-btn");
    var cards = document.querySelectorAll(".event-card");
    var emptyState = document.getElementById("emptyEvents");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var type = btn.getAttribute("data-type");
        var visible = 0;

        cards.forEach(function (card) {
          var match = type === "all" || card.getAttribute("data-type") === type;
          card.hidden = !match;
          if (match) visible++;
        });

        if (emptyState) emptyState.hidden = visible !== 0;
      });
    });
  }

  /* ---------- 3. .ics download ---------- */
  function toICSDate(dateObj) {
    return dateObj.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  function downloadICS(card) {
    var start = new Date(card.getAttribute("data-datetime"));
    var end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // assume 2-hour duration
    var title = card.querySelector("h3").textContent;
    var meta = card.querySelector(".event-meta").textContent;
    var description = card.querySelector("p:not(.event-date):not(.event-meta)").textContent;

    var ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//The Prestige Couture//Events//EN",
      "BEGIN:VEVENT",
      "UID:" + Date.now() + "@theprestigecouture.example",
      "DTSTAMP:" + toICSDate(new Date()),
      "DTSTART:" + toICSDate(start),
      "DTEND:" + toICSDate(end),
      "SUMMARY:" + title,
      "DESCRIPTION:" + description.replace(/\n/g, " "),
      "LOCATION:" + meta,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = title.replace(/\s+/g, "-").toLowerCase() + ".ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function setupICSButtons() {
    document.querySelectorAll(".ics-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".event-card");
        if (card) downloadICS(card);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    setupFilters();
    setupICSButtons();
  });
})();
