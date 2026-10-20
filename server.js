const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");


const port = 3000;

const publicPath = (p = "") => path.join(__dirname, "public", p);

app.get("/favicon.ico", (req, res) => {
  res.sendFile(publicPath("assets/images/icons/favicon.ico"));
})

// Handle subdomain routing — must be BEFORE static middleware
app.use((req, res, next) => {
  if (req.hostname === 'distance.bhoppings.de' && req.path === '/') {
    return res.sendFile(publicPath("distance/index.html"));
  }
  next();
});

const lunaStatic = express.static(publicPath("luna"));
app.use((req, res, next) => {
  if (req.hostname === 'luna.bhoppings.de') return lunaStatic(req, res, next);
  next();
});

const emojiStatic = express.static(publicPath("apps/emoji-hats"));

app.use((req, res, next) => {
  if (req.hostname === "emoji.bhoppings.de") {
    return emojiStatic(req, res, next);
  }
  next();
});

app.use(express.static(publicPath()));

app.get("/", (req, res) => {
  res.sendFile(publicPath("index.html"));
})

const redirects = {
  "/nexa": "/apps/nexa",
  "/apps": "/app-library"
}

for (const key of Object.keys(redirects)) {
  app.get(key, (req, res) => {
    res.redirect(redirects[key]);
  })
}


const NAMESPACE = 'bhoppings';
const COUNTER   = 'view-count';

// Proxy endpoint to get current count
app.get('/api/views', async (req, res) => {
  try {
    const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${COUNTER}/`);
    if (!response.ok) throw new Error('CounterAPI error');
    const text = await response.text();
    const data = JSON.parse(text); // parse manually
    res.json({ value: data.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch views' });
  }
});

// Proxy endpoint to increment count
app.get('/api/views/up', async (req, res) => {
  try {
    const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${COUNTER}/up`);
    if (!response.ok) throw new Error('CounterAPI error');
    const text = await response.text();
    const data = JSON.parse(text); // parse manually
    res.json({ value: data.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to increment views' });
  }
});

// Emoji Hats AI proxy: keeps the Groq key server-side (Vercel env variable "emojihats").
// Only accepts the exact kind of request the game makes (fixed model, short chat messages, capped sizes)
// so it can't be used as a free general-purpose AI.
const GROQ_MODEL = 'openai/gpt-oss-120b';
const groqClamp = (n, lo, hi, d) => (Number.isFinite(+n) && n !== null && n !== '' ? Math.min(hi, Math.max(lo, +n)) : d);

app.post('/api/groq', express.json({ limit: '64kb' }), async (req, res) => {
  const key = process.env.emojihats;
  if (!key) return res.status(500).json({ error: 'The "emojihats" environment variable is not set on this deployment.' });

  const b = req.body;
  if (!b || typeof b !== 'object') return res.status(400).json({ error: 'Expected a JSON body.' });

  const msgs = b.messages;
  const okMsgs = Array.isArray(msgs) && msgs.length >= 1 && msgs.length <= 3 &&
    msgs.every(m => m && (m.role === 'system' || m.role === 'user') && typeof m.content === 'string' && m.content.length <= 4000);
  if (!okMsgs) return res.status(400).json({ error: 'Bad messages.' });

  // Only forward a whitelist of fields, with the model fixed and the sizes capped.
  const body = {
    model: GROQ_MODEL,
    messages: msgs.map(m => ({ role: m.role, content: m.content })),
    temperature: groqClamp(b.temperature, 0, 2, 1),
    max_completion_tokens: groqClamp(b.max_completion_tokens, 16, 2048, 512),
    top_p: groqClamp(b.top_p, 0, 1, 1),
    reasoning_effort: b.reasoning_effort === 'low' ? 'low' : 'medium',
  };

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(25000),
    });
    const text = await r.text();
    res.status(r.status).type('application/json').send(text);
  } catch (e) {
    res.status(502).json({ error: 'The AI service did not respond.' });
  }
});

