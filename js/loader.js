/**
 * NV Portfolio — Isometric Workspace Loader
 * Design: Dark · Purple/Cyan/Pink gradient palette · Space Grotesk
 * Matches: css/style.css design tokens exactly
 */
(function () {
  'use strict';

  /* Run after DOM is ready so document.body is not null */
  function run() {

  /* ─────────────────────────────────────────
     0.  Bail if the user has already visited
         (skip loader on subsequent page loads)
  ───────────────────────────────────────── */
  // Comment out the two lines below if you ALWAYS want the loader:
  // if (sessionStorage.getItem('nv-loaded')) return;
  // sessionStorage.setItem('nv-loaded', '1');

  /* ─────────────────────────────────────────
     1.  Inject loader HTML into the DOM
  ───────────────────────────────────────── */
  const loaderHTML = `
    <div id="nv-loader" role="progressbar" aria-label="Loading portfolio" aria-valuemin="0" aria-valuemax="100">

      <!-- Three.js canvas target -->
      <div id="nv-canvas-wrap"></div>

      <!-- Radial gradient atmosphere (matches bg-gradient from CSS) -->
      <div id="nv-atmo"></div>

      <!-- Flash overlay — fires right before reveal -->
      <div id="nv-flash"></div>

      <!-- HUD overlay -->
      <div id="nv-hud">
        <div id="nv-hud-logo">NV.</div>
        <div id="nv-hud-bar-wrap">
          <div id="nv-hud-bar"></div>
        </div>
        <div id="nv-hud-label">// initialising workspace</div>
      </div>

      <!-- Progress counter -->
      <div id="nv-counter">00</div>

    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = loaderHTML.trim();
  document.body.insertBefore(wrapper.firstElementChild, document.body.firstChild);

  /* ─────────────────────────────────────────
     2.  Inject CSS (scoped to #nv-loader)
  ───────────────────────────────────────── */
  const css = `
    /* Prevent portfolio from flashing before loader is done */
    body.nv-loading {
      overflow: hidden;
    }

    #nv-loader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #050510;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                  visibility 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }

    #nv-loader.nv-done {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    /* Canvas fills the entire loader */
    #nv-canvas-wrap {
      position: absolute;
      inset: 0;
      z-index: 1;
    }

    #nv-canvas-wrap canvas {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }

    /* Atmosphere blob – purple/cyan/pink like the portfolio bg-gradient */
    #nv-atmo {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background:
        radial-gradient(900px 600px at 10% 10%, rgba(124, 92, 255, 0.20), transparent 60%),
        radial-gradient(700px 500px at 90% 15%, rgba(0, 229, 255, 0.12), transparent 60%),
        radial-gradient(800px 800px at 50% 100%, rgba(255, 61, 203, 0.14), transparent 65%);
      opacity: 0;
      transition: opacity 0.8s ease;
    }

    #nv-loader.nv-atmo-in #nv-atmo {
      opacity: 1;
    }

    /* Flash */
    #nv-flash {
      position: absolute;
      inset: 0;
      z-index: 8;
      background: #fff;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.18s ease;
    }

    /* ── HUD bar (bottom-left) ── */
    #nv-hud {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      min-width: 240px;
    }

    #nv-hud-logo {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-weight: 700;
      font-size: 22px;
      letter-spacing: 1px;
      background: linear-gradient(120deg, #00E5FF 0%, #7C5CFF 50%, #FF3DCB 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 4px;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s;
    }

    #nv-loader.nv-atmo-in #nv-hud-logo {
      opacity: 1;
      transform: translateY(0);
    }

    #nv-hud-bar-wrap {
      width: 220px;
      height: 2px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.08);
      overflow: hidden;
    }

    #nv-hud-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #7C5CFF, #00E5FF, #FF3DCB);
      border-radius: 2px;
      transition: width 0.08s linear;
      box-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
    }

    #nv-hud-label {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 11px;
      letter-spacing: 1.5px;
      color: rgba(244, 244, 251, 0.45);
      text-transform: uppercase;
      opacity: 0;
      transition: opacity 0.5s ease 0.25s;
    }

    #nv-loader.nv-atmo-in #nv-hud-label {
      opacity: 1;
    }

    /* Progress counter – large, top-right */
    #nv-counter {
      position: absolute;
      top: 36px;
      right: 40px;
      z-index: 9;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: clamp(48px, 8vw, 88px);
      font-weight: 400;
      color: rgba(255, 255, 255, 0.06);
      letter-spacing: -0.04em;
      line-height: 1;
      user-select: none;
      transition: color 0.3s ease;
    }

    /* Scanning line effect */
    #nv-loader::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
      background: repeating-linear-gradient(
        to bottom,
        transparent,
        transparent 2px,
        rgba(255,255,255,0.015) 2px,
        rgba(255,255,255,0.015) 4px
      );
    }

    /* Scanline sweep animation */
    #nv-loader::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg,
        transparent,
        rgba(0, 229, 255, 0.35),
        rgba(124, 92, 255, 0.5),
        rgba(0, 229, 255, 0.35),
        transparent);
      z-index: 4;
      pointer-events: none;
      animation: nvScanline 2.4s linear infinite;
      opacity: 0.6;
    }

    @keyframes nvScanline {
      from { top: -4px; }
      to   { top: 100%; }
    }

    /* ── Responsive ── */
    @media (max-width: 720px) {
      #nv-counter {
        top: 24px;
        right: 24px;
        font-size: clamp(36px, 10vw, 60px);
      }
      #nv-hud {
        bottom: 28px;
      }
      #nv-hud-bar-wrap {
        width: 180px;
      }
    }

    @media (max-width: 480px) {
      #nv-counter {
        top: 18px;
        right: 18px;
      }
      #nv-hud {
        bottom: 20px;
      }
      #nv-hud-bar-wrap {
        width: 150px;
      }
      #nv-hud-logo {
        font-size: 18px;
      }
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.id = 'nv-loader-style';
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* Prevent portfolio scroll during load */
  document.body.classList.add('nv-loading');

  /* ─────────────────────────────────────────
     3.  HUD helpers
  ───────────────────────────────────────── */
  const loaderEl  = document.getElementById('nv-loader');
  const hudBar    = document.getElementById('nv-hud-bar');
  const hudLabel  = document.getElementById('nv-hud-label');
  const counter   = document.getElementById('nv-counter');
  const flash     = document.getElementById('nv-flash');

  const LABELS = [
    '// initialising workspace',
    '// loading assets',
    '// compiling shaders',
    '// building environment',
    '// powering on monitor',
    '// launching portfolio',
  ];
  let labelIdx = 0;

  function setProgress(pct) {
    hudBar.style.width = pct + '%';
    counter.textContent = String(Math.round(pct)).padStart(2, '0');
    const nextIdx = Math.floor((pct / 100) * LABELS.length);
    if (nextIdx !== labelIdx && nextIdx < LABELS.length) {
      labelIdx = nextIdx;
      hudLabel.textContent = LABELS[labelIdx];
    }
  }

  /* ─────────────────────────────────────────
     4.  Build Three.js scene
         (Three.js is already loaded by index.html)
  ───────────────────────────────────────── */
  initScene();

  function initScene() {
    // Show atmosphere as soon as Three.js is ready
    loaderEl.classList.add('nv-atmo-in');

    if (typeof THREE === 'undefined') {
      // Graceful fallback: just show progress bar without 3D
      runFallbackTimer();
      return;
    }

    /* ── Scene setup ── */
    const wrap     = document.getElementById('nv-canvas-wrap');
    const W        = () => window.innerWidth;
    const H        = () => window.innerHeight;

    const scene    = new THREE.Scene();

    // Isometric-feel: far perspective camera with narrow FOV
    const camera   = new THREE.PerspectiveCamera(22, W() / H(), 0.1, 1000);
    const startPos = new THREE.Vector3(14, 11, 14);
    camera.position.copy(startPos);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W(), H());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    wrap.appendChild(renderer.domElement);

    /* ── Fog ── */
    scene.fog = new THREE.FogExp2(0x050510, 0.045);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(10, 18, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    // Purple rim light (matches --acc-1)
    const rimLight = new THREE.DirectionalLight(0x7C5CFF, 0.4);
    rimLight.position.set(-8, 4, -6);
    scene.add(rimLight);

    // Cyan screen point light (matches --acc-2) — starts at 0
    const screenLight = new THREE.PointLight(0x00E5FF, 0, 12);
    screenLight.position.set(0, 2.7, -0.1);
    scene.add(screenLight);

    /* ── Materials ── */
    const matDesk    = new THREE.MeshStandardMaterial({ color: 0x1a1f3a, roughness: 0.6, metalness: 0.2 });
    const matLeg     = new THREE.MeshStandardMaterial({ color: 0x0d1020, roughness: 0.7 });
    const matChair   = new THREE.MeshStandardMaterial({ color: 0x151a2e, roughness: 0.8 });
    const matMonitor = new THREE.MeshStandardMaterial({ color: 0x0e1326, roughness: 0.4, metalness: 0.4 });
    const matScreen  = new THREE.MeshBasicMaterial({ color: 0x05080f });
    const matScreenGlow = new THREE.MeshBasicMaterial({ color: 0x00E5FF });
    const matKeyboard = new THREE.MeshStandardMaterial({ color: 0x12172b, roughness: 0.5 });
    const matCup     = new THREE.MeshStandardMaterial({ color: 0x7C5CFF, roughness: 0.3, metalness: 0.5 });

    /* ── Workspace group ── */
    const ws = new THREE.Group();
    scene.add(ws);

    /* Grid floor */
    const grid = new THREE.GridHelper(12, 12, 0x7C5CFF, 0x7C5CFF);
    grid.material.opacity    = 0.15;
    grid.material.transparent = true;
    ws.add(grid);

    /* Desk */
    const desk = new THREE.Group();
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 2.0), matDesk);
    deskTop.position.y = 1.5;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    // Subtle chamfered look via edge lines
    const legGeom = new THREE.BoxGeometry(0.18, 1.5, 1.85);
    const legL    = new THREE.Mesh(legGeom, matLeg);
    legL.position.set(-1.95, 0.75, 0);
    const legR    = new THREE.Mesh(legGeom, matLeg);
    legR.position.set( 1.95, 0.75, 0);
    [legL, legR].forEach(l => { l.castShadow = true; });
    desk.add(deskTop, legL, legR);
    ws.add(desk);

    /* Chair */
    const chair = new THREE.Group();
    const seat     = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 1.1), matChair);
    seat.position.set(0, 0.85, 1.6);
    seat.castShadow = true;
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 0.1), matChair);
    backrest.position.set(0, 1.4, 2.1);
    backrest.castShadow = true;
    const base     = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.38, 0.85, 8), matChair);
    base.position.set(0, 0.42, 1.6);
    chair.add(seat, backrest, base);
    ws.add(chair);

    /* Monitor */
    const monitor = new THREE.Group();
    const monBody  = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.55, 0.12), matMonitor);
    monBody.position.set(0, 2.5, -0.42);
    monBody.castShadow = true;
    const monStand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.28, 0.55, 8), matMonitor);
    monStand.position.set(0, 1.75, -0.38);
    const monBase  = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.4), matMonitor);
    monBase.position.set(0, 1.48, -0.38);
    // Screen face (glowing plane)
    let screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.4), matScreen);
    screenMesh.position.set(0, 2.5, -0.35);
    monitor.add(monBody, monStand, monBase, screenMesh);
    ws.add(monitor);

    /* Keyboard */
    const kbd = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.55), matKeyboard);
    kbd.position.set(0, 1.58, 0.55);
    kbd.castShadow = true;
    ws.add(kbd);

    /* Coffee cup */
    const cup = new THREE.Group();
    const cupBody = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.22, 12), matCup);
    cupBody.position.set(1.6, 1.67, -0.3);
    cup.add(cupBody);
    ws.add(cup);

    /* ── Particle field (floating dots) ── */
    const pCount = 220;
    const pGeo   = new THREE.BufferGeometry();
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3 + 0] = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 1] = Math.random() * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0x7C5CFF, size: 0.05, transparent: true, opacity: 0.45
    }));
    scene.add(particles);

    /* ── Animation state ── */
    desk.scale.set(0, 0, 0);
    chair.scale.set(0, 0, 0);
    monitor.scale.set(0, 0, 0);
    kbd.scale.set(0, 0, 0);
    cup.scale.set(0, 0, 0);

    const targetCamPos    = new THREE.Vector3(0, 2.6, 0.4); // diving into screen
    const finalLookTarget = new THREE.Vector3(0, 2.5, -0.35);
    let screenOn = false;
    let finished = false;

    function easeOutBack(x) {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
    function easeInOutQuad(x) {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }
    function lerp(a, b, t) { return a + (b - a) * t; }

    /* TOTAL animation duration in seconds */
    const TOTAL = 3.2;
    const startTime = performance.now();

    function tick() {
      if (finished) return;
      requestAnimationFrame(tick);

      const elapsed = (performance.now() - startTime) / 1000;
      const overallPct = Math.min(elapsed / TOTAL, 1) * 100;
      setProgress(overallPct);

      // 1. Desk: 0.0 → 0.45s
      if (elapsed > 0.0) {
        const p = Math.min(1, elapsed / 0.45);
        const s = easeOutBack(p);
        desk.scale.set(s, s, s);
      }
      // 2. Chair: 0.25 → 0.70s
      if (elapsed > 0.25) {
        const p = Math.min(1, (elapsed - 0.25) / 0.45);
        const s = easeOutBack(p);
        chair.scale.set(s, s, s);
      }
      // 3. Monitor: 0.50 → 0.95s
      if (elapsed > 0.50) {
        const p = Math.min(1, (elapsed - 0.50) / 0.45);
        const s = easeOutBack(p);
        monitor.scale.set(s, s, s);
      }
      // 4. Keyboard: 0.70 → 1.10s
      if (elapsed > 0.70) {
        const p = Math.min(1, (elapsed - 0.70) / 0.40);
        const s = easeOutBack(p);
        kbd.scale.set(s, s, s);
      }
      // 5. Cup: 0.85 → 1.20s
      if (elapsed > 0.85) {
        const p = Math.min(1, (elapsed - 0.85) / 0.35);
        const s = easeOutBack(p);
        cup.scale.set(s, s, s);
      }

      // 6. Screen power-on at 1.3s
      if (elapsed > 1.3 && !screenOn) {
        screenOn = true;
        screenMesh.material = matScreenGlow;
        // Animate light intensity up
        const pOn = Math.min(1, (elapsed - 1.3) / 0.3);
        screenLight.intensity = lerp(0, 5, pOn);
      }
      if (screenOn && elapsed > 1.3) {
        const pOn = Math.min(1, (elapsed - 1.3) / 0.3);
        screenLight.intensity = lerp(0, 5, pOn);
      }

      // 7. Slow orbital camera float (1.3s → 2.0s)
      if (elapsed > 1.3 && elapsed < 2.0) {
        const t = (elapsed - 1.3) / 0.7;
        const angle = t * 0.18; // gentle arc
        camera.position.x = lerp(startPos.x, startPos.x, 1) * Math.cos(angle);
        camera.position.z = lerp(startPos.z, startPos.z, 1) * Math.sin(angle + Math.PI / 4);
        camera.lookAt(0, 1, 0);
      }

      // 8. Camera dive (2.0s → 2.8s)
      if (elapsed > 2.0) {
        const p    = Math.min(1, (elapsed - 2.0) / 0.8);
        const ep   = easeInOutQuad(p);
        camera.position.lerpVectors(startPos, targetCamPos, ep);
        const lk = new THREE.Vector3().lerpVectors(new THREE.Vector3(0, 1, 0), finalLookTarget, ep);
        camera.lookAt(lk);
      }

      // 9. Flash + exit (2.75s)
      if (elapsed > 2.75) {
        const fp = Math.min(1, (elapsed - 2.75) / 0.2);
        flash.style.opacity = fp;
      }

      // Spin particles slowly
      particles.rotation.y += 0.0008;

      renderer.render(scene, camera);

      if (elapsed >= TOTAL) {
        finished = true;
        setProgress(100);
        dismissLoader();
      }
    }

    tick();

    /* Resize */
    window.addEventListener('resize', () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    });
  }

  /* Fallback timer if Three.js fails */
  function runFallbackTimer() {
    let progress = 0;
    const iv = setInterval(() => {
      progress = Math.min(100, progress + 2);
      setProgress(progress);
      if (progress >= 100) { clearInterval(iv); dismissLoader(); }
    }, 56);
  }

  /* ─────────────────────────────────────────
     5.  Dismiss loader
  ───────────────────────────────────────── */
  function dismissLoader() {
    const loader = document.getElementById('nv-loader');
    if (!loader) return;
    loader.classList.add('nv-done');
    document.body.classList.remove('nv-loading');
    // Remove from DOM after transition
    loader.addEventListener('transitionend', () => {
      loader.remove();
      document.getElementById('nv-loader-style')?.remove();
    }, { once: true });
  }

  } // end run()

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run(); // DOM already parsed (script loaded with defer/async)
  }

})();
