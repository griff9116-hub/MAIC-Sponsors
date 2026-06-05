// Countdown to 30 June 2026 (early access deadline)
(function () {
  const deadline = new Date('2026-06-30T23:59:59Z').getTime();

  function update() {
    const now = Date.now();
    const diff = deadline - now;

    if (diff <= 0) {
      document.getElementById('countdown').textContent = 'Deadline passed';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
})();

// Sticky nav background on scroll
(function () {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60
      ? 'rgba(10,22,40,0.98)'
      : 'rgba(10,22,40,0.92)';
  }, { passive: true });
})();

// Mobile menu toggle
(function () {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', menu.classList.contains('open'));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
})();

// Sponsor form — basic validation + success state
(function () {
  const form    = document.getElementById('sponsorForm');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    const emailField = form.querySelector('#email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      valid = false;
    }

    if (!valid) return;

    form.hidden   = true;
    success.hidden = false;

    // In production: POST form data to your backend / form service here.
    // e.g. fetch('/api/sponsor-request', { method: 'POST', body: new FormData(form) })
  });

  form.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
})();

// Intersection Observer — fade-in on scroll
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.why-card, .benefit-item, .timeline__card, .package-card, .testimonial-card, .fit-check, .industry-tag'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();
