// Countdown to 30 June 2026 (early access deadline)
(function () {
  const deadline = new Date('2026-06-30T23:59:59Z').getTime();
  function update() {
    const diff = deadline - Date.now();
    if (diff <= 0) { document.getElementById('countdown').textContent = 'Deadline passed'; return; }
    document.getElementById('cd-days').textContent  = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('cd-mins').textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cd-secs').textContent  = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  update(); setInterval(update, 1000);
})();

// Sticky nav
(function () {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60 ? 'rgba(10,22,40,0.98)' : 'rgba(10,22,40,0.92)';
  }, { passive: true });
})();

// Mobile menu
(function () {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', menu.classList.contains('open'));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.classList.remove('open')));
})();

// Sponsor form — validation + Formspree submission
// Replace YOUR_FORM_ID with the ID from your Formspree dashboard (formspree.io)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

(function () {
  const form      = document.getElementById('sponsorForm');
  const success   = document.getElementById('formSuccess');
  const submitBtn = form ? form.querySelector('[type="submit"]') : null;
  if (!form) return;

  function validate() {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) { field.classList.add('error'); valid = false; }
    });
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error'); valid = false;
    }
    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });
      if (res.ok) { form.hidden = true; success.hidden = false; }
      else {
        const data = await res.json().catch(() => ({}));
        showFormError(data?.errors?.map(e => e.message).join(', ') || 'Submission failed. Please email maic@steampunkventures.com');
        resetBtn();
      }
    } catch {
      showFormError('Network error. Please try again or email maic@steampunkventures.com');
      resetBtn();
    }
  });

  function resetBtn() { submitBtn.disabled = false; submitBtn.textContent = 'Request Early Access →'; }
  function showFormError(msg) {
    let el = form.querySelector('.form-error');
    if (!el) { el = document.createElement('p'); el.className = 'form-error'; el.style.cssText = 'color:#c53030;font-size:0.85rem;margin-top:-8px;'; submitBtn.before(el); }
    el.textContent = msg;
  }
  form.querySelectorAll('input, select').forEach(f => f.addEventListener('input', () => {
    f.classList.remove('error');
    const el = form.querySelector('.form-error'); if (el) el.textContent = '';
  }));
})();

// Scroll reveal
(function () {
  const style = document.createElement('style');
  style.textContent = '.reveal{opacity:0;transform:translateY(28px);transition:opacity .55s ease,transform .55s ease}.reveal.visible{opacity:1;transform:none}';
  document.head.appendChild(style);
  const targets = document.querySelectorAll('.why-card,.benefit-item,.timeline__card,.package-card,.testimonial-card,.fit-check,.industry-tag');
  targets.forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${(i % 4) * 60}ms`; });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.1 });
  targets.forEach(el => observer.observe(el));
})();