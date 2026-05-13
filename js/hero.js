/* ============================================================
   HERO — Scroll-driven 60-frame sequence + animated text overlays
   ------------------------------------------------------------
   PRODUCTION MODE: Loads and displays 60 frames from frames/ folder.
   ============================================================ */

window.Portfolio = window.Portfolio || {};

window.Portfolio.initHero = function () {
  // --- Cleanup any previous instance ---
  if (window.Portfolio._heroScrollHandler) {
    window.removeEventListener('scroll', window.Portfolio._heroScrollHandler);
    window.Portfolio._heroScrollHandler = null;
  }
  if (window.Portfolio._heroScrollTrigger) {
    window.Portfolio._heroScrollTrigger.kill();
    window.Portfolio._heroScrollTrigger = null;
  }

  const TOTAL_FRAMES = 60;
  const canvas = document.getElementById('heroCanvas');
  const section = document.getElementById('hero');
  const overlays = Array.from(document.querySelectorAll('.hero-text'));
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  let currentFrame = 0;

  // Preload frames
  const frames = [];
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = `frames/Frames_${String(i + 1).padStart(3, '0')}.png`;
    frames.push(img);
  }

  /* ---------- size handling ---------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth = window.innerWidth;
    H = canvas.clientHeight = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrame(currentFrame);
  }

  /* ---------- frame renderer ----------
     Now loads and draws images from the frames/ folder.
  ------------------------------------------------- */
  function drawPlaceholderFrame(i) {
    if (frames[i] && frames[i].complete) {
      ctx.clearRect(0, 0, W, H);
      const imgW = frames[i].width;
      const imgH = frames[i].height;
      const scale = Math.max(W / imgW, H / imgH);
      const scaledW = imgW * scale;
      const scaledH = imgH * scale;
      const x = (W - scaledW) / 2;
      const y = (H - scaledH) / 2;
      ctx.drawImage(frames[i], x, y, scaledW, scaledH);
    } else {
      // Fallback: simple loading indicator
      ctx.fillStyle = '#02020a';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '16px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Loading frame ${i + 1}...`, W / 2, H / 2);
    }
  }

  /* ---------- master frame draw ---------- */
  function drawFrame(i) {
    const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(i)));
    currentFrame = idx;
    drawPlaceholderFrame(idx);
  }

  /* ---------- text overlay activation ----------
     Each overlay shows during its 15-frame slice:
       overlay 0 → frames 0–14
       overlay 1 → frames 15–29
       overlay 2 → frames 30–44
       overlay 3 → frames 45–59
     A short fade window at boundaries keeps things smooth.
  ----------------------------------------------- */
  function updateOverlays(progress) {
    // progress 0..1 → 4 segments
    const segments = overlays.length; // 4
    const seg = Math.min(segments - 1, Math.floor(progress * segments));
    overlays.forEach((el, i) => {
      el.classList.toggle('is-active', i === seg);
    });
  }

  /* ---------- ScrollTrigger setup ---------- */
  function setupScroll() {
    if (!window.gsap || !window.ScrollTrigger) {
      // fallback: window scroll listener
      const scrollHandler = () => {
        const rect = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        const scrolled = Math.min(total, Math.max(0, -rect.top));
        const p = total > 0 ? scrolled / total : 0;
        drawFrame(p * (TOTAL_FRAMES - 1));
        updateOverlays(p);
      };
      window.Portfolio._heroScrollHandler = scrollHandler;
      window.addEventListener('scroll', scrollHandler, { passive: true });
      scrollHandler();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const state = { frame: 0 };
    gsap.to(state, {
      frame: TOTAL_FRAMES - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: (self) => {
          drawFrame(state.frame);
          updateOverlays(self.progress);
        },
        onInit: (self) => {
          window.Portfolio._heroScrollTrigger = self;
        }
      }
    });
  }

  // ---------- init ----------
  resize();
  drawFrame(0);
  updateOverlays(0);
  window.addEventListener('resize', resize);
  setupScroll();
};
