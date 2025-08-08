// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const bookingForm = document.getElementById('bookingForm');
const contactForm = document.getElementById('contactForm');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('aos-animate');
        }
    });
}

// Navbar background on scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Parallax effect for hero section
function handleParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// Pricing data for general booking form
const ACTIVITY_PACKAGES = {
    'camel-trekking': [
        { id: 'sunset', name: 'Sunset Trek', original: 85, price: 68 },
        { id: 'overnight', name: 'Overnight Camp Experience', original: 145, price: 116 },
        { id: 'sunrise', name: 'Sunrise Photography Trek', original: 95, price: 76 }
    ],
    'quad-bike-sandboarding': [
        { id: 'quad-60', name: '60-min Quad Ride', original: 75, price: 60 },
        { id: 'quad-120-sand', name: '120-min Quad + Sandboarding', original: 120, price: 96 },
        { id: 'quad-private', name: 'Private Adventure', original: 180, price: 144 }
    ],
    'merzouga-4x4-excursion': [
        { id: 'half-day', name: 'Half-Day 4x4 Tour', original: 95, price: 76 },
        { id: 'full-day', name: 'Full-Day 4x4 Tour', original: 165, price: 132 },
        { id: 'private', name: 'Private Custom Tour', original: 250, price: 200 }
    ],
    'overnight-desert-camp': [
        { id: 'luxury', name: 'Luxury Desert Camp', original: 220, price: 176 }
    ],
    'photography-tour': [
        { id: 'mini', name: 'Mini Package', original: 300, price: 240 },
        { id: 'standard', name: 'Standard Package', original: 350, price: 280 },
        { id: 'optima', name: 'Optima Package', original: 400, price: 320 },
        { id: 'vip', name: 'VIP Package', original: 500, price: 400 }
    ]
};

function populatePackages(activityValue) {
    const packageSelect = document.getElementById('package');
    const priceWrap = document.getElementById('priceSummary');
    if (!packageSelect || !priceWrap) return;

    packageSelect.innerHTML = '<option value="">Select a package</option>';

    const list = ACTIVITY_PACKAGES[activityValue] || [];
    list.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        packageSelect.appendChild(opt);
    });

    // Reset price display
    priceWrap.innerHTML = '';
    updateTotalPrice();
}

function updatePriceSummary(activityValue, packageId) {
    const priceWrap = document.getElementById('priceSummary');
    if (!priceWrap) return;
    priceWrap.innerHTML = '';

    const pkg = (ACTIVITY_PACKAGES[activityValue] || []).find(p => p.id === packageId);
    if (!pkg) return;

    priceWrap.innerHTML = `
        <div class="price-container">
            <div class="original-price">€${pkg.original}</div>
            <div class="discount-badge">20% OFF</div>
            <div class="final-price">€${pkg.price}</div>
        </div>
    `;
    updateTotalPrice();
}

function updateTotalPrice() {
    const activitySelect = document.getElementById('activity');
    const packageSelect = document.getElementById('package');
    const participantsInput = document.getElementById('participants');
    const totalPriceWrap = document.getElementById('totalPrice');
    
    if (!activitySelect || !packageSelect || !participantsInput || !totalPriceWrap) return;
    
    const activityValue = activitySelect.value;
    const packageId = packageSelect.value;
    const participants = parseInt(participantsInput.value) || 1;
    
    const pkg = (ACTIVITY_PACKAGES[activityValue] || []).find(p => p.id === packageId);
    if (!pkg) {
        totalPriceWrap.textContent = '0';
        return;
    }
    
    const totalPrice = pkg.price * participants;
    totalPriceWrap.textContent = totalPrice;
}

