/* ── Mobile nav ────────────────────────────────────── */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('hidden') === false;
  menuBtn.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuBtn.classList.remove('menu-open');
  });
});

/* ── Navbar scroll effect ──────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('navbar-scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Active nav link on scroll ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── Scroll-triggered reveal ───────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings within same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(idx * 80, 300));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Case study accordion ──────────────────────────── */
document.querySelectorAll('.case-study-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const body = trigger.nextElementSibling;
    const chevron = trigger.querySelector('.case-chevron');
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    trigger.setAttribute('aria-expanded', String(!isOpen));
    body.classList.toggle('hidden', isOpen);
    chevron.classList.toggle('open', !isOpen);
  });
});

/* ── Contact form validation & submit ──────────────── */
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

function validateField(input) {
  const valid = input.checkValidity();
  input.classList.toggle('error', !valid);
  return valid;
}

form.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) validateField(input);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  let allValid = true;
  form.querySelectorAll('.form-input').forEach(input => {
    if (!validateField(input)) allValid = false;
  });
  if (!allValid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  // No backend — show success state after brief delay
  setTimeout(() => {
    form.reset();
    form.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
    submitBtn.classList.add('hidden');
    successMsg.classList.remove('hidden');
  }, 800);
});

/* ── Smooth scroll for anchor links ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