// ===== Emoji Hats: owner accounts ("Emoji Hats" and "bhoppings") =====
// Those two names are reserved. Using one means proving you know the password in the Vercel env variable
// "emojihatspass". The browser never gets to decide who is an owner: this server signs a proof when the password
// is right, and every player's browser asks this server to check the proofs it sees. A proof is locked to the name,
// the player's connection id and the room code, so a copied or sniffed proof is useless to anyone else, anywhere else.
// (Changing "emojihatspass" or "emojihats" in Vercel instantly invalidates every proof that was ever handed out.)
const crypto = require('crypto');

/* >>> owner-names (this block is identical in server.js and public/apps/emoji-hats/index.html: keep them in sync) */
const OWNER_HOMO = (() => {   // look-alike characters that count as the plain letter they imitate
  const m = Object.create(null), add = (to, chars) => { for (const c of chars) m[c] = to; };
  add('a', '\u0430\u0251\u03b1@4\u1d00');
  add('b', '\u03b2\u02996');
  add('e', '\u0435\u03b5\u04543\u1d07');
  add('g', '\u0261\u02629');
  add('h', '\u04bb\u029c');
  add('i', '\u0456\u0457\u03b9\u0131\u026a1l|!');
  add('j', '\u0458\u1d0a');
  add('m', '\u1d0d');
  add('n', '\u0578\u03b7\u0274');
  add('o', '\u043e\u03bf\u1d0f\u05850');
  add('p', '\u0440\u03c1\u1d18');
  add('s', '\u0455\ua731$5');
  add('t', '\u03c4\u1d1b7+');
  return m;
})();
function ownerSkel(s) {       // "Emoji Hats", "emojihats", "E.M.O.J.I hats", "ЕmojI Hats" (cyrillic E)... all boil down to the same skeleton
  const t = String(s == null ? '' : s).slice(0, 200).normalize('NFKD').toLowerCase()
    .replace(/[\u0300-\u036f\u00ad\u200b-\u200f\u2060\ufeff]/g, '');   // accents and invisible characters
  let out = '';
  for (const ch of t) out += OWNER_HOMO[ch] !== undefined ? OWNER_HOMO[ch] : ch;
  return out.replace(/[^a-z0-9]/g, '').replace(/(.)\1+/g, '$1');
}
const OWNER_NAMES = Object.create(null);
['Emoji Hats', 'bhoppings'].forEach(n => { OWNER_NAMES[ownerSkel(n)] = n; });
const ownerCanon = n => OWNER_NAMES[ownerSkel(n)] || null;   // -> the exact official spelling, or null if it's not a reserved name
/* <<< owner-names */