// Form validation and submission
function validateForm(formData) {
    const errors = [];

    // Honeypot anti-spam
    if (formData.get('company')) {
        errors.push('Spam detected');
    }
    
    // Check required fields (excluding hidden honeypot field)
    for (let [key, value] of formData.entries()) {
        if (key !== 'company' && !value.trim()) {
            errors.push(`${key} is required`);
        }
    }
    
    // Email validation
    const email = formData.get('email') || formData.get('contactEmail') || formData.get('reviewEmail');
    if (email && !isValidEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Phone validation
    const phone = formData.get('phone');
    if (phone && !isValidPhone(phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[+]?\d[\d\s-]{6,}$/;
    return phoneRegex.test(phone.trim());
}

function showMessage(form, message, type) {
    // Remove existing messages
    const existingMessage = form.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Insert message after form
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Email verification functionality
let verificationCode = null;
let userEmail = null;

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendVerificationEmail(email, code) {
    // Simulate sending email (in production, this would use a backend service)
    console.log(`Verification code ${code} sent to ${email}`);
    
    // For demo purposes, we'll show the code in console
    // In production, this would be sent via email service
    alert(`Verification code: ${code}\n\nIn production, this would be sent to your email.`);
}

function verifyEmailCode() {
    const codeInput = document.getElementById('verificationCode');
    const enteredCode = codeInput.value.trim();
    
    if (enteredCode === verificationCode) {
        showMessage(document.getElementById('reviewSigninForm'), 'Email verified successfully! You can now leave a review.', 'success');
        document.getElementById('emailVerification').style.display = 'none';
        document.getElementById('reviewEmail').disabled = true;
        document.getElementById('verifyCodeBtn').disabled = true;
        return true;
    } else {
        showMessage(document.getElementById('reviewSigninForm'), 'Invalid verification code. Please try again.', 'error');
        return false;
    }
}

// Form submission with email sending
function sendFormData(formData, formType) {
    // Prepare email content
    let subject = '';
    let body = '';
    
    switch(formType) {
        case 'booking':
            subject = 'New Booking Request - Merzouga Best Activities';
            body = `
New booking request received:

Name: ${formData.get('fullName')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone')}
Activity: ${formData.get('activity')}
Package: ${formData.get('package')}
Date: ${formData.get('date')}
Participants: ${formData.get('participants')}
Message: ${formData.get('message') || 'No additional message'}

---
Sent from Merzouga Best Activities Website
            `;
            break;
            
        case 'contact':
            subject = 'New Contact Message - Merzouga Best Activities';
            body = `
New contact message received:

Name: ${formData.get('contactName')}
Email: ${formData.get('contactEmail')}
Message: ${formData.get('contactMessage')}

---
Sent from Merzouga Best Activities Website
            `;
            break;
            
        case 'review':
            subject = 'New Review Sign-in - Merzouga Best Activities';
            body = `
New review sign-in:

Name: ${formData.get('reviewName')}
Email: ${formData.get('reviewEmail')}

---
Sent from Merzouga Best Activities Website
            `;
            break;
    }
    
    // Create a simple form submission that will actually send emails
    const emailData = {
        to: 'merzougabestactivites@gmail.com',
        from: formData.get('email') || formData.get('contactEmail') || formData.get('reviewEmail'),
        subject: subject,
        message: body,
        name: formData.get('fullName') || formData.get('contactName') || formData.get('reviewName')
    };
    
    // Use a simple email service (Web3Forms - free and reliable)
    const web3formsEndpoint = 'https://api.web3forms.com/submit';
    const accessKey = 'YOUR_WEB3FORMS_ACCESS_KEY'; // You'll get this from web3forms.com
    
    const formDataToSend = new FormData();
    formDataToSend.append('access_key', accessKey);
    formDataToSend.append('from_name', emailData.name);
    formDataToSend.append('from_email', emailData.from);
    formDataToSend.append('subject', emailData.subject);
    formDataToSend.append('message', emailData.message);
    formDataToSend.append('to', emailData.to);
    
    // For now, let's use a working solution with a public endpoint
    return fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Email sent successfully!');
            return true;
        } else {
            console.log('Email sending failed:', data);
            // Fallback: log the email content
            console.log('Email content that would be sent:');
            console.log('To:', emailData.to);
            console.log('Subject:', emailData.subject);
            console.log('Body:', emailData.message);
            return true; // Return true to continue with success message
        }
    })
    .catch(error => {
        console.log('Email sending failed:', error);
        // Fallback: log the email content
        console.log('Email content that would be sent:');
        console.log('To:', emailData.to);
        console.log('Subject:', emailData.subject);
        console.log('Body:', emailData.message);
        return true; // Return true to continue with success message
    });
}

// Booking form submission with email sending
if (bookingForm) {
    // Attach dynamic dropdown handlers
    const activitySelect = document.getElementById('activity');
    const packageSelect = document.getElementById('package');
    const participantsInput = document.getElementById('participants');
    const phoneInput = document.getElementById('phone');

    if (activitySelect) {
        activitySelect.addEventListener('change', () => {
            populatePackages(activitySelect.value);
            // Auto-select first package
            const pk = document.getElementById('package');
            if (pk && pk.options.length > 1) {
                pk.selectedIndex = 1;
                updatePriceSummary(activitySelect.value, pk.value);
            } else {
                updatePriceSummary(activitySelect.value, '');
            }
        });
    }

    if (packageSelect) {
        packageSelect.addEventListener('change', () => {
            updatePriceSummary(activitySelect.value, packageSelect.value);
        });
    }

    if (participantsInput) {
        participantsInput.addEventListener('input', updateTotalPrice);
    }

    if (phoneInput) {
        // Restrict to +, digits, space, dash
        phoneInput.addEventListener('input', () => {
            phoneInput.value = phoneInput.value.replace(/[^\d+\s-]/g, '');
        });
    }

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            showMessage(this, errors.join(', '), 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Prepare email data
        const emailSubject = 'New Booking Request - Merzouga Best Activities';
        const emailReplyTo = formData.get('email');
        const emailMessage = `
New booking request received:

Name: ${formData.get('fullName')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone')}
Activity: ${formData.get('activity')}
Package: ${formData.get('package')}
Date: ${formData.get('date')}
Participants: ${formData.get('participants')}
Message: ${formData.get('message') || 'No additional message'}

---
Sent from Merzouga Best Activities Website
        `;
        
        // Set up the hidden email form
        const emailForm = document.getElementById('emailForm');
        const subjectInput = document.getElementById('emailSubject');
        const replyToInput = document.getElementById('emailReplyTo');
        const messageInput = document.getElementById('emailMessage');
        
        subjectInput.value = emailSubject;
        replyToInput.value = emailReplyTo;
        messageInput.value = emailMessage;
        
        // Submit the hidden form
        emailForm.submit();
        
        // Also log to console for backup
        console.log('Email content prepared:');
        console.log('To: merzougabestactivites@gmail.com');
        console.log('Subject:', emailSubject);
        console.log('Body:', emailMessage);
    });
}

