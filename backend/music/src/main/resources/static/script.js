// Popup Ad Modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const popupAdModal = document.getElementById('popupAdModal');
    const popupAdClose = document.getElementById('popupAdClose');
    
    if (!popupAdModal || !popupAdClose) return;
    
    // Check if user has already closed the popup in this session
    const popupClosed = sessionStorage.getItem('popupAdClosed');
    
    // Show popup after a short delay if not already closed
    if (!popupClosed) {
        setTimeout(() => {
            popupAdModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 500); // Show after 500ms delay
    }
    
    // Close popup function
    const closePopup = () => {
        popupAdModal.classList.remove('active');
        document.body.style.overflow = '';
        sessionStorage.setItem('popupAdClosed', 'true');
    };
    
    // Close button click
    popupAdClose.addEventListener('click', closePopup);
    
    // Close on background click
    popupAdModal.addEventListener('click', (e) => {
        if (e.target === popupAdModal) {
            closePopup();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupAdModal.classList.contains('active')) {
            closePopup();
        }
    });
});

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        if (link && navMenu && hamburger) {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        }
    });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (!targetId || !targetId.startsWith('#')) return;
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Extra offset so section is not stuck under the fixed navbar
                    const offsetTop = targetSection.offsetTop - 100;
                    window.scrollTo({
                        top: Math.max(0, offsetTop),
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
});

// Auto play Programs video when section is visible
document.addEventListener('DOMContentLoaded', () => {
    const programsSection = document.getElementById('programs');
    const programVideo = document.getElementById('programMainVideo');

    if (!programsSection || !programVideo) {
        console.log('Video or section not found');
        return;
    }

    // Ensure video is muted for autoplay (required by browsers)
    programVideo.muted = true;
    programVideo.volume = 0;
    programVideo.setAttribute('playsinline', '');
    programVideo.setAttribute('webkit-playsinline', '');

    let hasUserInteracted = false;
    let videoReady = false;

    // Track user interaction to enable autoplay
    const enableAutoplay = () => {
        hasUserInteracted = true;
    };

    ['click', 'touchstart', 'keydown'].forEach(event => {
        document.addEventListener(event, enableAutoplay, { once: true });
    });

    // Wait for video to be ready
    const handleVideoReady = () => {
        videoReady = true;
        console.log('Video is ready');
    };

    programVideo.addEventListener('loadeddata', handleVideoReady);
    programVideo.addEventListener('canplay', handleVideoReady);
    programVideo.addEventListener('loadedmetadata', handleVideoReady);

    // If video is already loaded
    if (programVideo.readyState >= 2) {
        videoReady = true;
    }

    const playVideo = () => {
        if (!videoReady) {
            console.log('Video not ready yet');
            return;
        }

        const playPromise = programVideo.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Video playing successfully');
                })
                .catch((error) => {
                    console.log('Video play failed:', error);
                    // If autoplay fails, try again after user interaction
                    if (!hasUserInteracted) {
                        const tryAgain = () => {
                            programVideo.play().catch(() => {});
                            document.removeEventListener('click', tryAgain);
                        };
                        document.addEventListener('click', tryAgain, { once: true });
                    }
                });
        }
    };

    const pauseVideo = () => {
        programVideo.pause();
    };

    // Intersection Observer to detect when section is visible
    const videoObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Section is visible - try to play
                    console.log('Programs section is visible');
                    playVideo();
                } else {
                    // Section is not visible - pause
                    pauseVideo();
                }
            });
        },
        { 
            threshold: 0.2, // Start playing when 20% of section is visible
            rootMargin: '0px'
        }
    );

    videoObserver.observe(programsSection);

    // Check initial visibility after video loads
    const checkInitialVisibility = () => {
        if (!videoReady) {
            setTimeout(checkInitialVisibility, 100);
            return;
        }

        const rect = programsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible) {
            console.log('Section already visible on load');
            playVideo();
        }
    };

    // Try multiple times to ensure video loads
    setTimeout(checkInitialVisibility, 300);
    setTimeout(checkInitialVisibility, 1000);
    setTimeout(checkInitialVisibility, 2000);

    // Also try when video metadata is loaded
    programVideo.addEventListener('loadedmetadata', () => {
        setTimeout(checkInitialVisibility, 100);
    });
});

// Form submission handlers
document.addEventListener('DOMContentLoaded', () => {
    const admissionForm = document.getElementById('admissionForm');
    const contactForm = document.getElementById('contactForm');
    const enquiryForm = document.getElementById('enquiryForm');

    // Enquiry form: show extra textarea when "Other" is selected
    if (enquiryForm) {
        const inquirySelect = enquiryForm.querySelector('#inquiry');
        const otherReasonGroup = enquiryForm.querySelector('#otherReasonGroup');
        const otherReasonField = enquiryForm.querySelector('#otherReason');

        if (inquirySelect && otherReasonGroup && otherReasonField) {
            const toggleOtherReason = () => {
                if (inquirySelect.value === 'Other') {
                    otherReasonGroup.style.display = 'block';
                    otherReasonField.required = true;
                } else {
                    otherReasonGroup.style.display = 'none';
                    otherReasonField.required = false;
                    otherReasonField.value = '';
                }
            };

            // Initialize state on load
            toggleOtherReason();

            inquirySelect.addEventListener('change', toggleOtherReason);
        }
    }

    if (admissionForm) {
        admissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(admissionForm);
            const data = Object.fromEntries(formData);
            
            // Show success message
            showNotification('Thank you! Your admission inquiry has been submitted. We will contact you soon.', 'success');
            
            // Reset form
            admissionForm.reset();
            
            // In a real application, you would send this data to a server
            console.log('Admission Form Data:', data);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show success message
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // In a real application, you would send this data to a server
            console.log('Contact Form Data:', data);
        });
    }

    // Enquiry form now submits directly to Formspree via HTML form action/method.
    // Do not intercept with fetch; let the browser submit normally.
});

