/**
 * Sarah Samrin Personal Portfolio - Interactive Script
 * Master-Class Gravity & Anti-Gravity Animations (Vanilla JS)
 */

document.addEventListener("DOMContentLoaded", () => {
    initNavbarScroll();
    initScrollSpy();
    initParticleCanvas();
    initTypingEffect();
    initMagneticElements();
    initPerspectiveCardTilt();
    initSkillsGravityOrbit();
    initScrollReveals();
    initStatsCounter();
    initProjectFilter();
    initContactFormValidation();
    initMediaLightbox();
    initRecruiterHub();
});

/* ==========================================================================
   Navbar Scroll Effect
   ========================================================================== */
function initNavbarScroll() {
    const nav = document.getElementById("main-nav");
    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add("navbar-scrolled");
        } else {
            nav.classList.remove("navbar-scrolled");
        }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run on load
}

/* ==========================================================================
   ScrollSpy (Active Navigation Link)
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll("header, section");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Highlight when section takes up the middle of the viewport
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });
}

/* ==========================================================================
   Red Particle Background System (HTML5 Canvas)
   ========================================================================== */
function initParticleCanvas() {
    const container = document.getElementById("particle-container");
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let particles = [];
    const maxParticles = 60;
    const connectionDistance = 120;
    
    // Mouse coords for gravity interaction
    let mouse = { x: null, y: null, radius: 150 };

    const resizeCanvas = () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.baseRadius = this.radius;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary bounce
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse interaction (Push/Repulsion gravity effect)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    
                    // Repel
                    this.x += Math.cos(angle) * force * 1.5;
                    this.y += Math.sin(angle) * force * 1.5;
                    this.radius = this.baseRadius * 1.5;
                } else {
                    this.radius = this.baseRadius;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(227, 6, 19, 0.7)";
            ctx.fill();
        }
    }

    // Initialize particles array
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    // Connect close particles with thin red lines
    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    // Opacity decreases as distance increases
                    let alpha = (1 - (dist / connectionDistance)) * 0.15;
                    ctx.strokeStyle = `rgba(227, 6, 19, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ==========================================================================
   Typing Tagline Effect
   ========================================================================== */
function initTypingEffect() {
    const words = [
        "Crafting digital experiences that defy gravity.",
        "Building high-performance UI ecosystems.",
        "Synthesizing product engineering & marketing."
    ];
    let i = 0;
    let timer;
    const target = document.getElementById("typing-tagline");
    if (!target) return;

    function typingEffect() {
        let word = words[i].split("");
        var loopTyping = function() {
            if (word.length > 0) {
                target.innerHTML += word.shift();
                timer = setTimeout(loopTyping, 60);
            } else {
                setTimeout(deletingEffect, 2000);
            }
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[i].split("");
        var loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                target.innerHTML = word.join("");
                timer = setTimeout(loopDeleting, 30);
            } else {
                i = (i + 1) % words.length;
                setTimeout(typingEffect, 500);
            }
        };
        loopDeleting();
    }

    typingEffect();
}

/* ==========================================================================
   Magnetic Buttons (Repel/Attract Mouse coordinates)
   ========================================================================== */
function initMagneticElements() {
    const magneticBtns = document.querySelectorAll(".magnetic-btn");
    
    magneticBtns.forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            // Calculate center of button
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            // Get cursor relative offset from center
            const offsetX = e.clientX - centerX;
            const offsetY = e.clientY - centerY;
            
            // Move button 35% toward cursor
            btn.style.transform = `translate(${offsetX * 0.35}px, ${offsetY * 0.35}px) scale(1.05)`;
            
            // Handle arrow element if inside button
            const arrow = btn.querySelector(".transition-arrow");
            if (arrow) {
                arrow.style.transform = `translateX(${offsetX * 0.1}px)`;
            }
        });
        
        btn.addEventListener("mouseleave", () => {
            // Rebound back smoothly
            btn.style.transform = "translate(0, 0) scale(1)";
            btn.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            
            const arrow = btn.querySelector(".transition-arrow");
            if (arrow) {
                arrow.style.transform = "translateX(0)";
                arrow.style.transition = "transform 0.5s ease";
            }
        });

        btn.addEventListener("mouseenter", () => {
            btn.style.transition = "none";
            const arrow = btn.querySelector(".transition-arrow");
            if (arrow) arrow.style.transition = "none";
        });
    });
}

/* ==========================================================================
   Perspective Card 3D Tilt
   ========================================================================== */
function initPerspectiveCardTilt() {
    const cards = document.querySelectorAll(".img-hover-physics-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate ratios relative to card width/height
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            
            // Max tilt limits (12 degrees)
            const angleY = -((x - midX) / midX) * 12;
            const angleX = ((y - midY) / midY) * 12;

            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {
            // Reset position smoothly
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
            card.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        });

        card.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });
    });
}

/* ==========================================================================
   Skills Orbit & Dynamic Mouse Repulsion Bubble Physics
   ========================================================================== */
function initSkillsGravityOrbit() {
    const container = document.querySelector(".skills-galaxy-container");
    const bubbles = document.querySelectorAll(".gravity-bubble");
    if (!container || bubbles.length === 0) return;

    let containerRect = container.getBoundingClientRect();
    let mouse = { x: null, y: null };

    // Update coordinates on resize
    window.addEventListener("resize", () => {
        containerRect = container.getBoundingClientRect();
    });

    container.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX - containerRect.left;
        mouse.y = e.clientY - containerRect.top;
    });

    container.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Setup initial angles, radii, velocities and custom offsets
    const bubbleData = Array.from(bubbles).map(bubble => {
        const radius = parseFloat(bubble.getAttribute("data-radius")) || 120;
        const speed = parseFloat(bubble.getAttribute("data-speed")) || 1.0;
        const angle = parseFloat(bubble.getAttribute("data-angle")) || 0;
        
        return {
            element: bubble,
            radius: radius,
            speed: speed,
            angle: angle * (Math.PI / 180), // Convert to radians
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
            orbitSpeedFactor: 0.002 * speed
        };
    });

    const galaxyWidth = container.offsetWidth;
    const galaxyHeight = container.offsetHeight;
    const centerX = galaxyWidth / 2;
    const centerY = galaxyHeight / 2;

    function animateOrbit() {
        bubbleData.forEach(data => {
            // Increment angle for slow background orbit movement
            data.angle += data.orbitSpeedFactor;
            
            // Calculate baseline orbital position
            let baseOrbitX = centerX + Math.cos(data.angle) * data.radius;
            let baseOrbitY = centerY + Math.sin(data.angle) * data.radius;
            
            // Align offsets for bubble sizing (centering div at points)
            const bubbleWidth = data.element.offsetWidth;
            const bubbleHeight = data.element.offsetHeight;
            baseOrbitX -= bubbleWidth / 2;
            baseOrbitY -= bubbleHeight / 2;

            let finalX = baseOrbitX;
            let finalY = baseOrbitY;

            // Physics interaction: Repel from cursor coordinate
            if (mouse.x !== null && mouse.y !== null) {
                // Center coords of bubble
                let bubbleCenterX = baseOrbitX + bubbleWidth / 2;
                let bubbleCenterY = baseOrbitY + bubbleHeight / 2;
                
                let dx = bubbleCenterX - mouse.x;
                let dy = bubbleCenterY - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let repelRadius = 120;

                if (dist < repelRadius) {
                    let force = (repelRadius - dist) / repelRadius;
                    let repelAngle = Math.atan2(dy, dx);
                    
                    // Displace coordinate outward
                    finalX += Math.cos(repelAngle) * force * 50;
                    finalY += Math.sin(repelAngle) * force * 50;
                }
            }

            // Smooth interpolation (easing coordinate shifts)
            data.currentX += (finalX - data.currentX) * 0.1;
            data.currentY += (finalY - data.currentY) * 0.1;

            // Apply position transform
            data.element.style.left = `${data.currentX}px`;
            data.element.style.top = `${data.currentY}px`;
        });

        requestAnimationFrame(animateOrbit);
    }

    animateOrbit();
}

/* ==========================================================================
   Intersection Observer (Scroll Reveal Animations)
   ========================================================================== */
function initScrollReveals() {
    const revealElements = document.querySelectorAll("[data-reveal]");
    
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseInt(element.getAttribute("data-reveal-delay")) || 0;
                
                setTimeout(() => {
                    element.classList.add("revealed");
                }, delay);
                
                // Stop observing once animation triggered
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
    const counterElements = document.querySelectorAll(".counter");
    if (counterElements.length === 0) return;

    const countUp = (element) => {
        const target = +element.getAttribute("data-target");
        const duration = 2000; // 2 seconds
        const stepTime = 30;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let currentCount = 0;

        const updateCount = () => {
            currentCount += increment;
            if (currentCount >= target) {
                element.innerText = target;
            } else {
                element.innerText = Math.floor(currentCount);
                setTimeout(updateCount, stepTime);
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });

    counterElements.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   Projects Grid Categorization Filter
   ========================================================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll(".btn-filter");
    const projectItems = document.querySelectorAll(".project-item-wrapper");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active states from other filters
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterVal = btn.getAttribute("data-filter");

            projectItems.forEach(item => {
                const categories = item.getAttribute("data-category").split(",");
                
                if (filterVal === "all" || categories.includes(filterVal)) {
                    // Reveal matching elements
                    item.style.display = "block";
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, 50);
                } else {
                    // Hide non-matching elements
                    item.style.opacity = "0";
                    item.style.transform = "scale(0.8)";
                    setTimeout(() => {
                        item.style.display = "none";
                    }, 400); // match transit speed
                }
            });
        });
    });
}

/* ==========================================================================
   Contact Form Custom Validation & Simulation
   ========================================================================== */
function initContactFormValidation() {
    const form = document.getElementById("contactForm");
    const successMsg = document.getElementById("form-success-msg");
    if (!form) return;

    const inputs = form.querySelectorAll(".form-control-custom");
    const statusDot = document.querySelector(".status-dot-pulse");
    const statusText = document.getElementById("form-status-text");

    // Live validation check on input
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            validateInput(input);
        });
        input.addEventListener("blur", () => {
            validateInput(input);
        });
    });

    function validateInput(input) {
        let isValid = true;
        const val = input.value.trim();

        if (input.required && val === "") {
            isValid = false;
        }

        if (input.type === "email" && val !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                isValid = false;
            }
        }

        if (isValid) {
            input.classList.remove("is-invalid-custom");
            input.classList.add("is-valid-custom");
        } else {
            input.classList.remove("is-valid-custom");
            input.classList.add("is-invalid-custom");
        }

        return isValid;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isFormValid = true;

        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            const submitBtn = document.getElementById("btn-submit");
            const originalText = submitBtn.innerHTML;
            
            // Set dynamic terminal indicator to busy
            if (statusDot) statusDot.classList.add("status-busy");
            if (statusText) statusText.innerText = "System Executing • Transmitting Packet...";

            // Play cinematic launcher feedback state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Launching...`;

            // Gather service requirements selected
            const selectedServices = [];
            document.querySelectorAll("input[name='services']:checked").forEach(cb => {
                selectedServices.push(cb.value);
            });

            // Prepare AJAX payload matching FormSubmit.co requirements
            const payload = {
                name: document.getElementById("form-name").value.trim(),
                email: document.getElementById("form-email").value.trim(),
                subject: document.getElementById("form-subject").value.trim(),
                message: document.getElementById("form-message").value.trim(),
                services: selectedServices.length > 0 ? selectedServices.join(", ") : "None selected",
                _subject: "New Transmission from " + document.getElementById("form-name").value.trim()
            };

            // Post to FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/sarahsamrin05@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                if (data.success === "true" || data.success === true) {
                    // Success response UI
                    if (statusDot) statusDot.classList.remove("status-busy");
                    if (statusText) statusText.innerText = "System Active • Message Dispatched!";
                    
                    successMsg.innerHTML = `<i class="fa-solid fa-circle-check me-2"></i> System response: Message launched successfully to Sarah!`;
                    successMsg.className = "text-success mt-3 font-space text-center";
                    successMsg.classList.remove("d-none");
                    
                    form.reset();

                    inputs.forEach(input => {
                        input.classList.remove("is-valid-custom");
                        input.classList.remove("is-invalid-custom");
                    });

                    // Reset service pill states
                    document.querySelectorAll(".btn-check-custom").forEach(cb => {
                        cb.checked = false;
                    });
                } else {
                    // FormSubmit error response
                    if (statusDot) statusDot.classList.add("status-busy");
                    if (statusText) statusText.innerText = "System Error • Rejected";
                    
                    successMsg.innerHTML = `<i class="fa-solid fa-circle-xmark me-2"></i> Error: Transmission rejected by node.`;
                    successMsg.className = "text-danger mt-3 font-space text-center";
                    successMsg.classList.remove("d-none");
                }

                setTimeout(() => {
                    successMsg.classList.add("d-none");
                    if (statusText && statusText.innerText !== "System Active • Ready") {
                        if (statusDot) statusDot.classList.remove("status-busy");
                        statusText.innerText = "System Active • Ready";
                    }
                }, 5000);
            })
            .catch(err => {
                // Connection/Server failure
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                if (statusDot) statusDot.classList.add("status-busy");
                if (statusText) statusText.innerText = "System Offline • Offline State";

                successMsg.innerHTML = `<i class="fa-solid fa-circle-xmark me-2"></i> System offline: Could not connect to dispatch node.`;
                successMsg.className = "text-danger mt-3 font-space text-center";
                successMsg.classList.remove("d-none");

                setTimeout(() => {
                    successMsg.classList.add("d-none");
                    if (statusDot) statusDot.classList.remove("status-busy");
                    if (statusText) statusText.innerText = "System Active • Ready";
                }, 5000);
            });
        }
    });
}

