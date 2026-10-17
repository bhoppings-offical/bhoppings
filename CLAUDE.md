# CLAUDE.md — bhoppings

> A community platform where users create stylish, personalized bio pages — think guns.lol or feds.lol,
> but with bhoppings' own aesthetic. Also includes a paste site and community tools.
> Built with Node.js + Express + vanilla JS. Deployed at https://bhoppings.de

---

## What bhoppings Actually Is

The **core product** is a user bio platform. Users sign in, create their own profile/bio page styled in bhoppings' "hard" aesthetic — similar to guns.lol or feds.lol. Think stylish, cool, community-flex energy. Not corporate, not silly — just clean and tuff.

The main `public/index.html` is the reference bio page that shows what user bios look like and what users can build.

Secondary products being built out:
- **Paste site** — for sharing content/code
- **Community tools** — more to come

The **app library** (`/app-library`, `public/apps/`) is fun filler content — games, simulations, joke apps. It's entertaining but it's not the platform's purpose. Don't treat it like the main feature.

---

## Stack

- **Backend:** Node.js + Express 5 (`server.js`)
- **Frontend:** Plain HTML, CSS, vanilla JavaScript — no framework, no bundler
- **Deployment:** Vercel (`vercel.json` routes everything through `server.js`)
- **Dev server:** `npm start` or `node server.js` → runs on port 3000
- **Auth:** GitHub OAuth — actively being built in a **private repo**, partially wired in here via `auth.js`

---

## Project Structure

```
bhoppings/
├── server.js              # Main Express server — entry point
├── serverg.js             # Unknown purpose — do not touch
├── auth.js                # WIP GitHub OAuth — logic lives in a private repo, ignore this file
├── vercel.json            # Vercel deployment config
├── public/
│   ├── index.html         # Reference bio page — this IS the core product
│   ├── home/              # Home/landing page
│   ├── settings/          # User settings UI
│   ├── app-library/       # App browser (fun filler, not core)
│   ├── addons/            # Addons system
│   ├── login/             # Login page (auth WIP)
│   ├── 404/               # Custom 404 page
│   ├── apps/              # Mini apps and games (fun filler)
│   ├── global/            # Shared scripts (settings-init, glass, home-effects)
│   ├── components/        # Reusable JS components (navbar, carousel)
│   ├── config/            # JSON configs (themes, cursors, app-library, addons)
│   ├── seasonal/          # Seasonal event scripts (halloween, christmas, etc.)
│   ├── bhoppings/         # ⛔ AUTO-GENERATED SEO PAGES — DO NOT TOUCH
│   ├── downloads/         # Downloadable files (TangoX, TangoClicker, Quill)
│   └── particle-lib.js    # Shared particle effects library
```

---

## The `User` Object

The `User` global (with `User.getData()` / `User.setData()`) is **defined in a private auth repository** — not in this repo. It provides localStorage-based persistence for user settings and data, and will tie into the auth system as it matures.

When you see `User.getData("settings")` or `User.setData(...)`, that's coming from the private auth system. Do not try to redefine or mock it — it's injected externally.

---

## Auth

Auth is a **work in progress** and is the next major focus for the platform. GitHub OAuth is the chosen provider. The logic lives in a **private repo** — `auth.js` in this repo is a stub/placeholder and should be left alone.

When auth is ready, it will unlock user bios, paste site, and other community features that require accounts.

---

## Settings System

User settings are initialized in `public/global/settings-init.js`. The default settings object:

```js
{
  cursor: "snow",
  theme: "default",
  effect: "waves",
  cacheCursor: ["#fff", "#fff"],
  cacheTheme: { primary: ["#D185FF", "#51CBFF"], background: ["#12151D"] },
  liquidGlass: false,
  legacyNavbar: false,
  skipBio: false,
  backgroundUrl: null,
  backgroundBlur: 48
}
```

Settings are applied by dynamically injecting CSS variables into `:root`:
- `--theme-color` — gradient from `cacheTheme.primary`
- `--background` — gradient or custom image URL
- `--background-blur` — blur in px
- `--cursor` — SVG data URL for the custom cursor

Theme definitions → `public/config/themes.json`
Cursor definitions → `public/config/cursors.json`

---

## Aesthetic / Design Direction

bhoppings has two distinct aesthetics that should never be confused:

**Bio pages** — dark, minimal, hard. Near-black backgrounds, frosted glass cards, pixel/monospace fonts, almost zero color except social media brand icons. Think guns.lol/feds.lol. No gradients, no decorative color.

**Platform UI** (home, navbar, settings) — fully themeable by the user. Colors come from CSS variables (`--theme-color`, `--background`, etc.) set dynamically by the theme system. Never hardcode any specific color values here — what you see on screen depends entirely on the active theme. The default is just one of many.

When working on UI:
- Always use CSS variables for color — never hardcode hex values
- Liquid glass (`.liquid-glass`) is a signature effect — use it on cards and panels, don't overdo it
- Pixel or monospace fonts fit the hard aesthetic — avoid anything that reads as "friendly" or "bubbly"
- Less is more. Empty space is intentional. Don't over-decorate.

---

## Adding a New App (to the filler app library)

### 1. Create the app folder

```
public/apps/<kebab-case-app-name>/
```

### 2. Choose the file pattern based on complexity

- **Simple:** Single self-contained `index.html` with all CSS and JS inline
- **Complex:** Separate `index.html`, `script.js`, `styles.css`

### 3. Register in `public/config/app-library.json`

```json
{
  "name": "App Name",
  "url": "/app-folder-name",
  "image": "app-folder-name.png"
}
```

Optional fields:
- `"tags": ["broken"]` — marks as broken in the UI
- `"tags": ["ai"]` — marks as AI-powered
- `"fromRoot": true` — if the URL is NOT under `/apps/`

---

## Server (`server.js`)

Intentionally minimal:

- Serves `public/` as static files
- Handles named redirects (defined in the `redirects` object — add new ones there)
- Proxies the view counter via `/api/views` and `/api/views/up` → counterapi.dev
- Falls back to `public/404/index.html` for all unknown routes

---

## Navbar

Dynamically injected via `public/components/navbar.js` — it is not in any HTML file.

To add a nav item, edit the `navbarItems` array:
```js
{ text: "label", href: "/path" }
// dropdown:
{ text: "label", items: [ { text: "sub", href: "/sub" } ] }
```

---

## Seasonal Effects

One file per holiday in `public/seasonal/`. `seasonal.js` picks the active one based on the current date. To add a new one, create a file and register it in `seasonal.js`.

---

## ⛔ Do Not Touch

| Path | Reason |
|------|--------|
| `public/bhoppings/` | Auto-generated SEO pages — never edit manually |
| `auth.js` | Auth stub — logic is in a private repo |
| `serverg.js` | Unknown purpose — leave it alone |
| `public/apps/lume/` | Flagship app — only touch if explicitly asked |
| `public/apps/nexa/` | Flagship app — only touch if explicitly asked |
| `public/apps/vera/` | Flagship app — only touch if explicitly asked |

---

## Priorities (as of now)

1. **Auth system** — highest priority, getting user accounts working
2. **User bio pages** — the core product, guns.lol/feds.lol style
3. **Paste site** — coming alongside or after auth
4. **Community tools** — TBD
5. **App library** — fun, low priority, add things when it's fun to do so
