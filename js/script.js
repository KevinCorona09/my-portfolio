// Optimized Portfolio Application

class PortfolioApp {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'es';
        this.isLoading = false;
        this.observers = new Map();
        this.particlesContainer = null;
        this.init();
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
        const langToggle = document.getElementById('langToggle');
        const langText = document.getElementById('langText');
        if (langToggle && langText) {
            langText.textContent = this.currentLang === 'es' ? 'EN' : 'ES';
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }
        this.updateLanguage();
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('language', this.currentLang);
        this.updateLanguage();
        const langText = document.getElementById('langText');
        if (langText) {
            langText.textContent = this.currentLang === 'es' ? 'EN' : 'ES';
        }
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 200);
    }

    updateLanguage() {
        const elements = document.querySelectorAll(`[data-${this.currentLang}]`);
        elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLang}`);
            if (text) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = text;
                } else {
                    element.textContent = text;
                }
            }
        });
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
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
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
    
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.close();
        });
    
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
            this.showToast(this.currentLang === 'es' ? 'Descargando presentación...' : 'Downloading presentation...');
        } catch (error) {
            console.error('PDF download failed:', error);
            this.showToast(this.currentLang === 'es' ? 'Error al descargar' : 'Download failed');
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
                const emailItem = item.querySelector('span');
                if (emailItem && emailItem.textContent.includes('@')) {
                    navigator.clipboard.writeText(emailItem.textContent).then(() => {
                        this.showToast('Email copiado al portapapeles');
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
            button.addEventListener('click', (e) => {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);
                console.log('CV download initiated');
                this.showToast(this.currentLang === 'es' ? 'Descargando CV...' : 'Downloading CV...');
            });
            button.addEventListener('error', (e) => {
                console.error('Download failed:', e);
                this.showToast(this.currentLang === 'es' ? 'Error al descargar CV' : 'CV download failed');
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
                    this.showToast(this.currentLang === 'es' ? 'Abriendo cliente de email...' : 'Opening email client...');
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
            background: {
                color: { value: "transparent" }
            },
            fpsLimit: 60,
            interactivity: {
                detect_on: "window",
                events: {
                    onClick: { enable: true, mode: "push" },
                    onHover: { enable: true, mode: "repulse" },
                    resize: true
                },
                modes: {
                    push: { quantity: 2 },
                    repulse: { distance: 100, duration: 0.4 }
                }
            },
            particles: {
                color: { value: ["#00a8ff", "#1e3799", "#fbc531", "#ffffff"] },
                links: {
                    color: "#00a8ff",
                    distance: 120,
                    enable: true,
                    opacity: 0.3,
                    width: 1
                },
                collisions: { enable: false },
                move: {
                    direction: "none",
                    enable: true,
                    outMode: "bounce",
                    random: true,
                    speed: 1,
                    straight: false
                },
                number: {
                    density: { enable: true, area: 1000 },
                    value: window.innerWidth > 768 ? 50 : 30
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    animation: {
                        enable: true,
                        speed: 0.5,
                        minimumValue: 0.1,
                        sync: false
                    }
                },
                shape: {
                    type: ["circle", "triangle", "polygon"],
                    polygon: { nb_sides: 6 }
                },
                size: {
                    value: { min: 1, max: 4 },
                    animation: {
                        enable: true,
                        speed: 2,
                        minimumValue: 0.5,
                        sync: false
                    }
                }
            },
            detectRetina: true,
            responsive: [
                {
                    maxWidth: 768,
                    options: {
                        particles: {
                            number: { value: 30 },
                            links: { distance: 80 }
                        }
                    }
                },
                {
                    maxWidth: 480,
                    options: {
                        particles: {
                            number: { value: 20 },
                            links: { enable: false }
                        }
                    }
                }
            ]
        };
        tsParticles.load("particles-js", particlesConfig).then((container) => {
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
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
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
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        if (this.particlesContainer) {
            this.particlesContainer.refresh();
        }
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
