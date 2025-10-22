/* Netech Ltd — Global JS
   - Accessible nav + active state
   - Sticky navbar shadow
   - Mark current page
   - Reveal on scroll
   - Portfolio filters
   - Contact form (Formspree AJAX)
   - Contact page: preselect service + prefill message via URL params
   - Services: chip scroller (arrows, progress, deep links, keyboard nav)
   - Promo carousel (lightweight, auto-play, arrows, dots, swipe)
   - Homepage hero: rotating benefit statements
   - Hero canvas (aurora + constellation) with stabilized resize
   - Footer year
*/

/* =============== Accessible hamburger + active state =============== */
(() => {
  const menuButton = document.getElementById('menuButton');
  const navMenu = document.getElementById('primary-navigation');

  if (!menuButton || !navMenu) return;

  function toggleMenu(forceOpen) {
    const expanded = forceOpen !== undefined ? !forceOpen : menuButton.getAttribute('aria-expanded') === 'true';
    const next = !expanded;
    menuButton.setAttribute('aria-expanded', String(next));
    menuButton.classList.toggle('active', next);
    navMenu.classList.toggle('active', next);
    if (next) navMenu.querySelector('a')?.focus();
  }

  menuButton.addEventListener('click', () => toggleMenu());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMenu(false);
      menuButton.focus();
    }
  }, { passive: true });

  document.querySelectorAll('.nav-link').forEach(n =>
    n.addEventListener('click', () => toggleMenu(false))
  );
})();

/* =============== Navbar shadow on scroll =============== */
(() => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.style.boxShadow = (window.scrollY > 50) ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* =============== Mark current page for screen readers and styling =============== */
(() => {
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === current) link.setAttribute('aria-current', 'page');
  });
})();

/* =============== Reveal on scroll =============== */
(() => {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('reveal--visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealEls.forEach(el => io.observe(el));
})();

/* =============== Portfolio filters (safe on all pages) =============== */
(() => {
  const filters = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (!filters.length || !items.length) return;

  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    items.forEach(it => {
      const show = f === 'all' || it.dataset.category === f;
      it.style.display = show ? '' : 'none';
    });
  }));
})();

/* =============== Contact form (Formspree AJAX) =============== */
(() => {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (!form || !statusEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      statusEl.textContent = 'Please fill out all required fields.';
      return;
    }
    statusEl.textContent = 'Sending...';
    try {
      const data = new FormData(form);
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        statusEl.textContent = 'Thanks! We will get back to you shortly.';
        form.reset();
      } else {
        statusEl.textContent = 'Something went wrong. Please email conet@gmail.com.';
      }
    } catch {
      statusEl.textContent = 'Network error. Please try again later.';
    }
  });
})();

/* =============== Contact page: pre-select service + pre-fill message via URL params =============== */
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const params = new URLSearchParams(location.search);
  const rawKey = (params.get('service') || '').toLowerCase();
  const wantsSamples = params.has('samples');

  const serviceMap = {
    'branding-logo':          { select: 'branding',  label: 'Logo & Identity Systems' },
    'branding-guidelines':    { select: 'branding',  label: 'Brand Guidelines' },
    'branding-social':        { select: 'branding',  label: 'Social & Ad Creative' },
    'web-landing':            { select: 'web',       label: 'Corporate & Landing Pages' },
    'web-cms':                { select: 'web',       label: 'CMS & Blog' },
    'web-care':               { select: 'web',       label: 'Care Plans (Hosting & Maintenance)' },
    'ecom-store':             { select: 'ecommerce', label: 'Store Setup' },
    'ecom-payments':          { select: 'ecommerce', label: 'Payments Integrations' },
    'video-intros':           { select: 'content',   label: 'Brand Intros & About Videos' },
    'video-reels':            { select: 'content',   label: 'Explainers & Reels' },
    'seo-foundations':        { select: 'growth',    label: 'SEO Foundations' },
    'seo-content-engine':     { select: 'growth',    label: 'Content Engine' },
    'software-apps':          { select: 'software',  label: 'Web Apps & Portals' },
    'software-integrations':  { select: 'software',  label: 'Integrations & Automation' },
    'analytics-kpi':          { select: 'analytics', label: 'KPI & Tracking' },
    'analytics-dashboards':   { select: 'analytics', label: 'Dashboards & Pipelines' },
    'cloud-migration':        { select: 'it',        label: 'Cloud Setup/Migration' },
    'cloud-identity':         { select: 'it',        label: 'Identity & Access' },
    'sec-audit':              { select: 'security',  label: 'Security Audits & Hardening' },
    'sec-policy':             { select: 'security',  label: 'Policies & Training' },
    'support-sla':            { select: 'support',   label: 'Helpdesk & SLAs' },
    'maintenance':            { select: 'support',   label: 'Monthly Maintenance' },
    'training-cms':           { select: 'training',  label: 'CMS & Site Editing' },
    'training-analytics':     { select: 'training',  label: 'Analytics Deep‑Dives' }
  };

  const chosen = serviceMap[rawKey];
  const selectEl = form.querySelector('#service');
  const msgEl = form.querySelector('#message');

  if (chosen && selectEl) selectEl.value = chosen.select;

  if (chosen && msgEl && !msgEl.value.trim()) {
    const intro = wantsSamples
      ? `Please share a few recent samples for: ${chosen.label}.`
      : `I’m interested in: ${chosen.label}.`;
    msgEl.value = [
      intro,
      '',
      'Company: ',
      'Budget range: ',
      'Target timeline: ',
      'Anything else you should know: '
    ].join('\n');
  }

  const subj = form.querySelector('input[name="_subject"]');
  if (chosen && subj) subj.value = `New ${chosen.label} inquiry from CoNet website`;

  const nameParam = params.get('name');
  const emailParam = params.get('email');
  if (nameParam) form.querySelector('#name')?.setAttribute('value', nameParam);
  if (emailParam) form.querySelector('#email')?.setAttribute('value', emailParam);

  if (chosen) {
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    form.querySelector('#name')?.focus();
  }
})();

