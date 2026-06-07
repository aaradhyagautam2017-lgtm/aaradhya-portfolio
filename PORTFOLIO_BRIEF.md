# PORTFOLIO BRIEF — AARADHYA
## Claude Code Master Reference Document
**Version:** 1.0 | **Last updated:** May 2026  
**Read this file at the start of every session before writing any code.**

---

## 01 — WHO THIS IS FOR

**Designer:** Aaradhya — UI/UX Designer, Delhi, India  
**Audience:**
- Senior designers at product studios
- Founders who need a design partner
- Creative studios & agencies

---

## 02 — DESIGN PHILOSOPHY

> "I design experiences that feel inevitable."

This is the single line that governs every decision on this site.  
Not clever. Not safe. **Inevitable.**

---

## 03 — TONE OF VOICE

**Confident + Experimental.**  
Knows exactly what it is. Not afraid to break convention.  
Writing matches the visuals: precise where it needs to be, poetic where it earns it.  
Never verbose. Never safe. Never generic.

---

## 04 — VISUAL DIRECTION

| Property | Decision |
|---|---|
| Background | Void black — `#080808` |
| Primary accent | Deep amber → `#CC8833` |
| Secondary accent | Deep violet → `#7733CC` |
| Blend / glow | Amber-violet gradient |
| Supporting dark | `#0D0D14` (slightly blue-black) |
| Text primary | `#FFFFFF` |
| Text secondary | `rgba(255,255,255,0.45)` |
| Text muted | `rgba(255,255,255,0.22)` |

**Visual keywords:**  
Cinematic dark · Immersive first · 3D type · God rays · Void black · Amber + violet · Pixel grain · Volumetric light · Human scale · Cosmic depth

**Typography:**  
- Display / headings: **Space Grotesk** (700 weight) — large, sculptural, confident  
- Body: **Space Grotesk** (300–400 weight) — light, airy  
- Import: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap`

**Aesthetic references:**  
- Imaga.ai — cinematic 3D hero visuals, dark immersive  
- Polaris AI — vast scale, human figure, white type on depth  
- Noise Master Buds page — scroll-jacked frame sequence animation  
- Pinterest board — chrome 3D type, pixel cosmos, volumetric god rays

---

## 05 — SITE ARCHITECTURE

The site is an **experience-first product**, not a traditional portfolio.  
The user travels through it. They don't browse it.

```
WORMHOLE INTRO (3–5 seconds)
        ↓
HERO SECTION
        ↓
WORK / CASE STUDIES (scroll-jacked)
        ↓
[Further sections TBD — to be defined in later sessions]
```

---

## 06 — THE WORMHOLE (BUILD THIS FIRST)

### Concept
The site opens with a **full-screen cinematic wormhole** — a WebGL tunnel the user appears to travel through. This is not decoration. It IS the first impression. It sells Aaradhya's design process and thinking before a single portfolio piece is shown.

### Narrative text (appears during the journey)
Three lines flash and fade as the tunnel pulls you through:

```
Line 1: "I don't design interfaces."
Line 2: "I design the moment before the decision."
Line 3: "Welcome."
```

Each line appears sequentially. Fade in → hold → fade out. Pacing matches the tunnel speed.

### Technical specifications

| Property | Value |
|---|---|
| Engine | Three.js (via CDN) |
| Duration | 3–5 seconds total |
| Tunnel color | Amber (`#CC8833`) → Violet (`#7733CC`) blend |
| Background | `#080808` void black |
| Skip button | YES — always visible, top-right corner |
| Skip label | "skip intro →" |
| Skip style | Minimal — small, white, low opacity until hover |
| On complete | Smooth fade/dissolve into Hero section |
| Performance | Must run at 60fps on mid-range laptop |

### Wormhole visual behavior
- Tunnel rings/ellipses recede into a vanishing point at center
- Rings rotate slowly as they approach the camera
- Color shifts from amber at the edges → violet at the core
- Ambient particle drift in the void around the tunnel
- Subtle grain/noise overlay on top of the WebGL canvas
- Light glow at the tunnel center — the "destination"

### File to create
`wormhole.js` — self-contained module  
`index.html` — entry point, loads wormhole first, then transitions to main content

---

## 07 — SCROLL-BASED ANIMATIONS (Phase 2)

After the wormhole, the case studies section uses **scroll-jacked frame sequences** — inspired by the Noise Master Buds product page.

- Section is sticky while user scrolls
- Scroll position maps to frame index of a PNG sequence
- Product/screen appears to float, rotate, reveal itself
- Text content reveals alongside the visual
- Built with GSAP ScrollTrigger + canvas frame swap

**This is Phase 2 — build the wormhole first.**

---

