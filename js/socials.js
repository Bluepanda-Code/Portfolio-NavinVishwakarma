/* ============================================================
   SOCIALS — Jigsaw Puzzle Interaction
   ------------------------------------------------------------
   • 4 puzzle-shaped glass pieces scattered randomly around the section
   • Center frame shows 4 dashed-outline slots with faint platform watermarks
   • Click a piece → it auto-glides into its correct slot
   • Drag a piece → snaps in if dropped near correct slot, else springs back
   • Once placed, each piece is a clickable link to its platform
   • All four placed → shimmer wave + title morphs to "Connected."
   ------------------------------------------------------------
   PUZZLE GEOMETRY (4 pieces of a 2×2 jigsaw):
        TL: right=tab,   bottom=tab
        TR: left=blank,  bottom=tab
        BL: top=blank,   right=tab
        BR: top=blank,   left=blank
   Tab/blank shapes use semicircular arcs of radius 40px on a 200px
   square. SVG viewBox is 280×280; the inner square sits at (40,40)-(240,240)
   so tabs can protrude into the surrounding 40px margin on any side.
   ============================================================ */

window.Portfolio = window.Portfolio || {};

window.Portfolio.initSocials = function () {
  const arena   = document.getElementById('puzzleArena');
  const frame   = document.getElementById('puzzleFrame');
  const titleEl = document.getElementById('socialsTitleInner');
  const subEl   = document.getElementById('socialsSub');
  if (!arena || !frame) return;

  /* ---------- piece path geometry ---------- */
  const PATHS = {
    TL: 'M 40 40 L 240 40 L 240 120 A 40 40 0 0 1 240 200 L 240 240 L 200 240 A 40 40 0 0 1 120 240 L 40 240 L 40 40 Z',
    TR: 'M 40 40 L 240 40 L 240 240 L 200 240 A 40 40 0 0 1 120 240 L 40 240 L 40 200 A 40 40 0 0 0 40 120 L 40 40 Z',
    BL: 'M 40 40 L 120 40 A 40 40 0 0 1 200 40 L 240 40 L 240 120 A 40 40 0 0 1 240 200 L 240 240 L 40 240 L 40 40 Z',
    BR: 'M 40 40 L 120 40 A 40 40 0 0 1 200 40 L 240 40 L 240 240 L 40 240 L 40 200 A 40 40 0 0 0 40 120 L 40 40 Z'
  };

  /* ---------- platforms (each tied to a slot id) ---------- */
  const PLATFORMS = [
    {
      id: 'TL', name: 'LinkedIn', handle: '@n4vin',
      url: 'https://www.linkedin.com/in/n4vin/',
      color: 'rgba(0, 119, 181, 0.55)',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14M18.5 18.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>'
    },
    {
      id: 'TR', name: 'GitHub', handle: '@Bluepanda-Code',
      url: 'https://github.com/Bluepanda-Code/',
      color: 'rgba(200, 200, 220, 0.45)',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.39.97.01 1.95.14 2.86.39 2.18-1.48 3.14-1.17 3.14-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.37-5.25 5.65.41.36.78 1.05.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>'
    },
    {
      id: 'BL', name: 'Instagram', handle: '@n4vin_v',
      url: 'https://www.instagram.com/n4vin_v/',
      color: 'rgba(255, 61, 203, 0.55)',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'
    },
    {
      id: 'BR', name: 'Behance', handle: '@gamersnavin',
      url: 'https://www.behance.net/gamersnavin',
      color: 'rgba(0, 86, 255, 0.55)',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zM15.5 14a3.5 3.5 0 0 1-3.45 3H8V8h4.05a3.5 3.5 0 0 1 2.6 5.85c.55.32.85.78.85 1.65zM10 11h2.05c.55 0 1-.5 1-1.04 0-.55-.45-1.05-1-1.05H10v2.09zm2.5 4c.55 0 1-.5 1-1.04 0-.55-.45-1.05-1-1.05H10v2.09h2.5zm10.5-1.07c0 1.07-.43 3.07-3.43 3.07H17a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h2.07c1.93 0 3.93 1 3.93 4v.93H16v.07a1 1 0 0 0 1 1h2.57c.43 0 1.43-.07 1.43-1H23z"/></svg>'
    }
  ];

  /* slot's offset within the 400×400 frame, in unscaled (200-unit) coords */
  const SLOT_POS = {
    TL: { x: 0,   y: 0   },
    TR: { x: 200, y: 0   },
    BL: { x: 0,   y: 200 },
    BR: { x: 200, y: 200 }
  };

  /* ---------- responsive scale ----------
     Multi-tier so the puzzle stays in-frame on phones, fits on tablets,
     and looks generous on desktop. Vertical scatter is used below 720px
     because there isn't enough horizontal room for 4 corner quadrants.
  ---------------------------------------- */
  function getScale() {
    const w = window.innerWidth;
    if (w <= 480)  return 0.46;   /* pieces ~129px so longest handle fits inside */
    if (w <= 720)  return 0.58;
    if (w <= 1024) return 0.72;
    return 1;
  }
  function useVerticalLayout() {
    return window.innerWidth <= 720;
  }
  let scale = getScale();
  const FRAME_BASE = 400;
  const PIECE_VIEW = 280;

  /* ---------- build slots inside the frame ---------- */
  function buildSlots() {
    frame.innerHTML = '';
    // size the frame container to match the responsive scale
    frame.style.width  = (FRAME_BASE * scale) + 'px';
    frame.style.height = (FRAME_BASE * scale) + 'px';
    PLATFORMS.forEach((p) => {
      const slot = document.createElement('div');
      slot.className = 'puzzle-slot';
      slot.dataset.slot = p.id;

      const slotPos = SLOT_POS[p.id];
      // SVG anchor is at (40,40) inside its own viewBox; we want the inner
      // square (40..240) to align to the slot cell (slotPos..slotPos+200).
      slot.style.left = (slotPos.x - 40) * scale + 'px';
      slot.style.top  = (slotPos.y - 40) * scale + 'px';
      slot.style.width  = PIECE_VIEW * scale + 'px';
      slot.style.height = PIECE_VIEW * scale + 'px';

      // outline + faint platform watermark
      slot.innerHTML = `
        <svg viewBox="0 0 ${PIECE_VIEW} ${PIECE_VIEW}">
          <path class="slot-outline" d="${PATHS[p.id]}" />
          <g class="slot-watermark" transform="translate(110 110) scale(2.5)">${p.svg}</g>
        </svg>
      `;
      frame.appendChild(slot);
    });
  }

  /* ---------- build a piece (scattered, draggable) ---------- */
  function buildPiece(p) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.dataset.slot = p.id;
    piece.style.setProperty('--piece-color', p.color);
    piece.style.width  = PIECE_VIEW * scale + 'px';
    piece.style.height = PIECE_VIEW * scale + 'px';

    const gradId = 'g_' + p.id;
    piece.innerHTML = `
      <svg viewBox="0 0 ${PIECE_VIEW} ${PIECE_VIEW}">
        <defs>
          <linearGradient id="${gradId}" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0"   stop-color="rgba(255,255,255,0.10)" />
            <stop offset="0.5" stop-color="rgba(255,255,255,0.04)" />
            <stop offset="1"   stop-color="rgba(255,255,255,0.10)" />
          </linearGradient>
        </defs>
        <path class="piece-bg" d="${PATHS[p.id]}" fill="url(#${gradId})" />
        <path class="piece-glow" d="${PATHS[p.id]}" />
      </svg>
      <div class="piece-label">
        <div class="piece-icon">${p.svg}</div>
        <div class="piece-name">${p.name}</div>
        <div class="piece-handle">${p.handle}</div>
      </div>
    `;
    arena.appendChild(piece);
    return piece;
  }

  /* ---------- compute home (placed) and scatter positions ---------- */
  function computePositions() {
    const aw = arena.offsetWidth;
    const ah = arena.offsetHeight;
    const frameSize = FRAME_BASE * scale;
    const pieceSize = PIECE_VIEW * scale;
    const frameTL_x = (aw - frameSize) / 2;
    const frameTL_y = (ah - frameSize) / 2;

    const homes = {};
    for (const p of PLATFORMS) {
      const slot = SLOT_POS[p.id];
      // Piece's outer SVG must be placed so its (40,40) anchor lands at the slot's grid position.
      homes[p.id] = {
        x: frameTL_x + (slot.x - 40) * scale,
        y: frameTL_y + (slot.y - 40) * scale
      };
    }

    // Choose layout: on narrow viewports there's no room for 4 corner zones,
    // so we use a vertical layout (2 above + 2 below the frame).
    const margin = 10;
    const padding = 16;
    const vertical = useVerticalLayout();
    let zones;

    if (vertical) {
      const aboveY = { yMin: margin, yMax: Math.max(margin + 1, frameTL_y - pieceSize - padding) };
      const belowY = { yMin: frameTL_y + frameSize + padding, yMax: Math.max(margin + 1, ah - pieceSize - margin) };
      const halfX  = aw / 2 - pieceSize / 2 - 6;
      const leftX  = { xMin: margin, xMax: Math.max(margin + 1, halfX) };
      const rightX = { xMin: aw / 2 + pieceSize / 2 + 6, xMax: Math.max(margin + 1, aw - pieceSize - margin) };
      zones = [
        { ...leftX,  ...aboveY },
        { ...rightX, ...aboveY },
        { ...leftX,  ...belowY },
        { ...rightX, ...belowY }
      ];
    } else {
      const qLeft  = { xMin: margin,                          xMax: Math.max(margin + 1, frameTL_x - pieceSize - padding) };
      const qRight = { xMin: frameTL_x + frameSize + padding, xMax: Math.max(margin + 1, aw - pieceSize - margin) };
      const qTop   = { yMin: margin,                          yMax: Math.max(margin + 1, frameTL_y - pieceSize - padding) };
      const qBot   = { yMin: frameTL_y + frameSize + padding, yMax: Math.max(margin + 1, ah - pieceSize - margin) };
      zones = [
        { ...qLeft,  ...qTop }, { ...qRight, ...qTop },
        { ...qLeft,  ...qBot }, { ...qRight, ...qBot }
      ];
    }

    // Last-resort safety net for any zone that ended up degenerate
    zones = zones.map((z) => {
      if (z.xMax < z.xMin) { z.xMin = margin; z.xMax = Math.max(margin + 1, aw - pieceSize - margin); }
      if (z.yMax < z.yMin) { z.yMin = margin; z.yMax = Math.max(margin + 1, ah - pieceSize - margin); }
      return z;
    });
    zones.sort(() => Math.random() - 0.5);

    const scatters = {};
    PLATFORMS.forEach((p, i) => {
      const z = zones[i];
      const x = z.xMin + Math.random() * Math.max(1, z.xMax - z.xMin);
      const y = z.yMin + Math.random() * Math.max(1, z.yMax - z.yMin);
      scatters[p.id] = { x, y, rot: (Math.random() - 0.5) * (vertical ? 18 : 26) };
    });

    return { homes, scatters };
  }

  /* ---------- transform helper (single source of truth) ---------- */
  function applyTransform(piece, bobY) {
    bobY = bobY || 0;
    piece.style.transform =
      `translate3d(${piece._x}px, ${piece._y + bobY}px, 0) rotate(${piece._rot}deg)`;
  }

  /* ---------- animation helper ---------- */
  function animate(piece, fromX, fromY, fromRot, toX, toY, toRot, duration, onDone) {
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);   // ease-out-cubic
      piece._x   = fromX   + (toX   - fromX)   * e;
      piece._y   = fromY   + (toY   - fromY)   * e;
      piece._rot = fromRot + (toRot - fromRot) * e;
      applyTransform(piece, 0);
      if (t < 1) requestAnimationFrame(tick);
      else if (onDone) onDone();
    }
    requestAnimationFrame(tick);
  }

  /* ---------- main setup ---------- */
  let placedCount = 0;
  let pieces = {};
  let homes = {}, scatters = {};

  function setup() {
    // Clear arena (keep frame)
    Array.from(arena.querySelectorAll('.puzzle-piece')).forEach(el => el.remove());
    pieces = {};
    placedCount = 0;

    scale = getScale();
    buildSlots();

    const positions = computePositions();
    homes = positions.homes;
    scatters = positions.scatters;

    PLATFORMS.forEach((p) => {
      const piece = buildPiece(p);
      const s = scatters[p.id];
      piece._x = s.x; piece._y = s.y; piece._rot = s.rot;
      piece._phase = Math.random() * Math.PI * 2;   // random starting phase for bob
      piece._state = 'idle';                        // idle | dragging | animating | placed
      applyTransform(piece, 0);
      pieces[p.id] = piece;
      attachInteraction(piece, p);
    });
  }

  /* ---------- idle bob loop (JS-driven, never overrides _x/_y) ---------- */
  function bobLoop(now) {
    for (const id in pieces) {
      const piece = pieces[id];
      if (piece._state !== 'idle') continue;
      const bob = Math.sin(now * 0.0011 + piece._phase) * 5;
      applyTransform(piece, bob);
    }
    requestAnimationFrame(bobLoop);
  }
  requestAnimationFrame(bobLoop);

  /* ---------- click + drag interactions ---------- */
  function attachInteraction(piece, platform) {
    let downX = 0, downY = 0;
    let pieceStartX = 0, pieceStartY = 0;
    let isDown = false, isDragging = false;
    const DRAG_THRESHOLD = 6;
    const SNAP_RADIUS = 90 * scale;

    function getPoint(e) {
      if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (e.changedTouches && e.changedTouches[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }

    function onDown(e) {
      if (piece._state === 'placed' || piece._state === 'animating') return;
      const pt = getPoint(e);
      downX = pt.x; downY = pt.y;
      // Snapshot the piece's CURRENT position (not bob-adjusted)
      pieceStartX = piece._x;
      pieceStartY = piece._y;
      isDown = true;
      isDragging = false;
      piece._state = 'dragging';                  // freezes idle bob immediately
      applyTransform(piece, 0);                   // remove any in-flight bob
      e.preventDefault();
    }

    function onMove(e) {
      if (!isDown) return;
      const pt = getPoint(e);
      const dx = pt.x - downX;
      const dy = pt.y - downY;

      if (!isDragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        isDragging = true;
        piece.classList.add('is-dragging');
      }
      if (isDragging) {
        piece._x = pieceStartX + dx;
        piece._y = pieceStartY + dy;
        // Keep rotation steady during drag — feels more controlled
        applyTransform(piece, 0);
        e.preventDefault();
      }
    }

    function onUp() {
      if (!isDown) return;
      const wasDragging = isDragging;
      isDown = false;
      isDragging = false;
      piece.classList.remove('is-dragging');

      if (!wasDragging) {
        // Tap/click — auto-snap to its slot
        snapHome(piece, platform);
      } else {
        const home = homes[platform.id];
        const dist = Math.hypot(piece._x - home.x, piece._y - home.y);
        if (dist < SNAP_RADIUS) {
          snapHome(piece, platform);
        } else {
          // Spring back to scatter position
          const s = scatters[platform.id];
          piece._state = 'animating';
          animate(piece, piece._x, piece._y, piece._rot, s.x, s.y, s.rot, 420, () => {
            piece._state = 'idle';
          });
        }
      }
    }

    piece.addEventListener('mousedown', onDown);
    piece.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchcancel', onUp);

    // Once placed, click opens the link
    piece.addEventListener('click', (e) => {
      if (piece.classList.contains('is-placed')) {
        window.open(platform.url, '_blank', 'noopener,noreferrer');
      }
    });
  }

  function snapHome(piece, platform) {
    const home = homes[platform.id];
    piece._state = 'animating';
    animate(piece, piece._x, piece._y, piece._rot, home.x, home.y, 0, 720, () => {
      piece._state = 'placed';
      piece.classList.add('is-placed');
      const slot = frame.querySelector(`.puzzle-slot[data-slot="${platform.id}"]`);
      if (slot) slot.classList.add('is-filled');
      placedCount++;
      if (placedCount === PLATFORMS.length) {
        triggerCompletion();
      }
    });
  }

  /* ---------- completion: shimmer + title morph ---------- */
  function triggerCompletion() {
    // Shimmer wave: trigger each piece in TL → TR → BR → BL order
    const order = ['TL', 'TR', 'BR', 'BL'];
    order.forEach((id, i) => {
      const p = pieces[id];
      if (!p) return;
      setTimeout(() => {
        p.classList.add('is-shimmering');
        setTimeout(() => p.classList.remove('is-shimmering'), 1700);
      }, i * 180);
    });

    // Title morph after the shimmer starts
    setTimeout(() => {
      if (titleEl) {
        titleEl.classList.add('is-fading');
        setTimeout(() => {
          titleEl.innerHTML = '<span class="grad">Connected.</span>';
          titleEl.classList.remove('is-fading');
        }, 480);
      }
      if (subEl) {
        subEl.classList.add('is-fading');
        setTimeout(() => {
          subEl.textContent = 'Each piece is now a doorway — click to enter.';
          subEl.classList.remove('is-fading');
        }, 380);
      }
    }, 600);
  }

  /* ---------- handle resize ---------- */
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      // Preserve which pieces are placed during a re-layout
      const placedIds = Array.from(arena.querySelectorAll('.puzzle-piece.is-placed'))
        .map(el => el.dataset.slot);
      setup();
      // Re-place any that were already placed (skip animation)
      placedIds.forEach((id) => {
        const piece = pieces[id];
        const home = homes[id];
        if (!piece || !home) return;
        piece._x = home.x; piece._y = home.y; piece._rot = 0;
        piece._state = 'placed';
        piece.classList.add('is-placed');
        applyTransform(piece, 0);
        const slot = frame.querySelector(`.puzzle-slot[data-slot="${id}"]`);
        if (slot) slot.classList.add('is-filled');
        placedCount++;
      });
      if (placedCount === PLATFORMS.length) triggerCompletion();
    }, 200);
  });

  // initial build
  setup();
};
