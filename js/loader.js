/**
 * NV Portfolio — Isometric Workspace Loader (Enhanced)
 * • Duration: 5 seconds
 * • No numeric counter
 * • Vibrant multi-color palette
 * • Fully responsive
 */
(function () {
  'use strict';

  function run() {

  /* ─────────────────────────────────────────
     1.  Inject loader HTML
  ───────────────────────────────────────── */
  const loaderHTML = `
    <div id="nv-loader" role="progressbar" aria-label="Loading portfolio" aria-valuemin="0" aria-valuemax="100">
      <div id="nv-canvas-wrap"></div>
      <div id="nv-atmo"></div>
      <div id="nv-orbs">
        <span class="nv-orb nv-orb-1"></span>
        <span class="nv-orb nv-orb-2"></span>
        <span class="nv-orb nv-orb-3"></span>
        <span class="nv-orb nv-orb-4"></span>
      </div>
      <div id="nv-flash"></div>
      <div id="nv-logo-burst">
        <div id="nv-burst-ring"></div>
        <div id="nv-burst-ring2"></div>
      </div>
      <div id="nv-hud">
        <div id="nv-hud-logo">NV.</div>
        <div id="nv-hud-bar-wrap">
          <div id="nv-hud-bar"></div>
          <div id="nv-hud-bar-glow"></div>
        </div>
        <div id="nv-hud-label">// initialising workspace</div>
        <div id="nv-pills">
          <span class="nv-pill" id="pill-desk">desk</span>
          <span class="nv-pill" id="pill-chair">chair</span>
          <span class="nv-pill" id="pill-monitor">monitor</span>
          <span class="nv-pill" id="pill-power">power on</span>
        </div>
      </div>
      <span class="nv-corner nv-corner-tl"></span>
      <span class="nv-corner nv-corner-tr"></span>
      <span class="nv-corner nv-corner-bl"></span>
      <span class="nv-corner nv-corner-br"></span>
    </div>
  `;

  const existingLoader = document.getElementById('nv-loader');
  if (!existingLoader) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = loaderHTML.trim();
    document.body.insertBefore(wrapper.firstElementChild, document.body.firstChild);
  }

  /* ─────────────────────────────────────────
     2.  Inject CSS
  ───────────────────────────────────────── */
  const css = `
    body.nv-loading { overflow: hidden; }

    #nv-loader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #04040e;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1),
                  visibility 0.7s cubic-bezier(0.22,1,0.36,1);
      overflow: hidden;
    }
    #nv-loader.nv-done {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

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

    /* Atmosphere */
    #nv-atmo {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background:
        radial-gradient(ellipse 70% 60% at 15% 20%,  rgba(124,92,255,0.28), transparent 65%),
        radial-gradient(ellipse 55% 50% at 85% 15%,  rgba(0,229,255,0.20),  transparent 60%),
        radial-gradient(ellipse 65% 70% at 50% 105%, rgba(255,61,203,0.22), transparent 65%),
        radial-gradient(ellipse 40% 40% at 80% 80%,  rgba(255,165,0,0.14),  transparent 55%),
        radial-gradient(ellipse 45% 35% at 10% 85%,  rgba(52,211,153,0.12), transparent 55%);
      opacity: 0;
      transition: opacity 1s ease;
    }
    #nv-loader.nv-atmo-in #nv-atmo { opacity: 1; }

    /* Orbs */
    #nv-orbs { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
    .nv-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0;
      animation: nvOrbFloat 6s ease-in-out infinite;
    }
    #nv-loader.nv-atmo-in .nv-orb { opacity: 1; }
    .nv-orb-1 {
      width: clamp(180px,25vw,320px); height: clamp(180px,25vw,320px);
      background: radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%);
      top: -8%; left: -5%; animation-delay: 0s; animation-duration: 7s;
    }
    .nv-orb-2 {
      width: clamp(150px,20vw,260px); height: clamp(150px,20vw,260px);
      background: radial-gradient(circle, rgba(0,229,255,0.28), transparent 70%);
      top: 5%; right: -4%; animation-delay: -2s; animation-duration: 8s;
    }
    .nv-orb-3 {
      width: clamp(200px,28vw,380px); height: clamp(200px,28vw,380px);
      background: radial-gradient(circle, rgba(255,61,203,0.25), transparent 70%);
      bottom: -10%; right: 10%; animation-delay: -4s; animation-duration: 9s;
    }
    .nv-orb-4 {
      width: clamp(130px,18vw,220px); height: clamp(130px,18vw,220px);
      background: radial-gradient(circle, rgba(255,165,0,0.20), transparent 70%);
      bottom: 10%; left: 5%; animation-delay: -1.5s; animation-duration: 6.5s;
    }
    @keyframes nvOrbFloat {
      0%,100% { transform: translate(0,0) scale(1); }
      33%     { transform: translate(12px,-16px) scale(1.06); }
      66%     { transform: translate(-8px,10px) scale(0.95); }
    }

    /* Corner accents */
    .nv-corner {
      position: absolute;
      width: clamp(18px,3vw,28px); height: clamp(18px,3vw,28px);
      z-index: 10; opacity: 0;
      transition: opacity 0.6s ease 0.3s;
    }
    #nv-loader.nv-atmo-in .nv-corner { opacity: 1; }
    .nv-corner-tl { top:16px; left:16px;  border-top:2px solid rgba(0,229,255,0.7);   border-left:2px solid rgba(0,229,255,0.7); }
    .nv-corner-tr { top:16px; right:16px; border-top:2px solid rgba(255,61,203,0.7);  border-right:2px solid rgba(255,61,203,0.7); }
    .nv-corner-bl { bottom:16px; left:16px;  border-bottom:2px solid rgba(124,92,255,0.7); border-left:2px solid rgba(124,92,255,0.7); }
    .nv-corner-br { bottom:16px; right:16px; border-bottom:2px solid rgba(255,165,0,0.7);  border-right:2px solid rgba(255,165,0,0.7); }

    /* Burst ring */
    #nv-logo-burst {
      position: absolute; top:50%; left:50%;
      transform: translate(-50%,-50%);
      z-index: 3; pointer-events: none;
    }
    #nv-burst-ring, #nv-burst-ring2 {
      position: absolute; top:50%; left:50%;
      border-radius: 50%;
      transform: translate(-50%,-50%) scale(0);
      opacity: 0;
    }
    #nv-burst-ring {
      width: clamp(60px,12vw,140px); height: clamp(60px,12vw,140px);
      border: 1.5px solid rgba(0,229,255,0.45);
      box-shadow: 0 0 20px rgba(0,229,255,0.2), inset 0 0 20px rgba(0,229,255,0.1);
    }
    #nv-burst-ring2 {
      width: clamp(90px,18vw,210px); height: clamp(90px,18vw,210px);
      border: 1px solid rgba(124,92,255,0.3);
    }
    #nv-loader.nv-atmo-in #nv-burst-ring  { animation: nvRingPulse 2.2s ease-out 0.3s infinite; }
    #nv-loader.nv-atmo-in #nv-burst-ring2 { animation: nvRingPulse 2.2s ease-out 0.9s infinite; }
    @keyframes nvRingPulse {
      0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.8; }
      100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0; }
    }

    /* Flash */
    #nv-flash {
      position: absolute; inset: 0; z-index: 8;
      background: linear-gradient(135deg, #7C5CFF, #00E5FF, #FF3DCB);
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s ease;
    }

    /* HUD */
    #nv-hud {
      position: absolute;
      bottom: clamp(24px,5vh,56px);
      left: 50%;
      transform: translateX(-50%);
      z-index: 9;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(6px,1.2vh,12px);
      width: min(340px,90vw);
    }

    #nv-hud-logo {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-weight: 700;
      font-size: clamp(24px,4vw,36px);
      letter-spacing: 2px;
      background: linear-gradient(110deg, #00E5FF 0%, #7C5CFF 40%, #FF3DCB 70%, #FF9900 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
      animation: nvLogoShimmer 3s linear 0.8s infinite;
    }
    @keyframes nvLogoShimmer {
      0%   { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
    #nv-loader.nv-atmo-in #nv-hud-logo { opacity: 1; transform: translateY(0); }

    /* Progress bar */
    #nv-hud-bar-wrap {
      width: 100%; height: 3px;
      border-radius: 3px;
      background: rgba(255,255,255,0.07);
      overflow: visible;
      position: relative;
    }
    #nv-hud-bar {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, #7C5CFF, #00E5FF, #FF3DCB, #FF9900);
      background-size: 200% auto;
      border-radius: 3px;
      transition: width 0.1s linear;
      animation: nvBarShimmer 2s linear infinite;
      position: relative; z-index: 1;
    }
    @keyframes nvBarShimmer {
      0%   { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
    #nv-hud-bar-glow {
      position: absolute; top: 50%; left: 0;
      width: 0%; height: 14px;
      transform: translateY(-50%);
      background: linear-gradient(90deg, transparent, rgba(0,229,255,0.55), transparent);
      border-radius: 10px; filter: blur(6px);
      transition: width 0.1s linear;
      pointer-events: none;
    }

    #nv-hud-label {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: clamp(9px,1.8vw,12px);
      letter-spacing: 1.8px;
      color: rgba(244,244,251,0.55);
      text-transform: uppercase;
      opacity: 0;
      transition: opacity 0.5s ease 0.3s;
    }
    #nv-loader.nv-atmo-in #nv-hud-label { opacity: 1; }

    /* Pills */
    #nv-pills {
      display: flex; gap: clamp(4px,1vw,8px);
      flex-wrap: wrap; justify-content: center;
    }
    .nv-pill {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: clamp(8px,1.5vw,10px);
      letter-spacing: 1px;
      padding: 3px clamp(6px,1.2vw,10px);
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.28);
      text-transform: uppercase;
      transition: border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
    }
    #pill-desk.active    { border-color:rgba(124,92,255,0.7); color:rgba(160,130,255,1); background:rgba(124,92,255,0.1); box-shadow:0 0 10px rgba(124,92,255,0.3); }
    #pill-chair.active   { border-color:rgba(0,229,255,0.7);  color:rgba(0,229,255,1);   background:rgba(0,229,255,0.1);  box-shadow:0 0 10px rgba(0,229,255,0.3); }
    #pill-monitor.active { border-color:rgba(255,61,203,0.7); color:rgba(255,100,220,1); background:rgba(255,61,203,0.1); box-shadow:0 0 10px rgba(255,61,203,0.3); }
    #pill-power.active   { border-color:rgba(255,165,0,0.7);  color:rgba(255,185,50,1);  background:rgba(255,165,0,0.1);  box-shadow:0 0 10px rgba(255,165,0,0.3); }

    /* Scanline texture */
    #nv-loader::after {
      content: '';
      position: absolute; inset: 0; z-index: 3; pointer-events: none;
      background: repeating-linear-gradient(
        to bottom, transparent, transparent 3px,
        rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px
      );
    }

    /* Scanline sweep */
    #nv-loader::before {
      content: '';
      position: absolute; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg,
        transparent 0%, rgba(0,229,255,0.0) 10%,
        rgba(0,229,255,0.4) 30%, rgba(124,92,255,0.6) 50%,
        rgba(255,61,203,0.4) 70%, rgba(0,229,255,0.0) 90%, transparent 100%);
      z-index: 4; pointer-events: none;
      animation: nvScanline 3s linear infinite;
      opacity: 0.8; filter: blur(1px);
    }
    @keyframes nvScanline {
      from { top: -6px; }
      to   { top: 100%; }
    }

    /* Responsive */
    @media (max-width:600px) {
      #nv-hud { width: min(300px,92vw); }
      .nv-corner-tl,.nv-corner-tr { top: 10px; }
      .nv-corner-bl,.nv-corner-br { bottom: 10px; }
      .nv-corner-tl,.nv-corner-bl { left: 10px; }
      .nv-corner-tr,.nv-corner-br { right: 10px; }
    }
    @media (max-width:380px) {
      #nv-hud-logo { font-size: 20px; }
      #nv-pills { gap: 4px; }
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.id = 'nv-loader-style';
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  document.body.classList.add('nv-loading');

  /* ─────────────────────────────────────────
     3.  HUD helpers
  ───────────────────────────────────────── */
  const loaderEl   = document.getElementById('nv-loader');
  const hudBar     = document.getElementById('nv-hud-bar');
  const hudBarGlow = document.getElementById('nv-hud-bar-glow');
  const hudLabel   = document.getElementById('nv-hud-label');
  const flash      = document.getElementById('nv-flash');

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
    hudBar.style.width     = pct + '%';
    hudBarGlow.style.width = pct + '%';
    const nextIdx = Math.floor((pct / 100) * LABELS.length);
    if (nextIdx !== labelIdx && nextIdx < LABELS.length) {
      labelIdx = nextIdx;
      hudLabel.textContent = LABELS[labelIdx];
    }
  }

  function activatePill(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  /* ─────────────────────────────────────────
     4.  Three.js scene
  ───────────────────────────────────────── */
  initScene();

  function initScene() {
    loaderEl.classList.add('nv-atmo-in');

    if (typeof THREE === 'undefined') {
      runFallbackTimer();
      return;
    }

    const wrap = document.getElementById('nv-canvas-wrap');
    const W    = () => window.innerWidth;
    const H    = () => window.innerHeight;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(22, W() / H(), 0.1, 1000);
    const startPos = new THREE.Vector3(14, 11, 14);
    camera.position.copy(startPos);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W(), H());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    wrap.appendChild(renderer.domElement);

    scene.fog = new THREE.FogExp2(0x04040e, 0.038);

    /* Lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.65);
    keyLight.position.set(10, 18, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7C5CFF, 0.5);
    rimLight.position.set(-8, 4, -6);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x00E5FF, 0.3);
    fillLight.position.set(0, -6, 8);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xFF3DCB, 0.25);
    backLight.position.set(4, 2, -10);
    scene.add(backLight);

    const screenLight = new THREE.PointLight(0x00E5FF, 0, 14);
    screenLight.position.set(0, 2.7, -0.1);
    scene.add(screenLight);

    const accentLight = new THREE.PointLight(0xFF9900, 0, 8);
    accentLight.position.set(2.2, 2.2, 0.5);
    scene.add(accentLight);

    /* Materials */
    const matDesk      = new THREE.MeshStandardMaterial({ color: 0x1a1f3a, roughness: 0.55, metalness: 0.25 });
    const matLeg       = new THREE.MeshStandardMaterial({ color: 0x0d1020, roughness: 0.7 });
    const matChair     = new THREE.MeshStandardMaterial({ color: 0x151a2e, roughness: 0.8 });
    const matMonitor   = new THREE.MeshStandardMaterial({ color: 0x0e1326, roughness: 0.4, metalness: 0.45 });
    const matScreen    = new THREE.MeshBasicMaterial({ color: 0x05080f });
    const matScreenGlow= new THREE.MeshBasicMaterial({ color: 0x00E5FF });
    const matKeyboard  = new THREE.MeshStandardMaterial({ color: 0x12172b, roughness: 0.5 });
    const matCup       = new THREE.MeshStandardMaterial({ color: 0xFF3DCB, roughness: 0.3, metalness: 0.4 });
    const matBook      = new THREE.MeshStandardMaterial({ color: 0x7C5CFF, roughness: 0.6 });
    const matPlant     = new THREE.MeshStandardMaterial({ color: 0x34D399, roughness: 0.7 });

    const ws = new THREE.Group();
    scene.add(ws);

    /* Grid */
    const grid = new THREE.GridHelper(14, 14, 0x7C5CFF, 0x7C5CFF);
    grid.material.opacity = 0.18;
    grid.material.transparent = true;
    ws.add(grid);

    /* Desk */
    const desk    = new THREE.Group();
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.12, 2.1), matDesk);
    deskTop.position.y = 1.5; deskTop.castShadow = true; deskTop.receiveShadow = true;
    const legGeom = new THREE.BoxGeometry(0.18, 1.5, 1.95);
    const legL    = new THREE.Mesh(legGeom, matLeg); legL.position.set(-2.0, 0.75, 0);
    const legR    = new THREE.Mesh(legGeom, matLeg); legR.position.set( 2.0, 0.75, 0);
    legL.castShadow = legR.castShadow = true;
    desk.add(deskTop, legL, legR);
    ws.add(desk);

    /* Chair */
    const chair    = new THREE.Group();
    const seat     = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.1, 1.15), matChair);
    seat.position.set(0, 0.85, 1.7); seat.castShadow = true;
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 0.1), matChair);
    backrest.position.set(0, 1.45, 2.2); backrest.castShadow = true;
    const base     = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.38, 0.85, 8), matChair);
    base.position.set(0, 0.42, 1.7);
    chair.add(seat, backrest, base);
    ws.add(chair);

    /* Monitor */
    const monitor  = new THREE.Group();
    const monBody  = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.6, 0.12), matMonitor);
    monBody.position.set(0, 2.52, -0.44); monBody.castShadow = true;
    const monStand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.28, 0.56, 8), matMonitor);
    monStand.position.set(0, 1.77, -0.40);
    const monBase  = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.05, 0.45), matMonitor);
    monBase.position.set(0, 1.50, -0.40);
    let screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.45), matScreen);
    screenMesh.position.set(0, 2.52, -0.37);
    monitor.add(monBody, monStand, monBase, screenMesh);
    ws.add(monitor);

    /* Keyboard */
    const kbd = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.06, 0.56), matKeyboard);
    kbd.position.set(0, 1.58, 0.55); kbd.castShadow = true;
    ws.add(kbd);

    /* Cup */
    const cup     = new THREE.Group();
    const cupBody = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.23, 12), matCup);
    cupBody.position.set(1.7, 1.67, -0.32);
    cup.add(cupBody); ws.add(cup);

    /* Books */
    const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.06, 0.32), matBook);
    book1.position.set(-1.5, 1.59, -0.3);
    const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.30), matDesk);
    book2.position.set(-1.5, 1.65, -0.3);
    ws.add(book1, book2);

    /* Plant */
    const plantBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.14, 8), matCup);
    plantBase.position.set(-1.8, 1.65, 0.3);
    const plantTop  = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), matPlant);
    plantTop.position.set(-1.8, 1.84, 0.3);
    ws.add(plantBase, plantTop);

    /* Particles */
    const pCount = 280;
    const pGeo   = new THREE.BufferGeometry();
    const pPos   = new Float32Array(pCount * 3);
    const pCol   = new Float32Array(pCount * 3);
    const palette = [[0.49,0.36,1.0],[0.0,0.9,1.0],[1.0,0.24,0.80],[1.0,0.65,0.0],[0.20,0.83,0.60]];
    for (let i = 0; i < pCount; i++) {
      pPos[i*3+0] = (Math.random()-0.5)*24;
      pPos[i*3+1] = Math.random()*12;
      pPos[i*3+2] = (Math.random()-0.5)*24;
      const c = palette[Math.floor(Math.random()*palette.length)];
      pCol[i*3+0]=c[0]; pCol[i*3+1]=c[1]; pCol[i*3+2]=c[2];
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.06, vertexColors: true, transparent: true, opacity: 0.5
    }));
    scene.add(particles);

    /* Scale everything to 0 */
    [desk, chair, monitor, kbd, cup, book1, book2, plantBase, plantTop].forEach(o => o.scale.set(0,0,0));

    const targetCamPos    = new THREE.Vector3(0, 2.6, 0.5);
    const finalLookTarget = new THREE.Vector3(0, 2.52, -0.37);
    let screenOn = false, finished = false;
    let deskActive=false, chairActive=false, monitorActive=false, powerActive=false;

    function easeOutBack(x) {
      const c1=1.70158, c3=c1+1;
      return 1 + c3*Math.pow(x-1,3) + c1*Math.pow(x-1,2);
    }
    function easeInOutQuad(x) { return x<0.5 ? 2*x*x : 1-Math.pow(-2*x+2,2)/2; }
    function lerp(a,b,t) { return a+(b-a)*t; }

    /* ── 5-second total ── */
    const TOTAL = 5.0;
    const startTime = performance.now();

    function tick() {
      if (finished) return;
      requestAnimationFrame(tick);

      const elapsed    = (performance.now() - startTime) / 1000;
      const overallPct = Math.min(elapsed / TOTAL, 1) * 100;
      setProgress(overallPct);

      // Desk: 0.0 → 0.65s
      if (elapsed > 0.0) {
        const p=Math.min(1,elapsed/0.65), s=easeOutBack(p);
        desk.scale.set(s,s,s);
        if (!deskActive && p>0.05) { deskActive=true; activatePill('pill-desk'); }
      }
      // Chair: 0.5 → 1.15s
      if (elapsed > 0.5) {
        const p=Math.min(1,(elapsed-0.5)/0.65), s=easeOutBack(p);
        chair.scale.set(s,s,s);
        if (!chairActive && p>0.05) { chairActive=true; activatePill('pill-chair'); }
      }
      // Monitor: 1.0 → 1.7s
      if (elapsed > 1.0) {
        const p=Math.min(1,(elapsed-1.0)/0.70), s=easeOutBack(p);
        monitor.scale.set(s,s,s);
        if (!monitorActive && p>0.05) { monitorActive=true; activatePill('pill-monitor'); }
      }
      // Keyboard: 1.3 → 1.85s
      if (elapsed > 1.3) {
        const p=Math.min(1,(elapsed-1.3)/0.55), s=easeOutBack(p);
        kbd.scale.set(s,s,s);
      }
      // Cup: 1.5 → 1.95s
      if (elapsed > 1.5) {
        const p=Math.min(1,(elapsed-1.5)/0.45), s=easeOutBack(p);
        cup.scale.set(s,s,s);
      }
      // Books + plant: 1.7s
      if (elapsed > 1.7) {
        const p=Math.min(1,(elapsed-1.7)/0.40), s=easeOutBack(p);
        book1.scale.set(s,s,s); book2.scale.set(s,s,s);
        plantBase.scale.set(s,s,s); plantTop.scale.set(s,s,s);
      }
      // Screen power-on: 2.4s
      if (elapsed > 2.4 && !screenOn) {
        screenOn = true;
        screenMesh.material = matScreenGlow;
        if (!powerActive) { powerActive=true; activatePill('pill-power'); }
      }
      if (screenOn && elapsed > 2.4) {
        const pOn = Math.min(1,(elapsed-2.4)/0.5);
        screenLight.intensity = lerp(0, 6, pOn);
        accentLight.intensity = lerp(0, 3, pOn);
      }
      // Orbital float: 2.4s → 3.6s
      if (elapsed > 2.4 && elapsed < 3.6) {
        const t = (elapsed-2.4)/1.2;
        const angle = t*0.22;
        camera.position.x = startPos.x*Math.cos(angle);
        camera.position.z = startPos.z*Math.sin(angle+Math.PI/4);
        camera.lookAt(0,1,0);
      }
      // Camera dive: 3.6s → 4.6s
      if (elapsed > 3.6) {
        const p  = Math.min(1,(elapsed-3.6)/1.0);
        const ep = easeInOutQuad(p);
        camera.position.lerpVectors(startPos, targetCamPos, ep);
        const lk = new THREE.Vector3().lerpVectors(new THREE.Vector3(0,1,0), finalLookTarget, ep);
        camera.lookAt(lk);
      }
      // Flash: 4.6s → 4.9s
      if (elapsed > 4.6) {
        const fp = Math.min(1,(elapsed-4.6)/0.3);
        flash.style.opacity = fp;
      }

      particles.rotation.y += 0.0006;
      renderer.render(scene, camera);

      if (elapsed >= TOTAL) {
        finished = true;
        setProgress(100);
        dismissLoader();
      }
    }

    tick();

    window.addEventListener('resize', () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    });
  }

  function runFallbackTimer() {
    let progress = 0;
    const iv = setInterval(() => {
      progress = Math.min(100, progress + 1.5);
      setProgress(progress);
      if (progress >= 20) activatePill('pill-desk');
      if (progress >= 40) activatePill('pill-chair');
      if (progress >= 60) activatePill('pill-monitor');
      if (progress >= 80) activatePill('pill-power');
      if (progress >= 100) { clearInterval(iv); dismissLoader(); }
    }, 75);
  }

  /* ─────────────────────────────────────────
     5.  Dismiss
  ───────────────────────────────────────── */
  function dismissLoader() {
    const loader = document.getElementById('nv-loader');
    if (!loader) return;
    loader.classList.add('nv-done');
    document.body.classList.remove('nv-loading');
    loader.addEventListener('transitionend', () => {
      loader.remove();
      document.getElementById('nv-loader-style')?.remove();
    }, { once: true });
  }

  } // end run()

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
