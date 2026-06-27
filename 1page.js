// GATI Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeLandingPage();
});

function initializeLandingPage() {
    // Initialize all functionality
    initializeThemeToggle();
    initializeEventListeners();
    initializeAnimations();
    initializeStatsCounter();
    initializeMetricsAnimations();
    updateCurrentTime();
    
    console.log('GATI Landing Page initialized successfully');
}

// ========================= THEME TOGGLE =========================
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.classList.add('dark');
    }
    
    themeToggle.addEventListener('click', function() {
        html.classList.toggle('dark');
        
        // Save preference
        if (html.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        
        // Add animation to theme toggle
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

// ========================= EVENT LISTENERS =========================
function initializeEventListeners() {
    // Dashboard launch buttons
    const dashboardBtns = document.querySelectorAll('.dashboard-btn, .hero-buttons .btn-primary');
    dashboardBtns.forEach(btn => {
        btn.addEventListener('click', handleLaunchDashboard);
    });
    
    // Demo buttons
    const demoBtns = document.querySelectorAll('.btn-outline');
    demoBtns.forEach(btn => {
        if (btn.textContent.includes('Demo') || btn.textContent.includes('Live')) {
            btn.addEventListener('click', handleWatchDemo);
        }
    });
    
    // Email launch system
    const launchButton = document.getElementById('launch-button');
    const emailInput = document.getElementById('email-input');
    
    if (launchButton && emailInput) {
        launchButton.addEventListener('click', handleEmailLaunch);
        emailInput.addEventListener('input', handleEmailInput);
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleEmailLaunch();
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add hover effects to interactive elements
    addHoverEffects();
    
    // Close modal when clicking outside
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ========================= BUTTON HANDLERS =========================
async function handleLaunchDashboard(event) {
    const btn = event.target.closest('button') || event.target.closest('a');
    if (!btn) return;
    
    await simulateLoading(btn, 'Launching Dashboard...', 2500);
    showSuccessModal();
}

function handleWatchDemo() {
    // Create and show demo modal
    showDemoModal();
}

async function handleEmailLaunch() {
    const emailInput = document.getElementById('email-input');
    const launchButton = document.getElementById('launch-button');
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    await simulateSystemInitialization(launchButton);
    showSuccessModal();
}

function handleEmailInput() {
    const emailInput = document.getElementById('email-input');
    const launchButton = document.getElementById('launch-button');
    
    const email = emailInput.value.trim();
    launchButton.disabled = !email || !isValidEmail(email);
}

// ========================= LOADING SIMULATION =========================
async function simulateLoading(btn, loadingText, duration = 2000) {
    const originalText = btn.innerHTML;
    const originalDisabled = btn.disabled;
    
    // Set loading state
    btn.disabled = true;
    btn.innerHTML = `
        <div class="loading-spinner"></div>
        ${loadingText}
    `;
    
    await new Promise(resolve => setTimeout(resolve, duration));
    
    // Reset button state
    btn.disabled = originalDisabled;
    btn.innerHTML = originalText;
}

async function simulateSystemInitialization(btn) {
    const phases = [
        'Connecting to AI Engine...',
        'Loading Railway Network...',
        'Initializing Digital Twin...',
        'Starting Real-time Monitoring...',
        'System Ready!'
    ];
    
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('.btn-icon');
    const spinner = btn.querySelector('.loading-spinner');
    
    btn.disabled = true;
    btnIcon.style.display = 'none';
    spinner.classList.remove('hidden');
    
    for (let i = 0; i < phases.length; i++) {
        btnText.textContent = phases[i];
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Reset button
    btn.disabled = false;
    btnIcon.style.display = 'inline';
    spinner.classList.add('hidden');
    btnText.textContent = 'Launch Control Dashboard';
}

// ========================= MODAL FUNCTIONS =========================
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('hidden');
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closeModal();
    }, 5000);
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.animation = 'modalSlideOut 0.3s ease-in forwards';
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
    }, 300);
}

function showDemoModal() {
    const demoModal = createDemoModal();
    document.body.appendChild(demoModal);
    
    // Remove modal after showing
    setTimeout(() => {
        document.body.removeChild(demoModal);
    }, 8000);
}

function createDemoModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-icon">🎥</div>
                <h3 class="modal-title">Interactive Demo</h3>
                <p class="modal-description">
                    Experience GATI's powerful features:<br><br>
                    • Real-time train tracking and monitoring<br>
                    • AI-powered route optimization<br>
                    • Predictive delay analysis<br>
                    • Interactive control dashboard<br><br>
                    <em>Full demo available after system launch</em>
                </p>
                <button class="btn btn-primary modal-button" onclick="this.closest('.modal').remove()">
                    Close Preview
                </button>
            </div>
        </div>
    `;
    return modal;
}

// Make closeModal globally available
window.closeModal = closeModal;

// ========================= ANIMATIONS =========================
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .metric-card, .analytics-card, .alerts-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Parallax effect for floating elements
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', throttle(requestTick, 16));
}

function addHoverEffects() {
    // Feature cards hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.dataset.offset === '1' ? 
                'translateY(2rem) scale(1.05)' : 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.dataset.offset === '1' ? 
                'translateY(2rem)' : '';
        });
    });
    
    // Train status hover effects
    const trainItems = document.querySelectorAll('.train-item');
    trainItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(30, 41, 59, 0.8)';
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(30, 41, 59, 0.5)';
            this.style.transform = 'translateX(0)';
        });
    });
}

// ========================= STATS COUNTER =========================
function initializeStatsCounter() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateHeroStats();
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

function animateHeroStats() {
    const stats = {
        'active-trains': { target: 127, suffix: '' },
        'on-time-perf': { target: 94, suffix: '%' },
        'delay-reduction': { target: 52, suffix: '%' },
        'system-uptime': { target: 99.8, suffix: '%', decimal: true }
    };
    
    Object.keys(stats).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            animateNumber(element, stats[id].target, stats[id].suffix, stats[id].decimal);
        }
    });
}

function animateNumber(element, targetValue, suffix = '', useDecimal = false) {
    const duration = 2000;
    const start = performance.now();
    const startValue = 0;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        let current = startValue + (targetValue - startValue) * easeOutQuart;
        
        if (useDecimal) {
            current = Math.round(current * 10) / 10;
        } else {
            current = Math.round(current);
        }
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// ========================= METRICS ANIMATIONS =========================
function initializeMetricsAnimations() {
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateMetrics();
                metricsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    
    const metricsSection = document.getElementById('performance-section');
    if (metricsSection) {
        metricsObserver.observe(metricsSection);
    }
}

function animateMetrics() {
    const metrics = {
        'efficiency-value': { target: 92, progress: 'efficiency-progress' },
        'accuracy-value': { target: 97, progress: 'accuracy-progress' },
        'uptime-value': { target: 99.8, progress: 'uptime-progress', decimal: true },
        'throughput-value': { target: 127, progress: null }
    };
    
    Object.keys(metrics).forEach(id => {
        const element = document.getElementById(id);
        const progressBar = metrics[id].progress ? document.getElementById(metrics[id].progress) : null;
        
        if (element) {
            animateMetricValue(element, metrics[id].target, progressBar, metrics[id].decimal);
        }
    });
    
    // Animate overview stats
    animateOverviewStats();
}

function animateMetricValue(element, targetValue, progressBar, useDecimal = false) {
    const duration = 2000;
    const start = performance.now();
    
    function updateMetric(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        let current = targetValue * easeOutQuart;
        
        if (useDecimal) {
            current = Math.round(current * 10) / 10;
            element.textContent = current + '%';
        } else {
            current = Math.round(current);
            element.textContent = current + (element.id.includes('throughput') ? '' : '%');
        }
        
        // Update progress bar
        if (progressBar) {
            const progressPercent = useDecimal ? (current / 100) * 100 : current;
            progressBar.style.width = Math.min(progressPercent, 100) + '%';
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateMetric);
        }
    }
    
    requestAnimationFrame(updateMetric);
}

function animateOverviewStats() {
    const overviewStats = {
        'overview-ontime': 94,
        'overview-active': 127,
        'overview-delayed': 3
    };
    
    Object.keys(overviewStats).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            animateNumber(element, overviewStats[id], id.includes('ontime') ? '%' : '');
        }
    });
}

// ========================= TIME UPDATE =========================
function updateCurrentTime() {
    const timeElements = document.querySelectorAll('#current-time, #terminal-time');
    
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        timeElements.forEach(element => {
            if (element) {
                element.textContent = timeString;
            }
        });
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// ========================= UTILITY FUNCTIONS =========================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
        background: ${type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ========================= EASTER EGGS & EXTRAS =========================
document.addEventListener('keydown', function(e) {
    // Konami Code: ↑↑↓↓←→←→BA
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    if (!window.konamiProgress) {
        window.konamiProgress = 0;
    }
    
    if (e.code === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            showEasterEgg();
            window.konamiProgress = 0;
        }
    } else {
        window.konamiProgress = 0;
    }
});

function showEasterEgg() {
    // Create confetti effect
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 100);
    }
    
    // Show special message
    setTimeout(() => {
        showNotification('🎉 Easter Egg Activated! GATI Team appreciates curious minds! 🚄', 'info');
    }, 1000);
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        top: -10px;
        left: ${Math.random() * 100}vw;
        width: 10px;
        height: 10px;
        background: ${color};
        z-index: 10000;
        pointer-events: none;
        animation: confettiFall 3s linear forwards;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            @keyframes modalSlideOut {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        if (document.body.contains(confetti)) {
            document.body.removeChild(confetti);
        }
    }, 3000);
}

// ========================= PERFORMANCE MONITORING =========================
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('🚀 GATI Page Performance:', {
                        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart) + 'ms',
                        loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms',
                        totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms'
                    });
                }
            }, 0);
        });
    }
}

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    logPerformance();
}

// ========================= ACCESSIBILITY ENHANCEMENTS =========================
function initializeAccessibility() {
    // Add focus visible support for older browsers
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
    });
    
    // Add ARIA live region for dynamic content updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Add screen reader only styles
    const srOnlyStyles = document.createElement('style');
    srOnlyStyles.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        body.using-keyboard *:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(srOnlyStyles);
}

// Initialize accessibility features
initializeAccessibility();

// ========================= TERMINAL SIMULATION =========================
function initializeTerminalAnimation() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    
    // Add typing effect to terminal
    terminalLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-10px)';
            line.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, 100);
        }, index * 200);
    });
}

// Initialize terminal animation after a delay
setTimeout(initializeTerminalAnimation, 2000);

// ========================= LIVE DATA SIMULATION =========================
function simulateLiveData() {
    setInterval(() => {
        // Simulate train status updates
        const trainDots = document.querySelectorAll('.train-dot');
        trainDots.forEach(dot => {
            if (Math.random() < 0.1) { // 10% chance to update
                dot.style.opacity = '0.5';
                setTimeout(() => {
                    dot.style.opacity = '1';
                }, 200);
            }
        });
        
        // Simulate small variations in metrics
        const metricValues = document.querySelectorAll('#overview-ontime, #overview-active, #overview-delayed');
        metricValues.forEach(element => {
            if (Math.random() < 0.05) { // 5% chance to update
                const originalText = element.textContent;
                element.style.color = '#10b981';
                setTimeout(() => {
                    element.style.color = '';
                }, 500);
            }
        });
    }, 5000); // Update every 5 seconds
}

// Start live data simulation
setTimeout(simulateLiveData, 5000);