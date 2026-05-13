# Navin Vishwakarma — Portfolio

Dark · Glassmorphism · Fully interactive single-page portfolio.

## How to preview locally

This is a static site with no build step. Two ways to run it:

**Option 1 — Open directly (simplest)**
Just open `index.html` in your browser. Some browsers may block module loading from `file://` — if so, use Option 2.

**Option 2 — Tiny static server (recommended)**

```bash
# from this folder (where index.html lives)
python3 -m http.server 5500
# then visit http://localhost:5500
```

Or with Node:

```bash
npx serve .
```

Or just install the **Live Server** extension in VS Code → right-click `index.html` → "Open with Live Server".

---

## Project structure

```
.
├── index.html
├── css/
│   └── style.css         # Theme, glass, all section styles
├── js/
│   ├── main.js           # Cursor, smooth scroll, init
│   ├── hero.js           # Section 1 — 60-frame scroll sequence
│   ├── skills.js         # Section 2 — 3D skills globe
│   ├── projects.js       # Section 3 — DNA helix
│   └── socials.js        # Section 4 — magnetic glass cards
├── assets/
│   └── Vinay-Vishwakarma-Resume.pdf   # placeholder — replace with real CV
└── README.md
```

---

## What to replace before going live

### 1. Hero section — the 60 frames
**Currently:** procedurally drawn placeholder animation on canvas (cosmic abstract that morphs through 60 states).

**To use real frames:**
1. Drop your 60 images (e.g. `frame-001.webp` … `frame-060.webp`) into `assets/frames/`.
2. Open `js/hero.js` and replace the `drawPlaceholderFrame(i)` function with image blitting:

```js
const images = [];
let imagesLoaded = 0;
for (let i = 1; i <= 60; i++) {
  const img = new Image();
  img.src = `assets/frames/frame-${String(i).padStart(3, '0')}.webp`;
  img.onload = () => imagesLoaded++;
  images.push(img);
}

function drawFrame(i) {
  const idx = Math.max(0, Math.min(59, Math.round(i)));
  const img = images[idx];
  if (img && img.complete) {
    ctx.clearRect(0, 0, W, H);
    // cover-fit
    const r = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * r, h = img.naturalHeight * r;
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  }
}
```

### 2. Hero text overlays
Open `index.html` → search for `<div class="hero-text"`. There are 4 blocks, each tied to a 15-frame slice (frames 0–14, 15–29, 30–44, 45–59). Update the eyebrow / title / subtitle text in each.

### 3. Skills list
Open `js/skills.js` → edit the `SKILLS` array.

### 4. Projects
Open `js/projects.js` → edit the `PROJECTS` array (title, tag, url, accent color).
Replace the `PREVIEW · NN` placeholder thumbnails by adding real images: change the `<div class="project-thumb">` to an `<img>` and update the CSS for `.project-thumb` accordingly.

### 5. Social links
Open `js/socials.js` → edit the `PLATFORMS` array (handle, url for each platform).

### 6. Resume PDF
Drop your real CV at `assets/Vinay-Vishwakarma-Resume.pdf` (overwrites the placeholder).

### 7. Mail form
Open `js/main.js` → search for `TODO: replace with real Formspree`. Sign up free at https://formspree.io or https://web3forms.com, get your endpoint, and wire it in.

---

## Free hosting (next step)

When you're ready to deploy:
- **Vercel** — push to GitHub, import repo, done. Free, fast, custom subdomain.
- **Netlify** — drag-and-drop the folder onto netlify.com, or connect GitHub.
- **Cloudflare Pages** — same as above.
- **GitHub Pages** — push to a repo named `username.github.io` and enable Pages.

All four are 100% free and include HTTPS + global CDN.

---

## Browser support
Modern Chrome / Edge / Firefox / Safari. The site uses `backdrop-filter`, CSS 3D transforms, and Canvas — all well-supported in 2026 browsers. Mobile responsive; touch interactions are wired for the skills globe.

## Performance notes
- Custom cursor disables on `<= 900px` widths (mobile uses native).
- Reduced-motion users get a near-static experience automatically.
- Heaviest section is the hero canvas; on slower devices the procedural draw still runs at 60fps thanks to deterministic math.
