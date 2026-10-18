(() => {
  const nav = document.querySelector('.site-nav');
  const toggle = nav?.querySelector('.nav__toggle');
  const panel = nav?.querySelector('.nav__panel');
  if (!nav || !toggle || !panel) return;

  const desktopQuery = window.matchMedia('(min-width: 769px)');
  const setMenuOpen = (open, returnFocus = false) => {
    nav.classList.toggle('is-open', open);
    panel.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open && returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', event => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('click', event => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false, true);
  });
  desktopQuery.addEventListener('change', event => {
    if (event.matches) setMenuOpen(false);
  });

  const navItems = Array.from(nav.querySelectorAll('.nav__links li'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 1900;
  const triggerScroll = 24;
  const segment = 0.62;
  const step = 0.19;
  const slideGap = 48;
  const clamp = value => Math.min(1, Math.max(0, value));

  // iOS-style ease: fast start, long soft settle
  const bezier = (x1, y1, x2, y2) => {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sampleX = t => ((ax * t + bx) * t + cx) * t;
    const sampleY = t => ((ay * t + by) * t + cy) * t;
    const slopeX = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => {
      if (x <= 0 || x >= 1) return clamp(x);
      let t = x;
      for (let i = 0; i < 8; i++) {
        const err = sampleX(t) - x;
        if (Math.abs(err) < 1e-5) break;
        const slope = slopeX(t);
        if (Math.abs(slope) < 1e-6) break;
        t -= err / slope;
      }
      return sampleY(t);
    };
  };
  const ease = bezier(0.32, 0.72, 0, 1);

  let offsets = [];
  let progress = 0;
  let target = 0;
  let lastTime = 0;
  let frame = 0;

  const measureNav = () => {
    navItems.forEach(item => { item.style.transform = ''; });
    if (!desktopQuery.matches) {
      nav.style.removeProperty('--nav-progress');
      return;
    }
    const rects = navItems.map(item => item.getBoundingClientRect());
    const totalWidth = rects.reduce((sum, rect) => sum + rect.width, 0) + slideGap * (rects.length - 1);
    let cursor = (document.documentElement.clientWidth - totalWidth) / 2;
    offsets = rects.map(rect => {
      const offset = { x: cursor - rect.left, y: rects[0].top - rect.top };
      cursor += rect.width + slideGap;
      return offset;
    });
    renderNav();
  };

  const renderNav = () => {
    if (!desktopQuery.matches || !offsets.length) return;
    nav.style.setProperty('--nav-progress', ease(progress).toFixed(3));
    navItems.forEach((item, index) => {
      const t = ease(clamp((progress - index * step) / segment));
      const riseShare = index === 0 ? 0 : 0.35;
      const rise = riseShare ? ease(clamp(t / riseShare)) : 0;
      const slide = ease(clamp((t - riseShare) / (1 - riseShare)));
      item.style.transform = `translate(${offsets[index].x * slide}px, ${offsets[index].y * rise}px)`;
    });
  };

  const tick = now => {
    const delta = Math.min(now - lastTime, 50);
    lastTime = now;
    const direction = Math.sign(target - progress);
    progress = clamp(progress + direction * delta / duration);
    if ((direction > 0 && progress >= target) || (direction < 0 && progress <= target)) progress = target;
    renderNav();
    frame = progress === target ? 0 : requestAnimationFrame(tick);
  };

  const updateScrolled = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', updateScrolled, { passive: true });
  updateScrolled();

  const updateTarget = () => {
    if (!desktopQuery.matches) return;
    target = window.scrollY > triggerScroll ? 1 : 0;
    if (reducedMotion.matches) {
      progress = target;
      renderNav();
      return;
    }
    if (!frame && progress !== target) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  window.addEventListener('scroll', updateTarget, { passive: true });
  window.addEventListener('resize', measureNav);
  desktopQuery.addEventListener('change', measureNav);
  if (document.fonts?.ready) document.fonts.ready.then(measureNav);
  measureNav();
  updateTarget();
})();
