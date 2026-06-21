/**
 * MANOHAR SIR COACHING — script.js
 * Vanilla JS | No dependencies | Mobile-first
 */
'use strict';

/* ══════════════════════════════════
   1. NAV — scroll class + mobile menu
══════════════════════════════════ */
(function initNav() {
  const nav     = document.getElementById('nav');
  const burger  = document.getElementById('burger');
  const menu    = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');
  const closeBtn = document.getElementById('menu-close');
  if (!nav || !burger || !menu) return;

  // Scrolled class
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const openMenu = () => {
    menu.classList.add('open');
    overlay.classList.add('show');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    menu.classList.remove('open');
    overlay.classList.remove('show');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () =>
    menu.classList.contains('open') ? closeMenu() : openMenu()
  );
  closeBtn?.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Close on any link with [data-close]
  menu.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeMenu));
})();


/* ══════════════════════════════════
   2. SCROLL REVEAL
══════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-fade,.reveal-up,.reveal-left,.reveal-right');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-vis'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-vis');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ══════════════════════════════════
   3. COUNTER ANIMATION
══════════════════════════════════ */
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animate = el => {
    const target = parseFloat(el.dataset.count);
    const dur = 1400;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * easeOut(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) { els.forEach(animate); return; }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
})();


/* ══════════════════════════════════
   4. WHATSAPP FORM SUBMISSION
══════════════════════════════════ */
(function initForm() {
  const submitBtn  = document.getElementById('form-submit');
  const globalErr  = document.getElementById('form-err-global');
  if (!submitBtn) return;

  const g = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

  const setErr = (fieldId, msg) => {
    const inp = document.getElementById(fieldId);
    const err = document.getElementById(fieldId + '-err');
    if (inp)  inp.classList.toggle('err', !!msg);
    if (err)  err.textContent = msg || '';
  };

  const clearErrs = () => {
    ['f-name','f-phone','f-class'].forEach(id => setErr(id, ''));
    if (globalErr) globalErr.textContent = '';
  };

  submitBtn.addEventListener('click', () => {
    clearErrs();

    const name    = g('f-name');
    const phone   = g('f-phone');
    const student = g('f-student');
    const cls     = g('f-class');
    const subject = g('f-subject');
    const mode    = g('f-mode');
    const message = g('f-message');

    let valid = true;

    if (!name) {
      setErr('f-name', 'Please enter your name.');
      document.getElementById('f-name')?.focus();
      valid = false;
    }

    if (!phone) {
      setErr('f-phone', 'Please enter your phone number.');
      if (valid) document.getElementById('f-phone')?.focus();
      valid = false;
    } else if (phone.replace(/\D/g, '').length < 10) {
      setErr('f-phone', 'Enter a valid 10-digit number.');
      if (valid) document.getElementById('f-phone')?.focus();
      valid = false;
    }

    if (!cls) {
      setErr('f-class', 'Please select a class.');
      valid = false;
    }

    if (!valid) return;

    // Build message
    const lines = [
      'Hello Manohar Sir,',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      student ? `Student Name: ${student}` : null,
      `Class: ${cls}`,
      subject ? `Subject: ${subject}` : null,
      mode    ? `Mode: ${mode}` : null,
      '',
      message ? `Message:\n${message}` : null,
      '',
      'I would like to enquire about your coaching classes.',
      '',
      'Thank you.'
    ].filter(l => l !== null).join('\n');

    const url = 'https://wa.me/919810250842?text=' + encodeURIComponent(lines);
    window.open(url, '_blank', 'noopener,noreferrer');

    // UI feedback
    const orig = submitBtn.innerHTML;
    submitBtn.textContent = '✓ Opening WhatsApp…';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.innerHTML = orig;
      submitBtn.disabled = false;
    }, 4000);
  });
})();


/* ══════════════════════════════════
   5. FOOTER YEAR
══════════════════════════════════ */
(function () {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ══════════════════════════════════
   6. ACTIVE NAV LINK ON SCROLL
══════════════════════════════════ */
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__menu-link');
  if (!sections.length || !links.length) return;

  const onScroll = () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
    links.forEach(l => {
      const matches = l.getAttribute('href') === '#' + cur;
      l.style.color = matches ? 'var(--gold)' : '';
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();
