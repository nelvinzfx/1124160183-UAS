// Dark/Light Mode Toggle dan Loading Animation
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.htmlElement = document.documentElement;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        // Set initial theme
        if (this.currentTheme === 'dark') {
            this.htmlElement.classList.add('dark');
        }

        // Bind events
        this.bindEvents();
        
        // Initialize loading animation
        this.initLoadingAnimation();
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Add keyboard support
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        this.htmlElement.classList.toggle('dark');
        
        // Save theme preference
        const isDark = this.htmlElement.classList.contains('dark');
        this.currentTheme = isDark ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        
        // Add click animation
        this.addClickAnimation();
        
        // Trigger custom event for theme change
        this.dispatchThemeChangeEvent(isDark);
    }

    addClickAnimation() {
        this.themeToggle.classList.add('button-click');
        setTimeout(() => {
            this.themeToggle.classList.remove('button-click');
        }, 150);
    }

    dispatchThemeChangeEvent(isDark) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: isDark ? 'dark' : 'light' }
        });
        document.dispatchEvent(event);
    }

    initLoadingAnimation() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 100);
        });
    }
}

// Enhanced Card Interactions
class CardAnimations {
    constructor() {
        this.cards = document.querySelectorAll('.grid > div');
        this.init();
    }

    init() {
        this.cards.forEach((card, index) => {
            card.classList.add('card-hover');
            
            // Add stagger animation delay
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add mouse enter/leave effects
            card.addEventListener('mouseenter', () => this.onCardHover(card));
            card.addEventListener('mouseleave', () => this.onCardLeave(card));
        });
    }

    onCardHover(card) {
        // Add subtle pulse to icon
        const icon = card.querySelector('svg');
        if (icon) {
            icon.style.transform = 'scale(1.1)';
            icon.style.transition = 'transform 0.3s ease';
        }
    }

    onCardLeave(card) {
        const icon = card.querySelector('svg');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    }
}

// Social Links Animation
class SocialLinks {
    constructor() {
        this.links = document.querySelectorAll('footer a');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.classList.add('social-link');
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.animateClick(link);
            });
        });
    }

    animateClick(link) {
        link.style.transform = 'scale(0.9) rotate(-5deg)';
        setTimeout(() => {
            link.style.transform = 'scale(1.1) rotate(5deg)';
        }, 100);
        setTimeout(() => {
            link.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    }
}

// Smooth Scroll Enhancement
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Add scroll-based animations
        this.observeElements();
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe footer for entrance animation
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.opacity = '0';
            footer.style.transform = 'translateY(20px)';
            footer.style.transition = 'all 0.6s ease-out';
            observer.observe(footer);
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log theme change events
        document.addEventListener('themeChanged', (e) => {
            console.log(`Theme changed to: ${e.detail.theme}`);
        });

        // Log page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log(`Page loaded in: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
                }
            }, 0);
        });
    }
}

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new CardAnimations();
    new SocialLinks();
    new SmoothScroll();
    new PerformanceMonitor();
});

// Add error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});
