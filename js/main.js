(function() {
    'use strict';

    const navbar = document.querySelector('.navbar');
    const navCta = document.querySelector('.nav-cta');
    const contactForm = document.querySelector('.contact-form');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function initNavCta() {
        if (navCta) {
            navCta.addEventListener('click', function() {
                const contactSection = document.querySelector('#contacto');
                if (contactSection) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    function initContactForm() {
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const formData = new FormData(this);
                const data = {
                    nombre: formData.get('nombre'),
                    empresa: formData.get('empresa'),
                    email: formData.get('email'),
                    mensaje: formData.get('mensaje')
                };

                if (!data.nombre || !data.email) {
                    showNotification('Por favor completa los campos requeridos.', 'error');
                    return;
                }

                if (!isValidEmail(data.email)) {
                    showNotification('Por favor ingresa un email válido.', 'error');
                    return;
                }

                console.log('Form data:', data);

                showNotification('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.', 'success');

                this.reset();
            });
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    background: var(--bg-card);
                    border: 1px solid rgba(0, 229, 255, 0.2);
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                .notification-success {
                    border-color: var(--accent-teal);
                }
                .notification-error {
                    border-color: #ff4757;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                .notification-close:hover {
                    color: var(--text-primary);
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    function initNavbarScroll() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (navbar) {
                if (currentScroll > 50) {
                    navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
                } else {
                    navbar.style.boxShadow = 'none';
                }
            }

            lastScroll = currentScroll;
        });
    }

    function initCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.textContent;
                    const hasPlus = text.includes('+');
                    const hasMinus = text.includes('-');
                    const hasX = text.includes('x');
                    const hasPercent = text.includes('%');

                    let numericValue = parseFloat(text.replace(/[^0-9.-]/g, ''));

                    if (!isNaN(numericValue)) {
                        animateCounter(target, numericValue, hasPlus, hasMinus, hasX, hasPercent);
                    }

                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    function animateCounter(element, endValue, hasPlus, hasMinus, hasX, hasPercent) {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (endValue - startValue) * easeOut;

            let displayValue = Math.round(currentValue);
            let prefix = '';
            let suffix = '';

            if (hasPlus) prefix = '+';
            if (hasMinus) prefix = '-';
            if (hasX) suffix = 'x';
            if (hasPercent) suffix = '%';

            element.textContent = prefix + Math.abs(displayValue) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const floatingCta = document.querySelector('.floating-cta');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                });
            });
        }

        if (floatingCta) {
            function updateFloatingCta() {
                if (window.innerWidth <= 768) {
                    floatingCta.style.display = 'block';
                } else {
                    floatingCta.style.display = 'none';
                }
            }

            floatingCta.addEventListener('click', () => {
                const contactSection = document.querySelector('#contacto');
                if (contactSection) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });

            updateFloatingCta();
            window.addEventListener('resize', updateFloatingCta);
        }
    }

    function initParallax() {
        const parallaxSections = document.querySelectorAll('[data-parallax]');

        if (parallaxSections.length === 0) return;

        window.addEventListener('scroll', () => {
            parallaxSections.forEach(section => {
                const speed = section.dataset.parallax || 0.5;
                const rect = section.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                const sectionTop = rect.top + scrolled;
                const yPos = (scrolled - sectionTop) * speed;

                section.style.backgroundPositionY = `${yPos}px`;
            });
        });
    }

    function initHeroFrameAnimation() {
        const canvas = document.getElementById('heroCanvas');
        const scrollContainer = document.querySelector('.hero-scroll-container');
        const heroContent = document.querySelector('.hero-content');
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');

        if (!canvas || !scrollContainer) return;

        const ctx = canvas.getContext('2d');
        const totalFrames = 192;
        const frames = [];
        let loadedCount = 0;
        let currentFrame = 0;
        let isReady = false;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (isReady && frames[currentFrame]) {
                drawFrame(currentFrame);
            }
        }

        function drawFrame(index) {
            const img = frames[index];
            if (!img || !img.complete) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }

        function onScroll() {
            if (!isReady) return;

            const rect = scrollContainer.getBoundingClientRect();
            const scrollableHeight = scrollContainer.offsetHeight - window.innerHeight;
            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
            const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));

            if (frameIndex !== currentFrame && frames[frameIndex]) {
                currentFrame = frameIndex;
                requestAnimationFrame(() => drawFrame(currentFrame));
            }

            if (heroContent) {
                const fadeStart = 0.6;
                const fadeEnd = 0.85;
                if (progress > fadeStart) {
                    const fadeProgress = Math.min(1, (progress - fadeStart) / (fadeEnd - fadeStart));
                    heroContent.style.opacity = 1 - fadeProgress;
                    heroContent.style.transform = `translateY(${-fadeProgress * 60}px)`;
                } else {
                    heroContent.style.opacity = '';
                    heroContent.style.transform = '';
                }
            }

            if (scrollIndicator) {
                const indicatorFade = Math.min(1, progress * 5);
                scrollIndicator.style.opacity = 1 - indicatorFade;
            }
        }

        function preloadFrames() {
            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                const num = String(i).padStart(3, '0');
                img.src = `assets/img/hero/ezgif-frame-${num}.jpg`;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === 1) {
                        isReady = true;
                        resizeCanvas();
                        drawFrame(0);
                        onScroll();
                    }
                    if (loadedCount === totalFrames) {
                        console.log('All hero frames loaded');
                    }
                };
                frames[i - 1] = img;
            }
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('scroll', onScroll, { passive: true });

        preloadFrames();
    }

    function initCtaFrameAnimation() {
        const canvas = document.getElementById('ctaCanvas');
        const section = document.querySelector('.cta-section');

        if (!canvas || !section) return;

        const ctx = canvas.getContext('2d');
        const totalFrames = 64;
        const fps = 24;
        const interval = 1000 / fps;
        const frames = [];
        let loadedCount = 0;
        let currentFrame = 0;
        let isReady = false;
        let lastTime = 0;
        let animationId = null;

        function resizeCanvas() {
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
            if (isReady && frames[currentFrame]) {
                drawFrame(currentFrame);
            }
        }

        function drawFrame(index) {
            const img = frames[index];
            if (!img || !img.complete) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }

        function animate(timestamp) {
            animationId = requestAnimationFrame(animate);

            if (!isReady) return;

            const delta = timestamp - lastTime;
            if (delta < interval) return;

            lastTime = timestamp - (delta % interval);
            currentFrame = (currentFrame + 1) % totalFrames;

            if (frames[currentFrame] && frames[currentFrame].complete) {
                drawFrame(currentFrame);
            }
        }

        function preloadFrames() {
            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                const num = String(i).padStart(3, '0');
                img.src = `assets/img/section/ezgif-frame-${num}.jpg`;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === totalFrames) {
                        isReady = true;
                        resizeCanvas();
                        drawFrame(0);
                        requestAnimationFrame(animate);
                    }
                };
                frames[i - 1] = img;
            }
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        preloadFrames();
    }

    function initTypewriter() {
        const el = document.getElementById('typewriterText');
        if (!el) return;

        const words = ['inteligentes', 'precisas', 'estratégicas', 'optimizadas'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 100;
        const deleteSpeed = 60;
        const pauseAfterWord = 2000;
        const pauseBeforeDelete = 1500;

        function tick() {
            const currentWord = words[wordIndex];

            if (!isDeleting) {
                el.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentWord.length) {
                    setTimeout(() => {
                        isDeleting = true;
                        tick();
                    }, pauseBeforeDelete);
                    return;
                }
                setTimeout(tick, typeSpeed);
            } else {
                el.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(tick, 500);
                    return;
                }
                setTimeout(tick, deleteSpeed);
            }
        }

        setTimeout(tick, 1000);
    }

    function init() {
        initScrollAnimations();
        initSmoothScroll();
        initNavCta();
        initContactForm();
        initNavbarScroll();
        initCounterAnimation();
        initMobileMenu();
        initParallax();
        initHeroFrameAnimation();
        initCtaFrameAnimation();
        initTypewriter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
