/* ============================================================
   SKILLS — Interactive 3D globe of skill labels
   ------------------------------------------------------------
   - Fibonacci-sphere distribution for even spacing
   - Drag to rotate 360° on both X and Y axes (mouse + touch)
   - Auto-rotates when idle
   - Depth-based scaling, opacity, and blur
   - PLACEHOLDER: edit the SKILLS array to match your real stack
   ============================================================ */

window.Portfolio = window.Portfolio || {};

window.Portfolio.initSkills = function () {
  const container = document.getElementById('skillsGlobe');
  if (!container) return;

  /* ---------- skill data (placeholder — replace with real stack) ---------- */
  const SKILLS = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Vue',
    'Node.js', 'Express', 'Python', 'Django', 'FastAPI',
    'Tailwind', 'CSS3', 'HTML5', 'GSAP', 'Three.js',
    'Framer Motion', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
    'Docker', 'Git', 'AWS', 'Vercel', 'GraphQL',
    'REST API', 'Webpack', 'Vite'
  ];

  /* ---------- create label nodes ---------- */
  const nodes = SKILLS.map((name, i) => {
    const el = document.createElement('div');
    el.className = 'skill-label';
    el.innerHTML = `<span class="dot"></span>${name}`;
    container.appendChild(el);
    // Fibonacci-sphere distribution gives ~even spacing without clusters
    const phi = Math.acos(1 - 2 * (i + 0.5) / SKILLS.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);
    return { el, base: { x, y, z } };
  });

  /* ---------- state ---------- */
  let radius = 240;
  function computeRadius() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    radius = Math.max(180, Math.min(w, h) * 0.35);
  }
  computeRadius();
  window.addEventListener('resize', computeRadius);

  let rotX = 0;          // current rotation around X axis
  let rotY = 0;          // current rotation around Y axis
  let velX = 0.0008;     // gentle auto-rotation
  let velY = 0.0024;
  let isDragging = false;
  let lastX = 0, lastY = 0;

  /* ---------- render loop ---------- */
  function render() {
    if (!isDragging) {
      rotX += velX;
      rotY += velY;
    }

    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

    nodes.forEach(({ el, base }) => {
      // Rotate base vector around Y, then X
      let { x, y, z } = base;
      // Y rotation
      let xz = x * cosY - z * sinY;
      let zz = x * sinY + z * cosY;
      x = xz; z = zz;
      // X rotation
      let yz = y * cosX - z * sinX;
      zz = y * sinX + z * cosX;
      y = yz; z = zz;

      // Project to screen
      const px = x * radius;
      const py = y * radius;

      // Depth-derived scale, opacity, blur
      // z ∈ [-1, 1]; +1 = front, -1 = back
      const depth = (z + 1) / 2;             // 0 (back) → 1 (front)
      const scale = 0.55 + depth * 0.95;     // back tiny, front large
      const opacity = 0.18 + depth * 0.82;
      const blur = (1 - depth) * 4;          // back blurry, front sharp
      const z2 = Math.round(depth * 100);    // for stacking

      el.style.transform = `translate3d(calc(-50% + ${px}px), calc(-50% + ${py}px), 0) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `blur(${blur.toFixed(2)}px)`;
      el.style.zIndex = z2;
      el.style.fontSize = (12 + depth * 8).toFixed(1) + 'px';
    });

    requestAnimationFrame(render);
  }
  render();

  /* ---------- drag handlers ---------- */
  function onPointerDown(e) {
    isDragging = true;
    container.classList.add('is-dragging');
    document.body.classList.add('is-dragging');
    const cursor = document.getElementById('cursor');
    if (cursor) cursor.classList.add('is-drag');
    const p = pointerPos(e);
    lastX = p.x;
    lastY = p.y;
    velX *= 0.5; velY *= 0.5;
    e.preventDefault();
  }
  function onPointerMove(e) {
    if (!isDragging) return;
    const p = pointerPos(e);
    const dx = p.x - lastX;
    const dy = p.y - lastY;
    rotY += dx * 0.005;
    rotX -= dy * 0.005;
    // store the user's last delta as the new auto-rotate momentum
    velX = -dy * 0.0006;
    velY = dx * 0.0006;
    lastX = p.x;
    lastY = p.y;
  }
  function onPointerUp() {
    isDragging = false;
    container.classList.remove('is-dragging');
    document.body.classList.remove('is-dragging');
    const cursor = document.getElementById('cursor');
    if (cursor) cursor.classList.remove('is-drag');
    // damp momentum so it doesn't spin forever; drift toward gentle defaults
    setTimeout(() => {
      velX = 0.0008 * Math.sign(velX || 1);
      velY = 0.0024 * Math.sign(velY || 1);
    }, 1500);
  }
  function pointerPos(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  container.addEventListener('mousedown', onPointerDown);
  container.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('touchend', onPointerUp);
  window.addEventListener('mouseleave', onPointerUp);
};
