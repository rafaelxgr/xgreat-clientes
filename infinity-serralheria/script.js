(() => {
  'use strict';

  const finishingStyles = document.createElement('link');
  finishingStyles.rel = 'stylesheet';
  finishingStyles.href = 'finishing.css?v=1';
  document.head.appendChild(finishingStyles);

  const brandingStyles = document.createElement('link');
  brandingStyles.rel = 'stylesheet';
  brandingStyles.href = 'branding-final.css?v=1';
  document.head.appendChild(brandingStyles);

  const body = document.body;
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');
  const backToTop = document.querySelector('.back-to-top');
  const year = document.querySelector('#current-year');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('[data-full]');
  const videos = document.querySelectorAll('video');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('open');
    body.classList.remove('menu-open');
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(willOpen));
      mainNav.classList.toggle('open', willOpen);
      body.classList.toggle('menu-open', willOpen);
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (lightbox && lightboxImage && lightboxClose) {
    const closeLightbox = () => {
      if (lightbox.open) lightbox.close();
      body.classList.remove('lightbox-open');
      lightboxImage.src = '';
    };

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-full');
        const thumbnail = item.querySelector('img');
        if (!src) return;

        lightboxImage.src = src;
        lightboxImage.alt = thumbnail?.alt || 'Trabalho ampliado da Infinity Serralheria';
        lightbox.showModal();
        body.classList.add('lightbox-open');
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener('cancel', () => {
      body.classList.remove('lightbox-open');
      lightboxImage.src = '';
    });
  }

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const video = entry.target;
        const source = video.querySelector('source[data-src]');

        if (source && !source.src) {
          source.src = source.dataset.src || '';
          video.load();
        }

        observer.unobserve(video);
      });
    }, { rootMargin: '280px 0px' });

    videos.forEach((video) => videoObserver.observe(video));
  } else {
    videos.forEach((video) => {
      const source = video.querySelector('source[data-src]');
      if (source) {
        source.src = source.dataset.src || '';
        video.load();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();