// Script: Enhances interactivity for Mohit's resume site

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = [
    document.querySelector('.inter-face'),
    document.querySelector('.about'),
    document.querySelector('.skill'),
    document.querySelector('.work'),
    document.querySelector('.footer') || document.querySelector('.media')
  ];

  // Safe-guard: make lengths match
  while (navLinks.length > sections.length) sections.push(document.body);

  // Smooth scroll when nav link clicked
  navLinks.forEach((link, i) => {
    link.setAttribute('role', 'button');
    link.style.cursor = 'pointer';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = sections[i] || document.body;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // On small screens collapse menu if open
      const nav = document.querySelector('.nav-links');
      if (nav && nav.dataset.mobile === 'open') {
        toggleMobileMenu(false);
      }
    });
  });

  // Highlight active nav link using IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const index = sections.indexOf(entry.target);
      if (index === -1) return;
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove('active'));
        if (navLinks[index]) navLinks[index].classList.add('active');
      }
    });
  }, { threshold: 0.45 });

  sections.forEach((s) => { if (s) io.observe(s); });

  // Open social links in a new tab safely
  document.querySelectorAll('.media a').forEach(a => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });

  // Mail link - copy email to clipboard and show toast (also opens mail client)
  const mail = document.querySelector('.mail');
  if (mail) {
    const email = (mail.getAttribute('href') || '').replace('mailto:', '');
    mail.addEventListener('click', (e) => {
      // Try to copy to clipboard (best-effort)
      if (navigator.clipboard && email) {
        navigator.clipboard.writeText(email).catch(() => {});
      }
      showToast('Email copied to clipboard');
      // allow default mailto to proceed
    });
  }

  // Back to top button
  const backBtn = document.createElement('button');
  backBtn.id = 'backToTop';
  backBtn.title = 'Back to top';
  backBtn.innerHTML = '↑';
  Object.assign(backBtn.style, { display: 'none' });
  document.body.appendChild(backBtn);
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backBtn.style.display = 'block';
    else backBtn.style.display = 'none';
  });

  // Animate skill boxes when they enter viewport
  document.querySelectorAll('.skillbox1, .skillbox2, .skillbox3, .skillbox4').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
  });

  const skillsIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'all 700ms ease';
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0px)';
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.skillbox1, .skillbox2, .skillbox3, .skillbox4').forEach(el => skillsIO.observe(el));

  // Image click -> modal
  const image = document.querySelector('.image');
  if (image) {
    image.style.cursor = 'pointer';
    image.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `<div class="modal-content" role="dialog" aria-label="Profile image">
          <div class="modal-close" aria-hidden="true">✕</div>
        </div>`;
      const modalContent = modal.querySelector('.modal-content');
      modalContent.style.backgroundImage = getComputedStyle(image).backgroundImage;
      document.body.appendChild(modal);

      function close() { document.body.removeChild(modal); }
      modal.addEventListener('click', (ev) => { if (ev.target === modal || ev.target.classList.contains('modal-close')) close(); });
      document.addEventListener('keydown', function onEsc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); } });
    });
  }

  // Mobile menu button
  const nav = document.querySelector('.navbar');
  const navLinksEl = document.querySelector('.nav-links');
  if (nav && navLinksEl) {
    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '☰';
    btn.addEventListener('click', () => toggleMobileMenu());
    nav.insertBefore(btn, nav.firstChild);
  }

  function toggleMobileMenu(forceState) {
    const navEl = document.querySelector('.nav-links');
    if (!navEl) return;
    const open = (forceState !== undefined) ? forceState : navEl.dataset.mobile !== 'open';
    if (open) {
      navEl.style.display = 'flex';
      navEl.style.flexDirection = 'column';
      navEl.style.position = 'absolute';
      navEl.style.top = '60px';
      navEl.style.right = '20px';
      navEl.style.background = 'white';
      navEl.style.padding = '10px';
      navEl.style.gap = '12px';
      navEl.dataset.mobile = 'open';
    } else {
      navEl.style.display = 'flex';
      navEl.style.flexDirection = '';
      navEl.style.position = '';
      navEl.style.top = '';
      navEl.style.right = '';
      navEl.style.background = '';
      navEl.style.padding = '';
      navEl.style.gap = '';
      navEl.dataset.mobile = 'closed';
    }
    const btn = document.querySelector('.mobile-menu-btn');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }

  // Utility: show toast
  function showToast(text, ms = 2200) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => { t.classList.add('visible'); }, 10);
    setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 400); }, ms);
  }

});