/* ==========================================================================
   Media Lightbox Component Logic
   ========================================================================== */
function initMediaLightbox() {
    const lightbox = document.getElementById("mediaLightbox");
    if (!lightbox) return;

    const closeBtn = lightbox.querySelector(".lightbox-close-btn");
    const prevBtn = lightbox.querySelector(".prev-btn");
    const nextBtn = lightbox.querySelector(".next-btn");
    const mediaBox = lightbox.querySelector(".lightbox-media-box");
    const badgeEl = lightbox.querySelector(".lightbox-badge");
    const titleEl = lightbox.querySelector(".lightbox-title");
    const descEl = lightbox.querySelector(".lightbox-desc");
    const backdrop = lightbox.querySelector(".lightbox-backdrop");

    const triggers = Array.from(document.querySelectorAll(".media-lightbox-trigger"));
    let currentIndex = -1;

    function openLightbox(index) {
        if (index < 0 || index >= triggers.length) return;
        currentIndex = index;
        const trigger = triggers[index];
        
        const type = trigger.getAttribute("data-media-type");
        const src = trigger.getAttribute("data-media-src");
        const title = trigger.getAttribute("data-media-title");
        const desc = trigger.getAttribute("data-media-desc");
        const badge = trigger.getAttribute("data-media-badge");

        // Clear previous media
        mediaBox.innerHTML = "";

        if (type === "video") {
            const video = document.createElement("video");
            video.src = src;
            video.controls = true;
            video.autoplay = true;
            video.className = "w-100 highlight-video-playing";
            video.style.maxHeight = "70vh";
            mediaBox.appendChild(video);
            
            // Trigger play safely
            video.play().catch(e => {
                console.log("Autoplay prevented; fallback user interaction will trigger it.");
            });
        } else {
            const img = document.createElement("img");
            img.src = src;
            img.alt = title;
            img.className = "img-fluid";
            img.style.maxHeight = "70vh";
            mediaBox.appendChild(img);
        }

        // Set text details
        badgeEl.textContent = badge || "Highlight";
        titleEl.textContent = title || "";
        descEl.textContent = desc || "";

        // Open modal
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Prevent page body scrolling
    }

    function closeLightbox() {
        // Halt any video streams
        const video = mediaBox.querySelector("video");
        if (video) {
            video.pause();
            video.src = "";
        }
        
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Restore page scrolling
    }

    function showNext() {
        let nextIndex = (currentIndex + 1) % triggers.length;
        openLightbox(nextIndex);
    }

    function showPrev() {
        let prevIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        openLightbox(prevIndex);
    }

    // Connect clicks to lightbox triggers
    triggers.forEach((trigger, index) => {
        trigger.addEventListener("click", () => {
            openLightbox(index);
        });
    });

    closeBtn.addEventListener("click", closeLightbox);
    backdrop.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", showNext);
    prevBtn.addEventListener("click", showPrev);

    // Dynamic keyboard shortcuts
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        
        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowRight") {
            showNext();
        } else if (e.key === "ArrowLeft") {
            showPrev();
        }
    });
}

/* ==========================================================================
   Recruiter / HR Hub Logic
   ========================================================================== */
function initRecruiterHub() {
    const hub = document.getElementById("recruiterHub");
    if (!hub) return;

    const navToggle = document.getElementById("nav-recruiter-toggle");
    const heroBtn = document.getElementById("hero-recruiter-btn");
    const closeBtn = hub.querySelector(".hub-close-btn");
    const backdrop = hub.querySelector(".recruiter-hub-backdrop");

    function openHub() {
        hub.classList.add("active");
        hub.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeHub() {
        hub.classList.remove("active");
        hub.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    if (navToggle) {
        navToggle.addEventListener("click", openHub);
    }
    if (heroBtn) {
        heroBtn.addEventListener("click", openHub);
    }

    closeBtn.addEventListener("click", closeHub);
    backdrop.addEventListener("click", closeHub);

    // Escape key handling
    document.addEventListener("keydown", (e) => {
        if (hub.classList.contains("active") && e.key === "Escape") {
            closeHub();
        }
    });
}

