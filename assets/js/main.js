/* ============================================================
   ODIN TECH — main.js
   Loader, navbar scroll, hamburger menu, cursor personalizado,
   contador de estadísticas, smooth scroll, WhatsApp flotante
   ============================================================ */

'use strict';

/* === LOADER INICIAL === */
function initLoader() {
  const loader = document.getElementById('page-loader');
  // Mostrar el body (se llama desde DOMContentLoaded, no necesita listener anidado)
  document.body.classList.add('loaded');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 400);
}

/* === ÍCONOS DE MARCA (Lucide no los incluye) === */
const BRAND_ICONS = {
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  github:   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  instagram:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  tiktok:   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>`,
  twitter:  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
};

function initBrandIcons() {
  document.querySelectorAll('i[data-lucide]').forEach(el => {
    const name = el.getAttribute('data-lucide');
    if (BRAND_ICONS[name]) {
      const width  = el.getAttribute('width')  || '16';
      const height = el.getAttribute('height') || '16';
      const div = document.createElement('div');
      div.innerHTML = BRAND_ICONS[name];
      const svg = div.firstElementChild;
      if (svg) {
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        el.replaceWith(svg);
      }
    }
  });
}

/* === NAVBAR — scroll + hamburger === */
function initNavbar() {
  const navbar   = document.querySelector('.navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const overlay  = document.getElementById('nav-overlay');

  if (!navbar) return;

  // Glassmorphism al hacer scroll
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Estado inicial

  if (!hamburger || !mobileMenu || !overlay) return;

  // Abrir/cerrar menú mobile
  const openMenu = () => {
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    // Foco al primer link del menú
    const firstLink = mobileMenu.querySelector('a, button');
    if (firstLink) firstLink.focus();
  };

  const closeMenu = () => {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    hamburger.focus();
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Cerrar al hacer click en un link del menú mobile
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Marcar link activo según página actual
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === '/') || (currentPage === 'index.html' && href === '/')) {
      link.classList.add('active');
    }
  });
}

/* === CURSOR PERSONALIZADO (desktop con pointer:fine) === */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  // Solo en dispositivos con cursor fino (mouse)
  if (!window.matchMedia('(pointer: fine)').matches) {
    cursor.style.display = 'none';
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isVisible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      cursor.style.opacity = '1';
      isVisible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    isVisible = false;
  });

  // Elementos interactivos que expanden el cursor
  const interactiveSelectors = 'a, button, input, textarea, select, [role="tab"], label[for]';

  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });

  // Animación con lag suave
  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top  = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  };

  requestAnimationFrame(animateCursor);
}

/* === CONTADOR DE ESTADÍSTICAS === */
function initStatsCounter() {
  const statsElements = document.querySelectorAll('[data-count]');
  if (!statsElements.length) return;

  const formatNumber = (num) => {
    if (num >= 1000) return num.toLocaleString('es-CL');
    return num.toString();
  };

  const animateCounter = (el, target, duration = 1800) => {
    const start = performance.now();
    const suffix = el.dataset.suffix || '';

    const update = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatNumber(target) + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  // Disparar cuando el elemento entra en viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        if (!isNaN(target)) {
          animateCounter(el, target);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statsElements.forEach(el => observer.observe(el));
}

/* === SMOOTH SCROLL para anchors internos === */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 72;

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
      target.focus({ preventScroll: true });
    });
  });
}

/* === LUCIDE ICONS — inicializar === */
function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* === INICIALIZACIÓN === */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initCustomCursor();
  initStatsCounter();
  initSmoothScroll();
  initBrandIcons();
  initIcons();
});

// Lucide puede cargarse después del DOMContentLoaded si es defer
window.addEventListener('load', () => {
  initBrandIcons(); // por si quedaron elementos sin reemplazar
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