const b64u = b => Buffer.from(b).toString('base64url');
const ownerPass = () => (process.env.emojihatspass || '').trim();
let ownerKeyCache = null, ownerKeySrc = '';
function ownerKey() {   // signing key = scrypt(password + Groq key): even a weak password can't be guessed offline from a captured proof
  const src = ownerPass() + '\u0000' + (process.env.emojihats || '');
  if (!ownerKeyCache || ownerKeySrc !== src) { ownerKeyCache = crypto.scryptSync(src, 'emojihats-owner-proof-v1', 32); ownerKeySrc = src; }
  return ownerKeyCache;
}
const ownerMac = p => crypto.createHmac('sha256', ownerKey()).update('eh-owner-v1.' + p).digest();
const ownerSign = data => { const p = b64u(JSON.stringify(data)); return p + '.' + b64u(ownerMac(p)); };
function ownerRead(proof) {   // -> the signed data if the signature is genuine, else null
  if (typeof proof !== 'string' || proof.length > 700) return null;
  const parts = proof.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const want = ownerMac(parts[0]), got = Buffer.from(parts[1], 'base64url');
  if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return null;
  try { const d = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')); return d && typeof d === 'object' ? d : null; } catch (e) { return null; }
}

// Best-effort brute-force brake (memory is per serverless instance, so a strong password is still the real defence).
const ownerFails = new Map();
const ownerIp = req => String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '?').split(',')[0].trim();
const ownerLocked = ip => { const f = ownerFails.get(ip); return f && f.until > Date.now() ? Math.ceil((f.until - Date.now()) / 1000) : 0; };
function ownerFailed(ip) {
  const now = Date.now(), f = ownerFails.get(ip) || { n: 0, until: 0, t: now };
  if (now - f.t > 10 * 60e3) { f.n = 0; f.t = now; }
  if (++f.n >= 6) { f.until = now + 10 * 60e3; f.n = 0; f.t = now; }   // 6 wrong guesses -> locked out for 10 minutes
  ownerFails.set(ip, f);
  if (ownerFails.size > 2000) for (const [k, v] of ownerFails) if (v.until < now && now - v.t > 10 * 60e3) ownerFails.delete(k);
}
const ownerJson = limit => { const mw = express.json({ limit }); return (req, res, next) => mw(req, res, err => err ? res.status(400).json({ ok: false, error: 'bad' }) : next()); };

// Password in -> signed proof out. The proof says: "<name> proved the password, for connection <pid>, in room <room>, until <e>".
app.post('/api/owner/auth', ownerJson('4kb'), async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const pass = ownerPass();
  if (!pass) return res.status(503).json({ ok: false, error: 'setup' });
  const b = req.body || {};
  const canon = ownerCanon(b.name);
  const pid = typeof b.pid === 'string' && /^[\w-]{6,64}$/.test(b.pid) ? b.pid : null;
  const room = typeof b.room === 'string' && /^[A-Z]{4}$/.test(b.room) ? b.room : null;
  if (!canon || !pid || !room || typeof b.password !== 'string' || b.password.length > 1024) return res.status(400).json({ ok: false, error: 'bad' });
  const ip = ownerIp(req), wait = ownerLocked(ip);
  if (wait) return res.status(429).json({ ok: false, error: 'locked', retry: wait });
  const given = crypto.createHash('sha256').update(b.password.trim()).digest(), real = crypto.createHash('sha256').update(pass).digest();
  if (!crypto.timingSafeEqual(given, real)) {
    ownerFailed(ip);
    await new Promise(r => setTimeout(r, 600));   // slow guessing down
    return res.status(401).json({ ok: false, error: 'wrong' });
  }
  ownerFails.delete(ip);
  res.json({ ok: true, name: canon, proof: ownerSign({ v: 1, n: canon, p: pid, r: room, e: Date.now() + 12 * 3600e3 }) });
});

// "Is this proof real, for this room (and, if given, for exactly this connection)?" Used by the host when someone joins
// and by every player's browser before it shows the crown. Nothing secret goes in or out.
app.post('/api/owner/verify', ownerJson('16kb'), (req, res) => {
  res.set('Cache-Control', 'no-store');
  const b = req.body || {};
  const room = typeof b.room === 'string' && /^[A-Z]{4}$/.test(b.room) ? b.room : null;
  const items = Array.isArray(b.items) ? b.items.slice(0, 8) : [];
  const live = !!ownerPass() && !!room;
  res.json({ results: items.map(it => {
    const d = live && it && ownerRead(it.proof);
    if (!d || d.v !== 1 || d.r !== room || typeof d.p !== 'string' || ownerCanon(d.n) !== d.n || !(d.e > Date.now())) return { ok: false };
    if (it.pid !== undefined && it.pid !== d.p) return { ok: false };
    return { ok: true, name: d.n, pid: d.p };
  }) });
});


app.get("/distance", (req, res) => {
  res.sendFile(publicPath("distance/index.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(publicPath("404/index.html"));
})

app.listen(port, () => {
  console.log("Server is running on port", port)
})
