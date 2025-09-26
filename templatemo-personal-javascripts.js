/*

TemplateMo 593 personal shape

https://templatemo.com/tm-593-personal-shape

*/

// JavaScript Document

        // Mobile menu functionality
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        // Add ARIA attributes for screen readers
        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute('role', 'button');
            mobileMenuToggle.setAttribute('aria-controls', mobileMenu ? 'mobileMenu' : '');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-label', 'Open mobile menu');
        }

        function toggleMobileMenu(open) {
            const active = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('active');
            if (active) {
                mobileMenuToggle.classList.add('active');
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }

        mobileMenuToggle.addEventListener('click', () => toggleMobileMenu());
        // Keyboard activation for toggle (Enter / Space)
        mobileMenuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });

        // Close mobile menu when clicking on links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu(false);
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu && mobileMenuToggle && mobileMenu.classList.contains('active')) {
                if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                    toggleMobileMenu(false);
                }
            }
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Enhanced Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Staggered animation for portfolio items
        const portfolioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.portfolio-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.1 });

        // Observe all animation elements
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
            animatedElements.forEach(el => observer.observe(el));

            const portfolioSection = document.querySelector('.portfolio-grid');
            if (portfolioSection) {
                portfolioObserver.observe(portfolioSection);
            }
        });

        // Enhanced smooth scrolling for navigation links (guard against invalid targets)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });

        // Enhanced form submission with better UX
        document.getElementById('contact-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const submitBtn = form.querySelector('.submit-btn');
            const statusRegion = document.getElementById('contact-status');
            const originalText = submitBtn.textContent;

            // gather values
            const name = form.querySelector('#name') ? form.querySelector('#name').value.trim() : '';
            const email = form.querySelector('#email') ? form.querySelector('#email').value.trim() : '';
            const subject = form.querySelector('#subject') ? form.querySelector('#subject').value.trim() : '(No subject)';
            const message = form.querySelector('#message') ? form.querySelector('#message').value.trim() : '';

            // Add loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.background = 'linear-gradient(135deg, #94a3b8, #64748b)';

            const endpoint = form.dataset.endpoint; // optional server endpoint
            const toEmail = form.dataset.toEmail || 'purushotham.muktha@gmail.com';

            try {
                if (endpoint) {
                    // Try sending to the configured endpoint
                    const resp = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, subject, message, to: toEmail })
                    });
                    if (!resp.ok) throw new Error('Network response was not ok');
                } else {
                    // No endpoint: fallback to opening a mailto: link
                    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
                    const mailto = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${body}`;
                    // Open mail client in a new window/tab where supported
                    window.location.href = mailto;
                }

                // Success feedback
                submitBtn.textContent = 'Message Sent! ✓';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                if (statusRegion) {
                    statusRegion.textContent = 'Message sent. Thank you — I will get back to you soon.';
                    statusRegion.focus && statusRegion.focus();
                }
            } catch (err) {
                // Failure feedback
                if (statusRegion) {
                    statusRegion.textContent = 'Failed to send message. Please try again or email directly to ' + toEmail;
                    statusRegion.focus && statusRegion.focus();
                }
                console.error('Contact form send error:', err);
            } finally {
                // Restore state after a short delay so users see success
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    form.reset();
                    if (statusRegion) statusRegion.textContent = '';
                }, 2500);
            }
        });

        // Enhanced parallax effect for hero background
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const rate = scrolled * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        // Add subtle hover effects to skill tags
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Keyboard navigation for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Enable keyboard activation for scroll-indicator
        document.addEventListener('DOMContentLoaded', () => {
            const scroller = document.querySelector('.scroll-indicator');
            if (scroller) {
                scroller.addEventListener('keydown', (ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault();
                        document.getElementById('about-proven').scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        });

        // Typewriter effect
var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }

        setTimeout(function() {
        that.tick();
        }, delta);
    };
/* INJECT TYPEWRITER EFFECT */
    window.onload = function() {
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
        document.body.appendChild(css);
    };

    // Reveal-target observer (staggered)
    document.addEventListener('DOMContentLoaded', () => {
        const revealTargets = Array.from(document.querySelectorAll('.reveal-target'));
        revealTargets.forEach((el, i) => el.setAttribute('data-delay', String(i * 60)));

            // Set --delay CSS variable and copy data-logo into --chip-logo for chips
        revealTargets.forEach(el => {
            const delay = el.getAttribute('data-delay') || '0';
            el.style.setProperty('--delay', delay + 'ms');
            // if element is a chip with data-logo, set CSS var --chip-logo
            if (el.classList.contains('chip') && el.dataset.logo) {
                // data-logo may contain unescaped quotes; wrap safely
                el.style.setProperty('--chip-logo', `url(${el.dataset.logo})`);
            }
            // Accessibility: if this is a chip make it act like a button for keyboard users
            if (el.classList.contains('chip')) {
                el.setAttribute('role', el.getAttribute('role') || 'button');
                if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
                // aria-pressed indicates selection state; default false
                if (!el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', 'false');
                el.addEventListener('keydown', (ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault();
                        // Toggle pressed state as an example action
                        const pressed = el.getAttribute('aria-pressed') === 'true';
                        el.setAttribute('aria-pressed', String(!pressed));
                        // Provide a non-blocking visual cue
                        el.classList.toggle('chip-active', !pressed);
                    }
                });
                // update aria-pressed on click as well
                el.addEventListener('click', () => {
                    const pressed = el.getAttribute('aria-pressed') === 'true';
                    el.setAttribute('aria-pressed', String(!pressed));
                    el.classList.toggle('chip-active', !pressed);
                });
            }
        });

            // Mark purely decorative inline SVGs as aria-hidden to avoid noisy SR output
            document.querySelectorAll('svg').forEach(svg => {
                // If the SVG has no title/desc and contains no meaningful text nodes, mark it decorative.
                const hasTitle = svg.querySelector('title') !== null;
                const hasDesc = svg.querySelector('desc') !== null;
                const hasAriaLabel = svg.getAttribute('aria-label') !== null || svg.getAttribute('role') === 'img';
                if (!hasTitle && !hasDesc && !hasAriaLabel) {
                    svg.setAttribute('aria-hidden', 'true');
                    svg.setAttribute('focusable', 'false');
                }
            });

            // Ensure ecosystem boxes have aria-labelledby referencing the internal heading for clarity
            document.querySelectorAll('.ecosystem-box').forEach((box, idx) => {
                const heading = box.querySelector('h5');
                if (heading) {
                    if (!heading.id) heading.id = `ecosystem-heading-${idx}`;
                    box.setAttribute('aria-labelledby', heading.id);
                }
            });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    // unobserve after reveal
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealTargets.forEach(el => revealObserver.observe(el));
    });