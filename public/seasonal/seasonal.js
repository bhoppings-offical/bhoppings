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

  // ── Lunar New Year dates (hardcoded 2023–2032) ──────────────────
  function getLunarNewYear(year) {
    const dates = {
      2023: [1, 22], 2024: [2, 10], 2025: [1, 29], 2026: [2, 17],
      2027: [2,  6], 2028: [1, 26], 2029: [2, 13], 2030: [2,  3],
      2031: [1, 23], 2032: [2, 11],
    };
    const d = dates[year];
    return d ? new Date(year, d[0] - 1, d[1]) : null;
  }

  // ── Diwali dates (hardcoded 2024–2032) ─────────────────────────
  function getDiwali(year) {
    const dates = {
      2024: [11,  1], 2025: [10, 20], 2026: [11,  8], 2027: [10, 29],
      2028: [10, 17], 2029: [11,  5], 2030: [10, 26], 2031: [11, 14],
      2032: [11,  2],
    };
    const d = dates[year];
    return d ? new Date(year, d[0] - 1, d[1]) : null;
  }

  // ── 2nd Sunday of May (Mother's Day) ───────────────────────────
  function getSecondSundayMay(year) {
    const may1 = new Date(year, 4, 1);
    const firstSunOffset = (7 - may1.getDay()) % 7;
    return new Date(year, 4, 1 + firstSunOffset + 7);
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

  const easter     = getEaster(year);
  const lunarNY    = getLunarNewYear(year);
  const diwali     = getDiwali(year);
  const mothersDay = getSecondSundayMay(year);

  // Mardi Gras = Fat Tuesday = Easter minus 47 days
  const mardiGras = new Date(easter);
  mardiGras.setDate(mardiGras.getDate() - 47);

  // ── December — all month (Christmas / Winter) ──────────────────
  if (month === 12) { load("december"); return; }

  // ── New Year's — Jan 1–4 ───────────────────────────────────────
  if (month === 1 && day <= 4) { load("newyear"); return; }

  // ── Lunar New Year — day of through +2 days ───────────────────
  if (lunarNY) {
    const d = daysBetween(lunarNY, now);
    if (d >= 0 && d <= 2) { load("lunarnewyear"); return; }
  }

  // ── Valentine's Day — Feb 13–17 ────────────────────────────────
  if (month === 2 && day >= 13 && day <= 17) { load("valentines"); return; }

  // ── Mardi Gras — Fat Tuesday only ─────────────────────────────
  if (daysBetween(mardiGras, now) === 0) { load("mardigras"); return; }

  // ── St Patrick's Day — Mar 16–18 ──────────────────────────────
  if (month === 3 && day >= 16 && day <= 18) { load("stpatricks"); return; }

  // ── Easter — day of through +3 days ──────────────────────────
  const daysFromEaster = daysBetween(easter, now);
  if (daysFromEaster >= 0 && daysFromEaster <= 3) { load("easter"); return; }

  // ── April Fools — Apr 1 only ──────────────────────────────────
  if (month === 4 && day === 1) { load("aprilfools"); return; }

  // ── Cinco de Mayo — May 5 only ────────────────────────────────
  if (month === 5 && day === 5) { load("cincodemayo"); return; }

  // ── Mother's Day — day before + day of (2nd Sunday of May) ───
  const daysFromMD = daysBetween(mothersDay, now);
  if (daysFromMD >= -1 && daysFromMD <= 0) { load("mothersday"); return; }

  // ── Independence Day — Jul 3–5 (US) ──────────────────────────
  if (month === 7 && day >= 3 && day <= 5) { load("july4"); return; }

  // ── Diwali — day of through +2 days (checked before Halloween) ─
  if (diwali) {
    const daysFromDiwali = daysBetween(diwali, now);
    if (daysFromDiwali >= 0 && daysFromDiwali <= 2) { load("diwali"); return; }
  }

  // ── Halloween — all of October ────────────────────────────────
  if (month === 10) { load("halloween"); return; }

  // ── Nothing active ─────────────────────────────────────────────
  console.log("[Seasonal] No active event today.");

})();