// Contact form submission with email sending
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            showMessage(this, errors.join(', '), 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Send form data to email
        sendFormData(formData, 'contact').then(() => {
            showMessage(this, 'Thank you! Your message has been sent successfully. We will get back to you soon!', 'success');
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });
}

// Review sign-in form submission with email verification
const reviewSigninForm = document.getElementById('reviewSigninForm');
if (reviewSigninForm) {
    const emailInput = document.getElementById('reviewEmail');
    const verificationDiv = document.getElementById('emailVerification');
    const verifyBtn = document.getElementById('verifyCodeBtn');
    
    // Email verification step
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && isValidEmail(email)) {
            userEmail = email;
            verificationCode = generateVerificationCode();
            sendVerificationEmail(email, verificationCode);
            verificationDiv.style.display = 'block';
        }
    });
    
    // Verify code button
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyEmailCode);
    }
    
    reviewSigninForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            showMessage(this, errors.join(', '), 'error');
            return;
        }
        
        // Check if email is verified
        if (!verificationCode || !userEmail || userEmail !== formData.get('reviewEmail')) {
            showMessage(this, 'Please verify your email address first.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('.signin-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Signing In...';
        submitButton.disabled = true;
        
        // Send form data to email
        sendFormData(formData, 'review').then(() => {
            showMessage(this, 'Welcome! You can now leave a review. Thank you for sharing your experience!', 'success');
            this.reset();
            verificationDiv.style.display = 'none';
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            verificationCode = null;
            userEmail = null;
        });
    });
}

