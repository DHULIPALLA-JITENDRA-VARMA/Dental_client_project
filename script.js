// ============================================
// ADVANCED WEBSITE FUNCTIONALITY
// ============================================

// ===================
// 1. PARTICLE ANIMATION FOR HERO SECTION
// ===================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    window.addEventListener('resize', function() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        init();
    });
    
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
            
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // Draw connections
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 500})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}

// ===================
// 2. ANIMATED STATISTICS COUNTER
// ===================
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, stepTime);
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===================
// 3. BEFORE/AFTER SLIDER
// ===================
const baSlider = document.getElementById('baSlider');
const baHandle = document.getElementById('baHandle');
const baAfter = document.querySelector('.ba-after');

if (baSlider && baHandle && baAfter) {
    baSlider.addEventListener('input', function() {
        const value = this.value;
        baHandle.style.left = value + '%';
        baAfter.style.clipPath = `inset(0 0 0 ${value}%)`;
    });
}

// ===================
// 4. APPOINTMENT MODAL
// ===================
const openModalBtn = document.getElementById('openAppointmentModal');
const modal = document.getElementById('appointmentModal');
const closeModalBtn = document.querySelector('.close-modal');
const appointmentForm = document.getElementById('appointmentForm');
const successToast = document.getElementById('successToast');

if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

if (modal) {
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const formData = new FormData(appointmentForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.fullName || !data.email || !data.phone || !data.appointmentDate || !data.appointmentTime) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^[0-9\-\+\s\(\)]{10,15}$/;
        if (!phoneRegex.test(data.phone)) {
            alert('Please enter a valid phone number');
            return;
        }
        
        // Here you would normally send the data to a server
        console.log('Appointment Data:', data);
        
        // Show success message
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        appointmentForm.reset();
        
        showToast();
    });
}

function showToast() {
    if (successToast) {
        successToast.classList.add('show');
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 3000);
    }
}

// ===================
// 5. MOBILE NAVIGATION
// ===================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===================
// 6. TESTIMONIAL SLIDER
// ===================
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');

function showTestimonial(index) {
    testimonials.forEach(testimonial => {
        testimonial.style.display = 'none';
    });
    if (testimonials[index]) {
        testimonials[index].style.display = 'block';
    }
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

if (testimonials.length > 0) {
    showTestimonial(currentTestimonial);
    setInterval(nextTestimonial, 5000);
}

// ===================
// 7. SMOOTH SCROLLING
// ===================
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

// ===================
// 8. NAVBAR SCROLL EFFECT
// ===================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===================
// 9. BACK TO TOP BUTTON
// ===================
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.id = 'backToTop';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    font-size: 18px;
    display: none;
    z-index: 1000;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
`;

document.body.appendChild(backToTopButton);

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopButton.addEventListener('mouseenter', () => {
    backToTopButton.style.transform = 'scale(1.1)';
});

backToTopButton.addEventListener('mouseleave', () => {
    backToTopButton.style.transform = 'scale(1)';
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// ===================
// 10. LIVE CHAT FUNCTIONALITY
// ===================
document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chatButton');
    const chatBox = document.getElementById('chatBox');
    const closeChat = document.getElementById('closeChat');
    const messageInput = document.getElementById('messageInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    if (chatButton && chatBox) {
        chatButton.addEventListener('click', () => {
            chatBox.classList.toggle('active');
            if (chatBox.classList.contains('active')) {
                messageInput.focus();
            }
        });
    }

    if (closeChat && chatBox) {
        closeChat.addEventListener('click', () => {
            chatBox.classList.remove('active');
        });
    }

    if (sendMessage && messageInput && chatMessages) {
        sendMessage.addEventListener('click', sendMessageHandler);
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessageHandler();
            }
        });
    }

    function sendMessageHandler() {
        if (!messageInput || !chatMessages) return;
        
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            messageInput.value = '';

            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, 'bot');
            }, 1000);
        }
    }

    function addMessage(text, sender) {
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();

        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
            return 'Hello! Welcome to Sakthi Dental Clinic. How can I assist you today?';
        } else if (lowerCaseMessage.includes('appointment') || lowerCaseMessage.includes('book') || lowerCaseMessage.includes('schedule')) {
            return 'To book an appointment, please click the "Fix an Appointment" button or call us at +91 9862890897. Our staff will be happy to assist you.';
        } else if (lowerCaseMessage.includes('treatment') || lowerCaseMessage.includes('service') || lowerCaseMessage.includes('procedure')) {
            return 'We offer a wide range of dental treatments including cleanings, fillings, extractions, implants, orthodontics, and more. Check our treatments page for a complete list.';
        } else if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('cost') || lowerCaseMessage.includes('fee')) {
            return 'Treatment costs vary depending on the procedure. Please contact us directly for pricing information, as we can provide you with a personalized quote after examining your needs.';
        } else if (lowerCaseMessage.includes('hours') || lowerCaseMessage.includes('time') || lowerCaseMessage.includes('open') || lowerCaseMessage.includes('close')) {
            return 'We are open from 9am to 8pm, Sunday to Saturday. Our experienced doctors are available daily to provide you with quality dental care.';
        } else if (lowerCaseMessage.includes('thank')) {
            return 'You\'re welcome! Is there anything else I can help you with today?';
        } else if (lowerCaseMessage.includes('emergency') || lowerCaseMessage.includes('urgent') || lowerCaseMessage.includes('pain')) {
            return 'For dental emergencies, please call us immediately at +91 9862890897. We prioritize emergency cases and will do our best to see you as soon as possible.';
        } else {
            return 'Thank you for your message. For more specific inquiries, please contact us directly at info@sakthidentalclinic.in or call +91 9862890897.';
        }
    }
});

// ===================
// 11. FAQ ACCORDION
// ===================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        // Toggle current item
        const isOpen = answer.style.display === 'block';
        
        // Close all items
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.style.display = 'none';
        });
        document.querySelectorAll('.faq-question i').forEach(ic => {
            ic.style.transform = 'rotate(0deg)';
        });
        
        // Open clicked item if it was closed
        if (!isOpen) {
            answer.style.display = 'block';
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
            }
        }
    });
});

// ===================
// 12. FORM VALIDATION
// ===================
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ff6b6b';
        } else {
            field.style.borderColor = '#ddd';
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                field.style.borderColor = '#ff6b6b';
            }
        }

        if (field.name === 'phone' && field.value) {
            const phoneRegex = /^[0-9\-\+\s\(\)]{10,15}$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                field.style.borderColor = '#ff6b6b';
            }
        }
    });

    return isValid;
}

document.addEventListener('input', (e) => {
    if (e.target.hasAttribute('required')) {
        e.target.style.borderColor = '#ddd';
    }
});

// ===================
// 13. PERFORMANCE - LAZY LOADING
// ===================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('✨ Sakthi Dental Clinic - Advanced Features Loaded Successfully!');