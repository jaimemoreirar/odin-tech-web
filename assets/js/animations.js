/* ============================================================
   ODIN TECH — animations.js
   IntersectionObserver para .reveal, filtros tabs/pills,
   acordeón de servicios, hero section
   ============================================================ */

'use strict';

/* === SCROLL REVEAL === */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Respetar preferencia de movimiento reducido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* === FILTROS TABS / PILLS === */
function initFilterTabs() {
  const tabGroups = document.querySelectorAll('[role="tablist"]');

  tabGroups.forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.filter-tab');
    if (!tabs.length) return;

    // Determinar el grid objetivo según el tablist
    // Busca el primer grid con data-category items dentro del mismo section
    const section = tabGroup.closest('section') || tabGroup.closest('.container') || document;
    const gridId   = tabGroup.dataset.target;
    const grid     = gridId
      ? document.getElementById(gridId)
      : section.querySelector('[data-category]')?.closest('[id]')
        ? document.getElementById(section.querySelector('[data-category]').closest('[id]').id)
        : section.querySelector('.grid-3, .grid-2, .grid-4');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Actualizar estado de tabs
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.dataset.filter;
        if (!grid) return;

        // Mostrar / ocultar tarjetas
        const cards = grid.querySelectorAll('[data-category]');
        cards.forEach(card => {
          if (filter === 'todos' || card.dataset.category.split(' ').includes(filter)) {
            card.style.display = '';
            // Re-trigger reveal si ya pasó
            requestAnimationFrame(() => {
              card.classList.remove('visible');
              requestAnimationFrame(() => card.classList.add('visible'));
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });
}

/* === ACORDEÓN === */
function initAccordion() {
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll('.accordion__item');

    items.forEach(item => {
      const trigger = item.querySelector('.accordion__trigger');
      const body    = item.querySelector('.accordion__body');
      if (!trigger || !body) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Opcionalmente cerrar el resto (comportamiento exclusivo)
        items.forEach(other => {
          if (other !== item && other.classList.contains('open')) {
            other.classList.remove('open');
            other.querySelector('.accordion__trigger')?.setAttribute('aria-expanded', 'false');
            const otherBody = other.querySelector('.accordion__body');
            if (otherBody) otherBody.style.maxHeight = '0';
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          body.style.maxHeight = '0';
        } else {
          item.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });

      // Establecer altura inicial para los que ya están abiertos
      if (item.classList.contains('open')) {
        body.style.maxHeight = body.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* === HERO — texto animado (typewriter opcional) === */
function initHeroText() {
  const heroTitle = document.querySelector('.hero__title');
  if (!heroTitle) return;

  // Las clases hero-animate-* en el CSS ya manejan la animación de entrada.
  // Este bloque es un hook para futura extensión (typewriter, etc.)
}

/* === HERO — scroll indicator ocultar al bajar === */
function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;

  const handleScroll = () => {
    indicator.style.opacity = window.scrollY > 80 ? '0' : '0.6';
    indicator.style.pointerEvents = window.scrollY > 80 ? 'none' : 'auto';
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* === NAVBAR link activo por página === */
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || '';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();
    if (
      linkPage === currentPage ||
      (currentPage === '' && (href === '/' || href === 'index.html')) ||
      (currentPage === 'index.html' && (href === '/' || href === 'index.html'))
    ) {
      link.classList.add('active');
    }
  });
}

/* === INICIALIZACIÓN === */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initFilterTabs();
  initAccordion();
  initHeroText();
  initScrollIndicator();
  initActiveNavLink();
});
