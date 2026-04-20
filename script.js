/* ════════════════════════════════════════
   SAGE ONLINE SOLUTION — script.js
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar: scroll shadow + sticky ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Hamburger menu ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Scroll-reveal animation ── */
  const revealEls = document.querySelectorAll(
    '.service-card, .pricing-card, .edition-card, .step, .tax-item, .contact-item'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger children in the same parent
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const index = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(el => observer.observe(el));

  /* ── Form validation & submission ── */
  function validateForm(fields) {
    for (const { el, name } of fields) {
      if (!el) continue;
      const val = el.value.trim();
      if (!val) {
        showError(`Please enter your ${name}.`);
        el.focus();
        return false;
      }
      if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showError('Please enter a valid email address.');
        el.focus();
        return false;
      }
      if (el.type === 'tel' && !/^\+?[\d\s\-().]{7,}$/.test(val)) {
        showError('Please enter a valid phone number.');
        el.focus();
        return false;
      }
    }
    return true;
  }

  let _msgEl = null;
  function showError(msg) {
    if (_msgEl) { _msgEl.textContent = msg; _msgEl.classList.add('error'); }
  }
  function showSuccess(msg) {
    if (_msgEl) { _msgEl.textContent = msg; _msgEl.classList.remove('error'); }
  }

  function handleFormSubmit(formId, fields, msgId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      _msgEl = document.getElementById(msgId);

      const resolved = fields.map(f => ({ el: document.getElementById(f.id), name: f.name }));
      if (!validateForm(resolved)) return;

      // Disable submit button
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      // Simulate async submission (replace with real endpoint if needed)
      setTimeout(() => {
        showSuccess('✅ Thank you! Our team will contact you shortly.');
        form.reset();
        btn.disabled = false;
        btn.textContent = orig;
        setTimeout(() => { if (_msgEl) _msgEl.textContent = ''; }, 6000);
      }, 1200);
    });
  }

  handleFormSubmit(
    'contactFormHero',
    [
      { id: 'heroName',    name: 'full name' },
      { id: 'heroPhone',   name: 'phone number' },
      { id: 'heroEmail',   name: 'email address' },
    ],
    'heroFormMsg'
  );

  handleFormSubmit(
    'contactFormMain',
    [
      { id: 'mainName',    name: 'full name' },
      { id: 'mainPhone',   name: 'phone number' },
      { id: 'mainEmail',   name: 'email address' },
    ],
    'mainFormMsg'
  );

  /* ── Active nav link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY + 100 >= s.offsetTop) current = s.id;
    });
    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) {
        a.style.color = 'var(--sage-green)';
      }
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* ── Sticky call button: hide when hero visible ── */
  const stickyCall = document.getElementById('stickyCall');
  const heroSection = document.getElementById('home');
  if (stickyCall && heroSection) {
    const stickyObserver = new IntersectionObserver(
      ([entry]) => {
        stickyCall.style.display = entry.isIntersecting ? 'none' : 'block';
      },
      { threshold: 0.1 }
    );
    stickyObserver.observe(heroSection);
  }

  /* ── Dropdown: keyboard accessibility ── */
  document.querySelectorAll('.dropdown').forEach(dd => {
    const toggle = dd.querySelector('.dropdown-toggle');
    const menu   = dd.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const open = menu.style.opacity === '1';
        menu.style.opacity = open ? '' : '1';
        menu.style.visibility = open ? '' : 'visible';
        menu.style.transform = open ? '' : 'translateY(0)';
      }
    });
  });

  /* ── Typing effect for hero title accent ── */
  const words = ['Next Level', 'Future', 'Growth', 'Success'];
  let wIndex = 0;
  let cIndex = 0;
  let deleting = false;
  const highlightEl = document.querySelector('.hero-highlight');

  if (highlightEl) {
    function typeWriter() {
      const word = words[wIndex];
      if (deleting) {
        highlightEl.textContent = word.substring(0, --cIndex);
        if (cIndex === 0) { deleting = false; wIndex = (wIndex + 1) % words.length; }
        setTimeout(typeWriter, 60);
      } else {
        highlightEl.textContent = word.substring(0, ++cIndex);
        if (cIndex === word.length) {
          deleting = true;
          setTimeout(typeWriter, 2200);
        } else {
          setTimeout(typeWriter, 90);
        }
      }
    }
    // Start after a short delay so first word reads fully first
    setTimeout(typeWriter, 3000);
  }

});
