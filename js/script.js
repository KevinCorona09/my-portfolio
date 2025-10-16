// Optimized Portfolio Application (FR/ES/EN ready)

class PortfolioApp {
  constructor() {
    // Default language: French
    this.currentLang = localStorage.getItem('language') || 'fr';
    this.isLoading = false;
    this.observers = new Map();
    this.particlesContainer = null;

    // Simple i18n dictionary for toasts / small messages
    this.i18n = {
      fr: {
        downloading_presentation: 'Téléchargement de la présentation...',
        download_failed: 'Échec du téléchargement',
        downloading_cv: 'Téléchargement du CV...',
        cv_download_failed: 'Échec du téléchargement du CV',
        email_copied: 'E-mail copié dans le presse-papiers',
        opening_email: 'Ouverture du client e-mail...',
      },
      es: {
        downloading_presentation: 'Descargando presentación...',
        download_failed: 'Error al descargar',
        downloading_cv: 'Descargando CV...',
        cv_download_failed: 'Error al descargar CV',
        email_copied: 'Email copiado al portapapeles',
        opening_email: 'Abriendo cliente de email...',
      },
      en: {
        downloading_presentation: 'Downloading presentation...',
        download_failed: 'Download failed',
        downloading_cv: 'Downloading CV...',
        cv_download_failed: 'CV download failed',
        email_copied: 'Email copied to clipboard',
        opening_email: 'Opening email client...',
      }
    };

    this.init();
  }

  t(key) {
    const langTable = this.i18n[this.currentLang] || this.i18n.en;
    return (langTable && langTable[key]) || (this.i18n.en[key] || key);
  }

  async init() {
    try {
      await this.waitForDOM();
      this.initializeComponents();
      this.setupEventListeners();
      this.initEnhancements();
      this.initParticles();
      this.initVideoModal();
      console.log('Portfolio app initialized successfully');
    } catch (error) {
      console.error('Error initializing portfolio app:', error);
    }
  }

  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  initializeComponents() {
  this.initLanguageSystem();
  this.initNavigation();
  this.initAnimations();
  this.initProjects();
  this.initSkills();
  this.initContact();
  this.initDownloadButton();
  this.initSocialLinks();
  this.initMultimediaMedia();
  this.initAboutIcons();               
}


