document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor logic
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const cursorGlow = document.getElementById('cursor-glow');

    // Function to set up hover effects on elements
    function attachHoverEvents() {
        // Find all interactive targets on the page, including within modals
        const hoverTargets = document.querySelectorAll('.hover-target, input, select, a, button, .menu-item, .suite-card, .close-btn, .gallery-img.sub');
        
        hoverTargets.forEach(target => {
            if (target.dataset.hoverAttached === "true") return;
            
            target.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
                if (cursorGlow) {
                    cursorGlow.style.background = 'radial-gradient(circle, rgba(207, 170, 112, 0.15) 0%, rgba(0, 0, 0, 0) 50%)';
                }
            });
            target.addEventListener('mouseleave', () => {
                 document.body.classList.remove('hovering');
                 if (cursorGlow) {
                     cursorGlow.style.background = 'radial-gradient(circle, rgba(207, 170, 112, 0.08) 0%, rgba(0, 0, 0, 0) 60%)';
                 }
            });
            target.dataset.hoverAttached = "true";
        });
    }

    attachHoverEvents();

    // Make sure cursor is visible on move globally
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${x}px`;
            cursorDot.style.top = `${y}px`;
        }

        if (cursorOutline) {
            cursorOutline.animate({
                left: `${x}px`,
                top: `${y}px`
            }, { duration: 150, fill: "forwards" });
        }

        if (cursorGlow) {
            cursorGlow.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
        }
    });

    // MOUSE DOWN logic for cursor and font styles
    document.addEventListener('mousedown', (e) => {
        document.body.classList.add('clicking');

        const target = e.target.closest('.click-style-target');
        if (target) {
            target.classList.toggle('click-active');
        }
    });

    document.addEventListener('mouseup', () => {
        document.body.classList.remove('clicking');
    });

    // --- Hero Background Slider Logic ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        
        // Change image every 6 seconds
        setInterval(() => {
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');
            
            // Move to next slide, loop back to 0 if at the end
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Add active class to new slide to trigger fade in and zoom animation
            slides[currentSlide].classList.add('active');
        }, 6000); 
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = { rootMargin: "0px 0px -50px 0px", threshold: 0.15 };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // --- Explore Suites Modal Logic ---
    const modal = document.getElementById('explore-modal');
    const closeBtn = document.querySelector('.close-btn');
    const suiteCards = document.querySelectorAll('.suite-card');
    
    // Modal elements to populate
    const modalTitle = document.getElementById('modal-title');
    const modalImgMain = document.getElementById('modal-img-main');
    const modalImgSub1 = document.getElementById('modal-img-sub1');
    const modalImgSub2 = document.getElementById('modal-img-sub2');
    const modalDesc = document.getElementById('modal-desc');
    const modalBookBtn = document.getElementById('modal-book-btn');
    const suiteSelectDropdown = document.getElementById('experience');

    // Create a smooth mapping from Title to the Dropdown option value
    const titleToValueMap = {
        "Orchid Penthouse": "suite_orchid",
        "Lotus Pavilion": "suite_lotus",
        "Jasmine Villa": "suite_jasmine",
        "Bamboo Sanctuary": "suite_bamboo",
        "Cherry Blossom Suite": "suite_cherry",
        "Moonlight Reserve": "suite_moonlight"
    };

    suiteCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const title = card.getAttribute('data-title');
            const imgMainSrc = card.getAttribute('data-img-main');
            const imgSub1Src = card.getAttribute('data-img-sub1');
            const imgSub2Src = card.getAttribute('data-img-sub2');
            const desc = card.getAttribute('data-desc');

            // Populate Modal
            modalTitle.textContent = title;
            modalImgMain.src = imgMainSrc;
            modalImgSub1.src = imgSub1Src;
            modalImgSub2.src = imgSub2Src;
            modalDesc.textContent = desc;

            modalBookBtn.onclick = function() {
                modal.classList.remove('show');
                document.body.style.overflow = "auto";
                
                if (titleToValueMap[title] && suiteSelectDropdown) {
                    suiteSelectDropdown.value = titleToValueMap[title];
                    suiteSelectDropdown.dispatchEvent(new Event('change'));
                }
            };

            modal.classList.add('show');
            document.body.style.overflow = "hidden"; 
            attachHoverEvents();
        });
    });

    // Swap main modal image when a sub image thumbnail is clicked
    const subImages = [modalImgSub1, modalImgSub2];
    subImages.forEach(subImg => {
        subImg.addEventListener('click', () => {
            const currentMain = modalImgMain.src;
            modalImgMain.src = subImg.src;
            subImg.src = currentMain;
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = "auto";
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = "auto";
        }
    });

    // Add interactivity to the floating label of select menu
    if (suiteSelectDropdown) {
        suiteSelectDropdown.addEventListener('change', () => {
             const label = suiteSelectDropdown.nextElementSibling;
             if(suiteSelectDropdown.value !== "") {
                 label.classList.add('active');
             }
        });
    }
});
