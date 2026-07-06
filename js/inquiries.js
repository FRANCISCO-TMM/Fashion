/* ===========================================================
   inquiries.js — page-specific behaviour for inquiries.html
   1. Restrict date picker to today-or-later
   2. Build available time slots once a date is chosen
      (atelier is closed Sun/Mon, shorter hours Saturday,
      closed for lunch, and one slot per day is deterministically
      already booked so availability differs date to date)
   3. Live character counter on the message field
   4. Full client-side form validation + on-page confirmation
   =========================================================== */

(function () {
  "use strict";

  var dateInput = document.getElementById("prefDate");
  var timeSelect = document.getElementById("prefTime");
  var availabilityNote = document.getElementById("availabilityNote");
  var form = document.getElementById("appointmentForm");

  function todayISO() {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  function setMinDate() {
    if (dateInput) dateInput.min = todayISO();
  }

  /* deterministic "already booked" slot index, based on the date string,
     so the same date always shows the same availability */
  function hashIndex(str, mod) {
    var total = 0;
    for (var i = 0; i < str.length; i++) total += str.charCodeAt(i);
    return total % mod;
  }

  function buildSlots(dateStr) {
    var day = new Date(dateStr + "T00:00:00").getDay(); // 0 = Sun
    timeSelect.innerHTML = "";

    if (day === 0 || day === 1) {
      timeSelect.disabled = true;
      timeSelect.innerHTML = '<option value="" selected>Closed this day</option>';
      availabilityNote.textContent = "The atelier is closed Sundays and Mondays — please choose Tuesday through Saturday.";
      return;
    }

    var closeHour = day === 6 ? 16 : 18; // Saturday closes earlier
    var slots = [];
    for (var hour = 10; hour < closeHour; hour++) {
      if (hour === 13) continue; // closed for lunch
      slots.push(hour);
    }

    var bookedIndex = hashIndex(dateStr, slots.length);

    timeSelect.disabled = false;
    timeSelect.innerHTML = '<option value="" disabled selected>Choose a time</option>';
    slots.forEach(function (hour, i) {
      var label = (hour > 12 ? hour - 12 : hour) + ":00 " + (hour >= 12 ? "PM" : "AM");
      var opt = document.createElement("option");
      opt.value = label;
      if (i === bookedIndex) {
        opt.textContent = label + " — already booked";
        opt.disabled = true;
      } else {
        opt.textContent = label;
      }
      timeSelect.appendChild(opt);
    });

    availabilityNote.textContent = "Showing live availability for " + dateStr + ". One slot above is already booked.";
  }

  function setupDateTime() {
    if (!dateInput || !timeSelect) return;
    setMinDate();
    dateInput.addEventListener("change", function () {
      if (dateInput.value) buildSlots(dateInput.value);
    });
  }

  /* ---------- character counter ---------- */
  function setupCharCounter() {
    var textarea = document.getElementById("message");
    var counter = document.getElementById("charCount");
    if (!textarea || !counter) return;
    textarea.addEventListener("input", function () {
      counter.textContent = textarea.value.length + " / 500";
    });
  }

  /* ---------- validation + submit ---------- */
  function showError(fieldId, message) {
    var el = document.getElementById("err-" + fieldId);
    if (el) el.textContent = message || "";
  }

  function validate() {
    var valid = true;
    var fullName = document.getElementById("fullName");
    var email = document.getElementById("email");
    var phone = document.getElementById("phone");
    var inquiryType = document.getElementById("inquiryType");

    ["fullName", "email", "phone", "inquiryType", "prefDate", "prefTime"].forEach(function (id) {
      showError(id, "");
    });

    if (!fullName.value.trim()) {
      showError("fullName", "Please tell us your name.");
      valid = false;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (phone.value.trim() && !/^[0-9+\-()\s]{6,20}$/.test(phone.value.trim())) {
      showError("phone", "Please enter a valid phone number, or leave this blank.");
      valid = false;
    }

    if (!inquiryType.value) {
      showError("inquiryType", "Please choose an inquiry type.");
      valid = false;
    }

    if (!dateInput.value) {
      showError("prefDate", "Please choose a preferred date.");
      valid = false;
    } else {
      var day = new Date(dateInput.value + "T00:00:00").getDay();
      if (day === 0 || day === 1) {
        showError("prefDate", "The atelier is closed Sundays and Mondays.");
        valid = false;
      }
    }

    if (!timeSelect.value) {
      showError("prefTime", "Please choose an available time.");
      valid = false;
    }

    return valid;
  }

  function setupSubmit() {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      var panel = document.getElementById("confirmationPanel");
      document.getElementById("confName").textContent = document.getElementById("fullName").value.trim();
      document.getElementById("confEmail").textContent = document.getElementById("email").value.trim();
      document.getElementById("confType").textContent = document.getElementById("inquiryType").value;
      document.getElementById("confDate").textContent = dateInput.value;
      document.getElementById("confTime").textContent = timeSelect.value;

      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupDateTime();
    setupCharCounter();
    setupSubmit();
  });
})();