  setupEventListeners() {
    window.addEventListener('resize', this.throttle(() => {
      this.handleResize();
    }, 250));
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  // --- Language System ---
  initLanguageSystem() {
    // Prefer a <select id="languageSelect"> if present (FR/ES/EN)
    const select = document.getElementById('languageSelect');
    if (select) {
      // Set initial value
      select.value = this.currentLang;
      // On change, persist and update UI
      select.addEventListener('change', () => {
        this.currentLang = select.value;
        localStorage.setItem('language', this.currentLang);
        this.updateLanguage();
        document.body.style.opacity = '0.8';
        setTimeout(() => { document.body.style.opacity = '1'; }, 200);
      });
    } else {
      // Backward compatible toggle button (#langToggle / #langText)
      const langToggle = document.getElementById('langToggle');
      const langText = document.getElementById('langText');
      if (langToggle && langText) {
        langText.textContent = this.currentLang.toUpperCase();
        langToggle.addEventListener('click', () => {
          this.currentLang = this.nextLanguage();
          localStorage.setItem('language', this.currentLang);
          this.updateLanguage();
          langText.textContent = this.currentLang.toUpperCase();
          document.body.style.opacity = '0.8';
          setTimeout(() => { document.body.style.opacity = '1'; }, 200);
        });
      }
    }
    this.updateLanguage();
  }

  nextLanguage() {
    const order = ['fr', 'es', 'en'];
    const i = order.indexOf(this.currentLang);
    return order[(i + 1) % order.length];
  }

  updateLanguage() {
    // Update any element that has ANY data-xx attribute
    const elements = document.querySelectorAll('[data-es],[data-en],[data-fr]');
    elements.forEach(element => {
      const text =
        element.getAttribute(`data-${this.currentLang}`) ??
        element.getAttribute('data-fr') ??
        element.getAttribute('data-en') ??
        element.getAttribute('data-es');

      if (text != null) {
        if (element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) {
          element.value = text;
        } else {
          element.textContent = text;
        }
      }
    });

    // Keep document lang attr & select in sync
    document.documentElement.setAttribute('lang', this.currentLang);
    const select = document.getElementById('languageSelect');
    if (select && select.value !== this.currentLang) {
      select.value = this.currentLang;
    }
  }

  // --- Navigation System ---
  initNavigation() {
    const navbar = document.querySelector('.custom-navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navbar || navLinks.length === 0) return;

    window.addEventListener('scroll', this.throttle(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 100);
      this.updateScrollProgress();
    }, 16));

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          this.smoothScrollTo(href);
        }
      });
    });

    this.setupActiveSection(navLinks);
    this.setupMobileMenu();
  }

  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      this.animatedScrollTo(offsetTop, 1000);
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    }
  }

  animatedScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeInOutCubic(t) {
      return t < 0.5
        ? 4 * t * t * t
        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      window.scrollTo(0, startPosition + distance * ease);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    requestAnimationFrame(animation);
  }

  setupActiveSection(navLinks) {
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-100px 0px -100px 0px'
    };
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.updateActiveNav(id, navLinks);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
    this.observers.set('sections', sectionObserver);
  }

  updateActiveNav(activeId, navLinks) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }

  setupMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarToggler) {
      navbarToggler.addEventListener('click', () => {
        navbarToggler.classList.toggle('active');
      });
    }
    document.addEventListener('click', (e) => {
      if (navbarToggler && navbarCollapse &&
          !navbarToggler.contains(e.target) &&
          !navbarCollapse.contains(e.target)) {
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
            navbarToggler.classList.remove('active');
          }
        }
      }
    });
  }

  updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
    }
  }

  // --- Animation System ---
  initAnimations() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        disable: window.innerWidth < 768 ? 'mobile' : false
      });
    }
    this.setupParallax();
    this.setupTypewriter();
    this.setupScrollReveal();
    this.setupCounterAnimations();
  }

    // --- Multimedia media (video con fallback) ---
    initMultimediaMedia() {
    const container = document.querySelector('.mm-media');
    const video = document.querySelector('.mm-video');
    const fallback = document.querySelector('.mm-fallback');
    if (!container || !video || !fallback) return;

    const showFallback = () => {
        fallback.classList.add('show');
        container.classList.add('video-hidden');
        try { video.pause(); } catch {}
    };
    const hideFallback = () => {
        fallback.classList.remove('show');
        container.classList.remove('video-hidden');
    };

    video.addEventListener('loadeddata', hideFallback);

    ['error','stalled','abort','emptied'].forEach(ev =>
        video.addEventListener(ev, showFallback)
    );

    const tryPlay = () => {
        const p = video.play();
        if (p && typeof p.then === 'function') {
        p.then(hideFallback).catch(showFallback);
        }
    };
    tryPlay();

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !fallback.classList.contains('show')) tryPlay();
    }, { passive: true });
    }

