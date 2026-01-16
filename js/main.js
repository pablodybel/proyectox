/**
 * OPTIMA - Main JavaScript
 * Planificación Empresarial Inteligente
 */

(function() {
    'use strict';

    // =========================================
    // DOM Elements
    // =========================================
    const navbar = document.querySelector('.navbar');
    const navCta = document.querySelector('.nav-cta');
    const contactForm = document.querySelector('.contact-form');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // =========================================
    // Scroll Animation (Intersection Observer)
    // =========================================
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

    // =========================================
    // Smooth Scroll for Navigation Links
    // =========================================
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

    // =========================================
    // Navbar CTA Button
    // =========================================
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

    // =========================================
    // Contact Form Handling
    // =========================================
    function initContactForm() {
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Get form data
                const formData = new FormData(this);
                const data = {
                    nombre: formData.get('nombre'),
                    empresa: formData.get('empresa'),
                    email: formData.get('email'),
                    mensaje: formData.get('mensaje')
                };

                // Basic validation
                if (!data.nombre || !data.email) {
                    showNotification('Por favor completa los campos requeridos.', 'error');
                    return;
                }

                if (!isValidEmail(data.email)) {
                    showNotification('Por favor ingresa un email válido.', 'error');
                    return;
                }

                // Here you would typically send the data to your backend
                // For now, we'll show a success message
                console.log('Form data:', data);

                showNotification('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.', 'success');

                // Reset form
                this.reset();
            });
        }
    }

    // =========================================
    // Email Validation
    // =========================================
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // =========================================
    // Notification System
    // =========================================
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles dynamically if not exists
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

        // Add to DOM
        document.body.appendChild(notification);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // =========================================
    // Navbar Scroll Effect
    // =========================================
    function initNavbarScroll() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (navbar) {
                // Add shadow on scroll
                if (currentScroll > 50) {
                    navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
                } else {
                    navbar.style.boxShadow = 'none';
                }
            }

            lastScroll = currentScroll;
        });
    }

    // =========================================
    // Counter Animation for Stats
    // =========================================
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

            // Easing function (ease-out)
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

    // =========================================
    // Mobile Menu Toggle (for future implementation)
    // =========================================
    function initMobileMenu() {
        // This function can be expanded when adding a mobile hamburger menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }
    }

    // =========================================
    // Parallax Effect for Background Images
    // =========================================
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

    // =========================================
    // Initialize All Functions
    // =========================================
    function init() {
        initScrollAnimations();
        initSmoothScroll();
        initNavCta();
        initContactForm();
        initNavbarScroll();
        initCounterAnimation();
        initMobileMenu();
        initParallax();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
