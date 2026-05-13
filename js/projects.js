/* ============================================================
   PROJECTS — Pinned slanted DNA helix
   ------------------------------------------------------------
   - Section is ~11x viewport tall; an inner sticky pane stays
     fixed while the user scrolls, scrubbing the helix forward.
   - 10 cards spiral around a tilted central rod
   - Each card gets ~one viewport of scroll as its "front" moment
   - Front cards are sharp + clickable; back cards blur and fade
   ============================================================ */

window.Portfolio = window.Portfolio || {};

window.Portfolio.initProjects = function () {
  // --- Cleanup any previous instance ---
  if (window.Portfolio._projectsRAF) {
    cancelAnimationFrame(window.Portfolio._projectsRAF);
    window.Portfolio._projectsRAF = null;
  }
  if (window.Portfolio._projectsScrollHandler) {
    window.removeEventListener('scroll', window.Portfolio._projectsScrollHandler);
    window.Portfolio._projectsScrollHandler = null;
  }
  if (window.Portfolio._projectsScrollTrigger) {
    window.Portfolio._projectsScrollTrigger.kill();
    window.Portfolio._projectsScrollTrigger = null;
  }

  const container = document.getElementById('projectsHelix');
  const axis = document.getElementById('helixAxis');
  const bubblesLayer = document.getElementById('projectsBubbles');
  const section = document.getElementById('projects');
  const counterEl = document.getElementById('helixCounter');
  const progressFillEl = document.getElementById('helixProgressFill');
  if (!container || !axis) return;

  /* ---------- placeholder project data (10 entries) ---------- */
  const PROJECTS = [
    { title: 'Aurora Dashboard',  tag: 'SaaS · React',         url: '#', accent: 'linear-gradient(135deg, #7C5CFF, #00E5FF)' },
    { title: 'Nimbus Banking',    tag: 'Fintech · Next.js',    url: '#', accent: 'linear-gradient(135deg, #00E5FF, #7C5CFF)' },
    { title: 'Helio AI Studio',   tag: 'AI · Three.js',        url: '#', accent: 'linear-gradient(135deg, #FF3DCB, #FFB546)' },
    { title: 'Verse Commerce',    tag: 'E-commerce · Stripe',  url: '#', accent: 'linear-gradient(135deg, #FFB546, #FF3DCB)' },
    { title: 'Pulse Analytics',   tag: 'Data Viz · D3',        url: '#', accent: 'linear-gradient(135deg, #7C5CFF, #FF3DCB)' },
    { title: 'Drift Music',       tag: 'Web Audio · React',    url: '#', accent: 'linear-gradient(135deg, #00E5FF, #FFB546)' },
    { title: 'Orbit CRM',         tag: 'B2B · Vue',            url: '#', accent: 'linear-gradient(135deg, #FF3DCB, #7C5CFF)' },
    { title: 'Lumen Portfolio',   tag: 'Creative · GSAP',      url: '#', accent: 'linear-gradient(135deg, #00E5FF, #FF3DCB)' },
    { title: 'Echo Social',       tag: 'Social · Node.js',     url: '#', accent: 'linear-gradient(135deg, #FFB546, #7C5CFF)' },
    { title: 'Quanta Devtools',   tag: 'Open Source · TS',     url: '#', accent: 'linear-gradient(135deg, #FF3DCB, #00E5FF)' }
  ];

  /* ---------- build cards ---------- */
  const cards = PROJECTS.map((p, i) => {
    const a = document.createElement('a');
    a.className = 'project-card';
    a.href = p.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `
      <div class="project-card-inner">
        <div class="project-thumb" style="background:${p.accent}">PREVIEW · ${String(i + 1).padStart(2, '0')}</div>
        <div class="project-meta">
          <div class="project-title">${p.title}</div>
          <div class="project-tag">${p.tag}</div>
        </div>
      </div>
    `;
    axis.appendChild(a);
    return a;
  });

  /* ---------- helix maths (spotlight model) ----------
     Each card has a "phase" pi that represents where it is in its
     own journey:
        pi = -3..0   → spiraling in from the back (queued behind)
        pi =  0      → SPOTLIGHT — perfectly centered at right
        pi >  0      → exiting forward (fades + blurs out)
     pi is derived from progress so card 0 spotlights at progress=0,
     card N-1 spotlights at progress=1, with smooth handoffs.
     Because angle is purely a function of pi, every card lands at
     the exact same spotlight position (cos(0)=1, sin(0)=0 → right).
  ----------------------------------------------------- */
  const N = cards.length;                       // 10
  const ANGLE_PER_STEP = Math.PI / 2;           // 90° → 4 cards per revolution in queue
  const Z_SPOTLIGHT = 380;                      // z at pi=0 (close to camera)
  const Z_RATE = 340;                           // z change per pi step
  const VIS_BACK = 4;                           // how many steps back are visible
  const VIS_FRONT = 1.6;                        // how far forward before exit

  // Responsive: helix radius and spotlight angle vary by viewport.
  //   Desktop  → spotlight at angle 0   (center-RIGHT)
  //   Tablet   → spotlight at -π/2      (center-UPPER), tighter radius
  //   Mobile   → spotlight at -π/2,     even tighter radius
  let RADIUS = 220;
  let BASE_ANGLE = 0;
  function recomputeHelixParams() {
    const w = window.innerWidth;
    if (w <= 480)        { RADIUS = 105; BASE_ANGLE = -Math.PI / 2; }
    else if (w <= 1024)  { RADIUS = 155; BASE_ANGLE = -Math.PI / 2; }
    else                 { RADIUS = 220; BASE_ANGLE = 0;            }
  }
  recomputeHelixParams();
  window.addEventListener('resize', recomputeHelixParams);

  /* Lead-in / lead-out buffers so the first card spirals into the spotlight
     after the user has had time to register the section, and the last card
     holds at the spotlight at the end of the pinned scroll instead of
     flying off. */
  const LEAD = 0.10;     // first 10% of scroll: card 0 approaches spotlight
  const END  = 0.06;     // last 6%: card 9 holds at spotlight
  const ACTIVE = 1 - LEAD - END;

  let progress = 0;          // smoothed
  let targetProgress = 0;    // raw from scroll

  function updateHelix() {
    // Snap if very close to avoid infinite micro-lerp drift
    const diff = targetProgress - progress;
    progress += Math.abs(diff) < 0.0005 ? diff : diff * 0.12;

    // Remap raw progress → "adjusted" progress used by the helix.
    // Negative values during lead-in keep card 0 queued slightly back
    // so it visibly spirals INTO the spotlight as the user scrolls.
    let adjusted = (progress - LEAD) / ACTIVE;
    if (adjusted > 1) adjusted = 1;        // hold last card at spotlight

    cards.forEach((card, i) => {
      // pi: this card's distance from the spotlight (in journey-steps)
      // adjusted=0 → card 0 at spotlight; adjusted=1 → card N-1 at spotlight
      const pi = adjusted * (N - 1) - i;

      // angle = BASE_ANGLE + pi*step → spotlight always lands at BASE_ANGLE,
      //   which is 0 on desktop (center-right) or -π/2 on tablet/mobile (center-upper).
      const angle = BASE_ANGLE + pi * ANGLE_PER_STEP;
      const x = Math.cos(angle) * RADIUS;
      const y = Math.sin(angle) * RADIUS * 0.85;
      const z = Z_SPOTLIGHT + pi * Z_RATE;

      const inWindow = pi > -VIS_BACK && pi < VIS_FRONT;

      // Blur: back is mildly blurry, exiting front is heavily blurred
      const blur = pi <= 0
        ? Math.max(0, -pi * 5)
        : Math.max(0, pi * 9);

      // Opacity: peaks at pi=0, fades on both sides
      let opacity = 0;
      if (inWindow) {
        opacity = pi <= 0
          ? Math.max(0, 1 + pi * 0.28)             // 1 at pi=0 → ~0 at pi=-3.5
          : Math.max(0, 1 - pi * 0.7);             // 1 at pi=0 → 0 at pi≈1.4
      }

      // Only the spotlight card (and immediate neighbor) is clickable
      const interactive = pi > -0.5 && pi < 0.4;

      card.style.transform =
        `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) ` +
        `rotateZ(${(Math.sin(angle) * 3).toFixed(2)}deg)`;
      card.style.filter = `blur(${blur.toFixed(2)}px)`;
      card.style.opacity = opacity.toFixed(3);
      card.style.pointerEvents = interactive ? 'auto' : 'none';
      // Cards closer to spotlight render on top
      card.style.zIndex = Math.round((1 - Math.min(1.5, Math.abs(pi))) * 100 + 50);
    });

    // Counter — which card is currently featured? (use adjusted, not raw)
    const featured = Math.max(1, Math.min(N, Math.round(adjusted * (N - 1)) + 1));
    if (counterEl) {
      counterEl.textContent = `${String(featured).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
    }
    if (progressFillEl) {
      const pct = Math.max(0, Math.min(100, progress * 100));
      progressFillEl.style.width = pct.toFixed(1) + '%';
    }

    window.Portfolio._projectsRAF = requestAnimationFrame(updateHelix);
  }
  updateHelix();

  /* ---------- scroll → progress ----------
     The section is 1100vh tall with an inner sticky panel pinning
     to 100vh. So scroll distance available = 1000vh.
     Map that linearly to progress 0 → 1 (one full helix cycle).
  ---------------------------------------- */
  function setupScroll() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,                        // tighter coupling; was 0.5
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
        onRefreshInit: (self) => {
          // Sync immediately on any refresh so position is never stale
          targetProgress = self.progress;
          progress = self.progress;      // snap lerp target too
        },
        onInit: (self) => {
          window.Portfolio._projectsScrollTrigger = self;
          // Recalculate after the initial layout paint
          setTimeout(() => ScrollTrigger.refresh(), 150);
        }
      });
    } else {
      const onScroll = () => {
        const rect = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        const scrolled = Math.min(total, Math.max(0, -rect.top));
        targetProgress = total > 0 ? scrolled / total : 0;
      };
      window.Portfolio._projectsScrollHandler = onScroll;
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }
  setupScroll();

  /* ---------- floating bubbles (decorative) ---------- */
  if (bubblesLayer) {
    for (let i = 0; i < 16; i++) {
      const b = document.createElement('div');
      b.className = 'bubble';
      const size = 60 + Math.random() * 220;
      b.style.width = b.style.height = size + 'px';
      b.style.left = (Math.random() * 100) + '%';
      b.style.top = (Math.random() * 100) + '%';
      b.style.opacity = (0.16 + Math.random() * 0.22).toFixed(2);
      b.style.animationDuration = (14 + Math.random() * 14) + 's';
      b.style.animationDelay = (-Math.random() * 18) + 's';
      bubblesLayer.appendChild(b);
    }
  }
};
