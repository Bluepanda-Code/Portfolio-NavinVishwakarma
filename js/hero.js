/* ============================================================
   HERO — Scroll-driven 60-frame sequence + animated text overlays
   ------------------------------------------------------------
   PERFORMANCE EDITION:
   • Frames are preloaded in priority batches (first 10 instantly,
     rest in background) so the hero is visible with zero delay.
   • img.decode() is used so each frame is GPU-ready before paint.
   • A readyFlags array tracks which frames are truly drawable.
   • drawFrame() finds the nearest ready frame if the exact one
     isn't loaded yet — eliminating the "stuck / blank" bug.
   • RAF-throttled rendering prevents redundant repaints.
   • scrub:1 removes GSAP's extra ease lag that caused jank.
   ============================================================ */

window.Portfolio = window.Portfolio || {};

window.Portfolio.initHero = function () {
  /* ---------- cleanup previous instance ---------- */
  if (window.Portfolio._heroScrollHandler) {
    window.removeEventListener('scroll', window.Portfolio._heroScrollHandler);
    window.Portfolio._heroScrollHandler = null;
  }
  if (window.Portfolio._heroScrollTrigger) {
    window.Portfolio._heroScrollTrigger.kill();
    window.Portfolio._heroScrollTrigger = null;
  }
  if (window.Portfolio._heroRAF) {
    cancelAnimationFrame(window.Portfolio._heroRAF);
    window.Portfolio._heroRAF = null;
  }

  const TOTAL_FRAMES = 60;
  const canvas  = document.getElementById('heroCanvas');
  const section = document.getElementById('hero');
  const overlays = Array.from(document.querySelectorAll('.hero-text'));
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d', { alpha: false });   // alpha:false = faster composite
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;

  /* ---------- frame storage ---------- */
  const imgs       = new Array(TOTAL_FRAMES).fill(null);  // Image objects
  const readyFlags = new Array(TOTAL_FRAMES).fill(false); // true once decoded

  /* ---------- decode a single image (returns Promise) ---------- */
  function loadFrame(i) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = `frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
      imgs[i] = img;

      const markReady = () => {
        // Use decode() if available so the browser fully decompresses
        // before we try to blit it — prevents one-frame blank flashes.
        if (img.decode) {
          img.decode()
            .then(() => { readyFlags[i] = true; resolve(); })
            .catch(() => { readyFlags[i] = true; resolve(); }); // still mark ready on error
        } else {
          readyFlags[i] = true;
          resolve();
        }
      };

      if (img.complete) {
        markReady();
      } else {
        img.onload  = markReady;
        img.onerror = () => { readyFlags[i] = false; resolve(); };
      }
    });
  }

  /* ---------- batched preloading strategy ----------
     Batch 1 (0–9):   load IMMEDIATELY   — hero visible in < 1 s
     Batch 2 (10–29): load after batch 1  — early scroll covered
     Batch 3 (30–59): load after batch 2  — full sequence ready
  --------------------------------------------------- */
  function preloadAll() {
    const batch1 = Array.from({ length: 10 }, (_, i) => loadFrame(i));
    Promise.all(batch1).then(() => {
      // Draw frame 0 as soon as it's ready
      _paintFrame(0);

      const batch2 = Array.from({ length: 20 }, (_, i) => loadFrame(i + 10));
      Promise.all(batch2).then(() => {
        const batch3 = Array.from({ length: 30 }, (_, i) => loadFrame(i + 30));
        Promise.all(batch3); // fire-and-forget last batch
      });
    });
  }

  /* ---------- size / resize ---------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth  = window.innerWidth;
    H = canvas.clientHeight = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    _paintFrame(currentIdx);
  }
  window.addEventListener('resize', resize);

  /* ---------- raw paint — no safety checks, called with a ready index ---------- */
  function _paintFrame(i) {
    const img = imgs[i];
    if (!img || !readyFlags[i]) {
      // Dark fallback so it never shows blank white
      ctx.fillStyle = '#02020a';
      ctx.fillRect(0, 0, W, H);
      return;
    }
    const iW = img.naturalWidth  || img.width;
    const iH = img.naturalHeight || img.height;
    if (!iW || !iH) return;
    const scale   = Math.max(W / iW, H / iH);
    const scaledW = iW * scale;
    const scaledH = iH * scale;
    ctx.drawImage(img, (W - scaledW) / 2, (H - scaledH) / 2, scaledW, scaledH);
  }

  /* ---------- find nearest decoded frame ----------
     If the exact target frame isn't ready, search outward
     (first backward — prefer earlier frame to avoid "future" look).
  --------------------------------------------------------- */
  function nearestReady(target) {
    if (readyFlags[target]) return target;
    for (let d = 1; d < TOTAL_FRAMES; d++) {
      const lo = target - d;
      const hi = target + d;
      if (lo >= 0           && readyFlags[lo]) return lo;
      if (hi < TOTAL_FRAMES && readyFlags[hi]) return hi;
    }
    return -1; // nothing ready yet
  }

  /* ---------- public drawFrame (used by scroll handler) ---------- */
  let currentIdx   = 0;
  let _pendingDraw = false;

  function drawFrame(frameFloat) {
    const target = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameFloat)));
    currentIdx = target;

    if (_pendingDraw) return;            // coalesce into next RAF tick
    _pendingDraw = true;

    window.Portfolio._heroRAF = requestAnimationFrame(() => {
      _pendingDraw = false;
      const idx = nearestReady(currentIdx);
      if (idx >= 0) _paintFrame(idx);
    });
  }

  /* ---------- overlay activation ---------- */
  function updateOverlays(progress) {
    const segments = overlays.length;
    const seg = Math.min(segments - 1, Math.floor(progress * segments));
    overlays.forEach((el, i) => el.classList.toggle('is-active', i === seg));
  }

  /* ---------- ScrollTrigger / fallback ---------- */
  function setupScroll() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      const state = { frame: 0 };
      gsap.to(state, {
        frame: TOTAL_FRAMES - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,                       // was 0.4 — tighter coupling to scroll
          onUpdate: (self) => {
            drawFrame(state.frame);
            updateOverlays(self.progress);
          },
          onInit: (self) => {
            window.Portfolio._heroScrollTrigger = self;
            // Force a refresh so ScrollTrigger recalculates after images start loading
            setTimeout(() => ScrollTrigger.refresh(), 200);
          }
        }
      });
    } else {
      /* Native scroll fallback */
      const scrollHandler = () => {
        const rect  = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        const scrolled = Math.min(total, Math.max(0, -rect.top));
        const p = total > 0 ? scrolled / total : 0;
        drawFrame(p * (TOTAL_FRAMES - 1));
        updateOverlays(p);
      };
      window.Portfolio._heroScrollHandler = scrollHandler;
      window.addEventListener('scroll', scrollHandler, { passive: true });
      scrollHandler();
    }
  }

  /* ---------- init ---------- */
  resize();
  updateOverlays(0);
  preloadAll();
  setupScroll();
};