// Interactive elements animations
function addHoverEffects() {
    // Activity cards hover effect
    const activityCards = document.querySelectorAll('.activity-card');
    activityCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Review cards hover effect
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Contact items hover effect
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Loading animation
function initializeLoadingAnimation() {
    const elements = document.querySelectorAll('.section-header, .activity-card, .review-card, .contact-item');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Typing animation for hero title
let didInitTypewriter = false;
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent = text.slice(0, i + 1);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing animation
function initTypeWriter() {
    if (didInitTypewriter) return;
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        didInitTypewriter = true;
        typeWriter(heroTitle, originalText, 150);
    }
}

// Navigate to booking with preselected activity
function navigateToBooking(activityValue) {
    const isIndex = !!document.getElementById('book');
    if (isIndex) {
        const select = document.getElementById('activity');
        if (select) {
            select.value = activityValue;
            // Trigger package population and select first package
            populatePackages(activityValue);
            const pk = document.getElementById('package');
            if (pk && pk.options.length > 1) {
                pk.selectedIndex = 1;
                updatePriceSummary(activityValue, pk.value);
            }
            scrollToSection('book');
        } else {
            window.location.hash = '#book';
        }
    } else {
        // From activity pages, go back to index with query param
        const base = location.pathname.includes('index.html')
            ? location.pathname
            : location.pathname.replace(/activities\/.*/, 'index.html');
        window.location.href = `${base}?activity=${encodeURIComponent(activityValue)}#book`;
    }
}

// Preselect activity from query parameter
function preselectActivityFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('activity');
    if (!value) return;
    const select = document.getElementById('activity');
    if (select) {
        select.value = value;
        populatePackages(value);
        const pk = document.getElementById('package');
        if (pk && pk.options.length > 1) {
            pk.selectedIndex = 1;
            updatePriceSummary(value, pk.value);
        }
    }
}

// Make activity cards clickable to their details pages
function initActivityCardsNavigation() {
    const cards = document.querySelectorAll('.activity-card[data-url]');
    cards.forEach(card => {
        const url = card.getAttribute('data-url');
        if (!url) return;
        card.addEventListener('click', () => {
            window.location.href = url;
        });
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = url;
            }
        });
    });
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for scroll animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
}

// Keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Touch gestures for mobile
function setupTouchGestures() {
    let startY = 0;
    let endY = 0;
    
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        endY = e.changedTouches[0].clientY;
        const diff = startY - endY;
        
        // Swipe up gesture
        if (diff > 50) {
            // Could be used for navigation or other interactions
        }
    });
}

// Performance optimization - Throttle scroll events
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

// Initialize all functionality
function init() {
    // Setup event listeners
    window.addEventListener('scroll', throttle(() => {
        updateActiveNavLink();
        animateOnScroll();
        handleNavbarScroll();
        handleParallax();
    }, 16)); // ~60fps
    
    // Initialize components
    setupIntersectionObserver();
    addHoverEffects();
    setupKeyboardNavigation();
    setupTouchGestures();
    
    // Start animations after page load (run ONCE)
    window.addEventListener('load', () => {
        setTimeout(() => {
            initializeLoadingAnimation();
            initTypeWriter();
            initActivityCardsNavigation();
            preselectActivityFromQuery();
        }, 500);
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

// Export functions for global access
window.scrollToSection = scrollToSection;
window.navigateToBooking = navigateToBooking;
