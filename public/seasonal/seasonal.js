"use strict";
(function () {

  // ── Easter calculation (Anonymous Gregorian algorithm) ──────────
  function getEaster(year) {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100;
    const d = Math.floor(b / 4), e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mo = Math.floor((h + l - 7 * m + 114) / 31);
    const dy = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, mo - 1, dy);
  }

  function daysBetween(a, b) {
    return Math.round((b - a) / 86400000);
  }

  function load(name) {
    const s = document.createElement("script");
    s.src = "/seasonal/" + name + ".js?v=" + Date.now();
    document.head.appendChild(s);
    console.log("[Seasonal] Loading:", name);
  }

  const now   = new Date();
  const month = now.getMonth() + 1; // 1–12
  const day   = now.getDate();
  const year  = now.getFullYear();

  // ── December — all month (Christmas / Winter) ──────────────────
  if (month === 12) { load("december"); return; }

  // ── New Year's — Jan 1–4 ───────────────────────────────────────
  if (month === 1 && day <= 4) { load("newyear"); return; }

  // ── Valentine's Day — Feb 13–17 ────────────────────────────────
  if (month === 2 && day >= 13 && day <= 17) { load("valentines"); return; }

  // ── St Patrick's Day — Mar 16–18 ──────────────────────────────
  if (month === 3 && day >= 16 && day <= 18) { load("stpatricks"); return; }

  // ── Easter — day of through +3 days ──────────────────────────
  const easter = getEaster(year);
  const daysFromEaster = daysBetween(easter, now);
  if (daysFromEaster >= 0 && daysFromEaster <= 3) { load("easter"); return; }

  // ── Halloween — all of October ────────────────────────────────
  if (month === 10) { load("halloween"); return; }

  // ── Independence Day — Jul 3–5 (US) ──────────────────────────
  if (month === 7 && day >= 3 && day <= 5) { load("july4"); return; }

  // ── Nothing active ─────────────────────────────────────────────
  console.log("[Seasonal] No active event today.");

})();
