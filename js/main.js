/* ============================================================
   MAIN — Orchestrator
   - Custom cursor (mouse-following with ease)
   - Smooth nav-link scrolling
   - Hover-aware cursor states
   - Reveal-on-scroll for section headers
   - Mail form submit feedback
   - Initializes all section modules
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Custom Cursor ---------- */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  if (cursor && cursorDot && window.matchMedia('(min-width: 901px)').matches) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    // Hover state on interactive elements
    const hoverSelectors = 'a, button, input, textarea, .skill-label, .project-card, .puzzle-piece';
    document.querySelectorAll(hoverSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });

    // Re-attach for elements added later (skills, projects, socials)
    const observer = new MutationObserver(() => {
      document.querySelectorAll(hoverSelectors).forEach((el) => {
        if (el.dataset.cursorWired) return;
        el.dataset.cursorWired = '1';
        el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- 2. Smooth Scroll for Nav ---------- */
  document.querySelectorAll('a[data-scroll]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- 3. Reveal-on-scroll for section headers ---------- */
  const reveals = document.querySelectorAll('.section-header, .footer-grid, .footer-bottom');
  reveals.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  reveals.forEach((el) => io.observe(el));

  /* ---------- 4. Init section modules ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    if (window.Portfolio && window.Portfolio.initHero) window.Portfolio.initHero();
    if (window.Portfolio && window.Portfolio.initSkills) window.Portfolio.initSkills();
    if (window.Portfolio && window.Portfolio.initProjects) window.Portfolio.initProjects();
    if (window.Portfolio && window.Portfolio.initSocials) window.Portfolio.initSocials();
  });

  // If DOM is already loaded by the time we get here, init now
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    if (window.Portfolio && window.Portfolio.initHero) window.Portfolio.initHero();
    if (window.Portfolio && window.Portfolio.initSkills) window.Portfolio.initSkills();
    if (window.Portfolio && window.Portfolio.initProjects) window.Portfolio.initProjects();
    if (window.Portfolio && window.Portfolio.initSocials) window.Portfolio.initSocials();
  }
})();