/* =============== Services filters + chip scroller + deep link + keyboard nav + progress bar =============== */
(() => {
  const container = document.querySelector('.service-filters');
  const blocks = document.querySelectorAll('.service-block');
  if (!container || !blocks.length) return;

  const chips = container.querySelectorAll('.chip');
  const scroller = container.querySelector('.chips-scroller') || container;
  const prev = container.querySelector('.chip-nav.prev');
  const next = container.querySelector('.chip-nav.next');
  const progressBar = container.querySelector('.chip-progress__bar');

  // Ensure keyboard focus for arrow navigation
  if (!scroller.hasAttribute('tabindex')) scroller.setAttribute('tabindex', '0');

  function apply(filter) {
    chips.forEach(c => {
      const active = c.dataset.filter === filter || (filter === 'all' && c.dataset.filter === 'all');
      c.classList.toggle('is-active', active);
      c.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    blocks.forEach(b => b.hidden = !(filter === 'all' || b.id === filter));
  }

  function ensureInView(el) {
    if (!scroller || !el) return;
    const r = scroller.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    if (er.left < r.left) scroller.scrollBy({ left: er.left - r.left - 16, behavior: 'smooth' });
    else if (er.right > r.right) scroller.scrollBy({ left: er.right - r.right + 16, behavior: 'smooth' });
  }

  function updateArrows() {
    if (!prev || !next || !scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    prev.disabled = scroller.scrollLeft <= 6 || max <= 0;
    next.disabled = scroller.scrollLeft >= (max - 6) || max <= 0;
  }

  function updateProgress() {
    if (!progressBar || !scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    if (max <= 0) { progressBar.style.width = '100%'; return; }
    const ratio = Math.min(1, Math.max(0, scroller.scrollLeft / max));
    progressBar.style.width = `${ratio * 100}%`;
  }

  chips.forEach(chip => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    history.replaceState(null, '', f === 'all' ? '#services' : '#' + f);
    apply(f);
    ensureInView(chip);

    const hero = document.querySelector('.page-hero') || document.querySelector('.page-header');
    const top = (hero?.offsetTop || 0) + (hero?.offsetHeight || 0) - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  }));

  if (prev && next && scroller) {
    const step = 320;
    prev.addEventListener('click', () => scroller.scrollBy({ left: -step, behavior: 'smooth' }));
    next.addEventListener('click', () => scroller.scrollBy({ left: step, behavior: 'smooth' }));
    scroller.addEventListener('scroll', () => { updateArrows(); updateProgress(); }, { passive: true });
    window.addEventListener('resize', () => { updateArrows(); updateProgress(); });
  }

  scroller.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const list = Array.from(chips);
    const active = container.querySelector('.chip.is-active');
    let idx = Math.max(0, list.indexOf(active));
    idx = e.key === 'ArrowRight' ? Math.min(list.length - 1, idx + 1) : Math.max(0, idx - 1);
    list[idx]?.click();
  });

  window.addEventListener('hashchange', () => {
    const hash = location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      const chip = container.querySelector(`.chip[data-filter="${hash}"]`);
      chip?.click();
    }
  });

  const hash = location.hash.replace('#', '');
  apply(hash && document.getElementById(hash) ? hash : 'all');
  updateArrows();
  updateProgress();
})();

