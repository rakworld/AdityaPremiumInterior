/* ============================================================
   ADITYA PREMIUM INTERIORS — main.js (Static, no PHP)
   ============================================================ */
'use strict';

/* ── NAVBAR SCROLL ──────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 55);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // init state

/* ── HAMBURGER ──────────────────────────────────────────── */
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');

// Create overlay for mobile menu backdrop
let navOverlay = document.querySelector('.nav-overlay');
if (!navOverlay) {
  navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  navOverlay.style.cssText = `
    display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5);
    z-index:998; backdrop-filter:blur(2px); -webkit-backdrop-filter:blur(2px);
    transition:opacity 0.3s ease;
  `;
  document.body.appendChild(navOverlay);
}

function openMenu() {
  navMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  navOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => { navOverlay.style.opacity = '1'; });
}

function closeMenu() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  navOverlay.style.opacity = '0';
  document.body.style.overflow = '';
  setTimeout(() => { navOverlay.style.display = 'none'; }, 300);
}

hamburger?.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});

// Close on link click
navMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMenu);
});

// Close on overlay click
navOverlay.addEventListener('click', closeMenu);

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu?.classList.contains('open')) closeMenu();
});

/* ── ACTIVE NAV LINK ────────────────────────────────────── */
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (href === page || (page === '' && href === 'index.html') ||
      href.includes(page) && page !== 'index.html') {
    a.classList.add('active');
  }
});

/* ── SCROLL REVEAL ──────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -45px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── COUNTER ANIMATION ──────────────────────────────────── */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const step = target / (dur / 16);
    let cur = 0;
    const tick = () => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur) + suffix;
      if (cur < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ── LIGHTBOX ───────────────────────────────────────────── */
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lb-img');

function openLb(src, alt = '') {
  if (!lightbox) return;
  lbImg.src = src;
  lbImg.alt = alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
  if (lbImg) { lbImg.src = ''; lbImg.alt = ''; }
}

// Expose globally for inline onclick
window.closeLb = closeLb;

lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

document.querySelectorAll('[data-lb]').forEach(el => {
  el.addEventListener('click', () => openLb(el.dataset.lb, el.dataset.caption || ''));
});

/* ── PORTFOLIO FILTER ───────────────────────────────────── */
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    document.querySelectorAll('.m-item').forEach(item => {
      const show = cat === 'all' || item.dataset.cat === cat;
      item.style.display = show ? 'block' : 'none';
    });
  });
});

/* ── EMAIL OBFUSCATION (base64 decode) ──────────────────── */
document.querySelectorAll('[data-em]').forEach(el => {
  try {
    const decoded = atob(el.dataset.em);
    el.href = 'mailto:' + decoded;
    if (el.dataset.showText) el.textContent = decoded;
  } catch {}
});

/* ── STATIC CONTACT FORM (Formspree / EmailJS / mailto) ── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Honeypot check
    if (form.querySelector('[name="website"]')?.value) return;

    // Validate
    const name    = form.querySelector('#cf-name')?.value.trim();
    const phone   = form.querySelector('#cf-phone')?.value.trim();
    const email   = form.querySelector('#cf-email')?.value.trim();
    const message = form.querySelector('#cf-message')?.value.trim();

    let error = '';
    if (!name || name.length < 2)                         error = 'Please enter your full name.';
    else if (!/^[0-9]{10}$/.test(phone.replace(/\s/g,''))) error = 'Please enter a valid 10-digit phone number.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))   error = 'Please enter a valid email address.';
    else if (!message || message.length < 10)             error = 'Please describe your project (min 10 characters).';

    const errEl = form.querySelector('.form-error');
    if (error) {
      if (errEl) { errEl.textContent = error; errEl.style.display = 'block'; }
      return;
    }
    if (errEl) errEl.style.display = 'none';

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    /* ── OPTION A: Formspree (recommended for static sites) ──
       1. Go to https://formspree.io — create a free account
       2. Create a form → get your form endpoint
       3. Replace the action URL below:
          form.action = "https://formspree.io/f/YOUR_FORM_ID"

       ── OPTION B: EmailJS ──
       See: https://www.emailjs.com — free 200 emails/month
       Uncomment the emailjs block below.

       ── OPTION C: mailto fallback (zero setup) ──
       A mailto: link is used as final fallback below.
    ──────────────────────────────────────────────────────── */

    const FORMSPREE_URL = ''; // ← paste your Formspree URL here e.g. 'https://formspree.io/f/abcdefgh'

    if (FORMSPREE_URL) {
      try {
        const fd = new FormData(form);
        const res = await fetch(FORMSPREE_URL, {
          method: 'POST',
          body: fd,
          headers: { Accept: 'application/json' }
        });
        if (res.ok) { showSuccess(); return; }
      } catch {}
    }

    /* EmailJS fallback – fill in your keys */
    // await emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', form, 'PUBLIC_KEY');

    /* mailto: final fallback */
    const pt = form.querySelector('#cf-project')?.value || 'Not specified';
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nProject: ${pt}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:adityapremiuminteriors@gmail.com?subject=Consultation Request from ${encodeURIComponent(name)}&body=${body}`;

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  });
}

function showSuccess() {
  document.querySelector('.form-fields')?.style.setProperty('display','none');
  const suc = document.querySelector('.form-success');
  if (suc) suc.style.display = 'block';
}

/* ── SMOOTH SCROLL for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth' }); }
  });
});

/* ── HERO SCROLL CTA ────────────────────────────────────── */
document.querySelector('.hero-scroll')?.addEventListener('click', () => {
  (document.querySelector('#about-preview') ||
   document.querySelector('#services'))?.scrollIntoView({ behavior:'smooth' });
});

/* ── LOGO SCROLL CHANGE────────────────────────────────────── */
window.addEventListener('scroll', function() {
  var logoMain = document.querySelector('.logo-main');
  var logoScrolled = document.querySelector('.logo-scrolled');
  if (window.scrollY > 50) {
    logoMain.style.display = 'none';
    logoScrolled.style.display = 'block';
  } else {
    logoMain.style.display = 'block';
    logoScrolled.style.display = 'none';
  }
});