## 08 — TECH STACK

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, no framework) |
| 3D / WebGL | Three.js (CDN) |
| Animation | GSAP + ScrollTrigger (CDN) |
| Fonts | Google Fonts (Space Grotesk) |
| No build tools | Vanilla JS only — no React, no bundler |
| Hosting | TBD (Netlify / GitHub Pages) |

**Why no framework:** Keep it portable, fast, and zero-dependency. Claude Code can edit any file directly. No compilation step needed.

---

## 09 — FOLDER STRUCTURE

```
portfolio/
├── index.html          ← Entry point / wormhole + hero
├── PORTFOLIO_BRIEF.md  ← This file — read every session
├── css/
│   └── style.css       ← Global styles, CSS variables
├── js/
│   ├── wormhole.js     ← Three.js wormhole module
│   ├── scroll.js       ← GSAP scroll animations (Phase 2)
│   └── main.js         ← Entry JS, initialises everything
├── assets/
│   ├── fonts/          ← Any local font files if needed
│   ├── images/         ← Hero visuals, case study assets
│   └── frames/         ← PNG frame sequences (Phase 2)
└── sections/
    ├── hero.html       ← Hero section partial (or inline in index)
    ├── work.html       ← Case studies section
    └── contact.html    ← Contact section
```

---

## 10 — CSS VARIABLES (set these up first in style.css)

```css
:root {
  /* Colors */
  --void: #080808;
  --void-blue: #0D0D14;
  --amber: #CC8833;
  --amber-glow: rgba(204, 136, 51, 0.3);
  --violet: #7733CC;
  --violet-glow: rgba(119, 51, 204, 0.3);
  --white: #FFFFFF;
  --white-60: rgba(255, 255, 255, 0.6);
  --white-45: rgba(255, 255, 255, 0.45);
  --white-22: rgba(255, 255, 255, 0.22);

  /* Typography */
  --font: 'Space Grotesk', sans-serif;

  /* Sizing */
  --nav-height: 60px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background: var(--void);
  color: var(--white);
  font-family: var(--font);
  overflow-x: hidden;
  cursor: none; /* custom cursor — implement later */
}
```

---

## 11 — WORMHOLE IMPLEMENTATION NOTES FOR CLAUDE CODE

When building `wormhole.js`:

1. Use **Three.js r128** or latest stable via CDN
2. Create a `TubeGeometry` or series of `TorusGeometry` rings that recede to a vanishing point
3. Animate camera moving forward through the tunnel using `clock.getDelta()`
4. Color the rings with a gradient from `#CC8833` (outer) to `#7733CC` (inner/center)
5. Add `PointsMaterial` particles in the surrounding void
6. Overlay a CSS grain texture on top of the canvas for film texture
7. Text overlays are **HTML elements** positioned over the canvas with CSS — not Three.js text
8. Use `gsap.timeline()` to sequence the three narrative lines with the tunnel animation
9. On completion (or skip), use `gsap.to()` to fade the entire wormhole container out, revealing the hero section beneath
10. The skip button dispatches a custom event `wormhole:complete` that the main JS listens for

---

## 12 — SESSION RULES FOR CLAUDE CODE

- **Always read this file first** before starting any session
- **Never use React or any bundler** — vanilla JS only
- **Never use inline styles** — all styles go in `style.css` using CSS variables
- **Always test at 60fps** — no heavy computations on the main thread
- **Mobile awareness** — the wormhole should degrade gracefully on mobile (reduced particle count, shorter duration)
- **Comment your code** — Aaradhya is learning, comments help her understand what each section does
- **One feature at a time** — complete and test before moving to the next
- **Ask before adding dependencies** — any new CDN library needs to be discussed first

---

## 13 — CURRENT BUILD STATUS

| Feature | Status |
|---|---|
| Folder structure | ✅ Done |
| CSS variables + reset | ✅ Done |
| index.html shell | ✅ Done |
| Wormhole (Three.js) | ✅ Done |
| Narrative text overlay | ✅ Done |
| Skip button | ✅ Done |
| Hero section | ⬜ Placeholder only (Phase 2) |
| Scroll animations | ⬜ Not started (Phase 2) |

---

## 14 — FIRST SESSION PROMPT FOR CLAUDE CODE

When starting the first Claude Code session, paste this:

```
Read PORTFOLIO_BRIEF.md first. 

Then do the following in order:
1. Create the folder structure exactly as defined in Section 09
2. Set up index.html with the correct HTML shell, CDN imports for Three.js and GSAP, and Google Fonts
3. Set up style.css with all CSS variables from Section 10
4. Create js/wormhole.js with the Three.js tunnel as specified in Sections 06 and 11
5. Wire everything together so opening index.html in a browser shows the wormhole experience

Do one step at a time and confirm before moving to the next.
```

---

*This document is the single source of truth for this project.  
Update the Build Status table (Section 13) as features are completed.*