/* =============== Promo carousel (lightweight, no deps) =============== */
(() => {
  const root = document.querySelector('.promo-carousel');
  if (!root) return;

  const viewport = root.querySelector('.promo-viewport');
  const track = root.querySelector('.promo-track');
  const slides = root.querySelectorAll('.promo-slide');
  const dotsWrap = root.querySelector('.promo-dots');
  const prev = root.querySelector('.promo-prev');
  const next = root.querySelector('.promo-next');
  if (!slides.length || !viewport || !track || !dotsWrap) return;

  let i = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intervalMs = 5000;
  let timer = null;

  function renderDots() {
    dotsWrap.innerHTML = '';
    slides.forEach((_, idx) => {
      const b = document.createElement('button');
      b.className = 'promo-dot';
      b.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      b.addEventListener('click', () => go(idx));
      dotsWrap.appendChild(b);
    });
  }

  function go(to) {
    i = (to + slides.length) % slides.length;
    track.style.transition = 'transform .45s ease';
    track.style.transform = `translateX(-${i * 100}%)`;
    dotsWrap.querySelectorAll('.promo-dot').forEach((d, di) => d.classList.toggle('is-active', di === i));
  }

  function play() { if (!reduced) { stop(); timer = setInterval(() => go(i + 1), intervalMs); } }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  prev?.addEventListener('click', () => { go(i - 1); play(); });
  next?.addEventListener('click', () => { go(i + 1); play(); });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', play);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', play);

  let dragging = false, startX = 0, currentX = 0;
  const pxToPct = (px) => (px / (viewport.clientWidth || 1)) * 100;

  function onDown(e) {
    dragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    currentX = startX;
    track.style.transition = 'none';
    stop();
  }
  function onMove(e) {
    if (!dragging) return;
    currentX = (e.touches ? e.touches[0].clientX : e.clientX);
    const dx = currentX - startX;
    track.style.transform = `translateX(calc(-${i * 100}% + ${pxToPct(dx)}%))`;
  }
  function onUp() {
    if (!dragging) return;
    const dx = currentX - startX;
    dragging = false;
    const threshold = 50;
    if (dx > threshold) i = Math.max(0, i - 1);
    else if (dx < -threshold) i = Math.min(slides.length - 1, i + 1);
    go(i);
    play();
  }

  viewport.addEventListener('touchstart', onDown, { passive: true });
  viewport.addEventListener('touchmove', onMove, { passive: true });
  viewport.addEventListener('touchend', onUp);
  viewport.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  renderDots();
  go(0);
  play();
})();

/* =============== Homepage hero: rotating benefit statements =============== */
(() => {
  const container = document.getElementById('hero-rotator');
  if (!container) return;

  const items = Array.from(container.querySelectorAll('.rotator-item'));
  if (items.length < 2) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let i = 0;
  const delay = 4000;
  let timer;

  function show(n) {
    items.forEach((el, idx) => el.classList.toggle('is-active', idx === n));
  }
  function start() { stop(); timer = setInterval(() => { i = (i + 1) % items.length; show(i); }, delay); }
  function stop()  { if (timer) clearInterval(timer); }

  // If reduced motion, show first item only
  if (reduce) {
    show(0);
    return;
  }

  // Start/stop when in view if supported; otherwise always run
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.2 });
    io.observe(container);
    show(0);
  } else {
    show(0);
    start();
  }
})();