// Notification function
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Append to body
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Intersection Observer for fade-in animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .program-card, .gallery-item, .step, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length === 0) return;
    
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        if (!section) return;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        if (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        }
    });
}, { passive: true });

// Add active class styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Gallery Lightbox/Modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) return;
    
    // Create enhanced lightbox modal
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <div class="lightbox-info">SSGA Gallery</div>
            <div class="lightbox-image-wrapper">
                <img class="lightbox-image" src="" alt="Gallery Image">
            </div>
            <div class="lightbox-counter">
                <span class="lightbox-current">1</span> / <span class="lightbox-total">1</span>
            </div>
            <span class="lightbox-close">&times;</span>
            <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
            <button class="lightbox-next" aria-label="Next image">&#10095;</button>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCurrent = lightbox.querySelector('.lightbox-current');
    const lightboxTotal = lightbox.querySelector('.lightbox-total');
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return img ? img.src : null;
    }).filter(src => src !== null);
    
    // Update counter
    const updateCounter = () => {
        if (lightboxCurrent && lightboxTotal) {
            lightboxCurrent.textContent = currentImageIndex + 1;
            lightboxTotal.textContent = images.length;
        }
    };
    
    // Update image with fade effect
    const updateImage = (src) => {
        if (!lightboxImage) return;
        lightboxImage.style.opacity = '0';
        lightboxImage.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            lightboxImage.src = src;
            lightboxImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            lightboxImage.style.opacity = '1';
            lightboxImage.style.transform = 'scale(1)';
        }, 150);
    };
    
    const openLightbox = (index) => {
        if (index < 0 || index >= images.length) return;
        
        currentImageIndex = index;
        updateImage(images[index]);
        updateCounter();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Prevent body scroll
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    };
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    };
    
    const showNext = () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImage(images[currentImageIndex]);
        updateCounter();
    };
    
    const showPrev = () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateImage(images[currentImageIndex]);
        updateCounter();
    };
    
    // Add click handlers to gallery items
    galleryItems.forEach((item, index) => {
        if (item) {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img && img.src) {
                    const imageIndex = images.findIndex(src => src === img.src);
                    if (imageIndex !== -1) {
                        openLightbox(imageIndex);
                    } else {
                        openLightbox(index);
                    }
                }
            });
        }
    });
    
    // Lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });
    }
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-image-wrapper')) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                showNext();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                showPrev();
            }
        }
    });
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNext();
            } else {
                showPrev();
            }
        }
    };
    
    // Prevent image dragging
    if (lightboxImage) {
        lightboxImage.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Particle Animation Canvas
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles = [];
    const particleCount = 50;
    let animationId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Recreate particles on resize
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    resizeCanvas();

    function animateParticles() {
        if (!canvas || !ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });

        animationId = requestAnimationFrame(animateParticles);
    }

    animateParticles();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
        }, 250);
    });
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', initParticles);

// Counter Animation for Statistics
function animateCounter(element) {
    if (!element) return;
    const target = parseInt(element.getAttribute('data-target'));
    if (isNaN(target)) return;
    
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Initialize statistics counter
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => statsObserver.observe(stat));
    }
});

// Testimonials Slider
let currentTestimonial = 0;
let testimonialInterval = null;

function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    if (testimonialCards.length === 0) return;

    function showTestimonial(index) {
        if (index < 0 || index >= testimonialCards.length) return;
        
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                setTimeout(() => card.classList.add('active'), 50);
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Initialize first testimonial
    if (testimonialCards.length > 0) {
        showTestimonial(0);
    }

    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
            // Reset auto-rotate timer
            if (testimonialInterval) {
                clearInterval(testimonialInterval);
            }
            testimonialInterval = setInterval(() => {
                currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
                showTestimonial(currentTestimonial);
            }, 5000);
        });
    });

    // Auto-rotate testimonials
    if (testimonialCards.length > 1) {
        testimonialInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }
}

// Initialize testimonials when DOM is ready
document.addEventListener('DOMContentLoaded', initTestimonials);

// Parallax Effect for Hero Section (removed to prevent sticking)
// The hero section should scroll normally without transform effects

// Enhanced Scroll Animations with Stagger
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .program-card, .step, .contact-item, .stat-card');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) rotateX(10deg)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) rotateX(0deg)';
                    elementObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elementObserver.observe(el);
    });

    // Gallery items with unique staggered animation
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((el, index) => {
        const delay = (index % 6) * 0.05; // Stagger based on position
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.95)';
        el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;
        
        const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    galleryObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });
        
        galleryObserver.observe(el);
    });
});

// Mouse Move Parallax Effect (only on desktop)
let isDesktop = window.innerWidth > 768;
let mouseMoveTimeout;

window.addEventListener('resize', () => {
    isDesktop = window.innerWidth > 768;
});

document.addEventListener('mousemove', (e) => {
    if (!isDesktop) return; // Skip on mobile
    
    clearTimeout(mouseMoveTimeout);
    
    const cards = document.querySelectorAll('.feature-card, .program-card');
    
    cards.forEach(card => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - cardX) / 20;
        const deltaY = (e.clientY - cardY) / 20;
        
        if (card.matches(':hover')) {
            card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotateY(${deltaX / 10}deg) rotateX(${-deltaY / 10}deg)`;
        }
    });
}, { passive: true });

// Reset card transforms when mouse leaves
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .program-card');
    cards.forEach(card => {
        if (card) {
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        }
    });
});