initAboutIcons() {
  const grid = document.querySelector('.image-grid');
  if (!grid) return;

  grid.querySelectorAll('.grid-item').forEach((item, i) => {
    item.style.setProperty('--reveal-delay', `${i * 90}ms`);
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        grid.classList.add('activated');   
        obs.unobserve(entry.target);       
      }
    });
  }, { threshold: 0.35 });

  obs.observe(grid);
  this.observers.set('about-icons', obs);
}


  setupParallax() {
    const parallaxElements = document.querySelectorAll('.hero-background, .bg-pattern');
    if (parallaxElements.length === 0) return;
    const handleParallax = this.throttle(() => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 - (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, 16);
    window.addEventListener('scroll', handleParallax);
  }

  setupTypewriter() {
    const typewriterElements = document.querySelectorAll('.hero-title .name');
    typewriterElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid var(--primary-color)';
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
          element.classList.add('typing-complete');
          setTimeout(() => {
            element.style.borderRight = 'none';
          }, 500);
        }
      }, 100);
    });
  }

  setupScrollReveal() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-element').forEach(el => {
      revealObserver.observe(el);
    });
    this.observers.set('reveal', revealObserver);
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
    this.observers.set('counters', counterObserver);
  }

  animateCounter(element) {
    const text = element.textContent;
    const target = parseInt(text.replace(/\D/g, ''));
    const hasPlus = text.includes('+');
    const increment = target / 50;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + (hasPlus ? '+' : '');
        clearInterval(timer);
      } else {
        element.textContent = Math.ceil(current) + (hasPlus ? '+' : '');
      }
    }, 50);
  }

  // --- Skills System ---
  initSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const width = progressBar.getAttribute('data-width');
          if (width) {
            setTimeout(() => {
              progressBar.style.width = width;
              progressBar.classList.add('animated');
              progressBar.style.setProperty('--target-width', width);
            }, 300);
          }
          skillObserver.unobserve(progressBar);
        }
      });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => {
      skillObserver.observe(bar);
    });
    this.observers.set('skills', skillObserver);
  }

  // --- Projects System ---
  initProjects() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      // Card Animation
      card.addEventListener('mouseenter', () => this.animateProjectCard(card, true));
      card.addEventListener('mouseleave', () => this.animateProjectCard(card, false));
      // Download PDF
      const pdfOverlay = card.querySelector('.download-pdf-overlay');
      if (pdfOverlay) {
        pdfOverlay.addEventListener('click', (e) => {
          e.preventDefault();
          const pdfPath = pdfOverlay.getAttribute('data-pdf');
          this.downloadPDF(pdfPath);
        });
      }
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  // --- Video Modal System ---
  initVideoModal() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video');
    if (!modal || !video) return;

    const closeBtn = modal.querySelector('.video-modal-close');
    const playButtons = document.querySelectorAll('.play-button-overlay[data-video]');

    playButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const videoSrc = btn.getAttribute('data-video');
        if (videoSrc) {
          video.querySelector('source').src = videoSrc;
          video.load();
          modal.showModal();
          setTimeout(() => video.play().catch(() => {}), 100);
        }
      });
    });

    modal.addEventListener('close', () => {
      video.pause();
      video.currentTime = 0;
      video.querySelector('source').src = '';
      video.load();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.close();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (modal.open && e.key === 'Escape') {
        modal.close();
      }
    });
  }

  // --- PDF Download ---
  downloadPDF(pdfPath) {
    try {
      const link = document.createElement('a');
      link.href = pdfPath;
      link.download = pdfPath.split('/').pop();
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('PDF download initiated:', pdfPath);
      this.showToast(this.t('downloading_presentation'));
    } catch (error) {
      console.error('PDF download failed:', error);
      this.showToast(this.t('download_failed'));
      window.open(pdfPath, '_blank');
    }
  }

  // --- Card Animation ---
  animateProjectCard(card, isHover) {
    const image = card.querySelector('.project-image img');
    const content = card.querySelector('.project-content');
    const techTags = card.querySelectorAll('.tech-tag');
    if (isHover) {
      card.style.transform = 'translateY(-15px) scale(1.02)';
      card.style.boxShadow = 'var(--shadow-xl)';
      if (image) image.style.transform = 'scale(1.1)';
      if (content) content.style.transform = 'translateY(-5px)';
      techTags.forEach((tag, index) => {
        setTimeout(() => {
          tag.style.transform = 'translateY(-3px)';
          tag.style.boxShadow = '0 4px 12px rgba(0, 168, 255, 0.3)';
        }, index * 50);
      });
    } else {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = 'var(--shadow-lg)';
      if (image) image.style.transform = 'scale(1)';
      if (content) content.style.transform = 'translateY(0)';
      techTags.forEach(tag => {
        tag.style.transform = 'translateY(0)';
        tag.style.boxShadow = 'none';
      });
    }
  }

  // --- Contact System ---
  initContact() {
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
      item.addEventListener('click', () => {
        const span = item.querySelector('span');
        if (span && span.textContent.includes('@')) {
          navigator.clipboard.writeText(span.textContent).then(() => {
            this.showToast(this.t('email_copied'));
          }).catch(err => {
            console.warn('Could not copy email:', err);
          });
        }
      });
    });
  }

  // --- Download Button System ---
  initDownloadButton() {
    const downloadButtons = document.querySelectorAll('a[href*="CV-Kevin-Corona.pdf"]');
    downloadButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
        console.log('CV download initiated');
        this.showToast(this.t('downloading_cv'));
      });
      button.addEventListener('error', (e) => {
        console.error('Download failed:', e);
        this.showToast(this.t('cv_download_failed'));
      });
    });
  }

  // --- Social Links System ---
  initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-3px) scale(1.1)';
      });
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
      });
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const icon = link.querySelector('i');
        let platform = 'unknown';
        if (icon) {
          if (icon.classList.contains('fa-github')) platform = 'GitHub';
          else if (icon.classList.contains('fa-linkedin')) platform = 'LinkedIn';
          else if (icon.classList.contains('fa-instagram')) platform = 'Instagram';
          else if (icon.classList.contains('fa-envelope')) platform = 'Email';
        }
        console.log(`Social link clicked: ${platform}`, href);
        if (href && href.startsWith('mailto:')) {
          this.showToast(this.t('opening_email'));
        }
      });
    });
  }

  // --- Particles System ---
  initParticles() {
    if (typeof tsParticles === 'undefined') {
      console.warn('tsParticles library not loaded');
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const particlesConfig = {
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      interactivity: {
        detect_on: 'window',
        events: {
          onClick: { enable: true, mode: 'push' },
          onHover: { enable: true, mode: 'repulse' },
          resize: true
        },
        modes: {
          push: { quantity: 2 },
          repulse: { distance: 100, duration: 0.4 }
        }
      },
      particles: {
        color: { value: ['#00a8ff', '#1e3799', '#fbc531', '#ffffff'] },
        links: { color: '#00a8ff', distance: 120, enable: true, opacity: 0.3, width: 1 },
        collisions: { enable: false },
        move: { direction: 'none', enable: true, outMode: 'bounce', random: true, speed: 1, straight: false },
        number: { density: { enable: true, area: 1000 }, value: window.innerWidth > 768 ? 50 : 30 },
        opacity: { value: 0.5, random: true, animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false } },
        shape: { type: ['circle', 'triangle', 'polygon'], polygon: { nb_sides: 6 } },
        size: { value: { min: 1, max: 4 }, animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false } }
      },
      detectRetina: true,
      responsive: [
        { maxWidth: 768, options: { particles: { number: { value: 30 }, links: { distance: 80 } } } },
        { maxWidth: 480, options: { particles: { number: { value: 20 }, links: { enable: false } } } }
      ]
    };
    tsParticles.load('particles-js', particlesConfig).then((container) => {
      this.particlesContainer = container;
      console.log('Particles loaded successfully');
    }).catch((error) => {
      console.error('Error loading particles:', error);
    });
  }

  // --- Enhancement Methods ---
  initEnhancements() {
    this.setupPerformanceOptimizations();
    this.setupAccessibility();
    this.setupErrorHandling();
  }

  setupPerformanceOptimizations() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });
      images.forEach(img => imageObserver.observe(img));
      this.observers.set('images', imageObserver);
    }
  }

  setupAccessibility() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') document.body.classList.add('using-keyboard');
    });
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }

  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
    });
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
    });
  }

  // --- Utility Methods ---
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  handleResize() {
    if (typeof AOS !== 'undefined') AOS.refresh();
    if (this.particlesContainer) this.particlesContainer.refresh();
  }

  handleKeyboardNavigation(e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        const modal = bootstrap.Modal.getInstance(openModal);
        if (modal) modal.hide();
      }
      const openCollapse = document.querySelector('.navbar-collapse.show');
      if (openCollapse) {
        const collapse = bootstrap.Collapse.getInstance(openCollapse);
        if (collapse) collapse.hide();
      }
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius);
      z-index: 10000;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 100);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // --- Cleanup method ---
  cleanup() {
    this.observers.forEach(observer => {
      if (observer && typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
    });
    this.observers.clear();
    if (this.particlesContainer) {
      this.particlesContainer.destroy();
    }
  }
}

// Start
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioApp;
}