/* =============== Aurora + Constellation canvas (hero) — stabilized resize =============== */
(() => {
  const canvas = document.getElementById('hero-aurora');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  let DPR = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, t = 0;
  let blobs = [];
  let particles = [];
  let mouse = { x: null, y: null, vx: 0, vy: 0 };
  let initialized = false;

  function rand(min, max){ return Math.random() * (max - min) + min; }

  const COLORS = [
    { r: 212, g: 175, b: 55 },
    { r: 231, g: 76,  b: 60 },
    { r: 255, g: 255, b: 255 }
  ];

  function applySize(cw, ch) {
    const roundedW = Math.ceil(cw);
    const roundedH = Math.ceil(ch);

    const widthDelta  = Math.abs(roundedW - w);
    const heightDelta = Math.abs(roundedH - h);

    if (widthDelta < 1 && heightDelta < 1) return;

    const prevW = w, prevH = h;
    w = roundedW; h = roundedH;

    DPR = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const bigChange = Math.abs(w - prevW) > 60 || Math.abs(h - prevH) > 60;
    if (!initialized || bigChange) {
      initBlobs();
      initParticles();
      initialized = true;
    }
  }

  function initBlobs(){
    const count = isTouch ? 3 : 5;
    const minSide = Math.min(w, h);
    blobs = Array.from({length: count}).map((_, i) => {
      const c = COLORS[i % COLORS.length];
      return {
        x: rand(-0.1*w, 1.1*w), y: rand(-0.1*h, 1.1*h),
        r: rand(minSide * 0.28, minSide * 0.45),
        vx: rand(-0.15, 0.15), vy: rand(-0.15, 0.15),
        phase: rand(0, Math.PI * 2), color: c
      };
    });
  }

  function initParticles(){
    const density = isTouch ? 14000 : 9000;
    const count = Math.min(150, Math.floor((w*h)/density));
    particles = Array.from({length: count}).map(() => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: rand(-0.3,0.3), vy: rand(-0.3,0.3),
      size: rand(1,2)
    }));
  }

  function drawBackground(){
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0, '#0c1219');
    g.addColorStop(1, '#182334');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);
  }

  function drawBlobs(time){
    ctx.globalCompositeOperation = 'lighter';
    blobs.forEach(b => {
      b.x += b.vx + (mouse.vx * 0.02);
      b.y += b.vy + (mouse.vy * 0.02);
      if (b.x < -b.r) b.x = w + b.r;
      if (b.x > w + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = h + b.r;
      if (b.y > h + b.r) b.y = -b.r;

      const pulse = 0.06 * Math.sin(time * 0.001 + b.phase);
      const R = b.r * (1 + pulse);
      const grad = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,R);
      const c = b.color;
      grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.55)`);
      grad.addColorStop(0.6, `rgba(${c.r},${c.g},${c.b},0.12)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(b.x,b.y,R,0,Math.PI*2); ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawParticles(time){
    const flowStrength = 0.05;
    const linkDist = isTouch ? 110 : 140;

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    particles.forEach(p => {
      p.vx += Math.cos((p.y + time*0.06)/70) * flowStrength;
      p.vy += Math.sin((p.x + time*0.06)/90) * flowStrength;

      if (mouse.x !== null){
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx*dx + dy*dy;
        if (d2 < 16000){
          const f = 0.08 / Math.max(60, Math.sqrt(d2));
          p.vx += dx*f; p.vy += dy*f;
        }
      }

      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.98; p.vy *= 0.98;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
    });

    ctx.lineWidth = 1;
    particles.forEach((a,i) => {
      for (let j=i+1;j<particles.length;j++){
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx*dx + dy*dy;
        if (d2 < linkDist*linkDist){
          const alpha = 1 - d2/(linkDist*linkDist);
          ctx.strokeStyle = `rgba(255,255,255,${alpha*0.25})`;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    });
  }

  function tick(now){
    t = now;
    drawBackground();
    drawBlobs(t);
    drawParticles(t);
    requestAnimationFrame(tick);
  }

  function onMouse(e){
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left; const y = e.clientY - r.top;
    mouse.vx = (x - (mouse.x ?? x)) * 0.3;
    mouse.vy = (y - (mouse.y ?? y)) * 0.3;
    mouse.x = x; mouse.y = y;
  }
  function onLeave(){ mouse.x = mouse.y = null; mouse.vx = mouse.vy = 0; }

  const target = canvas.parentElement || canvas;
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      applySize(rect.width, rect.height);
    });
    ro.observe(target);
  } else {
    const fallbackResize = () => applySize(target.clientWidth, target.clientHeight);
    window.addEventListener('resize', fallbackResize, { passive: true });
    fallbackResize();
  }

  const initRect = (target.getBoundingClientRect ? target.getBoundingClientRect() : canvas.getBoundingClientRect());
  applySize(initRect.width, initRect.height);
  requestAnimationFrame(tick);

  if (!isTouch){
    canvas.addEventListener('mousemove', onMouse, { passive: true });
    canvas.addEventListener('mouseleave', onLeave);
  }
})();

/* =============== Footer year =============== */
(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
